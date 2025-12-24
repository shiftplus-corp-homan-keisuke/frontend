import { Injectable } from '@angular/core';

/**
 * [Service] 口座管理サービス
 * 
 * 事前条件（Preconditions）と不変条件（Invariants）をコードで表現する例です。
 */
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private balance = 1000; // 初期残高

  /**
   * 出金処理
   * 
   * @param amount 出金する金額
   * @throws Error 契約違反（事前条件や不変条件の不履行）があった場合
   */
  withdraw(amount: number): void {
    // 1. 事前条件のチェック (Precondition)
    // 呼び出し側に対する要求: "負の数や0を渡してはならない"
    if (amount <= 0) {
      throw new Error(`[Precondition Violation] Amount must be positive. Received: ${amount}`);
    }

    // 2. 不変条件のチェックへの配慮 (Invariant)
    // 処理を実行すると残高がマイナスになってしまう場合、それはシステムの不変条件
    // 「残高は負にならない」を破壊するため、実行を阻止する。
    if (this.balance < amount) {
          throw new Error(`[Invariant Warning] Insufficient funds. Balance: ${this.balance}, Requested: ${amount}`);
    }

    // 処理実行
    this.balance -= amount;

    // 3. 事後条件のチェック (Postcondition) - オプショナル
    // 処理後の状態が正しいかを検証（デバッグ時や重要なロジックで有効）
    this.assert(this.balance >= 0, 'Balance should never be negative after withdrawal');
  }

  /**
   * 入金処理
   */
  deposit(amount: number): void {
    // 事前条件の簡潔なチェック
    this.require(amount > 0, 'Amount must be positive');

    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }

  /**
   * ヘルパー関数: 事前条件の強制 (Contract.Requires)
   */
  private require(condition: boolean, message: string): void {
    if (!condition) {
      throw new Error(`[Contract Violation] ${message}`);
    }
  }

  /**
   * ヘルパー関数: 事後条件/不変条件の強制 (Contract.Ensures / Invariant)
   */
  private assert(condition: boolean, message: string): void {
    if (!condition) {
      // 本来起きえないバグ
      console.error(`[System Error] ${message}`);
      // 本番環境では投げずにログ通知だけにするなどの判断も可
      throw new Error(message);
    }
  }
}

/**
 * [Broken Windows] 割れ窓の例
 * 
 * どんな型でも受け入れる `any` は、一見柔軟に見えますが、
 * 実際には型システムの全ての恩恵（補完、リファクタリングの安全性、ドキュメント性）
 * を放棄する行為です。
 */
export class BadExample {
  // 窓が割れている: 何が入っているか不明
  data: any;

  constructor(data: any) {
    this.data = data;
  }

  // 割れ窓は広がる: 戻り値も any なので、これを使う側のコードも汚染される
  processData(): any {
    // 実行時エラーの温床: .name がある保証はどこにもない
    return this.data.name.toUpperCase();
  }
}

/**
 * [Fixed Windows] 窓を直した例
 * 
 * Generics や Interface を使い、データの契約を明確にします。
 */

interface UserData {
  name: string;
  age?: number;
}

export class GoodExample<T extends UserData> {
  // 型安全かつ柔軟
  constructor(public readonly data: T) {}

  processData(): string {
    // T は UserData を満たすことが保証されているため安全
    return this.data.name.toUpperCase();
  }
}

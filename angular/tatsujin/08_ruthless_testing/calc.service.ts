export class CalcService {
  /**
   * 割引価格を計算する
   * @param price 元の価格 (0以上であること)
   * @param discountRate 割引率 (0.0 〜 1.0)
   */
  calculateDiscount(price: number, discountRate: number): number {
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
    if (discountRate < 0 || discountRate > 1) {
      throw new Error('Discount rate must be between 0 and 1');
    }

    return price * (1 - discountRate);
  }
}

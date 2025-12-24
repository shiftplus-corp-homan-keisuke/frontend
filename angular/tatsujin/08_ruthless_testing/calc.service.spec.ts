import { CalcService } from './calc.service';

/**
 * [Test] 冷酷なテスト
 * 
 * 正常系（Happy Path）を通すだけなら簡単です。
 * しかし達人は「意地悪なケース」を積極的にテストします。
 */
describe('CalcService (Ruthless)', () => {
  let service: CalcService;

  beforeEach(() => {
    service = new CalcService();
  });

  // 1. 正常系
  it('should calculate discount correctly', () => {
    expect(service.calculateDiscount(1000, 0.1)).toBe(900);
  });

  // 2. 境界値 (0)
  it('should handle zero price', () => {
    expect(service.calculateDiscount(0, 0.5)).toBe(0);
  });

  // 3. 境界値 (100% 割引)
  it('should handle 100% discount', () => {
    expect(service.calculateDiscount(500, 1.0)).toBe(0);
  });

  // 4. 異常系 (負の価格) - 契約違反を見逃さない
  it('should throw error for negative price', () => {
    expect(() => service.calculateDiscount(-100, 0.1)).toThrowError('Price cannot be negative');
  });

  // 5. 異常系 (不正な割引率)
  it('should throw error for invalid discount rate', () => {
    expect(() => service.calculateDiscount(100, 1.5)).toThrowError();
    expect(() => service.calculateDiscount(100, -0.1)).toThrowError();
  });
});

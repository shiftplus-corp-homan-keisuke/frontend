import { Component } from '@angular/core';

// テスト対象のシンプルなコンポーネント
@Component({ template: '' })
export class CounterComponent {
  count = 0;
  
  increment() {
    this.count++;
  }
  
  reset() {
    this.count = 0;
  }
}

/**
 * [Test] 隔離されたコンポーネントテスト (Isolated Test)
 * 
 * TestBed を使うと Angular のコンパイルが走るため遅くなります。
 * ロジックだけをテストしたいなら、コンポーネントをただのクラスとして扱い、
 * new してテストする方が圧倒的に高速（＝冷酷に回数を回せる）です。
 */
describe('CounterComponent (Isolated)', () => {
  let component: CounterComponent;

  beforeEach(() => {
    // Angularの仕組みを使わず、クラスとしてインスタンス化
    component = new CounterComponent();
  });

  it('should start with 0', () => {
    expect(component.count).toBe(0);
  });

  it('should increment', () => {
    component.increment();
    expect(component.count).toBe(1);
  });
  
  it('should reset', () => {
    component.increment();
    component.increment();
    component.reset();
    expect(component.count).toBe(0);
  });
});

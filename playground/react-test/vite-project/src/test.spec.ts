import { describe, it, expect, vi } from 'vitest';

function executeCallback(callback: (meg: string) => void, meaages: string) {
  callback(meaages);
}


describe('モックのテスト', () => {

  it('コールバックが正しく呼ばれる', () => {
    const callback = vi.fn();

    executeCallback(callback, 'Hey');

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('Hey!');

  })

})


async function homan(): Promise<'homan'> {
  return 'homan';
}


 homan();
console.log(name);

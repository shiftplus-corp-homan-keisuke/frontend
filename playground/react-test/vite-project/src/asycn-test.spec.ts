import { describe, it, expect } from 'vitest';

function fetchDate(): Promise<{ id: number, name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: 'John Doe' });
    }, 1000)
  })
}

function failingfetchDate(): Promise<{ id: number, name: string }> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Failed to fetch data'));
    }, 1000)
  })
}


describe.skip('非同期関数のテスト', () => {



  it('データを取得する',  async() => {
    const data =  await fetchDate();
    expect(data).toEqual({ id: 1, name: 'John Doe' });
  })

  it('データを取得する2', () => {
    expect(fetchDate()).resolves.toEqual({ id: 1, name: 'John Doe' });
  })

  it('データ取得に失敗する', () => {
    expect(failingfetchDate()).rejects.toThrow('Failed to fetch data');
  })

  it("エラーを投げる", async () => {
    await expect(failingfetchDate()).rejects.toThrow("Failed to fetch data");
  });

})

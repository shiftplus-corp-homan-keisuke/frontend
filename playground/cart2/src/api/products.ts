const API_URL = "https://dummyjson.com/products";

export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
};

export async function fetchProducts(
  category: string | null = null
): Promise<Product[]> {
  let url = API_URL;

  // カテゴリが指定されていれば、カテゴリ別のURLを使う
  if (category) {
    url = `${API_URL}/category/${category}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("商品の取得に失敗しました");
  }

  const data = await response.json();
  return data.products;
}

// カテゴリ一覧を取得
export type Category = {
  slug: string,
  name: string,
  url: string,
};

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("カテゴリの取得に失敗しました");
  }

  return response.json();
}
import { fetchCategories, fetchProducts, type Product } from "../api/products";
import { useCartStore } from "../store/useCartStore";
import { useQuery } from "@tanstack/react-query";
import Loading from "./Loading";
import { useState } from "react";

export default function ProductList() {

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    const { data: categories, } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories
    })

    const { data: products, isLoading, error } = useQuery<Product[], Error>({
        queryKey: ['products', selectedCategory],
        queryFn: () => fetchProducts(selectedCategory)
    })

    const addItem = useCartStore((state) => state.addItem);


    if (isLoading) {
        return <Loading />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    // 商品一覧を表示
    return (
        <div>
            <div className="category-filter">
                <label>カテゴリ: </label>
                <select
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    value={selectedCategory || ''}>
                    <option value="">すべて</option>
                    {categories?.map((category) => (
                        <option key={category.slug} value={category.slug}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="product-grid">
                {products?.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.thumbnail} alt={product.title} />
                        <h3>{product.title}</h3>
                        <p>${product.price}</p>
                        <button onClick={() => addItem(product)}>カートに追加</button>
                    </div>
                ))}
            </div>
        </div>

    );

}


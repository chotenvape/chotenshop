"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Banner from "../../components/Banner";
import ProductCard from "../../components/ProductCard";
import { supabase } from "../../lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

const categories = ["전체", "기기", "일회용", "팟", "코일", "액상"];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [category, setCategory] = useState("전체");
  const [search, setSearch] = useState("");

  async function loadProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
      return;
    }

    setProducts(data || []);
    setFiltered(data || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    // 카테고리 필터
    if (category !== "전체") {
      result = result.filter((p) => p.category === category);
    }

    // 검색 필터
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [category, search, products]);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Banner />

      {/* 카테고리 */}
      <div className="mx-auto mt-6 flex max-w-7xl flex-wrap gap-2 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              category === cat
                ? "bg-pink-500 text-white"
                : "bg-pink-100 text-pink-600 hover:bg-pink-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 검색 */}
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <input
          type="text"
          placeholder="상품 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-pink-200 px-5 py-3 outline-none focus:border-pink-500"
        />
      </div>

      {/* 상품 목록 */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold text-pink-500">
          상품 목록
        </h2>

        {filtered.length === 0 ? (
          <p className="text-gray-400">상품이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={`${Number(product.price).toLocaleString()}원`}
                image={product.image}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
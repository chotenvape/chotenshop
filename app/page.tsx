"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";

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

    if (category !== "전체") {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [category, search, products]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white">

      <Header />
      <Banner />

      {/* 전체 가운데 컨테이너 */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4">

        {/* 카테고리 */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition shadow-sm ${
                category === cat
                  ? "bg-pink-500 text-white"
                  : "bg-white text-pink-500 border border-pink-200 hover:bg-pink-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div className="mt-5 w-full max-w-md">
          <input
            type="text"
            placeholder="상품 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-pink-200 px-5 py-3 text-center shadow-sm outline-none focus:border-pink-500"
          />
        </div>

        {/* 타이틀 */}
        <h2 className="mt-10 text-center text-3xl font-extrabold text-pink-500">
          🛍️ 상품 목록
        </h2>

        {/* 상품 */}
        {filtered.length === 0 ? (
          <p className="mt-10 text-gray-400">상품이 없습니다.</p>
        ) : (
          <div className="mt-8 grid w-full grid-cols-2 gap-6 md:grid-cols-4">
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
      </div>
    </main>
  );
}
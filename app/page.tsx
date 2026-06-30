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
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">

      {/* 헤더 */}
      <Header />

      {/* 배너 */}
      <div className="mx-auto max-w-6xl px-4">
        <Banner />
      </div>

      {/* 전체 컨텐츠 */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-8">

        {/* 타이틀 */}
        <h1 className="mt-4 text-center text-4xl font-extrabold text-pink-500 drop-shadow-sm">
          🛍️ CHOTEN SHOP
        </h1>

        <p className="mt-2 text-center text-gray-500">
          원하는 전자담배 제품을 빠르게 찾아보세요
        </p>

        {/* 카테고리 */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-6 py-2 text-sm font-bold transition shadow-sm ${
                category === cat
                  ? "bg-pink-500 text-white scale-105"
                  : "bg-white text-pink-500 border border-pink-200 hover:bg-pink-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 검색 */}
        <div className="mt-6 w-full max-w-md">
          <input
            type="text"
            placeholder="상품 이름 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-pink-200 px-5 py-3 text-center shadow-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
        </div>

        {/* 상품 영역 */}
        <div className="mt-10 w-full">
          <h2 className="mb-6 text-center text-2xl font-bold text-pink-500">
            상품 목록
          </h2>

          {filtered.length === 0 ? (
            <p className="text-center text-gray-400">
              상품이 없습니다 😢
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="transition hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={`${Number(product.price).toLocaleString()}원`}
                    image={product.image}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
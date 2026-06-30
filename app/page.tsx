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

      <Header />

      <div className="mx-auto max-w-6xl px-3">
        <Banner />
      </div>

      {/* 모바일 컨테이너 */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-3 py-6">

        {/* 타이틀 */}
        <h1 className="text-center text-3xl font-extrabold text-pink-500">
          🛍️ CHOTEN SHOP
        </h1>

        <p className="mt-1 text-center text-sm text-gray-500">
          원하는 제품을 빠르게 찾아보세요
        </p>

        {/* 검색 */}
        <div className="mt-5 w-full">
          <input
            type="text"
            placeholder="상품 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-pink-200 px-4 py-3 text-center text-sm shadow-sm outline-none focus:border-pink-500"
          />
        </div>

        {/* 카테고리 (모바일 스크롤 대응) */}
        <div className="mt-5 flex w-full gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                category === cat
                  ? "bg-pink-500 text-white"
                  : "bg-white text-pink-500 border border-pink-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 상품 */}
        <div className="mt-6 w-full">
          <h2 className="mb-4 text-center text-lg font-bold text-pink-500">
            상품 목록
          </h2>

          {filtered.length === 0 ? (
            <p className="text-center text-gray-400">상품이 없습니다 😢</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="active:scale-95 transition"
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
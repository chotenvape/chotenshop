"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Banner from "@/components/Banner";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const pathname = usePathname();

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

  const navItems = [
    { href: "/", label: "홈", icon: "🏠" },
    { href: "/cart", label: "장바구니", icon: "🛒" },
    { href: "/orders", label: "주문", icon: "📦" },
    { href: "/login", label: "로그인", icon: "👤" },
    { href: "/signup", label: "회원가입", icon: "✨" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 pb-24">

      {/* 헤더 */}
      <Header />

      {/* 배너 */}
      <div className="mx-auto max-w-6xl px-4">
        <Banner />
      </div>

      {/* 컨텐츠 */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-8">

        <h1 className="mt-4 text-center text-4xl font-extrabold text-pink-500">
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
              className={`rounded-full px-6 py-2 text-sm font-bold transition ${
                category === cat
                  ? "bg-pink-500 text-white"
                  : "bg-white text-pink-500 border border-pink-200"
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
            placeholder="상품 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-pink-200 px-5 py-3 text-center outline-none focus:border-pink-500"
          />
        </div>

        {/* 상품 */}
        <div className="mt-10 w-full">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400">상품이 없습니다 😢</p>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
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
      </div>

      {/* 💖🔥 하단 네비바 (절대 안 깨지는 구조) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-pink-100 bg-white/95 backdrop-blur-md shadow-lg md:hidden">

        {/* 🔥 핵심: 무조건 가로 유지 */}
        <div className="flex w-full items-center justify-around py-2">

          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1"
              >

                <div
                  className={`text-xl leading-none transition ${
                    active ? "text-pink-500 scale-110" : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </div>

                <span
                  className={`mt-1 text-[10px] font-bold ${
                    active ? "text-pink-500" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>

              </Link>
            );
          })}

        </div>
      </nav>

    </main>
  );
}
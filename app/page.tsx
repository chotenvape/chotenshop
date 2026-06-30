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
    // 🌸 전체 배경을 화사하고 부드러운 소프트 핑크 톤 그라데이션으로 교체
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50/30 to-white pb-32 font-sans antialiased">
      
      {/* 상단 헤더 */}
      <Header />

      {/* 모바일 컨테이너: max-w-md로 스마트폰 핏 고정 및 중앙 정렬 */}
      <div className="mx-auto max-w-md px-4 pt-4">
        
        {/* 상단 배너 - 라운딩 스무스하게 */}
        <div className="overflow-hidden rounded-2xl shadow-sm">
          <Banner />
        </div>

        {/* 타이틀 영역 - 딥핑크&로즈그레이 조합으로 시인성 극대화 */}
        <div className="mt-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-pink-600 drop-shadow-sm">
            💖 CHOTEN SHOP
          </h1>
          <p className="mt-1.5 text-xs font-semibold text-rose-400/90 tracking-wide">
            취향저격 전자담배를 가장 빠르게
          </p>
        </div>

        {/* 검색창 - 핑크 보더 포커스 및 그림자 효과 */}
        <div className="mt-6">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="어떤 상품을 찾으시나요? 💕"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border-2 border-pink-100 bg-white/80 px-5 py-3.5 pl-12 text-sm font-medium text-gray-800 placeholder-pink-300/80 outline-none transition-all shadow-inner focus:border-pink-400 focus:bg-white focus:shadow-md"
            />
            <span className="absolute left-4 text-base text-pink-400">🔍</span>
          </div>
        </div>

        {/* 카테고리 - 모바일 좌우 스크롤(스와이프) 최적화 */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          {categories.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold tracking-wide transition-all duration-200 snap-center shadow-sm ${
                  isSelected
                    ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-pink-200/50 scale-105"
                    : "bg-white text-pink-500 border border-pink-100/80 hover:bg-pink-50/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 상품 리스트 격자 (Grid) - 깔끔한 2열 배치 */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <span className="text-4xl">✨</span>
              <p className="mt-3 text-sm font-medium text-rose-300">찾으시는 상품이 아직 없어요</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map((product) => (
                <div 
                  key={product.id} 
                  className="transform transition-transform active:scale-98 bg-white rounded-2xl p-1 shadow-sm border border-pink-50/50"
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

      {/* 하단 모바일 하트 네비게이션 바 */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-2xl border border-pink-100/60 bg-white/90 px-2 py-2.5 shadow-xl shadow-pink-100/40 backdrop-blur-lg">
        <div className="flex w-full items-center justify-around">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-1 flex-col items-center justify-center transition-all duration-200 active:scale-95"
              >
                {/* 활성화 상태일 때 아이콘 뒤에 은은한 핑크 후광 효과 */}
                {active && (
                  <div className="absolute -top-1 h-8 w-8 rounded-full bg-pink-100/60 blur-sm" />
                )}
                
                <div
                  className={`relative text-xl leading-none transition-transform duration-200 ${
                    active ? "text-pink-500 -translate-y-0.5 scale-110" : "text-gray-300"
                  }`}
                >
                  {item.icon}
                </div>

                <span
                  className={`mt-1 text-[10px] font-black tracking-wider transition-colors ${
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
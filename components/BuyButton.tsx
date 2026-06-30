"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function BuyButton({ notice, product }: any) {
  const [qty, setQty] = useState(1);
  const router = useRouter();

  async function addToCart() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      alert("로그인 필요");
      return;
    }

    const { error } = await supabase.from("cart").insert([
      {
        user_id: user.id,
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("장바구니 추가됨!");
  }

  return (
    <div className="mt-10 space-y-6 font-sans">

      {/* 수량 */}
      <div className="flex items-center justify-between rounded-2xl border border-pink-100 bg-white px-5 py-4 shadow-sm">

        <span className="text-sm font-medium text-gray-600">
          수량
        </span>

        <div className="flex items-center gap-4">

          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="h-9 w-9 rounded-full bg-gray-100 text-lg font-bold hover:bg-gray-200 transition"
          >
            -
          </button>

          <span className="w-6 text-center text-lg font-semibold">
            {qty}
          </span>

          <button
            onClick={() => setQty(qty + 1)}
            className="h-9 w-9 rounded-full bg-gray-100 text-lg font-bold hover:bg-gray-200 transition"
          >
            +
          </button>

        </div>
      </div>

      {/* 구매 안내 */}
      <div className="rounded-2xl bg-pink-50 px-5 py-4 text-sm text-gray-700 leading-relaxed">
        <p className="mb-1 font-semibold text-pink-500">
          구매 안내
        </p>
        {notice}
      </div>

      {/* 장바구니 버튼 */}
      <button
        onClick={addToCart}
        className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-pink-400 py-4 text-lg font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"
      >
        장바구니 담기
      </button>

      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="w-full rounded-2xl bg-gray-100 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition"
      >
        ← 뒤로가기
      </button>

    </div>
  );
}
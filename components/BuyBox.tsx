"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function BuyBox({ product }: any) {
  const [qty, setQty] = useState(1);

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
        product_id: String(product.id),
        name: product.name,
        price: Number(product.price),
        image: product.image || "",
        quantity: qty,
      },
    ]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("장바구니 추가 완료!");
  }

  return (
    <div className="mt-6 space-y-4">

      {/* 수량 */}
      <div className="flex items-center justify-between border rounded-xl p-4">
        <span>수량</span>

        <div className="flex items-center gap-3">
          <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <span className="font-bold">{qty}</span>
          <button onClick={() => setQty(qty + 1)}>+</button>
        </div>
      </div>

      {/* 장바구니 버튼 */}
      <button
        onClick={addToCart}
        className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold"
      >
        장바구니 담기
      </button>

    </div>
  );
}
"use client";

import { supabase } from "../../lib/supabase";

export default function Card({ product }: any) {

  async function addToCart() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      alert("로그인 필요");
      return;
    }

    // 🔥 먼저 기존 있는지 확인
    const { data: exist } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single();

    if (exist) {
      // 있으면 +1
      await supabase
        .from("cart")
        .update({ quantity: exist.quantity + 1 })
        .eq("id", exist.id);
    } else {
      // 없으면 새로 추가
      await supabase.from("cart").insert([
        {
          user_id: user.id,
          product_id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.image,
          quantity: 1,
        },
      ]);
    }

    alert("🛒 장바구니 추가 완료!");
  }

  return (
    <div className="rounded-2xl bg-white shadow overflow-hidden">
      <img src={product.image} className="h-48 w-full object-cover" />

      <div className="p-4">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-pink-500 font-bold">
          {Number(product.price).toLocaleString()}원
        </p>

        <button
          onClick={addToCart}
          className="mt-3 w-full rounded-xl bg-pink-500 py-2 text-white font-bold"
        >
          🛒 장바구니 담기
        </button>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();

  async function loadCart() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) return;

    const { data: items } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id);

    setCart(items || []);
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQty(id: number, qty: number) {
    if (qty < 1) return;

    await supabase
      .from("cart")
      .update({ quantity: qty })
      .eq("id", id);

    loadCart();
  }

  async function removeItem(id: number) {
    await supabase.from("cart").delete().eq("id", id);
    loadCart();
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 to-white p-6">

      {/* 🔙 뒤로가기 추가 */}
      <button
        onClick={() => router.back()}
        className="mb-6 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-gray-100 transition"
      >
        ← 뒤로가기
      </button>

      {/* 🔥 헤더 */}
      <div className="mx-auto mb-8 max-w-3xl text-center">

        <img
          src="/choten-banner.png"
          alt="banner"
          className="mb-6 h-40 w-full rounded-3xl object-cover shadow-lg"
        />

        <h1 className="text-4xl font-extrabold text-pink-500">
          쵸텐샵 장바구니!
        </h1>

        <p className="mt-2 text-gray-500">
          결제 문의 넣기 전 상품 확인 필수!
        </p>
      </div>

      {/* 🧺 리스트 */}
      <div className="mx-auto max-w-3xl space-y-4">

        {cart.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow">
            <p className="text-gray-400">장바구니가 비어있습니다</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-md transition hover:shadow-lg"
              >
                <img
                  src={item.image}
                  className="h-20 w-20 rounded-2xl object-cover"
                />

                <div className="flex-1">
                  <p className="text-lg font-bold">{item.name}</p>

                  <p className="font-semibold text-pink-500">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="rounded-full bg-pink-100 px-3 py-1 font-bold"
                    >
                      -
                    </button>

                    <span className="font-bold">{item.quantity}</span>

                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="rounded-full bg-pink-100 px-3 py-1 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="font-bold text-red-500 hover:text-red-700"
                >
                  삭제
                </button>
              </div>
            ))}

            {/* 💰 총합 + 구매하기 */}
            <div className="space-y-3">

              <div className="rounded-3xl bg-pink-500 p-6 text-center text-xl font-bold text-white shadow-lg">
                총합: {total.toLocaleString()}원
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full rounded-3xl bg-black py-4 text-lg font-bold text-white shadow-lg transition hover:opacity-80"
              >
                구매하기
              </button>

            </div>
          </>
        )}
      </div>
    </main>
  );
}
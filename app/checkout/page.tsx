"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const [name, setName] = useState("");
  const [depositor, setDepositor] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      setCart([]);
      return;
    }

    const { data: items } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user.id);

    setCart(items || []);
  }

  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  async function order() {
    setLoading(true);

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      alert("로그인 필요");
      setLoading(false);
      return;
    }

    try {
      const { data: orderData, error } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total_price: total,
            status: "pending",
            customer_name: name,
            depositor_name: depositor,
            address: address,
          },
        ])
        .select()
        .single();

      if (error || !orderData) {
        alert(error?.message);
        setLoading(false);
        return;
      }

      const orderItems = cart.map((item) => ({
        order_id: orderData.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await supabase.from("order_items").insert(orderItems);

      await supabase.from("cart").delete().eq("user_id", user.id);

      setTotalPrice(total);
      setDone(true);
      setCart([]);
    } catch (e) {
      console.log(e);
      alert("에러 발생");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-white p-6">

      <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-center text-2xl font-bold text-pink-500 mb-4">
          CHECKOUT PAGE
        </h1>

        {!done ? (
          <>
            <div className="space-y-3">

              <input
                className="w-full border p-3 rounded-xl"
                placeholder="받는 사람 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="w-full border p-3 rounded-xl"
                placeholder="입금자명"
                value={depositor}
                onChange={(e) => setDepositor(e.target.value)}
              />

              <input
                className="w-full border p-3 rounded-xl"
                placeholder="주소"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

            </div>

            <p className="mt-4 text-center font-bold">
              총 금액: {total.toLocaleString()}원
            </p>

            <button
              onClick={order}
              disabled={loading}
              className="mt-5 w-full bg-pink-500 text-white py-3 rounded-2xl font-bold"
            >
              {loading ? "처리중..." : "결제 문의"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-center text-2xl font-bold text-pink-500">
              주문 완료!
            </h2>

            <p className="text-center mt-2">
              입금 확인 후 처리됩니다
            </p>

            <div className="mt-4 bg-gray-100 p-4 rounded-xl text-sm">
              <p>국민은행</p>
              <p>123-456-789</p>
              <p>쵸텐샵</p>
            </div>

            <p className="text-center mt-3 font-bold text-pink-500">
              {totalPrice.toLocaleString()}원
            </p>
          </>
        )}

      </div>

    </main>
  );
}
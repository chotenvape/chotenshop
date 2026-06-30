"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  }

  async function loadOrderItems(orderId: number) {
    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    setItems(data || []);
    setSelectedOrder(orderId);
  }

  function statusText(status: string) {
    switch (status) {
      case "pending":
        return "💳 입금확인 전";
      case "paid":
        return "✅ 입금 확인 완료";
      case "preparing":
        return "📦 배송 준비중";
      case "shipping":
        return "🚚 배송중";
      case "done":
        return "📬 배송 완료";
      default:
        return status;
    }
  }

  return (
    <main className="min-h-screen bg-pink-50 p-6">

      <div className="mx-auto max-w-3xl">

        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="mb-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow hover:bg-gray-100 transition"
        >
          ← 뒤로가기
        </button>

        <h1 className="text-3xl font-bold text-pink-500 mb-6 text-center">
          🧾 내 주문 내역
        </h1>

        {loading ? (
          <p className="text-center">로딩중...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">
            주문 내역이 없습니다
          </p>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-4 rounded-2xl shadow mb-4"
            >

              <div className="flex justify-between">
                <p className="font-bold">주문 #{o.id}</p>
                <p className="text-pink-500 font-bold">
                  {o.total_price.toLocaleString()}원
                </p>
              </div>

              <p className="mt-2 text-gray-600">
                상태: {statusText(o.status)}
              </p>

              {o.customer_name && (
                <p className="text-sm text-gray-500 mt-1">
                  받는 사람: {o.customer_name}
                </p>
              )}

              {o.address && (
                <p className="text-sm text-gray-500">
                  주소: {o.address}
                </p>
              )}

              <button
                onClick={() => loadOrderItems(o.id)}
                className="mt-3 bg-pink-500 text-white px-3 py-1 rounded-xl text-sm"
              >
                주문 상품 보기
              </button>

              {selectedOrder === o.id && (
                <div className="mt-3 bg-gray-100 p-3 rounded-xl">

                  <p className="font-bold mb-2">📦 주문 상품</p>

                  {items.length === 0 ? (
                    <p className="text-sm text-gray-500">상품 없음</p>
                  ) : (
                    items.map((i) => (
                      <div key={i.id} className="text-sm border-b py-1">

                        <p className="font-semibold">
                          {i.product_name}
                        </p>

                        <p className="text-gray-600">
                          {i.quantity}개 / {i.price.toLocaleString()}원
                        </p>

                      </div>
                    ))
                  )}

                </div>
              )}

            </div>
          ))
        )}

      </div>

    </main>
  );
}
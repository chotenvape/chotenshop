"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
};

type Order = {
  id: number;
  user_id: string;
  total_price: number;
  status: string;
  customer_name?: string;
  address?: string;
  depositor_name?: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [doneOrders, setDoneOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  // 상품
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const categories = ["기기", "일회용", "팟", "코일", "액상"];

  // ================= LOAD =================
  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
  }

  async function loadOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    const normal = (data || []).filter((o) => o.status !== "done");
    const done = (data || []).filter((o) => o.status === "done");

    setOrders(normal);
    setDoneOrders(done);
  }

  async function loadOrderDetail(orderId: number) {
    setSelectedOrder(orderId);

    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    setOrderItems(data || []);
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // ================= IMAGE =================
  async function uploadImage(file: File) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // ================= PRODUCT SAVE =================
  async function saveProduct() {
    if (!name || !price || !category) return;

    let imageUrl = "";

    if (file) {
      imageUrl = await uploadImage(file);
    }

    if (editingId) {
      await supabase
        .from("products")
        .update({
          name,
          price: Number(price),
          category,
          description,
          ...(imageUrl && { image: imageUrl }),
        })
        .eq("id", editingId);
    } else {
      await supabase.from("products").insert([
        {
          name,
          price: Number(price),
          category,
          description,
          image: imageUrl,
        },
      ]);
    }

    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setFile(null);
    setEditingId(null);

    loadProducts();
  }

  async function deleteProduct(id: number) {
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setName(p.name);
    setPrice(String(p.price));
    setCategory(p.category);
    setDescription(p.description);
  }

  // ================= STATUS =================
  async function updateStatus(id: number, status: string) {
    await supabase.from("orders").update({ status }).eq("id", id);
    loadOrders();
  }

  // ================= ORDER DELETE (취소) =================
  async function cancelOrder(id: number) {
    await supabase.from("order_items").delete().eq("order_id", id);
    await supabase.from("orders").delete().eq("id", id);

    setSelectedOrder(null);
    loadOrders();
  }

  return (
    <main className="min-h-screen bg-pink-50 p-6">

      <div className="mx-auto max-w-7xl">

        <h1 className="text-center text-4xl font-bold text-pink-500 mb-6">
          🎀 관리자 페이지
        </h1>

        <div className="grid grid-cols-3 gap-6">

          {/* ================= PRODUCT ================= */}
          <div className="bg-white p-4 rounded-2xl shadow">

            <h2 className="font-bold mb-3">📦 상품 등록</h2>

            <input
              placeholder="상품명"
              className="w-full border p-2 mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="가격"
              className="w-full border p-2 mb-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <select
              className="w-full border p-2 mb-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">카테고리</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <textarea
              placeholder="상세정보"
              className="w-full border p-2 mb-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              className="w-full border p-2 mb-2"
              onChange={(e) => {
                if (e.target.files?.[0]) setFile(e.target.files[0]);
              }}
            />

            <button
              onClick={saveProduct}
              className="w-full bg-pink-500 text-white p-2 rounded"
            >
              {editingId ? "수정" : "등록"}
            </button>

          </div>

          {/* ================= PRODUCT LIST ================= */}
          <div className="bg-white p-4 rounded-2xl shadow">

            <h2 className="font-bold mb-3">🛍 상품 목록</h2>

            {products.map((p) => (
              <div key={p.id} className="border p-2 mb-2 rounded">

                <p className="font-bold">{p.name}</p>
                <p>{p.price}원</p>

                {p.image && (
                  <img
                    src={p.image}
                    className="w-full h-20 object-cover rounded mt-2"
                  />
                )}

                <div className="flex gap-2 mt-2">
                  <button onClick={() => startEdit(p)} className="text-blue-500">
                    수정
                  </button>

                  <button onClick={() => deleteProduct(p.id)} className="text-red-500">
                    삭제
                  </button>
                </div>

              </div>
            ))}

          </div>

          {/* ================= ORDERS ================= */}
          <div className="bg-white p-4 rounded-2xl shadow">

            <h2 className="font-bold mb-3">📑 주문 관리</h2>

            {/* 진행 주문 */}
            {orders.map((o) => (
              <div key={o.id} className="border p-2 mb-3 rounded">

                <p className="font-bold">주문 #{o.id}</p>
                <p>{o.total_price.toLocaleString()}원</p>
                <p>상태: {o.status}</p>

                {o.customer_name && <p className="text-xs">이름: {o.customer_name}</p>}
                {o.depositor_name && <p className="text-xs">입금자: {o.depositor_name}</p>}
                {o.address && <p className="text-xs">주소: {o.address}</p>}

                <div className="flex flex-wrap gap-1 mt-2">

                  <button
                    onClick={() => updateStatus(o.id, "paid")}
                    className="bg-green-500 text-white px-2 py-1 text-xs rounded"
                  >
                    입금확인
                  </button>

                  <button
                    onClick={() => updateStatus(o.id, "preparing")}
                    className="bg-yellow-500 text-white px-2 py-1 text-xs rounded"
                  >
                    준비
                  </button>

                  <button
                    onClick={() => updateStatus(o.id, "shipping")}
                    className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
                  >
                    배송중
                  </button>

                  <button
                    onClick={() => updateStatus(o.id, "done")}
                    className="bg-gray-700 text-white px-2 py-1 text-xs rounded"
                  >
                    완료
                  </button>

                  {/* ❌ 취소 = 삭제 */}
                  <button
                    onClick={() => cancelOrder(o.id)}
                    className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                  >
                    취소
                  </button>

                  <button
                    onClick={() => loadOrderDetail(o.id)}
                    className="bg-gray-200 px-2 py-1 text-xs rounded"
                  >
                    상세
                  </button>

                </div>

              </div>
            ))}

            {/* 완료 주문 */}
            <h3 className="font-bold mt-6 mb-2 text-green-600">
              ✅ 배송 완료 목록
            </h3>

            {doneOrders.map((o) => (
              <div key={o.id} className="border p-2 mb-2 rounded bg-green-50">
                <p>주문 #{o.id}</p>
                <p>{o.total_price.toLocaleString()}원</p>
              </div>
            ))}

            {/* 상세 */}
            {selectedOrder && (
              <div className="mt-4 p-3 bg-gray-100 rounded">

                <h3 className="font-bold mb-2">📦 주문 상품</h3>

                {orderItems.map((item) => (
                  <div key={item.id}>
                    • {item.product_name} / {item.quantity}개 / {item.price}원
                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}
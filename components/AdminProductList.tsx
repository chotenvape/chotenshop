"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  async function loadProducts() {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    setProducts(data || []);
  }

  async function deleteProduct(id: number) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="mt-12">
      <h2 className="mb-6 text-3xl font-bold text-pink-500">
        등록된 상품
      </h2>

      <div className="space-y-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-5 rounded-2xl bg-pink-50 p-4"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={100}
              height={100}
              className="rounded-xl object-cover"
            />

            <div className="flex-1">
              <h3 className="text-xl font-bold">{product.name}</h3>

              <p className="text-pink-500 font-bold">
                ₩ {Number(product.price).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => deleteProduct(product.id)}
              className="rounded-xl bg-red-500 px-5 py-2 font-bold text-white hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
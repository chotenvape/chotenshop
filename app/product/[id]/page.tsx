import Image from "next/image";
import { notFound } from "next/navigation";
import { supabaseServer } from "../../../lib/supabase-server";
import BuyButton from "../../../components/BuyButton";

type Props = {
  params: {
    id: string;
  };
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = params;

  const { data: product } = await supabaseServer
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-pink-50 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="grid gap-10 md:grid-cols-2">

          {/* 이미지 */}
          <div className="overflow-hidden rounded-3xl border border-pink-100">
            <Image
              src={product.image}
              alt={product.name}
              width={700}
              height={700}
              className="h-auto w-full object-cover"
            />
          </div>

          {/* 정보 */}
          <div>
            <h1 className="text-4xl font-extrabold text-pink-500">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-bold">
              ₩ {Number(product.price).toLocaleString()}
            </p>

            {/* 설명 */}
            <div className="mt-8 rounded-2xl bg-pink-50 p-5">
              <h2 className="mb-2 text-xl font-bold text-pink-500">
                상품 설명
              </h2>
              <p className="whitespace-pre-wrap text-gray-700">
                {product.description || "상품 설명이 없습니다."}
              </p>
            </div>

            {/* 안내 */}
            <div className="mt-8 rounded-2xl border border-pink-200 bg-pink-50 p-5">
              <h2 className="mb-2 text-xl font-bold text-pink-500">
                구매 전 안내
              </h2>
              <p className="whitespace-pre-wrap text-gray-700">
                {product.notice || "안내사항이 없습니다."}
              </p>
            </div>

            {/* 구매 버튼 */}
            <BuyButton notice={product.notice} product={product} />
          </div>

        </div>
      </div>
    </main>
  );
}
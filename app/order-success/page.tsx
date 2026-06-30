"use client";

import { useRouter } from "next/navigation";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-100 to-white p-6">
      
      <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-md w-full">

        <h1 className="text-3xl font-extrabold text-pink-500">
          🎉 주문 완료!
        </h1>

        <p className="text-gray-500 mt-3">
          주문이 정상적으로 처리되었습니다
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 w-full bg-pink-500 text-white py-3 rounded-2xl font-bold hover:bg-pink-600"
        >
          홈으로 이동
        </button>

      </div>

    </main>
  );
}
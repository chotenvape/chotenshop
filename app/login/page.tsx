"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // 🔥 관리자 체크
    const admin = await isAdmin();

    alert("로그인 성공!");

    if (admin) {
      router.push("/admin");
    } else {
      router.push("/");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-100">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* 🔙 뒤로가기 추가 */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm font-semibold text-gray-600 hover:text-black transition"
        >
          ← 뒤로가기
        </button>

        <h1 className="mb-6 text-center text-3xl font-bold text-pink-500">
          로그인
        </h1>

        <input
          className="mb-4 w-full rounded-xl border p-3"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mb-6 w-full rounded-xl border p-3"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full rounded-xl bg-pink-500 p-3 font-bold text-white hover:bg-pink-600 transition"
        >
          {loading ? "로그인중..." : "로그인"}
        </button>

      </div>
    </main>
  );
}
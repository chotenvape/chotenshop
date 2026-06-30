"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signup() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("회원가입 완료! 로그인 해주세요");
    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-100">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-sm font-semibold text-gray-600 hover:text-black"
        >
          ← 뒤로가기
        </button>

        <h1 className="mb-6 text-center text-3xl font-bold text-pink-500">
          회원가입
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
          onClick={signup}
          disabled={loading}
          className="w-full rounded-xl bg-pink-500 p-3 font-bold text-white hover:bg-pink-600 transition"
        >
          {loading ? "가입중..." : "회원가입"}
        </button>

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/80 backdrop-blur-md shadow-sm">

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">

        {/* 로고 */}
        <Link href="/">
          <h1 className="text-2xl font-extrabold text-pink-500 tracking-tight">
            💖 쵸텐샵
          </h1>
        </Link>

        {/* 오른쪽 메뉴 */}
        <div className="flex items-center gap-2">

          {/* 로그인 안됨 */}
          {!user ? (
            <>
              <Link href="/login">
                <button className="rounded-full bg-pink-500 px-4 py-2 text-sm font-bold text-white shadow-md transition active:scale-95">
                  로그인
                </button>
              </Link>

              <Link href="/signup">
                <button className="rounded-full border border-pink-300 px-4 py-2 text-sm font-bold text-pink-500 transition active:scale-95 hover:bg-pink-50">
                  회원가입
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* 이메일 (모바일 숨김) */}
              <span className="hidden text-xs text-gray-500 md:block">
                {user.email}
              </span>

              <Link href="/cart">
                <button className="rounded-full bg-pink-100 px-3 py-2 text-sm font-bold text-pink-600 transition active:scale-95 hover:bg-pink-200">
                  🛒
                </button>
              </Link>

              <Link href="/orders">
                <button className="rounded-full bg-pink-500 px-3 py-2 text-sm font-bold text-white transition active:scale-95 hover:bg-pink-600">
                  📦
                </button>
              </Link>

              <button
                onClick={logout}
                className="rounded-full bg-gray-900 px-4 py-2 text-sm font-bold text-white transition active:scale-95 hover:bg-black"
              >
                로그아웃
              </button>
            </>
          )}

        </div>
      </div>
    </header>
  );
}
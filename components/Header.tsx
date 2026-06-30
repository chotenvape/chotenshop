"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
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
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* 로고 */}
        <Link href="/">
          <h1 className="cursor-pointer text-3xl font-extrabold text-pink-500">
            쵸텐샵
          </h1>
        </Link>

        {/* 오른쪽 메뉴 */}
        <div className="flex items-center gap-3">

          {/* 장바구니 */}
          {user && (
            <>
              <Link href="/cart">
                <button className="rounded-full border border-pink-300 px-5 py-2 font-semibold text-pink-500 transition hover:bg-pink-50">
                  🛒 장바구니
                </button>
              </Link>

              <Link href="/orders">
                <button className="rounded-full bg-pink-500 px-5 py-2 text-white transition hover:bg-pink-600">
                  📦 주문내역
                </button>
              </Link>
            </>
          )}

          {/* 로그인/회원가입 or 로그아웃 */}
          {!user ? (
            <>
              <Link href="/login">
                <button className="rounded-full bg-pink-500 px-5 py-2 text-white transition hover:bg-pink-600">
                  로그인
                </button>
              </Link>

              <Link href="/signup">
                <button className="rounded-full border border-pink-300 px-5 py-2 text-pink-500 transition hover:bg-pink-50">
                  회원가입
                </button>
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-sm text-gray-500 md:block">
                {user.email}
              </span>

              <button
                onClick={logout}
                className="rounded-full bg-pink-500 px-5 py-2 text-white transition hover:bg-pink-600"
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
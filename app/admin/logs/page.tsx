import { supabase } from "@/lib/supabase";

export default async function LogsPage() {
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: false });

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <div className="mx-auto max-w-5xl">
        
        <h1 className="mb-8 text-4xl font-bold text-pink-500">
          📋 상품 로그
        </h1>

        <div className="space-y-4">
          {products?.map((item: any) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white p-5 shadow-md"
            >
              <div className="flex justify-between">
                
                <div>
                  <h2 className="text-xl font-bold">{item.name}</h2>
                  <p className="text-gray-500">
                    ₩ {Number(item.price).toLocaleString()}
                  </p>
                </div>

                <span className="text-sm text-gray-400">
                  ID: {item.id}
                </span>

              </div>

              <p className="mt-2 text-sm text-gray-600">
                {item.notice || "기록 없음"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {item.description || "설명 없음"}
              </p>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
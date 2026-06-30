import Image from "next/image";

export default function Banner() {
  return (
    <section className="bg-pink-50 py-4">
      <div className="mx-auto max-w-6xl px-3">

        {/* 모바일 기준 배너 */}
        <div className="relative h-40 w-full overflow-hidden rounded-2xl shadow-md sm:h-52 md:h-72">

          <Image
            src="/hero.webp"
            alt="메인 배너"
            fill
            priority
            className="object-cover object-center"
          />

        </div>

      </div>
    </section>
  );
}
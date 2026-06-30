import Image from "next/image";

export default function Banner() {
  return (
    <section className="bg-pink-50 py-6">
      <div className="mx-auto max-w-6xl px-4">

        <div className="relative h-56 w-full overflow-hidden rounded-3xl shadow-xl md:h-72">

          <Image
            src="/hero.webp"
            alt="메인 배너"
            fill
            className="object-cover object-center"
            priority
          />

        </div>

      </div>
    </section>
  );
}
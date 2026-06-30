import Image from "next/image";

export default function Banner() {
  return (
    <section className="bg-pink-50 py-6">
      <div className="mx-auto max-w-7xl px-4">
        <Image
          src="/hero.webp"
          alt="메인 배너"
          width={1400}
          height={500}
          priority
          className="w-full rounded-3xl shadow-xl"
        />
      </div>
    </section>
  );
}
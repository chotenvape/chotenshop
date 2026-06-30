import Link from "next/link";
import Image from "next/image";

type Props = {
  id: number;
  name: string;
  price: string;
  image: string;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
}: Props) {
  return (
    <Link href={`/product/${id}`}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">

        <div className="relative h-60 bg-pink-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="mt-2 text-xl font-bold text-pink-500">
            {price}
          </p>
        </div>

      </div>
    </Link>
  );
}
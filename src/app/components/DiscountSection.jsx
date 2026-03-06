"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DiscountSection() {
  const router = useRouter();

  const goToProducts = () => {
    router.push("/mainproducts");
  };

  const goToHome = () => {
    router.push("/");
  };

  return (

    <section className="bg-blue-700 text-white py-20">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10 px-6">

        {/* IMAGE */}

        <div>
          <Image
            src="/dddee.png"
            width={600}
            height={400}
            alt="controller"
            className="w-full"
          />
        </div>

        {/* TEXT */}

        <div>

          <p className="text-lg text-blue-200 mb-2">
            Computer Accessories
          </p>

          <h1 className="text-5xl font-bold mb-6">
            Game Controller
          </h1>

          <p className="text-2xl mb-6">

            <span className="line-through text-gray-300 mr-3">
              $60.00
            </span>

            <span className="font-bold">
              $40.00
            </span>

          </p>

          <div className="flex gap-4">

            <button
              onClick={goToHome}
              className="border border-white px-6 py-3 rounded hover:bg-white hover:text-blue-700 transition"
            >
              BUY NOW
            </button>

            <button
              onClick={goToProducts}
              className="bg-green-500 px-6 py-3 rounded hover:bg-green-600"
            >
              VIEW COLLECTIONS
            </button>

          </div>

        </div>

      </div>

    </section>

  );
}
import React from "react";
import { Instagram } from "lucide-react";
import sponsors from "./sponsorsMockup";
import Image from "next/image";
import Link from "next/link";

export default function SponsorsPage() {
  return (
    <div className="bg-[#fdfaf3] container mx-auto px-4 py-10 text-center">
      {/* Título */}
      <div className="bg-[#d0bb942c] p-2 rounded-2xl shadow-md mb-10">
        <h1 className="text-4xl font-bold my-4 text-white">
          Nossos Patrocinadores
        </h1>
        {/* Descrição */}
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Agradecemos a todos os nossos patrocinadores que acreditam e apoiam
          este projeto. O sucesso do campeonato só é possível graças ao
          incentivo dessas marcas incríveis.
        </p>
      </div>

      {/* Grade de patrocinadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center hover:shadow-xl transition"
          >
            {/* Logo */}
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              className="w-28 h-28 object-contain mb-4"
            />

            {/* Nome */}
            <h2 className="text-lg font-semibold mb-2 text-gray-500">
              {sponsor.name}
            </h2>

            {/* Instagram */}
            <Link
              href={sponsor.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-pink-600 hover:text-pink-800 transition"
            >
              <Instagram className="w-5 h-5 mr-1" />@{sponsor.insta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";
// import Image from "next/image";

export default function page() {
  return (
    <div className="min-h-screen bg-[#fdfaf3]">
      {/* Header */}
      <header className="bg-[#708c9a] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="hover:text-green-200">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <CalendarClock className="w-6 h-6" />
            <h1 className="text-xl font-bold">Partidas</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-6 shadow-md text-center">
          <h2 className="text-lg font-semibold mb-2">Confrontos em breve</h2>
          <p>Os confrontos ainda não foram definidos.</p>
          <p className="text-sm text-gray-600 mt-2">
            Acompanhe essa página para ver os jogos quando forem divulgados.
          </p>
        </div>

        {/* Exemplo de layout de uma partida futura */}
        <div className="mt-8">
          <h3 className="text-md font-bold text-gray-700 mb-4">
            Exemplo de Partida
          </h3>
          <div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-800">Time A</span>
            </div>

            <span className="text-gray-500 font-bold">vs</span>

            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-800">Time A</span>
            </div>

            <div className="text-sm text-gray-600 text-center sm:text-right">
              <p>
                <strong>Data:</strong> 20/07/2025
              </p>
              <p>
                <strong>Horário:</strong> 15:30
              </p>
              <p>
                <strong>Local:</strong> Estadio das Luzes
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-800">Time B</span>
            </div>

            <span className="text-gray-500 font-bold">vs</span>

            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-800">Time B</span>
            </div>

            <div className="text-sm text-gray-600 text-center sm:text-right">
              <p>
                <strong>Data:</strong> 20/07/2025
              </p>
              <p>
                <strong>Horário:</strong> 15:30
              </p>
              <p>
                <strong>Local:</strong> Estadio das Luzes
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

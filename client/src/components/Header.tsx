// components/Header.tsx
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/Logo_Preto.jpeg";

export default function Header() {
  return (
    <header className="bg-[#102f4c] text-[#d0bb94] shadow">
      <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl">
        <div className="flex items-center space-x-4">
          <Image
            src={logo}
            alt="Logo do Campeonato"
            width={50}
            height={50}
            className="object-cover rounded-full"
          />
          <h1 className="text-xl font-bold">Campeões Travinho</h1>
        </div>

        <nav className="space-x-4">
          <Link href="/" passHref>
            <span className="px-3 py-1 rounded cursor-pointer hover:bg-[#2b4d66] transition">
              Home
            </span>
          </Link>
          <Link href="/table" passHref>
            <span className="px-3 py-1 rounded cursor-pointer hover:bg-[#2b4d66] transition">
              Tabela
            </span>
          </Link>
          <Link href="/matches" passHref>
            <span className="px-3 py-1 rounded cursor-pointer hover:bg-[#2b4d66] transition">
              Partidas
            </span>
          </Link>
          <Link href="/news" passHref>
            <span className="px-3 py-1 rounded cursor-pointer hover:bg-[#2b4d66] transition">
              Notícias
            </span>
          </Link>
        </nav>

        <Link href="/inscription">
          <button className="bg-[#855b21] hover:bg-[#5e5035] text-white cursor-pointer font-semibold px-6 py-3 rounded-full transition">
            Fazer Inscrição
          </button>
        </Link>
      </div>
    </header>
  );
}

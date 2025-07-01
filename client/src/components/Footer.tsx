import Link from "next/link";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import logo from "@/assets/Logo_Tranparente.png";

export default function Footer() {
  return (
    <footer className="bg-[#102f4c] text-[#d0bb94] py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap">
        {/* Logo e Regulamento */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src={logo}
            alt="Logo do Campeonato Travinha"
            width={60}
            height={60}
            className="object-contain"
          />
          <a
            href="/REGULAMENTO_DA_COPA_CAMPEÃES_TRAVINHO_2023.pdf"
            download
            className="text-sm underline hover:text-[#855b21] transition-colors"
          >
            Veja Nosso Regulamento
          </a>
        </div>

        {/* Navegação */}
        <nav className="flex gap-4 text-md">
          <Link href="/" className="hover:text-[#855b21] transition-colors">
            Home
          </Link>
          <Link
            href="/table"
            className="hover:text-[#855b21] transition-colors"
          >
            Tabela
          </Link>
          <Link
            href="/matches"
            className="hover:text-[#855b21] transition-colors"
          >
            Partidas
          </Link>
          <Link href="/news" className="hover:text-[#855b21] transition-colors">
            Notícias
          </Link>
        </nav>

        {/* Instagram */}
        <Link
          href="https://www.instagram.com/campeoes_travinha?igsh=NWR2eGxxMXB6aHMw"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm hover:text-[#855b21] transition-colors"
        >
          <FaInstagram className="text-xl" />
          <span>@campeoes_travinha</span>
        </Link>
      </div>

      {/* Direitos autorais */}
      <div className="text-center text-sm mt-6 border-t border-[#d0bb94]/20 pt-4">
        © {new Date().getFullYear()} Campeonato Travinha. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}

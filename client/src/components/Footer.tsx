import Link from "next/link";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import logo from "@/assets/Logo_Tranparente.png";

export default function Footer() {
  return (
    <footer className="bg-[#102f4c] px-4 py-6 text-[#d0bb94]">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
        <div className="flex w-full flex-col items-center gap-4 md:w-auto">
          <Image
            src={logo}
            alt="Logo do Campeonato Travinha"
            width={72}
            height={72}
            className="object-contain"
          />
          <a
            href="/Regulamento_Travinho_2025.pdf"
            download
            className="text-center text-sm underline transition-colors hover:text-[#855b21]"
          >
            Veja Nosso Regulamento
          </a>
        </div>

        <nav className="grid w-full max-w-sm grid-cols-2 gap-x-6 gap-y-3 text-center text-sm sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-4 md:w-auto md:text-base">
          <Link href="/" className="transition-colors hover:text-[#855b21]">
            Home
          </Link>
          <Link href="/table" className="transition-colors hover:text-[#855b21]">
            Tabela
          </Link>
          <Link href="/matches" className="transition-colors hover:text-[#855b21]">
            Partidas
          </Link>
          <Link
            href="/statistics"
            className="transition-colors hover:text-[#855b21]"
          >
            Estatísticas
          </Link>
          <Link href="/news" className="transition-colors hover:text-[#855b21]">
            Notícias
          </Link>
          <Link href="/history" className="transition-colors hover:text-[#855b21]">
            Histórico
          </Link>
        </nav>

        <Link
          href="https://www.instagram.com/campeoes_travinha?igsh=NWR2eGxxMXB6aHMw"
          target="_blank"
          rel="noopener noreferrer"
          className="flex max-w-full items-center gap-2 text-sm transition-colors hover:text-[#855b21] md:justify-end"
        >
          <FaInstagram className="shrink-0 text-xl" />
          <span className="break-all">@campeoes_travinha</span>
        </Link>
      </div>

      <div className="mt-6 border-t border-[#d0bb94]/20 pt-4 text-center text-xs leading-relaxed sm:text-sm">
        &copy; {new Date().getFullYear()} Campeonato Travinha. Todos os direitos
        reservados.
      </div>
    </footer>
  );
}

import Link from "next/link";

// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#102f4c] text-[#d0bb94] py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} Campeonato Travinha. Todos os direitos
          reservados.
        </p>

        <nav className="space-x-6">
          <Link href="/" className="hover:text-[#855b21] transition-colors">
            Home
          </Link>
          <Link
            href="/tabela"
            className="hover:text-[#855b21] transition-colors"
          >
            Tabela
          </Link>
          <Link
            href="/partidas"
            className="hover:text-[#855b21] transition-colors"
          >
            Partidas
          </Link>
          <Link
            href="/noticias"
            className="hover:text-[#855b21] transition-colors"
          >
            Notícias
          </Link>
        </nav>
      </div>
    </footer>
  );
}

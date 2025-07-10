// components/Header.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // ícones

import logo from "@/assets/Logo_Preto.jpeg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#102f4c] text-[#d0bb94] shadow">
      <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl">
        {/* Logo e título */}
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

        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-4 items-center">
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
          <Link href="/inscription">
            <button className="bg-[#855b21] hover:bg-[#5e5035] text-white font-semibold px-4 py-2 rounded-full transition">
              Fazer Inscrição
            </button>
          </Link>
        </nav>

        {/* Botão mobile */}
        <button
          className="md:hidden text-[#d0bb94]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3 bg-[#102f4c] text-sm">
          <Link href="/" passHref onClick={() => setMenuOpen(false)}>
            <div className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
              Home
            </div>
          </Link>
          <Link href="/table" passHref onClick={() => setMenuOpen(false)}>
            <div className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
              Tabela
            </div>
          </Link>
          <Link href="/matches" passHref onClick={() => setMenuOpen(false)}>
            <div className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
              Partidas
            </div>
          </Link>
          <Link href="/news" passHref onClick={() => setMenuOpen(false)}>
            <div className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
              Notícias
            </div>
          </Link>
          <Link href="/inscription" passHref onClick={() => setMenuOpen(false)}>
            <div className="block bg-[#855b21] text-white text-center py-2 rounded-full hover:bg-[#5e5035] font-semibold">
              Fazer Inscrição
            </div>
          </Link>
        </div>
      )}
    </header>
  );
}

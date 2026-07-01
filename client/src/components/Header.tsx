// components/Header.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown  } from "lucide-react"; // ícones

import logo from "../assets/Logo_Preto.jpeg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [matchMenuOpen, setMatchMenuOpen] = useState(false);

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
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-[#2b4d66] transition"
            >
              <span>Partidas</span>

              <ChevronDown
                className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div className="absolute left-0 top-full mt-1 w-56 overflow-hidden rounded-md bg-white shadow-lg z-50 md:w-60">
                <Link
                  href="/matches"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  Partidas
                </Link>

                <Link
                  href="/statistics"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  Estatísticas
                </Link>

                <Link
                  href="/matches/floods"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100"
                >
                  Problabilidades
                </Link>
              </div>
            )}
          </div>
          <Link href="/news" passHref>
            <span className="px-3 py-1 rounded cursor-pointer hover:bg-[#2b4d66] transition">
              Notícias
            </span>
          </Link>
          <Link href="/sponsors" passHref>
            <span className="px-3 py-1 rounded cursor-pointer hover:bg-[#2b4d66] transition">
              Patrocinadores
            </span>
          </Link>
          <Link href="/history" passHref>
            <span className="px-3 py-1 rounded cursor-pointer hover:bg-[#2b4d66] transition">
              Histórico
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

          <button onClick={() => setMatchMenuOpen(!matchMenuOpen)} className="flex w-full items-center justify-between rounded px-3 pt-2 hover:bg-[#2b4d66]">
              <span>Partidas</span>
              <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}/>
          </button>

          {matchMenuOpen && (
            <div className="ml-4 border-l border-white/20">
              <Link href="/matches" passHref onClick={() => setMenuOpen(false)}>
                <div className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
                  Partidas
              </div>
              </Link>
              <Link href="/statistics" passHref onClick={() => setMenuOpen(false)}>
                <div className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
                  Estatísticas
                </div>
              </Link>
              <Link href="/matches/floods" onClick={() => setIsOpen(false)} 
                className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
                Probabilidades
              </Link>
            </div>
          )}

          <Link href="/news" passHref onClick={() => setMenuOpen(false)}>
            <div className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
              Notícias
            </div>
          </Link>
          <Link href="/sponsors" passHref onClick={() => setMenuOpen(false)}>
            <div className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
              Patrocinadores
            </div>
          </Link>
          <Link href="/history" passHref onClick={() => setMenuOpen(false)}>
            <div className="block px-3 py-2 rounded hover:bg-[#2b4d66]">
              Histórico
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

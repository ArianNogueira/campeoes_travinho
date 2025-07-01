"use client";

import { useEffect, useState } from "react";
import { emblemMap } from "./emblem";
import Image from "next/image";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedRound, setSelectedRound] = useState(1);

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch(
          "https://campeoes-travinho.onrender.com/matches"
        );
        const data = await res.json();
        setMatches(data);
      } catch (error) {
        console.error("Erro ao buscar partidas:", error);
      }
    }

    fetchMatches();
  }, []);

  const teamsList = Array.from(
    new Set(matches.flatMap((m) => [m.home?.name, m.away?.name]))
  );

  const roundsList = Array.from(new Set(matches.map((m) => m.round))).sort(
    (a, b) => a - b
  );

  const filteredMatches =
    selectedTeam === "all"
      ? matches.filter((m) => m.round === selectedRound)
      : matches.filter(
          (m) => m.home?.name === selectedTeam || m.away?.name === selectedTeam
        );

  return (
    <div className="mx-auto py-6 px-5 md:px-20 bg-[#fdfaf3]">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Partidas
      </h1>

      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div>
          <label className="mr-2 font-medium text-gray-700">
            Filtrar por time:
          </label>
          <select
            className="border rounded px-3 py-1 text-gray-700"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="all">Todos</option>
            {teamsList.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium text-gray-700">Rodada:</label>
          <select
            className="border rounded px-3 py-1 text-gray-700"
            value={selectedRound}
            onChange={(e) => setSelectedRound(Number(e.target.value))}
            disabled={selectedTeam !== "all"}
          >
            {roundsList.map((round) => (
              <option key={round} value={round}>
                {round}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Partidas */}
      {filteredMatches.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma partida encontrada.</p>
      ) : (
        filteredMatches.map((match) => (
          <div
            key={match.id}
            className="mx-auto border border-gray-200 rounded-xl p-4 shadow-md bg-white mb-6 max-w-xl md:max-w-full"
          >
            <div className="mb-2 text-sm text-indigo-600 text-center font-semibold">
              Rodada {match.round} · Grupo {match.group}
            </div>

            <div className="flex justify-around items-center mb-4 text-sm text-gray-600 flex-wrap gap-2 text-center">
              <div className="flex gap-5">
                <div>
                  <span className="font-medium">Data:</span>
                  <span className="ml-1">{match.date}</span>
                </div>
                <div>
                  <span className="font-medium">Hora:</span>
                  <span className="ml-1">{match.time}</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Local: Stadium das Luses</span>
              </div>
            </div>

            {/* Confronto responsivo e centralizado */}
            <div className="grid grid-cols-3 items-center text-center gap-2 sm:gap-4">
              {/* Time A */}
              <div className="flex flex-col items-center justify-center gap-y-1">
                <Image
                  src={emblemMap[match.home?.name] || "/default-emblem.png"}
                  alt={match.home?.name}
                  width={50}
                  height={50}
                  className="rounded-full mb-1"
                />
                <p className="text-sm font-semibold text-gray-800 text-center max-w-[1400px] truncate">
                  {match.home?.name}
                </p>
              </div>

              {/* VS */}
              <div className="text-2xl font-bold text-gray-600 flex items-center justify-center h-full">
                <span className="text-gray-400">vs</span>
              </div>

              {/* Time B */}
              <div className="flex flex-col items-center justify-center gap-y-1">
                <Image
                  src={emblemMap[match.away?.name] || "/default-emblem.png"}
                  alt={match.away?.name}
                  width={50}
                  height={50}
                  className="rounded-full mb-1"
                />
                <p className="text-sm font-semibold text-gray-800 text-center max-w-[140px] truncate">
                  {match.away?.name}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

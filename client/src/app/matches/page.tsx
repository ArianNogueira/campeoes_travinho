"use client";

import { useState } from "react";
import Image from "next/image";
import { matches } from "./matche";

export default function MatchesPage() {
  const [selectedTeam, setSelectedTeam] = useState("all");

  const teamsList = Array.from(
    new Set(matches.flatMap((m) => [m.teamA.name, m.teamB.name]))
  );

  const filteredMatches =
    selectedTeam === "all"
      ? matches
      : matches.filter(
          (m) => m.teamA.name === selectedTeam || m.teamB.name === selectedTeam
        );

  return (
    <div className="mx-auto py-6 px-5 md:px-20 bg-[#fdfaf3]">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Partidas
      </h1>

      {/* Filtro */}
      <div className="mb-6 text-center">
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

      {filteredMatches.map((match) => (
        <div
          key={match.id}
          className="mx-auto border border-gray-200 rounded-xl p-4 shadow-md bg-white mb-6"
        >
          {/* Rodada */}
          <div className="mb-5 md:mb-2 text-sm text-indigo-600 text-center font-semibold">
            Rodada {match.round} · Grupo {match.group}
          </div>

          {/* Infos principais */}
          <div className="flex justify-around items-center mb-4 text-sm text-gray-600">
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
              <span className="font-medium">Local:</span> {match.location}
            </div>
          </div>

          {/* Confronto */}
          <div className="flex items-center justify-around">
            {/* Time A */}
            <div className="flex items-center gap-3">
              <Image
                src={match.teamA.emblem}
                alt={match.teamA.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {match.teamA.name}
                </p>
                <p className="text-sm text-gray-500">
                  Posição: {match.teamA.position}
                </p>
              </div>
            </div>

            {/* Placar */}
            <div className=" text-center text-2xl font-bold text-gray-700 w-24">
              {match.scoreA !== null && match.scoreB !== null ? (
                `${match.scoreA} - ${match.scoreB}`
              ) : (
                <span className="text-gray-400">vs</span>
              )}
            </div>

            {/* Time B */}
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {match.teamB.name}
                </p>
                <p className="text-sm text-gray-500">
                  Posição: {match.teamB.position}
                </p>
              </div>
              <Image
                src={match.teamB.emblem}
                alt={match.teamB.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

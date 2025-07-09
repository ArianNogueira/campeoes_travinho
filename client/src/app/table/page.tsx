"use client";

import { useState } from "react";
import { Trophy, ArrowLeft, TrendingUp, Target, Shield } from "lucide-react";
import { bestDefenses, standings, topScorers } from "./mockData";
import Image from "next/image";
import Link from "next/link";

const StandingsPage = () => {
  const [selectedGroup, setSelectedGroup] = useState("all");

  const sortTeams = (teams: typeof standings) =>
    teams
      .slice()
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points; // 1. Pontos
        if (b.goalDifference !== a.goalDifference)
          return b.goalDifference - a.goalDifference; // 2. Saldo
        return b.goalsFor - a.goalsFor; // 3. Gols marcados
      })
      .map((team, index) => ({ ...team, position: index + 1 }));

  const filteredStandings =
    selectedGroup === "all"
      ? sortTeams(standings)
      : sortTeams(standings.filter((team) => team.group === selectedGroup));

  const groups = ["A", "B"];

  const getPositionColor = (position: number) => {
    if (position <= 4) return "text-green-600 bg-green-50"; // Classificados
    return "text-red-600 bg-red-50"; // Zona de rebaixamento
  };

  return (
    <div className="min-h-screen bg-[#fdfaf3]">
      {/* Header */}
      <header className="text-white bg-[#708c9a] shadow-lg">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center space-x-3">
            <Link href="/" className="hover:text-green-200">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <Trophy className="w-6 h-6" />
            <h1 className="text-xl font-bold">Classificação</h1>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8 mx-auto">
        {/* Filters */}
        <div className="p-6 mb-6 bg-[#d0bb942c] rounded-lg shadow-md">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedGroup("all")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedGroup === "all"
                    ? "bg-[#557389] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>
              {groups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedGroup === group
                      ? "bg-[#557389] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Grupo {group}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-1 lg:px-0">
          {/* Tabela principal (ocupa 2 colunas no desktop) */}
          <div className="lg:col-span-2 w-full">
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 text-white bg-[#708c9a]">
                <h2 className="text-xl font-bold">
                  {selectedGroup === "all"
                    ? "Classificação Geral"
                    : `Grupo ${selectedGroup}`}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      {[
                        "Pos",
                        "Time",
                        "Pts",
                        "J",
                        "V",
                        "E",
                        "D",
                        "GP",
                        "GC",
                        "SG",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-sm font-semibold text-gray-600 text-center"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStandings.map((team) => (
                      <tr
                        key={team.id}
                        className="transition-colors border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPositionColor(
                              team.position
                            )}`}
                          >
                            {team.position}
                          </div>
                        </td>
                        <td className="px-2 py-4 min-w-44">
                          <div className="flex items-center gap-3">
                            <Image
                              src={team.img}
                              alt={team.team}
                              className="rounded-full w-10 h-10 object-cover"
                              width={40}
                              height={40}
                            />
                            <div>
                              <p className="font-semibold text-gray-800 text-sm md:text-base">
                                {team.team}
                              </p>
                              <p className="text-sm text-gray-500">
                                Grupo {team.group}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-black">
                          {team.points}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {team.played}
                        </td>
                        <td className="px-4 py-4 text-center text-green-600">
                          {team.won}
                        </td>
                        <td className="px-4 py-4 text-center text-yellow-600">
                          {team.drawn}
                        </td>
                        <td className="px-4 py-4 text-center text-red-600">
                          {team.lost}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {team.goalsFor}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {team.goalsAgainst}
                        </td>
                        <td className="px-4 py-4 text-center font-semibold">
                          <span
                            className={`${
                              team.goalDifference >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {team.goalDifference >= 0 ? "+" : ""}
                            {team.goalDifference}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legenda */}
              <div className="px-6 py-4 bg-gray-100 border-t text-sm">
                {selectedGroup === "all" ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-green-200 rounded-full bg-green-50"></div>
                    <span className="text-black">
                      Times com a melhor campanha durante a fase de grupos!
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-green-200 rounded-full bg-green-50"></div>
                      <span className="text-black">Classificados (1º-4º)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-red-200 rounded-full bg-red-50"></div>
                      <span className="text-black">Eliminados (5º-6º)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Sidebar */}
          <div className="space-y-6 max-w-[23.5em] md:max-w-full">
            {/* Top Scorers */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 text-white bg-[#5e5035]">
                <h3 className="flex items-center font-bold">
                  <Target className="w-5 h-5 mr-2" />
                  Artilheiros
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {topScorers.map((scorer, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {scorer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {scorer.team}
                        </div>
                      </div>
                      <div className="px-3 py-1 font-bold text-yellow-800 bg-yellow-100 rounded-full">
                        {scorer.goals}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best Defenses */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 text-white bg-blue-500">
                <h3 className="flex items-center font-bold">
                  <Shield className="w-5 h-5 mr-2" />
                  Melhores Defesas
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {bestDefenses.map((defense, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {defense.team}
                        </div>
                        <div className="text-sm text-gray-500">
                          {defense.cleanSheets} jogos sem sofrer
                        </div>
                      </div>
                      <div className="px-3 py-1 font-bold text-blue-800 bg-blue-100 rounded-full">
                        {defense.goalsAgainst}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tournament Progress */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 text-white bg-purple-500">
                <h3 className="flex items-center font-bold">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Progresso do Campeonato
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Jogos Realizados</span>
                    <span className="font-bold">6/38</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: "5%" }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500">1% concluído</div>

                  <div className="pt-4 space-y-2 border-t">
                    <div className="flex justify-between text-gray-600">
                      <span>Total de Gols</span>
                      <span className="font-bold">29</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Média por Jogo</span>
                      <span className="font-bold">4,8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandingsPage;

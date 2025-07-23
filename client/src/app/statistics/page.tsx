import React from "react";
import statisticsMockup from "./mockupStatistics";
import Image from "next/image";

export default function StatisticsPage() {
  const { topScorers, cards, teams } = statisticsMockup;

  const bestAttack = teams.reduce((prev, curr) =>
    curr.goalsScored > prev.goalsScored ? curr : prev
  );
  const bestDefense = teams.reduce((prev, curr) =>
    curr.goalsConceded < prev.goalsConceded ? curr : prev
  );

  return (
    <div className="bg-[#fdfaf3] px-4 py-10">
      {/* Título principal */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-[#5e5035]">
        Estatísticas do Campeonato
      </h1>

      {/* Andamento */}
      <section className="mb-12 text-center">
        <h2 className="text-2xl font-semibold my-5 text-[#5e5035]">
          Andamento do Campeonato
        </h2>
        <p className="text-gray-700 text-lg">
          Estamos atualmente na{" "}
          <span className="font-bold text-[#5e5035]">5ª Rodada</span> do
          campeonato.
        </p>
      </section>

      {/* Artilharia */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-[#5e5035]">Artilharia</h2>
        <div className="bg-white shadow rounded-xl p-4 border-l-4 border-[#5e5035] max-h-64 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white z-20 shadow-md">
              <tr className="border-b text-[#5e5035]">
                <th className="p-2">Jogador</th>
                <th className="p-2">Time</th>
                <th className="p-2 text-center">Gols</th>
              </tr>
            </thead>
            <tbody>
              {topScorers.map((player) => (
                <tr
                  key={player.id}
                  className="border-b hover:bg-[#f9f5ec] transition"
                >
                  <td className="p-2 text-gray-800 font-medium">
                    {player.name}
                  </td>
                  <td className="p-2 text-gray-600">
                    {typeof player.team === "string" ? (
                      player.team
                    ) : (
                      <Image
                        src={player.team}
                        alt={player.name}
                        width={35}
                        className="rounded-full"
                      />
                    )}
                  </td>
                  <td className="p-2 text-center font-bold text-[#5e5035]">
                    {player.goals}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cartões */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-red-700">Cartões</h2>
        <div className="bg-white shadow rounded-xl p-4 border-l-4 border-red-400 max-h-64 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white z-20 shadow-md">
              <tr className="border-b text-gray-700">
                <th className="p-2">Jogador</th>
                <th className="p-2">Time</th>
                <th className="p-2 text-center text-yellow-600">Amarelos</th>
                <th className="p-2 text-center text-red-600">Vermelhos</th>
                <th className="p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => {
                const status =
                  c.yellow > 2
                    ? "Suspenso"
                    : c.yellow === 2
                    ? "Pendurado"
                    : "-";

                return (
                  <tr
                    key={c.id}
                    className="border-b hover:bg-red-50 transition"
                  >
                    <td className="p-2 text-gray-800 font-medium">{c.name}</td>
                    <td className="p-2 text-gray-600">
                      {typeof c.team === "string" ? (
                        c.team
                      ) : (
                        <Image
                          src={c.team}
                          alt={c.name}
                          width={35}
                          className="rounded-full"
                        />
                      )}
                    </td>
                    <td className="p-2 text-center font-bold text-yellow-700">
                      {c.yellow}
                    </td>
                    <td className="p-2 text-center font-bold text-red-600">
                      {c.red}
                    </td>
                    <td
                      className={`p-2 text-center font-semibold ${
                        status === "Suspenso"
                          ? "text-red-700"
                          : status === "Pendurado"
                          ? "text-yellow-700"
                          : "text-gray-500"
                      }`}
                    >
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Melhor ataque e defesa */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded-xl shadow">
          <h3 className="text-xl font-bold text-green-800">Melhor Ataque</h3>
          <p className="text-gray-700 mt-2 text-lg">
            <span className="font-bold text-green-900">{bestAttack.name}</span>{" "}
            com <span className="font-bold">{bestAttack.goalsScored}</span> gols
            marcados.
          </p>
        </div>
        <div className="bg-blue-500 p-4 rounded-xl shadow">
          <h3 className="text-xl font-bold text-white">Melhor Defesa</h3>
          <p className="text-white mt-2 text-lg">
            <span className="font-bold">{bestDefense.name}</span> com apenas{" "}
            <span className="font-bold">{bestDefense.goalsConceded}</span> gols
            sofridos.
          </p>
        </div>
      </section>
    </div>
  );
}

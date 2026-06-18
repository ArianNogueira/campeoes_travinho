"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getMatches,
  getMatchEvents,
  getTeams,
  subscribeToTournamentChanges,
} from "@/services/tournamentService";
import {
  buildStandings,
  buildTournamentStats,
} from "@/lib/tournamentCalculations";
import type { Match, MatchEvent, Team } from "@/types/tournament";

export default function StatisticsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [teamsData, matchesData, eventsData] = await Promise.all([
        getTeams(),
        getMatches(),
        getMatchEvents(),
      ]);
      setTeams(teamsData);
      setMatches(matchesData);
      setEvents(eventsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar estatísticas."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    return subscribeToTournamentChanges(loadData);
  }, [loadData]);

  const standings = useMemo(() => buildStandings(teams, matches), [matches, teams]);
  const stats = useMemo(
    () => buildTournamentStats(standings, matches, events),
    [events, matches, standings]
  );

  return (
    <div className="min-h-screen bg-[#fdfaf3] px-4 py-10">
      <h1 className="mb-8 text-center text-4xl font-extrabold text-[#5e5035]">
        Estatísticas do Campeonato
      </h1>

      {error ? (
        <div className="mx-auto mb-6 max-w-4xl rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="mb-12 text-center">
        <h2 className="my-5 text-2xl font-semibold text-[#5e5035]">
          Andamento do Campeonato
        </h2>
        <p className="text-lg text-gray-700">
          {loading
            ? "Carregando dados..."
            : stats.currentRound
            ? `Rodada atual: ${stats.currentRound}`
            : "Nenhuma rodada cadastrada."}
        </p>
        <div className="mx-auto mt-4 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <StatBox label="Jogos realizados" value={`${stats.finishedMatches}/${stats.totalMatches}`} />
          <StatBox label="Total de gols" value={stats.totalGoals.toString()} />
          <StatBox label="Média por jogo" value={stats.averageGoals.toString()} />
        </div>
      </section>

      <section className="mb-12 grid gap-6 lg:grid-cols-2">
        <RankingTable
          columns={["Jogador", "Time", "Gols"]}
          emptyText="Sem gols registrados."
          rows={stats.topScorers.map((player) => [
            player.name,
            player.team,
            player.total.toString(),
          ])}
          title="Artilharia"
        />
        <RankingTable
          columns={["Jogador", "Time", "Assistências"]}
          emptyText="Sem assistências registradas."
          rows={stats.topAssists.map((player) => [
            player.name,
            player.team,
            player.total.toString(),
          ])}
          title="Assistências"
        />
      </section>

      <section className="mb-12">
        <RankingTable
          columns={["Jogador", "Time", "Amarelos", "Vermelhos", "Status"]}
          emptyText="Sem cartões registrados."
          rows={stats.cards.map((card) => {
            const status =
              card.red > 0 ? "Suspenso" : card.yellow >= 2 ? "Pendurado" : "-";

            return [
              card.name,
              card.team,
              card.yellow.toString(),
              card.red.toString(),
              status,
            ];
          })}
          title="Cartões"
        />
      </section>

      <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border-l-4 border-green-600 bg-green-100 p-4 shadow">
          <h3 className="text-xl font-bold text-green-800">Melhor Ataque</h3>
          <p className="mt-2 text-lg text-gray-700">
            {stats.bestAttack
              ? `${stats.bestAttack.team} com ${stats.bestAttack.goalsFor} gols marcados.`
              : "Sem jogos finalizados."}
          </p>
        </div>
        <div className="rounded-lg bg-blue-500 p-4 shadow">
          <h3 className="text-xl font-bold text-white">Melhor Defesa</h3>
          <p className="mt-2 text-lg text-white">
            {stats.bestDefense
              ? `${stats.bestDefense.team} com ${stats.bestDefense.goalsAgainst} gols sofridos.`
              : "Sem jogos finalizados."}
          </p>
        </div>
      </section>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="text-2xl font-bold text-[#5e5035]">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function RankingTable({
  title,
  columns,
  rows,
  emptyText,
}: {
  title: string;
  columns: string[];
  rows: string[][];
  emptyText: string;
}) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-[#5e5035]">{title}</h2>
      <div className="max-h-80 overflow-y-auto rounded-lg border-l-4 border-[#5e5035] bg-white p-4 shadow">
        <table className="w-full border-collapse text-left">
          <thead className="bg-white shadow-sm">
            <tr className="border-b text-[#5e5035]">
              {columns.map((column) => (
                <th className="p-2" key={column}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, rowIndex) => (
                <tr className="border-b transition hover:bg-[#f9f5ec]" key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      className={`p-2 ${
                        cellIndex === 0
                          ? "font-medium text-gray-800"
                          : "text-gray-600"
                      }`}
                      key={`${rowIndex}-${cellIndex}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-sm text-gray-500" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

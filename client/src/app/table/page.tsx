"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Target, TrendingUp, Trophy, X } from "lucide-react";
import {
  getMatches,
  getMatchEvents,
  getPlayersByTeamIds,
  getTeams,
  subscribeToTournamentChanges,
} from "@/services/tournamentService";
import {
  buildStandings,
  buildTournamentStats,
} from "@/lib/tournamentCalculations";
import type { Match, MatchEvent, Player, StandingRow, Team } from "@/types/tournament";
import { emblemMap } from "../matches/emblem";

const groups = ["A", "B"];

export default function StandingsPage() {
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<StandingRow | null>(null);
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
      const playersData = teamsData.length
        ? await getPlayersByTeamIds(teamsData.map((team) => team.id))
        : [];
      setTeams(teamsData);
      setMatches(matchesData);
      setEvents(eventsData);
      setPlayers(playersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar tabela.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    return subscribeToTournamentChanges(loadData);
  }, [loadData]);

  const standings = useMemo(() => buildStandings(teams, matches), [teams, matches]);
  const stats = useMemo(
    () => buildTournamentStats(standings, matches, events),
    [events, matches, standings]
  );
  const filteredStandings =
    selectedGroup === "all"
      ? standings
      : standings
          .filter((team) => team.group === selectedGroup)
          .map((team, index) => ({ ...team, position: index + 1 }));
  const selectedTeamPlayers = selectedTeam
    ? players.filter((player) => player.team_id === selectedTeam.id)
    : [];

  return (
    <div className="min-h-screen bg-[#fdfaf3]">
      <header className="bg-[#708c9a] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link className="hover:text-green-200" href="/">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Trophy className="h-6 w-6" />
            <h1 className="text-xl font-bold">Classificação</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error ? (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-6 rounded-lg bg-[#d0bb942c] p-6 shadow-md">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-lg px-4 py-2 transition-colors ${
                  selectedGroup === "all"
                    ? "bg-[#557389] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedGroup("all")}
                type="button"
              >
                Geral
              </button>
              {groups.map((group) => (
                <button
                  className={`rounded-lg px-4 py-2 transition-colors ${
                    selectedGroup === group
                      ? "bg-[#557389] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  type="button"
                >
                  Grupo {group}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 px-1 lg:grid-cols-3 lg:px-0">
          <div className="w-full lg:col-span-2">
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              <div className="bg-[#708c9a] px-6 py-4 text-white">
                <h2 className="text-xl font-bold">
                  {selectedGroup === "all"
                    ? "Classificação Geral"
                    : `Grupo ${selectedGroup}`}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Pos", "Time", "Pts", "J", "V", "E", "D", "GP", "GC", "SG"].map(
                        (header) => (
                          <th
                            className="px-4 py-3 text-center text-sm font-semibold text-gray-600"
                            key={header}
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td className="px-4 py-8 text-center text-gray-500" colSpan={10}>
                          Carregando classificação...
                        </td>
                      </tr>
                    ) : filteredStandings.length === 0 ? (
                      <tr>
                        <td className="px-4 py-8 text-center text-gray-500" colSpan={10}>
                          Nenhum time encontrado.
                        </td>
                      </tr>
                    ) : (
                      filteredStandings.map((team) => (
                        <StandingTableRow
                          key={team.id}
                          onOpenTeam={setSelectedTeam}
                          team={team}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t bg-gray-100 px-6 py-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 rounded-full border-2 border-green-200 bg-green-50" />
                  <span className="text-black">
                    Critérios: pontos, vitorias, saldo de gols, gols marcados e confronto direto.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <RankingCard
              icon={<Target className="mr-2 h-5 w-5" />}
              title="Artilheiros"
              color="bg-[#5e5035]"
              rows={stats.topScorers.slice(0, 5).map((row) => ({
                label: row.name,
                detail: row.team.toUpperCase(),
                value: row.total,
              }))}
              emptyText="Sem gols registrados."
            />

            <RankingCard
              icon={<Shield className="mr-2 h-5 w-5" />}
              title="Melhores Defesas"
              color="bg-blue-500"
              rows={standings
                .filter((row) => row.played > 0)
                .sort((a, b) => a.goalsAgainst - b.goalsAgainst)
                .slice(0, 5)
                .map((row) => ({
                  label: row.team,
                  labelClassName: "uppercase",
                  detail: `${row.played} jogos`,
                  value: row.goalsAgainst,
                }))}
              emptyText="Sem jogos finalizados."
            />

            <div className="rounded-lg bg-white shadow-md">
              <div className="bg-purple-500 px-6 py-4 text-white">
                <h3 className="flex items-center font-bold">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Progresso do Campeonato
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Jogos Realizados</span>
                    <span className="font-bold">
                      {stats.finishedMatches}/{stats.totalMatches}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{
                        width: stats.totalMatches
                          ? `${(stats.finishedMatches / stats.totalMatches) * 100}%`
                          : "0%",
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    {stats.totalMatches
                      ? Math.round((stats.finishedMatches / stats.totalMatches) * 100)
                      : 0}
                    % concluído
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Total de Gols</span>
                      <span className="font-bold">{stats.totalGoals}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Média por Jogo</span>
                      <span className="font-bold">{stats.averageGoals}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {selectedTeam ? (
        <TeamPlayersModal
          onClose={() => setSelectedTeam(null)}
          players={selectedTeamPlayers}
          team={selectedTeam}
        />
      ) : null}
    </div>
  );
}

function StandingTableRow({
  team,
  onOpenTeam,
}: {
  team: StandingRow;
  onOpenTeam: (team: StandingRow) => void;
}) {
  const localEmblem = emblemMap[team.team]?.src;
  const src = team.emblemUrl || localEmblem;

  return (
    <tr className="border-b border-gray-200 transition-colors hover:bg-gray-50">
      <td className="px-4 py-4 text-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            team.position <= 4
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {team.position}
        </div>
      </td>
      <td className="min-w-44 px-2 py-4">
        <div className="flex items-center gap-3">
          {src ? (
            <img
              alt={team.team}
              className="h-10 w-10 rounded-full object-cover"
              src={src}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-100" />
          )}
          <div>
            <button
              className="text-left text-sm font-semibold uppercase text-gray-800 transition-colors hover:text-[#557389] focus:outline-none md:text-base"
              onClick={() => onOpenTeam(team)}
              type="button"
            >
              {team.team}
            </button>
            <p className="text-sm text-gray-500">Grupo {team.group}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-center font-bold text-black">{team.points}</td>
      <td className="px-4 py-4 text-center text-gray-600">{team.played}</td>
      <td className="px-4 py-4 text-center text-green-600">{team.won}</td>
      <td className="px-4 py-4 text-center text-yellow-600">{team.drawn}</td>
      <td className="px-4 py-4 text-center text-red-600">{team.lost}</td>
      <td className="px-4 py-4 text-center text-gray-600">{team.goalsFor}</td>
      <td className="px-4 py-4 text-center text-gray-600">{team.goalsAgainst}</td>
      <td className="px-4 py-4 text-center font-semibold">
        <span className={team.goalDifference >= 0 ? "text-green-600" : "text-red-600"}>
          {team.goalDifference >= 0 ? "+" : ""}
          {team.goalDifference}
        </span>
      </td>
    </tr>
  );
}

function TeamPlayersModal({
  team,
  players,
  onClose,
}: {
  team: StandingRow;
  players: Player[];
  onClose: () => void;
}) {
  const localEmblem = emblemMap[team.team]?.src;
  const src = team.emblemUrl || localEmblem;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-players-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-[#708c9a] px-5 py-4 text-white">
          <div className="flex min-w-0 items-center gap-3">
            {src ? (
              <img
                alt={team.team}
                className="h-11 w-11 rounded-full bg-white object-cover"
                src={src}
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-white/25" />
            )}
            <div className="min-w-0">
              <h2 id="team-players-title" className="truncate text-lg font-bold">
                {team.team.toUpperCase()}
              </h2>
              <p className="text-sm text-white/85">Grupo {team.group}</p>
            </div>
          </div>

          <button
            aria-label="Fechar modal"
            className="rounded-full p-2 transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <h3 className="mb-4 font-semibold text-gray-800">Jogadores</h3>

          {players.length ? (
            <div className="max-h-[55vh] overflow-y-auto">
              <ul className="divide-y divide-gray-100">
                {players.map((player) => (
                  <li
                    className="flex items-center justify-between gap-4 py-3"
                    key={player.id}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-800">
                        {player.name}
                        {player.is_captain ? (
                          <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-800">
                            Capitao
                          </span>
                        ) : null}
                      </p>
                      <p className="text-sm text-gray-500">
                        {player.position || "Posicao nao informada"}
                      </p>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#557389]/10 text-sm font-bold text-[#557389]">
                      {player.number ?? "-"}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
              Nenhum jogador cadastrado para esta equipe.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function RankingCard({
  icon,
  title,
  color,
  rows,
  emptyText,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  rows: Array<{ label: string; detail: string; value: number; labelClassName?: string }>;
  emptyText: string;
}) {
  return (
    <div className="rounded-lg bg-white shadow-md">
      <div className={`${color} px-6 py-4 text-white`}>
        <h3 className="flex items-center font-bold">
          {icon}
          {title}
        </h3>
      </div>
      <div className="p-6">
        {rows.length ? (
          <div className="space-y-3">
            {rows.map((row) => (
              <div className="flex items-center justify-between" key={row.label}>
                <div>
                  <div className={`font-semibold text-gray-800 ${row.labelClassName || ""}`}>
                    {row.label}
                  </div>
                  <div className="text-sm text-gray-500">{row.detail}</div>
                </div>
                <div className="rounded-full bg-yellow-100 px-3 py-1 font-bold text-yellow-800">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{emptyText}</p>
        )}
      </div>
    </div>
  );
}

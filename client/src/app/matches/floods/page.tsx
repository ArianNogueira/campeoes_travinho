"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CalendarClock, Gauge, ShieldQuestion } from "lucide-react";
import {
  getMatches,
  getTeams,
  subscribeToTournamentChanges,
} from "@/services/tournamentService";
import { buildStandings } from "@/lib/tournamentCalculations";
import type { Match, StandingRow, Team } from "@/types/tournament";

type Prediction = {
  match: Match;
  homeChance: number;
  drawChance: number;
  awayChance: number;
  homeRating: number;
  awayRating: number;
  confidence: "Baixa" | "Media" | "Alta";
};

const confidenceStyles = {
  Baixa: "bg-yellow-50 text-yellow-700",
  Media: "bg-blue-50 text-blue-700",
  Alta: "bg-green-50 text-green-700",
};

export default function FloodsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedRound, setSelectedRound] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [teamsData, matchesData] = await Promise.all([
        getTeams(),
        getMatches(),
      ]);
      setTeams(teamsData);
      setMatches(matchesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar enquetes."
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
  const standingsByTeamId = useMemo(
    () => new Map(standings.map((standing) => [standing.id, standing])),
    [standings]
  );
  const rounds = useMemo(
    () => Array.from(new Set(matches.map((match) => match.round))).sort(),
    [matches]
  );
  const groups = useMemo(
    () =>
      Array.from(new Set(matches.map((match) => match.group_name)))
        .filter(Boolean)
        .sort(),
    [matches]
  );

  const predictions = useMemo(() => {
    return matches
      .filter((match) => match.status !== "finished")
      .filter((match) => selectedRound === "all" || match.round === selectedRound)
      .filter((match) => selectedGroup === "all" || match.group_name === selectedGroup)
      .map((match) => buildMatchPrediction(match, standingsByTeamId))
      .sort((a, b) =>
        `${a.match.date} ${a.match.time}`.localeCompare(`${b.match.date} ${b.match.time}`)
      );
  }, [matches, selectedGroup, selectedRound, standingsByTeamId]);

  const featuredPrediction = predictions[0] || null;

  return (
    <main className="min-h-screen bg-[#fdfaf3] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-lg bg-[#102f4c] px-5 py-6 text-white shadow-md md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase text-[#d0bb94]">
                <ShieldQuestion className="h-4 w-4" />
                Enquetes das partidas
              </div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Probabilidades por desempenho
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/80 md:text-base">
                Estimativa baseada na classificacao atual, aproveitamento, saldo de gols,
                ataque e defesa das equipes no campeonato.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <SummaryTile label="Jogos abertos" value={predictions.length.toString()} />
              <SummaryTile
                label="Jogos finalizados"
                value={matches.filter((match) => match.status === "finished").length.toString()}
              />
            </div>
          </div>
        </section>

        {error ? (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="mb-6 flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <Gauge className="h-5 w-5 text-[#557389]" />
            Filtros
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="text-sm font-medium text-gray-700">
              Rodada
              <select
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-gray-800"
                onChange={(event) => setSelectedRound(event.target.value)}
                value={selectedRound}
              >
                <option value="all">Todas</option>
                {rounds.map((round) => (
                  <option key={round} value={round}>
                    {round}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-gray-700">
              Grupo
              <select
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-gray-800"
                onChange={(event) => setSelectedGroup(event.target.value)}
                value={selectedGroup}
              >
                <option value="all">Todos</option>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    Grupo {group}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {featuredPrediction ? <FeaturedPoll prediction={featuredPrediction} /> : null}

        {loading ? (
          <p className="rounded-lg bg-white p-6 text-center text-gray-500 shadow-sm">
            Carregando enquetes...
          </p>
        ) : predictions.length === 0 ? (
          <p className="rounded-lg bg-white p-6 text-center text-gray-500 shadow-sm">
            Nenhuma partida pendente encontrada para os filtros selecionados.
          </p>
        ) : (
          <section className="grid gap-5 lg:grid-cols-2">
            {predictions.map((prediction) => (
              <PollCard key={prediction.match.id} prediction={prediction} />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function FeaturedPoll({ prediction }: { prediction: Prediction }) {
  return (
    <section className="mb-6 rounded-lg border border-[#d0bb94] bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase text-[#855b21]">
        <BarChart3 className="h-4 w-4" />
        Proxima enquete em destaque
      </div>
      <PollCard prediction={prediction} featured />
    </section>
  );
}

function PollCard({
  prediction,
  featured = false,
}: {
  prediction: Prediction;
  featured?: boolean;
}) {
  const { match } = prediction;

  return (
    <article
      className={`rounded-lg bg-white p-5 shadow-sm ${
        featured ? "border border-gray-100 shadow-none" : ""
      }`}
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#557389]">
            {match.round} {match.group_name ? `- Grupo ${match.group_name}` : ""}
          </p>
          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <CalendarClock className="h-4 w-4" />
            <span>
              {formatDate(match.date)} - {match.time || "A definir"}
            </span>
          </div>
        </div>
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
            confidenceStyles[prediction.confidence]
          }`}
        >
          Confianca {prediction.confidence}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <TeamBadge name={match.home?.name} emblemUrl={match.home?.emblem_url} />
        <div className="text-sm font-bold uppercase text-gray-400">vs</div>
        <TeamBadge name={match.away?.name} emblemUrl={match.away?.emblem_url} />
      </div>

      <div className="space-y-3">
        <ChanceBar
          label={match.home?.name || "Mandante"}
          value={prediction.homeChance}
          color="bg-[#557389]"
        />
        <ChanceBar label="Empate" value={prediction.drawChance} color="bg-[#d0bb94]" />
        <ChanceBar
          label={match.away?.name || "Visitante"}
          value={prediction.awayChance}
          color="bg-[#855b21]"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <RatingBox label="Forca mandante" value={prediction.homeRating} />
        <RatingBox label="Forca visitante" value={prediction.awayRating} />
      </div>
    </article>
  );
}

function ChanceBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-semibold text-gray-700">{label}</span>
        <span className="font-bold text-gray-900">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function TeamBadge({
  name,
  emblemUrl,
}: {
  name?: string;
  emblemUrl?: string | null;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      {emblemUrl ? (
        <img
          alt={name || "Escudo"}
          className="h-14 w-14 rounded-full object-cover"
          src={emblemUrl}
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500">
          Time
        </div>
      )}
      <p className="max-w-[140px] truncate text-sm font-bold text-gray-800">
        {name || "A definir"}
      </p>
    </div>
  );
}

function RatingBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-800">{value.toFixed(1)}</p>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/10 px-4 py-3">
      <p className="text-xs font-semibold uppercase text-white/65">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function buildMatchPrediction(
  match: Match,
  standingsByTeamId: Map<number, StandingRow>
): Prediction {
  const home = standingsByTeamId.get(match.home_team_id);
  const away = standingsByTeamId.get(match.away_team_id);
  const homeRating = getTeamRating(home);
  const awayRating = getTeamRating(away);
  const totalRating = homeRating + awayRating || 2;
  const ratingGap = Math.abs(homeRating - awayRating);
  const drawChance = clamp(18 + (1 - Math.min(ratingGap / 35, 1)) * 14, 15, 32);
  const remainingChance = 100 - drawChance;
  const homeChance = (homeRating / totalRating) * remainingChance;
  const awayChance = remainingChance - homeChance;
  const roundedHome = Math.round(homeChance);
  const roundedDraw = Math.round(drawChance);
  const roundedAway = 100 - roundedHome - roundedDraw;

  return {
    match,
    homeChance: roundedHome,
    drawChance: roundedDraw,
    awayChance: roundedAway,
    homeRating,
    awayRating,
    confidence: getConfidence(home, away, ratingGap),
  };
}

function getTeamRating(team?: StandingRow) {
  if (!team || team.played === 0) return 50;

  const maxPoints = team.played * 3;
  const pointsRate = maxPoints ? (team.points / maxPoints) * 42 : 0;
  const winRate = (team.won / team.played) * 20;
  const attack = Math.min((team.goalsFor / team.played) * 7, 18);
  const defense = Math.max(14 - (team.goalsAgainst / team.played) * 5, 0);
  const goalBalance = clamp(team.goalDifference * 2, -12, 12);

  return clamp(28 + pointsRate + winRate + attack + defense + goalBalance, 12, 95);
}

function getConfidence(
  home?: StandingRow,
  away?: StandingRow,
  ratingGap = 0
): Prediction["confidence"] {
  const played = Math.min(home?.played || 0, away?.played || 0);

  if (played < 2) return "Baixa";
  if (ratingGap >= 22 && played >= 3) return "Alta";
  return "Media";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatDate(date: string) {
  if (!date) return "A definir";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR").format(parsedDate);
}

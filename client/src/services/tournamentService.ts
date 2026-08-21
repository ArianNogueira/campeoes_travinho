import { assertSupabaseConfig, supabase } from "@/lib/supabase";
import type {
  Match,
  MatchEvent,
  MatchEventType,
  NewsItem,
  Player,
  StandingRow,
  Team,
} from "@/types/tournament";
import { buildStandings } from "@/lib/tournamentCalculations";

import {
  generateRoundRobin,
  mergeGroupRounds,
  buildSchedule,
} from "./generateMatches";

export type PlayerResultInput = {
  playerId: number;
  teamId: number;
  goals: number;
  ownGoals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
};

export type MatchVoteOption = "home" | "draw" | "away";

export type MatchVoteTotals = Record<MatchVoteOption, number>;

export type TeamInscriptionPlayerInput = {
  name: string;
  number: number;
  position: string;
  isCaptain: boolean;
};

export type HomeStats = {
  teams: number;
  matches: number;
  players: number;
  upcomingMatches: number;
};

export async function getTeams() {
  assertSupabaseConfig();

  const { data, error } = await supabase
    .from("teams")
    .select("id, name, group_name, emblem_url")
    .order("group_name", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return (data || []) as Team[];
}

export async function getHomeStats(): Promise<HomeStats> {
  assertSupabaseConfig();

  const [
    teamsResult,
    matchesResult,
    playersResult,
    upcomingMatchesResult,
  ] = await Promise.all([
    supabase.from("teams").select("id", { count: "exact", head: true }),
    supabase.from("matches").select("id", { count: "exact", head: true }),
    supabase.from("players").select("id", { count: "exact", head: true }),
    supabase
      .from("matches")
      .select("id", { count: "exact", head: true })
      .neq("status", "finished"),
  ]);

  const error =
    teamsResult.error ||
    matchesResult.error ||
    playersResult.error ||
    upcomingMatchesResult.error;

  if (error) throw error;

  return {
    teams: teamsResult.count ?? 0,
    matches: matchesResult.count ?? 0,
    players: playersResult.count ?? 0,
    upcomingMatches: upcomingMatchesResult.count ?? 0,
  };
}

export async function getMatches() {
  assertSupabaseConfig();

  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      id,
      home_team_id,
      away_team_id,
      group_name,
      round,
      date,
      time,
      status,
      home_score,
      away_score,
      home_penalty_score,
      away_penalty_score,
      counts_for_standings,
      home:home_team_id(id, name, group_name, emblem_url),
      away:away_team_id(id, name, group_name, emblem_url)
    `
    )
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw error;
  return (data || []) as unknown as Match[];
}

export async function getPlayersByTeamIds(teamIds: number[]) {
  assertSupabaseConfig();

  const { data, error } = await supabase
    .from("players")
    .select("id, team_id, name, number, position, is_captain")
    .in("team_id", teamIds)
    .order("is_captain", { ascending: false })
    .order("number", { ascending: true });

  if (error) throw error;
  return (data || []) as Player[];
}

export async function getRegisteredTeamIds() {
  assertSupabaseConfig();

  const { data, error } = await supabase.from("players").select("team_id");

  if (error) throw error;

  return Array.from(new Set((data || []).map((player) => player.team_id)));
}

export async function saveTeamInscription(
  teamName: string,
  players: TeamInscriptionPlayerInput[],
  emblemFile?: File | null
) {
  assertSupabaseConfig();

  // Verifica se já existe um time com esse nome
  const { data: existingTeam } = await supabase
    .from("teams")
    .select("id")
    .ilike("name", teamName)
    .maybeSingle();

  if (existingTeam) {
    throw new Error("Já existe um time com esse nome.");
  }

  let emblemUrl: string | null = null;

  if (emblemFile) {
    const extension = emblemFile.name.split(".").pop();

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("team-emblems")
      .upload(fileName, emblemFile);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("team-emblems")
      .getPublicUrl(fileName);

    emblemUrl = data.publicUrl;
  }

  // Cria o time
  const { data: team, error: teamError } = await supabase
    .from("teams")
    .insert({
      name: teamName,
      emblem_url: emblemUrl,
    })
    .select()
    .single();

  if (teamError) throw teamError;

  // Insere os jogadores
  const { error: playersError } = await supabase.from("players").insert(
    players.map((player) => ({
      team_id: team.id,
      name: player.name,
      number: player.number,
      position: player.position,
      is_captain: player.isCaptain,
    }))
  );

  if (playersError) throw playersError;
}

export async function getMatchEvents() {
  assertSupabaseConfig();

  const { data, error } = await supabase.from("match_events").select(
    `
      id,
      match_id,
      team_id,
      player_id,
      type,
      quantity,
      player:player_id(id, team_id, name, number, position, is_captain),
      team:team_id(id, name, group_name, emblem_url)
    `
  );

  if (error) throw error;
  return (data || []) as unknown as MatchEvent[];
}

export async function getMatchVoteTotals(): Promise<Map<number, MatchVoteTotals>> {
  assertSupabaseConfig();

  const { data, error } = await supabase
    .from("match_votes")
    .select("match_id, choice");

  if (error) throw error;

  const totals = new Map<number, MatchVoteTotals>();

  for (const vote of data || []) {
    const current = totals.get(vote.match_id) || { home: 0, draw: 0, away: 0 };
    const choice = vote.choice as MatchVoteOption;

    if (choice === "home" || choice === "draw" || choice === "away") {
      current[choice] += 1;
      totals.set(vote.match_id, current);
    }
  }

  return totals;
}

export async function castMatchVote(matchId: number, choice: MatchVoteOption) {
  assertSupabaseConfig();

  const { error } = await supabase.from("match_votes").insert({
    match_id: matchId,
    choice,
  });

  if (error) throw error;
}

export async function getNews() {
  assertSupabaseConfig();

  const { data, error } = await supabase
    .from("news")
    .select("id, title, summary, image_url, published_at")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data || []) as NewsItem[];
}

export async function updateMatchSchedule(
  matchId: number,
  payload: Pick<Match, "date" | "time" | "round">
) {
  assertSupabaseConfig();

  const { error } = await supabase
    .from("matches")
    .update(payload)
    .eq("id", matchId);

  if (error) throw error;
}

export async function saveMatchResult(params: {
  matchId: number;
  homeScore: number;
  awayScore: number;
  homePenaltyScore?: number | null;
  awayPenaltyScore?: number | null;
  countsForStandings: boolean;
  events: PlayerResultInput[];
}) {
  assertSupabaseConfig();

  const { matchId, homeScore, awayScore, homePenaltyScore, awayPenaltyScore, countsForStandings, events } = params;

  const { data: updatedMatch, error: matchError } = await supabase
    .from("matches")
    .update({
      home_score: homeScore,
      away_score: awayScore,
      home_penalty_score: homePenaltyScore ?? null,
      away_penalty_score: awayPenaltyScore ?? null,
      counts_for_standings: countsForStandings,
      status: "finished",
    })
    .eq("id", matchId)
    .select("counts_for_standings")
    .single();

  if (matchError) throw matchError;
  if (updatedMatch.counts_for_standings !== countsForStandings) {
    throw new Error("A configuração de pontuação da partida não foi salva. Verifique se a migração do banco foi aplicada.");
  }

  const { error: deleteError } = await supabase
    .from("match_events")
    .delete()
    .eq("match_id", matchId);

  if (deleteError) throw deleteError;

  const rows = events.flatMap((event) => [
    ...buildEventRows(matchId, event, "goal", event.goals),
    ...buildEventRows(matchId, event, "own_goal", event.ownGoals),
    ...buildEventRows(matchId, event, "assist", event.assists),
    ...buildEventRows(matchId, event, "yellow_card", event.yellowCards),
    ...buildEventRows(matchId, event, "red_card", event.redCards),
  ]);

  if (!rows.length) return;

  const { error: insertError } = await supabase.from("match_events").insert(rows);

  if (insertError) throw insertError;
}

const KNOCKOUT_GROUP = "MATA-MATA";
const QUARTERFINALS = [
  "Quartas de final 1",
  "Quartas de final 2",
  "Quartas de final 3",
  "Quartas de final 4",
] as const;
const SEMIFINALS = ["Semifinal 1", "Semifinal 2"] as const;
const FINAL = "Final";

export function isKnockoutMatch(match: Match) {
  return match.group_name === KNOCKOUT_GROUP;
}

/** Gera as quartas: A1×B4, A2×B3, A3×B2 e A4×B1. */
export async function generateKnockoutMatches() {
  assertSupabaseConfig();
  const [teams, matches] = await Promise.all([getTeams(), getMatches()]);

  const groupMatches = matches.filter(
    (match) =>
      !isKnockoutMatch(match) &&
      (match.home?.group_name === "A" || match.home?.group_name === "B") &&
      match.home?.group_name === match.away?.group_name
  );
  if (!groupMatches.length || groupMatches.some((match) => match.status !== "finished")) {
    return 0;
  }

  const standings = buildStandings(teams, matches);
  const groupA = rankGroup(standings, "A");
  const groupB = rankGroup(standings, "B");
  if (groupA.length < 4 || groupB.length < 4) {
    throw new Error("Cada grupo precisa ter pelo menos quatro equipes classificadas.");
  }

  const clashes: Array<[StandingRow, StandingRow, (typeof QUARTERFINALS)[number]]> = [
    [groupA[0], groupB[3], QUARTERFINALS[0]],
    [groupA[1], groupB[2], QUARTERFINALS[1]],
    [groupA[2], groupB[1], QUARTERFINALS[2]],
    [groupA[3], groupB[0], QUARTERFINALS[3]],
  ];

  const existingRounds = new Set(matches.filter(isKnockoutMatch).map((match) => match.round));
  const missingClashes = clashes.filter(([, , round]) => !existingRounds.has(round));
  if (!missingClashes.length) return 0;

  const { error } = await supabase.from("matches").insert(
    missingClashes.map(([home, away, round]) => ({
      home_team_id: home.id,
      away_team_id: away.id,
      group_name: KNOCKOUT_GROUP,
      round,
      date: new Date().toISOString().slice(0, 10),
      time: "00:00",
      status: "scheduled",
      home_score: null,
      away_score: null,
    }))
  );
  if (error) throw error;
  return missingClashes.length;
}

/** Cria automaticamente a semifinal ou final assim que os dois vencedores são conhecidos. */
export async function advanceKnockoutBracket() {
  assertSupabaseConfig();
  const matches = (await getMatches()).filter(isKnockoutMatch);
  const created: string[] = [];

  await createNextMatch(matches, QUARTERFINALS.slice(0, 2), SEMIFINALS[0], created);
  await createNextMatch(matches, QUARTERFINALS.slice(2, 4), SEMIFINALS[1], created);
  await createNextMatch(matches, SEMIFINALS, FINAL, created);
  return created;
}

function rankGroup(standings: StandingRow[], group: string) {
  return standings
    .filter((row) => row.group === group)
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.team.localeCompare(b.team));
}

async function createNextMatch(
  allMatches: Match[],
  sourceRounds: readonly string[],
  targetRound: string,
  created: string[]
) {
  if (allMatches.some((match) => match.round === targetRound)) return;
  const sources = sourceRounds.map((round) => allMatches.find((match) => match.round === round));
  if (sources.some((match) => !match || match.status !== "finished")) return;

  const winners = sources.map(getWinner);
  if (winners.some((winner) => winner === null)) {
    throw new Error(`Há empate em ${sourceRounds.join(" e ")}. Defina um vencedor antes de avançar.`);
  }
  const [homeTeamId, awayTeamId] = winners as number[];

  const { error } = await supabase.from("matches").insert({
    home_team_id: homeTeamId,
    away_team_id: awayTeamId,
    group_name: KNOCKOUT_GROUP,
    round: targetRound,
    date: new Date().toISOString().slice(0, 10),
    time: "00:00",
    status: "scheduled",
    home_score: null,
    away_score: null,
  });
  if (error) throw error;
  created.push(targetRound);
}

function getWinner(match: Match | undefined) {
  if (!match || match.home_score === null || match.away_score === null) return null;
  if (match.home_score === match.away_score) {
    if (match.home_penalty_score === null || match.away_penalty_score === null) return null;
    if (match.home_penalty_score === match.away_penalty_score) return null;
    return match.home_penalty_score > match.away_penalty_score
      ? match.home_team_id
      : match.away_team_id;
  }
  return match.home_score > match.away_score ? match.home_team_id : match.away_team_id;
}

export function subscribeToTournamentChanges(onChange: () => void) {
  const channelName = `tournament-realtime-${crypto.randomUUID()}`;
  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "teams" },
      onChange
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "players" },
      onChange
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "matches" },
      onChange
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "match_events" },
      onChange
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "match_votes" },
      onChange
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "news" },
      onChange
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

function buildEventRows(
  matchId: number,
  event: PlayerResultInput,
  type: MatchEventType,
  quantity: number
) {
  if (quantity <= 0) return [];

  return [
    {
      match_id: matchId,
      team_id: event.teamId,
      player_id: event.playerId,
      type,
      quantity,
    },
  ];
}

// Gerar partidas
export async function generateTournamentMatches(
  startDate: string
) {
  // pega os times que estão no banco de dados
  const { count } = await supabase
    .from("matches")
    .select("*", {
      count: "exact",
      head: true,
    });

  if ((count ?? 0) > 0) {
    throw new Error(
      "Já existem partidas cadastradas."
    );
  }

  // aqui faz o filtro dos times que estão designados pelos grupos A ou B
  const teams = await getTeams();

  const groupA = teams.filter(
    (team) => team.group_name === "A"
  );

  const groupB = teams.filter(
    (team) => team.group_name === "B"
  );

  // Os grupos precisas tem no minimo 6 equipes
  if (groupA.length !== 6) {
    throw new Error(
      "Grupo A deve possuir 6 equipes."
    );
  }

  if (groupB.length !== 6) {
    throw new Error(
      "Grupo B deve possuir 6 equipes."
    );
  }

  // leva as equipes já separadas por grupos para fazer a definição dos confrontos
  const roundsA = generateRoundRobin(groupA);
  const roundsB = generateRoundRobin(groupB);

  // chama a função com os confrontos feitos e faz a separação em seus respectivos grupos
  const mergedRounds = mergeGroupRounds(
    roundsA,
    roundsB
  );

  // define as datas e horários para cada confronto
  const schedule = buildSchedule(
    mergedRounds,
    startDate
  );

  // mostra um erro ou insera no banco de dados
  const { error } = await supabase
    .from("matches")
    .insert(schedule);

  if (error) throw error;

  return schedule.length;
}

import { assertSupabaseConfig, supabase } from "@/lib/supabase";
import type {
  Match,
  MatchEvent,
  MatchEventType,
  NewsItem,
  Player,
  Team,
} from "@/types/tournament";

import {
  generateRoundRobin,
  mergeGroupRounds,
  buildSchedule,
} from "./generateMatches";

export type PlayerResultInput = {
  playerId: number;
  teamId: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
};

export type TeamInscriptionPlayerInput = {
  name: string;
  number: number;
  position: string;
  isCaptain: boolean;
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
  events: PlayerResultInput[];
}) {
  assertSupabaseConfig();

  const { matchId, homeScore, awayScore, events } = params;

  const { error: matchError } = await supabase
    .from("matches")
    .update({
      home_score: homeScore,
      away_score: awayScore,
      status: "finished",
    })
    .eq("id", matchId);

  if (matchError) throw matchError;

  const { error: deleteError } = await supabase
    .from("match_events")
    .delete()
    .eq("match_id", matchId);

  if (deleteError) throw deleteError;

  const rows = events.flatMap((event) => [
    ...buildEventRows(matchId, event, "goal", event.goals),
    ...buildEventRows(matchId, event, "assist", event.assists),
    ...buildEventRows(matchId, event, "yellow_card", event.yellowCards),
    ...buildEventRows(matchId, event, "red_card", event.redCards),
  ]);

  if (!rows.length) return;

  const { error: insertError } = await supabase.from("match_events").insert(rows);

  if (insertError) throw insertError;
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

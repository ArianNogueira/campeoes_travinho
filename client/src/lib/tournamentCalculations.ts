import type {
  CardRankingRow,
  Match,
  MatchEvent,
  PlayerRankingRow,
  StandingRow,
  Team,
  TournamentStats,
} from "@/types/tournament";

export function buildStandings(teams: Team[], matches: Match[]): StandingRow[] {
  const rows = new Map<number, StandingRow>();

  for (const team of teams) {
    rows.set(team.id, {
      id: team.id,
      team: team.name,
      group: team.group_name,
      emblemUrl: team.emblem_url,
      position: 0,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    });
  }

  for (const match of matches) {
    if (
      match.status !== "finished" ||
      match.home_score === null ||
      match.away_score === null
    ) {
      continue;
    }

    const home = rows.get(match.home_team_id);
    const away = rows.get(match.away_team_id);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;

    home.goalsFor += match.home_score;
    home.goalsAgainst += match.away_score;
    away.goalsFor += match.away_score;
    away.goalsAgainst += match.home_score;

    if (match.home_score > match.away_score) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
    } else if (match.home_score < match.away_score) {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  return Array.from(rows.values())
    .map((row) => ({
      ...row,
      goalDifference: row.goalsFor - row.goalsAgainst,
    }))
    .sort(sortStandingRows)
    .map((row, index) => ({ ...row, position: index + 1 }));
}

export function buildTournamentStats(
  standings: StandingRow[],
  matches: Match[],
  events: MatchEvent[]
): TournamentStats {
  const topScorers = buildPlayerRanking(events, "goal");
  const topAssists = buildPlayerRanking(events, "assist");
  const cards = buildCardRanking(events);
  const finishedMatches = matches.filter((match) => match.status === "finished");
  const totalGoals = finishedMatches.reduce(
    (sum, match) => sum + (match.home_score || 0) + (match.away_score || 0),
    0
  );
  const scheduledOrLive = matches
    .filter((match) => match.status !== "finished")
    .sort(sortMatchesByDate);

  return {
    topScorers,
    topAssists,
    cards,
    bestAttack: standings.length
      ? standings.reduce((best, row) =>
          row.goalsFor > best.goalsFor ? row : best
        )
      : null,
    bestDefense: standings.length
      ? standings.reduce((best, row) =>
          row.goalsAgainst < best.goalsAgainst ? row : best
        )
      : null,
    finishedMatches: finishedMatches.length,
    totalMatches: matches.length,
    totalGoals,
    averageGoals: finishedMatches.length
      ? Number((totalGoals / finishedMatches.length).toFixed(2))
      : 0,
    currentRound: scheduledOrLive[0]?.round || finishedMatches.at(-1)?.round || null,
  };
}

function buildPlayerRanking(
  events: MatchEvent[],
  type: "goal" | "assist"
): PlayerRankingRow[] {
  const ranking = new Map<number, PlayerRankingRow>();

  for (const event of events) {
    if (event.type !== type) continue;

    const current = ranking.get(event.player_id) || {
      id: event.player_id,
      name: event.player?.name || "Jogador",
      team: event.team?.name || "Time",
      total: 0,
    };

    current.total += event.quantity;
    ranking.set(event.player_id, current);
  }

  return Array.from(ranking.values()).sort((a, b) => b.total - a.total);
}

function buildCardRanking(events: MatchEvent[]): CardRankingRow[] {
  const ranking = new Map<number, CardRankingRow>();

  for (const event of events) {
    if (event.type !== "yellow_card" && event.type !== "red_card") continue;

    const current = ranking.get(event.player_id) || {
      id: event.player_id,
      name: event.player?.name || "Jogador",
      team: event.team?.name || "Time",
      yellow: 0,
      red: 0,
    };

    if (event.type === "yellow_card") current.yellow += event.quantity;
    if (event.type === "red_card") current.red += event.quantity;
    ranking.set(event.player_id, current);
  }

  return Array.from(ranking.values()).sort(
    (a, b) => b.red - a.red || b.yellow - a.yellow
  );
}

function sortStandingRows(a: StandingRow, b: StandingRow) {
  return (
    b.points - a.points ||
    b.goalDifference - a.goalDifference ||
    b.goalsFor - a.goalsFor ||
    a.team.localeCompare(b.team)
  );
}

function sortMatchesByDate(a: Match, b: Match) {
  return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}

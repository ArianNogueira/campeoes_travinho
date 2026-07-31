import type { Match, MatchEvent, Player } from "@/types/tournament";

export type PendingSuspension = {
  matchId: number;
  round: string;
};

export type SuspensionHistoryItem = PendingSuspension & {
  fulfilled: boolean;
};

/**
 * Identifica os atletas que devem cumprir suspensão nesta partida.
 * A apuração usa exclusivamente os jogos e cartões já persistidos no banco.
 */
export function getSuspendedPlayerIdsForMatch(
  match: Match,
  players: Player[],
  matches: Match[],
  events: MatchEvent[]
): Set<number> {
  const suspended = new Set<number>();

  for (const player of players) {
    const teamMatches = matches
      .filter(
        (item) =>
          item.home_team_id === player.team_id || item.away_team_id === player.team_id
      )
      .sort(sortMatches);
    const targetIndex = teamMatches.findIndex((item) => item.id === match.id);

    if (targetIndex === -1) continue;

    let yellowCards = 0;
    let pendingSuspensions = 0;

    for (let index = 0; index <= targetIndex; index += 1) {
      const teamMatch = teamMatches[index];

      if (index === targetIndex && pendingSuspensions > 0) {
        suspended.add(player.id);
      }

      // A suspensão é cumprida no primeiro jogo seguinte, mesmo que ele ainda
      // esteja agendado; assim somente esse jogo aparece como indisponível.
      if (pendingSuspensions > 0) pendingSuspensions -= 1;

      if (teamMatch.status !== "finished") continue;

      const playerEvents = events.filter(
        (event) =>
          event.match_id === teamMatch.id && event.player_id === player.id
      );
      const newYellowCards = playerEvents
        .filter((event) => event.type === "yellow_card")
        .reduce((total, event) => total + event.quantity, 0);
      const redCards = playerEvents
        .filter((event) => event.type === "red_card")
        .reduce((total, event) => total + event.quantity, 0);

      const suspensionsBefore = Math.floor(yellowCards / 3);
      yellowCards += newYellowCards;
      const suspensionsAfter = Math.floor(yellowCards / 3);
      pendingSuspensions += suspensionsAfter - suspensionsBefore + redCards;
    }
  }

  return suspended;
}

/**
 * Retorna a próxima partida em que cada atleta ainda precisa cumprir
 * suspensão. Jogos já finalizados são considerados como suspensão cumprida.
 */
export function getPendingSuspensions(
  matches: Match[],
  events: MatchEvent[]
): Map<number, PendingSuspension> {
  const playerTeams = new Map<number, number>();

  for (const event of events) {
    if (event.type !== "yellow_card" && event.type !== "red_card") continue;
    playerTeams.set(event.player_id, event.player?.team_id ?? event.team_id);
  }

  const pendingByPlayer = new Map<number, PendingSuspension>();

  for (const [playerId, teamId] of playerTeams) {
    const teamMatches = matches
      .filter(
        (match) => match.home_team_id === teamId || match.away_team_id === teamId
      )
      .sort(sortMatches);
    let yellowCards = 0;
    let pendingSuspensions = 0;

    for (const match of teamMatches) {
      if (pendingSuspensions > 0) {
        if (match.status !== "finished") {
          pendingByPlayer.set(playerId, { matchId: match.id, round: match.round });
          break;
        }

        pendingSuspensions -= 1;
      }

      if (match.status !== "finished") continue;

      const playerEvents = events.filter(
        (event) => event.match_id === match.id && event.player_id === playerId
      );
      const newYellowCards = playerEvents
        .filter((event) => event.type === "yellow_card")
        .reduce((total, event) => total + event.quantity, 0);
      const redCards = playerEvents
        .filter((event) => event.type === "red_card")
        .reduce((total, event) => total + event.quantity, 0);

      const suspensionsBefore = Math.floor(yellowCards / 3);
      yellowCards += newYellowCards;
      const suspensionsAfter = Math.floor(yellowCards / 3);
      pendingSuspensions += suspensionsAfter - suspensionsBefore + redCards;
    }
  }

  return pendingByPlayer;
}

/**
 * Monta o histórico de jogos em que cada suspensão foi (ou será) cumprida.
 */
export function getSuspensionHistory(
  matches: Match[],
  events: MatchEvent[]
): Map<number, SuspensionHistoryItem[]> {
  const playerTeams = new Map<number, number>();

  for (const event of events) {
    if (event.type !== "yellow_card" && event.type !== "red_card") continue;
    playerTeams.set(event.player_id, event.player?.team_id ?? event.team_id);
  }

  const historyByPlayer = new Map<number, SuspensionHistoryItem[]>();

  for (const [playerId, teamId] of playerTeams) {
    const teamMatches = matches
      .filter(
        (match) => match.home_team_id === teamId || match.away_team_id === teamId
      )
      .sort(sortMatches);
    const history: SuspensionHistoryItem[] = [];
    let yellowCards = 0;
    let pendingSuspensions = 0;

    for (const match of teamMatches) {
      if (pendingSuspensions > 0) {
        history.push({
          matchId: match.id,
          round: match.round,
          fulfilled: match.status === "finished",
        });
        pendingSuspensions -= 1;
      }

      if (match.status !== "finished") continue;

      const playerEvents = events.filter(
        (event) => event.match_id === match.id && event.player_id === playerId
      );
      const newYellowCards = playerEvents
        .filter((event) => event.type === "yellow_card")
        .reduce((total, event) => total + event.quantity, 0);
      const redCards = playerEvents
        .filter((event) => event.type === "red_card")
        .reduce((total, event) => total + event.quantity, 0);

      const suspensionsBefore = Math.floor(yellowCards / 3);
      yellowCards += newYellowCards;
      const suspensionsAfter = Math.floor(yellowCards / 3);
      pendingSuspensions += suspensionsAfter - suspensionsBefore + redCards;
    }

    if (history.length) historyByPlayer.set(playerId, history);
  }

  return historyByPlayer;
}

function sortMatches(a: Match, b: Match) {
  return (
    `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`) || a.id - b.id
  );
}

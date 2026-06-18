export type MatchStatus = "scheduled" | "live" | "finished";

export type MatchEventType = "goal" | "assist" | "yellow_card" | "red_card";

export type Team = {
  id: number;
  name: string;
  group_name: string;
  emblem_url: string | null;
};

export type Player = {
  id: number;
  team_id: number;
  name: string;
  number: number | null;
  position: string | null;
  is_captain: boolean;
};

export type Match = {
  id: number;
  home_team_id: number;
  away_team_id: number;
  group_name: string;
  round: string;
  date: string;
  time: string;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  home?: Team | null;
  away?: Team | null;
};

export type MatchEvent = {
  id: number;
  match_id: number;
  team_id: number;
  player_id: number;
  type: MatchEventType;
  quantity: number;
  player?: Player | null;
  team?: Team | null;
};

export type NewsItem = {
  id: number;
  title: string;
  summary: string;
  image_url: string | null;
  published_at: string;
};

export type StandingRow = {
  id: number;
  team: string;
  group: string;
  emblemUrl: string | null;
  position: number;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

export type PlayerRankingRow = {
  id: number;
  name: string;
  team: string;
  total: number;
};

export type CardRankingRow = {
  id: number;
  name: string;
  team: string;
  yellow: number;
  red: number;
};

export type TournamentStats = {
  topScorers: PlayerRankingRow[];
  topAssists: PlayerRankingRow[];
  cards: CardRankingRow[];
  bestAttack: StandingRow | null;
  bestDefense: StandingRow | null;
  finishedMatches: number;
  totalMatches: number;
  totalGoals: number;
  averageGoals: number;
  currentRound: string | null;
};

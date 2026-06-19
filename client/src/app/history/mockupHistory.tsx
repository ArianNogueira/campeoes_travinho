
interface Seasons {
  season: string,
  champion: string,
  vice: string,
  result: string,
}

interface RankingTeams {
  position: number,
  team: string,
  titles: number,
  vice: number,
  points: number,
}

interface RankingPlayers {
  player: string, 
  team: string, 
  titles: number, 
  vice: number,
  points: number

}

const seasons: Seasons[] = [
    {
      season: "2025",
      champion: "Inter Miami",
      vice: "Lions FC",
      result: "5 x 2",
    },
    {
      season: "2024",
      champion: "Inter Miami",
      vice: "Fênix FC",
      result: "4 x 1",
    },
    {
      season: "2023",
      champion: "Lions FC",
      vice: "Millennium Falconn",
      result: "7 x 1",
    },
    {
      season: "2022",
      champion: "Thunder FC",
      vice: "Titans FC",
      result: "1 x 0",
    },
    {
      season: "2021",
      champion: "Golden Warriors",
      vice: "Dallas FC",
      result: "1 x 0",
    },
  ];

  const rankingTeams: RankingTeams[] = [
    {
      position: 1,
      team: "Inter Miami",
      titles: 2,
      vice: 0,
      points: 60,
    },
    {
      position: 2,
      team: "Lions FC",
      titles: 1,
      vice: 1,
      points: 45,
    },
    {
      position: 3,
      team: "Thunder FC",
      titles: 1,
      vice: 0,
      points: 30,
    },
    {
      position: 4,
      team: "Fênix FC",
      titles: 0,
      vice: 1,
      points: 15,
    },
    {
      position: 5,
      team: "Millennium Falconn",
      titles: 0,
      vice: 1,
      points: 15,
    },
    {
      position: 6,
      team: "Titans FC",
      titles: 0,
      vice: 1,
      points: 15,
    },
  ];

  const playersRanking: RankingPlayers[] = [
  { player: "Duarley", team: "Inter Miamim, Lions FC, Golden Warriors", titles: 4, vice: 0, points: 120 },
  { player: "Kayque", team: "Lions FC, Golden Warriors", titles: 2, vice: 0, points: 60 },
  { player: "Moris", team: "Inter Miami", titles: 2, vice: 0, points: 60 },
  { player: "Robson", team: "Inter Miami", titles: 2, vice: 0, points: 60 },
  { player: "Ruan Thyago", team: "Inter Miami", titles: 2, vice: 0, points: 60 },
  { player: "Saulo", team: "Inter Miami", titles: 2, vice: 0, points: 60 },
  { player: "Arian", team: "Thunder FC / Dallas FC", titles: 1, vice: 1, points: 45 },
  { player: "Dedé", team: "Lions FC", titles: 1, vice: 1, points: 45 },
  { player: "Joelson", team: "Lions FC", titles: 1, vice: 1, points: 45 },
  { player: "Antonny", team: "Golden Warriors", titles: 1, vice: 0, points: 30 },
  { player: "Dayvid", team: "Golden Warriors", titles: 1, vice: 0, points: 30 },
  { player: "Raul", team: "Golden Warriors", titles: 1, vice: 0, points: 30 },
  { player: "Bruno", team: "Lions FC", titles: 1, vice: 0, points: 30 },
  { player: "Renato", team: "Lions FC", titles: 1, vice: 0, points: 30 },
  { player: "Gleyvison", team: "Dallas FC / Titan FC", titles: 0, vice: 2, points: 30 },
];

export { seasons, rankingTeams, playersRanking };
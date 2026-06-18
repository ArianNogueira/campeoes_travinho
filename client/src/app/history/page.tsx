"use client";

import { Trophy, Medal, Calendar } from "lucide-react";

export default function History() {
  const seasons = [
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

  const rankingTeams = [
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

  const playersRanking = [
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

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-8 text-black">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}
        <section className="rounded-2xl bg-[#557389] p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold">
            Retrospecto do Campeonato
          </h1>

          <p className="mt-2 text-lg text-gray-100">
            Histórico completo das temporadas e ranking das equipes.
          </p>
        </section>

        {/* TEMPORADAS */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#708c9a] p-6 text-white shadow">
            <Calendar className="mb-3 h-8 w-8" />

            <p className="text-sm uppercase tracking-wide">
              Temporadas
            </p>

            <h2 className="text-4xl font-bold">
              {seasons.length}
            </h2>
          </div>
        </section>

        {/* HALL DA FAMA */}
        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center gap-3">
            <Trophy className="h-7 w-7 text-[#5e5035]" />

            <h2 className="text-2xl font-bold text-[#5e5035]">
              Hall da Fama
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <PodiumCard
              emoji="🥇"
              team="Inter Miami"
              titles={2}
            />

            <PodiumCard
              emoji="🥈"
              team="Lions FC"
              titles={1}
            />

            <PodiumCard
              emoji="🥉"
              team="Thunder FC"
              titles={1}
            />
          </div>
        </section>

        {/* HISTÓRICO */}
        <section>
          <div className="mb-4 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-[#5e5035]" />

            <h2 className="text-2xl font-bold text-[#5e5035]">
              Histórico das Temporadas
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {seasons.map((season) => (
              <SeasonCard
                key={season.season}
                season={season.season}
                champion={season.champion}
                vice={season.vice}
                result={season.result}
              />
            ))}
          </div>
        </section>

        {/* RANKING */}
        <section className="rounded-2xl bg-white p-6 shadow">
          <div className="mb-5 flex items-center gap-3">
            <Medal className="h-6 w-6 text-[#5e5035]" />

            <h2 className="text-2xl font-bold text-[#5e5035]">
              Ranking de Equipes
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full overflow-hidden rounded-xl">
              <thead>
                <tr className="bg-[#557389] text-white">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Equipe</th>
                  <th className="p-3 text-center">Títulos</th>
                  <th className="p-3 text-center">Vice</th>
                  <th className="p-3 text-center">Pontos</th>
                </tr>
              </thead>

              <tbody>
                {rankingTeams.map((team) => (
                  <RankingRow
                    key={team.position}
                    {...team}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 rounded-lg bg-[#708c9a]/10 p-4 text-sm text-[#5e5035]">
            <strong>Pontuação:</strong> Campeão = 30 pts |
            Vice-campeão = 15 pts
          </div>
        </section>
      

        <section className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-5 text-2xl font-bold text-[#5e5035]">
                Ranking Histórico de Jogadores
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                    <tr className="bg-[#557389] text-white">
                    <th className="p-3 text-left">#</th>
                    <th className="p-3 text-left">Jogador</th>
                    <th className="p-3 text-left">Equipe(s)</th>
                    <th className="p-3 text-center">Títulos</th>
                    <th className="p-3 text-center">Vice</th>
                    <th className="p-3 text-center">Pontos</th>
                    </tr>
                </thead>

                <tbody>
                    {playersRanking.map((player, index) => (
                    <tr
                        key={player.player}
                        className="border-b hover:bg-gray-50"
                    >
                        <td className="p-3 font-semibold">
                        {index + 1}
                        </td>

                        <td className="p-3 font-semibold">
                        {player.player}
                        </td>

                        <td className="p-3 text-sm">
                        {player.team}
                        </td>

                        <td className="p-3 text-center">
                        {player.titles}
                        </td>

                        <td className="p-3 text-center">
                        {player.vice}
                        </td>

                        <td className="p-3 text-center font-bold text-[#5e5035]">
                        {player.points}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </section>
        </div>
    </main>
  );
}

function PodiumCard({
  emoji,
  team,
  titles,
}: {
  emoji: string;
  team: string;
  titles: number;
}) {
  return (
    <div className="rounded-xl bg-[#708c9a] p-6 text-white shadow">
      <div className="text-4xl">{emoji}</div>

      <h3 className="mt-3 text-xl font-bold">
        {team}
      </h3>

      <p className="mt-2">
        {titles} {titles === 1 ? "título" : "títulos"}
      </p>
    </div>
  );
}

function SeasonCard({
  season,
  champion,
  vice,
  result,
}: {
  season: string;
  champion: string;
  vice: string;
  result: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg">
      <h3 className="mb-4 text-2xl font-bold text-[#557389]">
        {season}
      </h3>

      <div className="space-y-2">
        <p>
          🏆 Campeão:
          <span className="font-semibold">
            {" "}
            {champion}
          </span>
        </p>

        <p>
          🥈 Vice:
          <span className="font-semibold">
            {" "}
            {vice}
          </span>
        </p>

        <p>
          ⚽ Final:
          <span className="font-semibold">
            {" "}
            {result}
          </span>
        </p>
      </div>
    </div>
  );
}

function RankingRow({
  position,
  team,
  titles,
  vice,
  points,
}: {
  position: number;
  team: string;
  titles: number;
  vice: number;
  points: number;
}) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-3 font-semibold">
        {position}
      </td>

      <td className="p-3 font-semibold">
        {team}
      </td>

      <td className="p-3 text-center">
        {titles}
      </td>

      <td className="p-3 text-center">
        {vice}
      </td>

      <td className="p-3 text-center font-bold text-[#5e5035]">
        {points}
      </td>
    </tr>
  );
}

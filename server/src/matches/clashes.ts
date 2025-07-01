import salvarPartidas from "./savematches";

type Team = {
  id: number;
  name: string;
  group: string;
};

type Match = {
  home: string;
  away: string;
  group: string;
  round: number;
  date: string;
  time: string;
};

import { AppDataSource } from "../data-source";

AppDataSource.initialize().then(async () => {
  console.log("Banco conectado com sucesso!");

  // aqui vai sua geração e salvamento:
  const jogos = generateSchedule(teams, allDates, horariosPorDia);
  await salvarPartidas(jogos);

  console.log("Partidas geradas e salvas.");
  console.log(jogos);
}).catch((err) => {
  console.error("Erro ao conectar no banco:", err);
});


// Gera rodadas round-robin para um grupo
function generateRoundRobinMatches(teams: Team[]): Match[][] {
  const n = teams.length;
  const rounds: Match[][] = [];

  const hasBye = n % 2 !== 0;
  const extendedTeams = hasBye ? [...teams, { id: 0, name: "BYE", group: teams[0].group }] : [...teams];

  const totalTeams = extendedTeams.length;
  const totalRounds = totalTeams - 1;

  for (let round = 0; round < totalRounds; round++) {
    const roundMatches: Match[] = [];

    for (let i = 0; i < totalTeams / 2; i++) {
      const homeIndex = (round + i) % (totalTeams - 1);
      let awayIndex = (totalTeams - 1 - i + round) % (totalTeams - 1);

      // Último time fixo no final
      if (i === 0) awayIndex = totalTeams - 1;

      const home = extendedTeams[homeIndex];
      const away = extendedTeams[awayIndex];

      if (home.name !== "BYE" && away.name !== "BYE" && home.name !== away.name) {
        roundMatches.push({
          home: home.name,
          away: away.name,
          group: home.group,
          round: round + 1,
          date: "",
          time: "",
        });
      }
    }

    rounds.push(roundMatches);
  }

  return rounds;
}


function generateSchedule(
  teams: Team[],
  allDates: string[],
  horariosPorDia: Record<string, string[]>
): Match[] {
  // 1. Separar times por grupo
  const groups: Record<string, Team[]> = {};
  teams.forEach(t => {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  });

  // 2. Gerar rodadas round-robin por grupo
  const roundsByGroup: Record<string, Match[][]> = {};
  for (const group in groups) {
    roundsByGroup[group] = generateRoundRobinMatches(groups[group]);
  }

  // 3. Intercalar as rodadas para formar rodadas finais com 6 jogos (2 noites de 3 jogos)
  // Alternância de jogos por noite: 2A+1B e 1A+2B

  const maxRounds = Math.max(roundsByGroup["A"].length, roundsByGroup["B"].length);
  const finalMatches: Match[] = [];
  let dateIndex = 0;

  for (let round = 0; round < maxRounds; round++) {
    // Cada rodada tem 2 noites
    for (let night = 0; night < 2; night++) {
      if (dateIndex >= allDates.length) break;
      const date = allDates[dateIndex];
      const horarios = horariosPorDia[date] || [];

      // Distribuição alternada
      const isFirstNight = night === 0;
      const distribA = isFirstNight ? 2 : 1;
      const distribB = isFirstNight ? 1 : 2;

      // Selecionar jogos do grupo A
      const jogosA = roundsByGroup["A"][round] || [];
      const jogosB = roundsByGroup["B"][round] || [];

      // Função para pegar X jogos não usados ainda
      const pickMatches = (matches: Match[], count: number): Match[] => {
        return matches.splice(0, count);
      };

      const selectedA = pickMatches(jogosA, distribA);
      const selectedB = pickMatches(jogosB, distribB);

      const jogosDaNoite = [...selectedA, ...selectedB];

      // Atribuir data e horário
      jogosDaNoite.forEach((match, idx) => {
        match.date = date;
        match.time = horarios[idx] || "Horário indefinido";
      });

      finalMatches.push(...jogosDaNoite);
      dateIndex++;
    }
  }

  return finalMatches;
}

const teams: Team[] = [
  { id: 1, name: "CM INTER MIAMI", group: "A" },
  { id: 2, name: "THUNDER FC", group: "A" },
  { id: 3, name: "TITANS FC", group: "A" },
  { id: 4, name: "FALCON FC", group: "A" },
  { id: 5, name: "TG FC", group: "A" },
  { id: 6, name: "FC DALLAS", group: "A" },
  { id: 7, name: "LIONS FC", group: "B" },
  { id: 8, name: "ATLÉTICO RF", group: "B" },
  { id: 9, name: "VILARREAL", group: "B" },
  { id: 10, name: "GOLDEN WARRIOS", group: "B" },
  { id: 11, name: "CA NOTTS", group: "B" },
  { id: 12, name: "OS LISOS TEAM", group: "B" },
];

const allDates = [
  "02/07/2025", "04/07/2025", "07/07/2025", "09/07/2025",
  "11/07/2025", "14/07/2025", "16/07/2025", "18/07/2025",
  "21/07/2025", "23/07/2025",
];

const horariosPorDia: Record<string, string[]> = Object.fromEntries(
  allDates.map((d) => [d, ["19:00", "20:00", "21:00"]])
);

// console.time("Geração dos jogos");

// const jogos = generateSchedule(teams, allDates, horariosPorDia);
// salvarPartidas(jogos);

// console.timeEnd("Geração dos jogos");
// console.log(jogos);

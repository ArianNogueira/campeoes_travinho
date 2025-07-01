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

  jogos.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA, ...a.time.split(":").map(Number));
    const dateB = new Date(yearB, monthB - 1, dayB, ...b.time.split(":").map(Number));
    return dateA.getTime() - dateB.getTime();
  });

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
  const groups: Record<string, Team[]> = {};
  teams.forEach(t => {
    if (!groups[t.group]) groups[t.group] = [];
    groups[t.group].push(t);
  });

  const roundsByGroup: Record<string, Match[][]> = {};
  for (const group in groups) {
    roundsByGroup[group] = generateRoundRobinMatches(groups[group]);
  }

  const maxRounds = Math.max(roundsByGroup["A"].length, roundsByGroup["B"].length);
  const finalMatches: Match[] = [];
  let dateIndex = 0;

  // Rastrear os horários usados por time
  const timeUsage: Record<string, Set<string>> = {};
  teams.forEach(team => {
    timeUsage[team.name] = new Set();
  });

  // Função para escolher horário menos usado por ambos os times
  const pickTimeSlot = (home: string, away: string, available: string[]): string => {
    const homeUsed = timeUsage[home];
    const awayUsed = timeUsage[away];

    const unused = available.filter(t => !homeUsed.has(t) && !awayUsed.has(t));
    const leastUsed = unused.length > 0 ? unused : available;

    const chosen = leastUsed[Math.floor(Math.random() * leastUsed.length)];

    timeUsage[home].add(chosen);
    timeUsage[away].add(chosen);

    return chosen;
  };

  for (let round = 0; round < maxRounds; round++) {
    for (let night = 0; night < 2; night++) {
      if (dateIndex >= allDates.length) break;
      const date = allDates[dateIndex];
      const horarios = [...(horariosPorDia[date] || [])]; // copia para manipular

      const isFirstNight = night === 0;
      const distribA = isFirstNight ? 2 : 1;
      const distribB = isFirstNight ? 1 : 2;

      const jogosA = roundsByGroup["A"][round] || [];
      const jogosB = roundsByGroup["B"][round] || [];

      const pickMatches = (matches: Match[], count: number): Match[] => {
        return matches.splice(0, count);
      };

      const selectedA = pickMatches(jogosA, distribA);
      const selectedB = pickMatches(jogosB, distribB);

      const jogosDaNoite = [...selectedA, ...selectedB];

      // Embaralhar ordem dos jogos para diversificar
      jogosDaNoite.sort(() => Math.random() - 0.5);

      // Embaralhar os horários da noite
      const shuffledHorarios = horarios.sort(() => Math.random() - 0.5);

      jogosDaNoite.forEach((match, idx) => {
        const horarioDisponivel = shuffledHorarios[idx];

        // Atualiza rastreamento de horários usados
        timeUsage[match.home].add(horarioDisponivel);
        timeUsage[match.away].add(horarioDisponivel);

        match.date = date;
        match.time = horarioDisponivel;
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

// // Ordenar os jogos por data e horário
// jogos.sort((a, b) => {
//   const [dayA, monthA, yearA] = a.date.split("/").map(Number);
//   const [dayB, monthB, yearB] = b.date.split("/").map(Number);
//   const dateA = new Date(yearA, monthA - 1, dayA, ...a.time.split(":").map(Number));
//   const dateB = new Date(yearB, monthB - 1, dayB, ...b.time.split(":").map(Number));
//   return dateA.getTime() - dateB.getTime();
// });

// salvarPartidas(jogos);

// console.timeEnd("Geração dos jogos");
// console.log(jogos);
import { Team } from "@/types/tournament";

export function generateRoundRobin(teams: Team[]) {
  const list = [...teams];

  // se a quantidade de times for impar, cai no erro, pois o grupo precisa ter 6 ou 8 times
  if (list.length % 2 !== 0) {
    throw new Error(
      "A quantidade de equipes deve ser par."
    );
  }

  const rounds = [];

  const totalRounds = list.length - 1;

  // pega os times e faz o cruzamento do primeiro elemento e ultimo, de forma subsequente e armazena os confrontos e matches:
  // A vs F -> B vs E -> C vs D
  for (let round = 0; round < totalRounds; round++) {
    const matches = [];

    for (let i = 0; i < list.length / 2; i++) {
      matches.push({
        home_team_id: list[i].id,
        away_team_id:
          list[list.length - 1 - i].id,
      });
    }

    rounds.push(matches);

    // aqui ele fixa o primeiro time (A) e faz a mudança da ordem dos restante:
    // A > B > C > D > E > F passa a ser -> A > F > B > C > D > E...
    const fixed = list[0];

    const rotated = [
      fixed,
      list[list.length - 1],
      ...list.slice(1, -1),
    ];

    list.splice(0, list.length, ...rotated);
  }

  return rounds;
}

// função que separa em grupos os confrontos gerados tendo:
// roundsA - [time casa][time visitante] e roundsB - [time cas][time visitante]
export function mergeGroupRounds(
  roundsA: any[][],
  roundsB: any[][]
) {
  const result = [];

  for (let round = 0; round < roundsA.length; round++) {
    result.push({
      round: round + 1,
      matches: [
        ...roundsA[round],
        ...roundsB[round],
      ],
    });
  }

  return result;
}

export function buildSchedule(
  rounds: any[],
  startDate: string
) {
  const horarios = [
    "19:00",
    "20:00",
    "21:00",
  ];

  let currentDate = new Date(startDate);

  const rows = [];

  for (const roundData of rounds) {

    // caso seja final de semana, adicionar mais um dia: 0 - domingo e 6 - sábado
    while (
      currentDate.getDay() === 0 ||
      currentDate.getDay() === 6
    ) {
      currentDate.setDate(
        currentDate.getDate() + 1
      );
    }

    let horarioIndex = 0;

    // aqui define as datas das partidas com os horários padrões, desfraguementando a data por ex: 2026-06-18
    for (const match of roundData.matches) {
      rows.push({
        ...match,
        round: `Rodada ${roundData.round}`,
        date: currentDate
          .toISOString()
          .split("T")[0],
        time: horarios[horarioIndex],
        status: "scheduled",
      });

      horarioIndex++;

      // aqui começa os horarios do inicio, casa o index seja igual a 3, ou seja, 19h > 20h > 21h ... 19h > 20h....
      if (horarioIndex === 3) {
        horarioIndex = 0;

        currentDate.setDate(
          currentDate.getDate() + 1
        );

        while (
          currentDate.getDay() === 0 ||
          currentDate.getDay() === 6
        ) {
          currentDate.setDate(
            currentDate.getDate() + 1
          );
        }
      }
    }
  }

  return rows;
}
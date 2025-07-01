import { AppDataSource } from "../data-source";
import { Match } from "../entity/Match";
import { Team } from "../entity/Team";

type MatchData = {
  home: string;
  away: string;
  date: string;
  time: string;
  round: number;
  group: string;
};

async function salvarPartidas(generatedMatches: MatchData[]) {
  const teamRepo = AppDataSource.getRepository(Team);
  const matchRepo = AppDataSource.getRepository(Match);

  const teams = await teamRepo.find(); // 🔄 Carrega todos os times de uma vez
  const teamMap = new Map(teams.map((t) => [t.name, t])); // 🔍 Para busca mais rápida

  for (const partida of generatedMatches) {
    const homeTeam = teamMap.get(partida.home);
    const awayTeam = teamMap.get(partida.away);

    if (!homeTeam || !awayTeam) {
      console.warn("Time não encontrado:", partida.home, partida.away);
      continue;
    }

    const partidaExistente = await matchRepo.findOne({
      where: {
        home: { id: homeTeam.id },
        away: { id: awayTeam.id },
        round: partida.round,
      },
    });

    if (partidaExistente) {
      console.log("Partida já existe:", partida.home, "x", partida.away);
      continue;
    }

    const novaPartida = matchRepo.create({
      home: homeTeam,
      away: awayTeam,
      date: partida.date,
      time: partida.time,
      round: partida.round,
      group: partida.group,
    });

    await matchRepo.save(novaPartida);
  }

  console.log("✅ Partidas salvas com sucesso!");
}

export default salvarPartidas;

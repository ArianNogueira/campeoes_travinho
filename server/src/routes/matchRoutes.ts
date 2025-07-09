import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { Match } from "../entity/Match";
import { Player } from "../entity/Player";
import { MatchEvent } from "../entity/MatchEvent";

const router = Router();

// GET /matches - retorna todas as partidas com os dados dos times
router.get("/", async (req, res) => {
  try {
    const matchRepo = AppDataSource.getRepository(Match);
    const matches = await matchRepo.find({
      relations: ["home", "away"], // ✅ agora relaciona os dois times
      order: {
        round: "ASC",
        date: "ASC",
        time: "ASC"
      }
    });
    res.json(matches);
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    res.status(500).json({ error: "Erro ao buscar partidas" });
  }
});

router.post("/salvar", async (req, res): Promise<void> => {
  const { matchId, goals, cards } = req.body;

  try {
    const match = await AppDataSource.getRepository(Match).findOneBy({ id: matchId });
    if (!match) { 
      res.status(404).json({ error: "Partida não encontrada" });
      return;
    }

    const eventRepo = AppDataSource.getRepository(MatchEvent);

    for (const playerId of Object.keys(goals)) {
      const player = await AppDataSource.getRepository(Player).findOneBy({ id: Number(playerId) });
      if (!player) continue;

      const event = new MatchEvent();
      event.match = match;
      event.player = player;
      event.goals = goals[playerId] || 0;
      event.yellowCard = cards[playerId]?.yellow || false;
      event.redCard = cards[playerId]?.red || false;

      await eventRepo.save(event);
    }

    res.json({ message: "Resultado salvo com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao salvar resultado" });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const match = await AppDataSource.getRepository(Match).findOne({
      where: { id: Number(id) },
      relations: ['home', 'home.captain', 'away', 'away.captain'],
    });

    if (!match) {
      res.status(404).json({ message: 'Partida não encontrada' });
      return;
    }

    const playerRepo = AppDataSource.getRepository(Player);

    const homePlayers = await playerRepo.find({
      where: { team: { id: match.home.id } },
      // order: { number: 'ASC' }
    });

    const awayPlayers = await playerRepo.find({
      where: { team: { id: match.away.id } },
      // order: { number: 'ASC' }
    });

    res.json({
      homePlayers,
      awayPlayers,
      homeCaptain: match.home.captain?.name || null,
      awayCaptain: match.away.captain?.name || null,
    });
    return;
  } catch (error) {
    console.error("Erro ao buscar jogadores da partida:", error);
    res.status(500).json({ error: "Erro ao buscar jogadores" });
    return;
  }
});


router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { date, time, round } = req.body;

  try {
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await matchRepository.findOne({
      where: { id: Number(id) },
    });

    if (!match) {
      res.status(404).json({ message: 'Partida não encontrada' });
      return;
    }

    match.date = date || match.date;
    match.time = time || match.time;
    match.round = round || match.round;

    await matchRepository.save(match);

    res.json(match);
  } catch (error) {
    console.error("Erro ao atualizar partida:", error);
    res.status(500).json({ error: 'Erro ao atualizar partida' });
  }
});

export default router;

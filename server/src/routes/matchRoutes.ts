import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { Match } from "../entity/Match";
import { Player } from "../entity/Player";

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

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const match = await AppDataSource.getRepository(Match).findOne({
      where: { id: Number(id) },
      relations: ['home', 'away'],
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

    res.json({ homePlayers, awayPlayers });
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

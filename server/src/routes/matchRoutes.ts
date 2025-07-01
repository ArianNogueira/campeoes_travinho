import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Match } from "../entity/Match";

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

export default router;

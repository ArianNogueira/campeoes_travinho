import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Team } from "../entity/Team";
import { Captain } from "../entity/Captain";

const router = Router();

import { Player } from "../entity/Player"; // não esqueça de importar
import { serialize } from "v8";

router.get("/", async (req, res) => {
  try {
    const teamRepository = AppDataSource.getRepository(Team);

    const teams = await teamRepository.find({
      relations: ["captain", "players"],
    });

    res.json(teams);
  } catch (error) {
    console.error("Erro ao buscar times:", error);
    res.status(500).send("Erro ao buscar times");
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { name, group, captain, players } = req.body;

  if (!name || !group || !captain || !players || players.length !== 5) {
    res.status(400).send("Dados incompletos. O time deve ter um capitão e 5 jogadores.");
    return;
  }

  const teamRepository = AppDataSource.getRepository(Team);
  const existingTeam = await teamRepository.findOne({ where: { name }, relations: ["captain"] });

  if (existingTeam) {
    res.status(400).send("Time já cadastrado.");
    return;
  }

  const newCaptain = new Captain();
  newCaptain.name = captain.name;
  newCaptain.playerNumber = captain.playerNumber;
  newCaptain.position = captain.position;

  const team = new Team();
  team.name = name;
  team.group = group;
  team.captain = newCaptain;

  // Criar jogadores
  team.players = players.map((p: any) => {
  const player = new Player();
  player.name = p.name;
  player.playerNumber = p.playerNumber;
  player.position = p.position;
  player.team = team; // <- associação explícita aqui
  return player;
});

  await teamRepository.save(team);

  res.status(201).json(serialize(team));
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  const teamId = parseInt(req.params.id);
  const { name, group, captain, players } = req.body;

  if (!name || !group || !captain || !players || players.length !== 5) {
    res.status(400).send("Dados incompletos. O time deve ter um capitão e 5 jogadores.");
    return;
  }

  const teamRepository = AppDataSource.getRepository(Team);
  const captainRepository = AppDataSource.getRepository(Captain);
  const playerRepository = AppDataSource.getRepository(Player);

  try {
    const team = await teamRepository.findOne({
      where: { id: teamId },
      relations: ["captain", "players"],
    });

    if (!team) {
      res.status(404).send("Time não encontrado.");
      return;
    }

    // Atualizar informações do time
    team.name = name;
    team.group = group;

    // Atualizar capitão
    if (team.captain) {
      team.captain.name = captain.name;
      team.captain.playerNumber = captain.playerNumber;
      team.captain.position = captain.position;
      await captainRepository.save(team.captain);
    } 

    for (let i = 0; i < players.length; i++) {
      const incoming = players[i];
      const existing = team.players.find(p => p.id === incoming.id);

      if(existing) {
        // Atualizar jogador existente
        existing.name = incoming.name;
        existing.playerNumber = incoming.playerNumber;
        existing.position = incoming.position;
        await playerRepository.save(existing);
      }
    }

      await teamRepository.save(team);
      
    res.status(200).json({ message: "Time atualizado com sucesso."});
  } catch (error) {
    console.error("Erro ao atualizar time:", error);
    res.status(500).send("Erro ao atualizar time.");
  }
})

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  const teamId = parseInt(req.params.id);
  const teamRepository = AppDataSource.getRepository(Team);
  const playerRepository = AppDataSource.getRepository(Player);
  const captainRepository = AppDataSource.getRepository(Captain);

  try {
    const team = await teamRepository.findOne({
      where: { id: teamId },
      relations: ["players", "captain"],
    });

    if (!team) {
       res.status(404).send("Time não encontrado.");
       return;
    }

    // Remover jogadores primeiro
    if (team.players.length > 0) {
      await playerRepository.remove(team.players);
    }

    // Remover capitão
    if (team.captain) {
      await captainRepository.remove(team.captain);
    }

    // Por fim, remover o time
    await teamRepository.remove(team);

    res.status(200).send("Time removido com sucesso.");
    return;
  } catch (error) {
    console.error("Erro ao excluir time:", error);
    res.status(500).send("Erro ao excluir time.");
    return;
  }
});


export default router;

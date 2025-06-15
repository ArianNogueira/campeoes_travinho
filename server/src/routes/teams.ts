import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Team } from "../entity/Team";
import { Captain } from "../entity/Captain";

const router = Router();

import { Player } from "../entity/Player"; // não esqueça de importar

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

router.post("/criar-inicial", async (req: Request, res: Response) => {
  const { name, group } = req.body;

  if (!name || !group) {
    res.status(400).send("Nome e grupo são obrigatórios.");
    return;
  }

  const teamRepository = AppDataSource.getRepository(Team);
  const existingTeam = await teamRepository.findOne({ where: { name } });

  if (existingTeam) {
    res.status(400).send("Time já existe.");
    return;
  }

  const newTeam = new Team();
  newTeam.name = name;
  newTeam.group = group;

  await teamRepository.save(newTeam);

  res.status(201).json({ message: "Time cadastrado com sucesso." });
});


router.put("/:dados", async (req: Request, res: Response): Promise<void> => {
  const { name, captain, players } = req.body;

  if (!captain || !players || players.length !== 5) {
    res.status(400).send("Dados incompletos. O time deve ter um capitão e 5 jogadores.");
    return;
  }

  const teamRepository = AppDataSource.getRepository(Team);
  const captainRepository = AppDataSource.getRepository(Captain);
  const playerRepository = AppDataSource.getRepository(Player);

  try {
    const team = await teamRepository.findOne({
      where: { name },
      relations: ["captain", "players"],
    });

    if (!team) {
      res.status(404).send("Time não encontrado.");
      return;
    }

    if (team.captain || team.players.length > 0) {
      res.status(403).send("Este time já foi preenchido.");
      return;
    }

    // Criar e salvar o capitão
    const newCaptain = new Captain();
    newCaptain.name = captain.Nome;
    newCaptain.playerNumber = captain.Numero;
    newCaptain.position = captain.Posicao;
    await captainRepository.save(newCaptain);
    team.captain = newCaptain;

    // Criar e salvar jogadores
    const newPlayers = players.map((p: any) => {
      const player = new Player();
      player.name = p.Nome;
      player.playerNumber = p.Numero;
      player.position = p.Posicao;
      player.team = team;
      return player;
    });

    await playerRepository.save(newPlayers);
    team.players = newPlayers;

    await teamRepository.save(team);

    res.status(200).json({ message: "Time preenchido com sucesso!" });
  } catch (error) {
    console.error("Erro ao preencher o time:", error);
    res.status(500).send("Erro ao preencher o time.");
  }
});


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

router.post("/teams/:id/player", async (req: Request, res: Response): Promise<void> => {
  const teamId = parseInt(req.params.id);
  const { name, playerNumber, position } = req.body;
  
  if (!name || !playerNumber || position) {
    res.status(400).send("Todos os campos do jogador são obrigatórios.");
    return;
  }
  
  try {
    const teamRepository = AppDataSource.getRepository(Team);
    const playerRepository = AppDataSource.getRepository(Player);
    
    const team = await teamRepository.findOne({
      where: { id: teamId },
      relations: ["players", "captain"],
    });
    
    if (!team) {
      res.status(404).send("Time não encontrado.");
      return;
    }
    
    const exists = team.players.find(p => p.playerNumber === playerNumber);
    const capitanConflct = team.captain?.playerNumber === playerNumber;
    
    if (exists || capitanConflct) {
      res.status(400).send("Número de camisa já utilizada no time.");
      return;
      
    }
    if (team.players.length >= 5) {
      res.status(400).send("O time já possui 5 jogadores.");
      return;
    }

    const newPlayer = new Player();
    newPlayer.name = name;
    newPlayer.playerNumber = playerNumber;
    newPlayer.position = position;
    newPlayer.team = team; // associação explícita

    await playerRepository.save(newPlayer);
    res.status(201).json({ message: "Jogador adicionado com sucesso."});
  } catch (error) {
    console.error("Erro ao adicionar jogador:", error);
    res.status(500).send("Erro ao adicionar jogador.");
  }
})

router.delete("/teams/:teamId/player/:playerId", async (req: Request, res: Response): Promise<void> => {
  const { teamId, playerId } = req.params;
  const playerRepository = AppDataSource.getRepository(Player);
   
  try {
    const player = await playerRepository.findOne({
      where: { id: parseInt(playerId) },
      relations: ["team"],
    });
    
    if (!player || player.team.id !== parseInt(teamId)) {
      res.status(404).send("Jogador não encontrado nesse time.");
      return;
    }

    await playerRepository.remove(player);
    res.status(200).send("Jogador removido com sucesso.");
  } catch (error) {
    console.error("Erro ao remover jogador:", error);
    res.status(500).send("Erro ao remover jogador.");
  }
});

export default router;

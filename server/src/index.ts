import "reflect-metadata";
import express, { Request, Response } from "express";
import { DataSource } from "typeorm";
import { Team } from "./entity/Team";
import { Captain } from "./entity/Captain";
import { Match } from "./entity/Match";

const app = express();
app.use(express.json());

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",           // ajuste com seu usuário MySQL
  password: "1234",      // ajuste com sua senha
  database: "campeonato",     // certifique-se de que esse banco existe
  entities: [Team, Captain, Match],
  synchronize: true,
});

AppDataSource.initialize().then(() => {
  console.log("📦 Banco conectado!");

  app.post("/teams", async (req: Request, res: Response): Promise<void> => {
    const { name, group, captain } = req.body;
    if (!name || !group || !captain) {
      res.status(400).send("Dados incompletos");
      return;
    }

    const teamRepository = AppDataSource.getRepository(Team);

    const newCaptain = new Captain();
    newCaptain.name = captain.name;
    newCaptain.playerNumber = captain.playerNumber;
    newCaptain.position = captain.position;

    const team = new Team();
    team.name = name;
    team.group = group;
    team.captain = newCaptain;

    await teamRepository.save(team);

    res.status(201).json({ team });
  });

  app.listen(3000, () => {
    console.log("🚀 Servidor rodando em http://localhost:3000");
  });
}).catch((error) => console.log("Erro na conexão:", error));

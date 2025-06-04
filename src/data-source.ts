import "reflect-metadata";
import { DataSource } from "typeorm";
import { Team } from "./entity/Team";
import { Captain } from "./entity/Captain";
import { Match } from "./entity/Match";
import { Player } from "./entity/Player";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "campeonato",
  entities: [Team, Captain, Match, Player],
  synchronize: true,
});

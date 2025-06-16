import "reflect-metadata";
import { DataSource } from "typeorm";
import { Team } from "./entity/Team";
import { Captain } from "./entity/Captain";
import { Match } from "./entity/Match";
import { Player } from "./entity/Player";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Team, Captain, Match, Player],
  synchronize: true,
});

// src/reset-db.ts
import "reflect-metadata";
import { AppDataSource } from "./data-source";

async function resetDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("Conectado ao banco de dados...");

    await AppDataSource.dropDatabase();
    console.log("Banco de dados excluído.");

    await AppDataSource.synchronize();
    console.log("Banco de dados recriado e sincronizado.");

    process.exit(0);
  } catch (error) {
    console.error("Erro ao resetar o banco:", error);
    process.exit(1);
  }
}

resetDatabase();

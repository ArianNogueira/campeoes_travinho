import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Team } from "./entity/Team";

async function deleteAllTeams() {
  await AppDataSource.initialize();

  const teamRepository = AppDataSource.getRepository(Team);

  await teamRepository.clear(); // Remove todos os registros da tabela
  console.log("Todos os times foram excluídos.");

  process.exit(0);
}

deleteAllTeams().catch((error) => {
  console.error("Erro ao excluir times:", error);
  process.exit(1);
});

import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Team } from "./entity/Team";

async function seedInitialData() {
  await AppDataSource.initialize();

  const teamRepository = AppDataSource.getRepository(Team);

  const teamsData = [
    { name: "CM INTER MIAMI", group: "Grupo A" },
    { name: "THUNDER FC", group: "Grupo A" },
    { name: "TITANS FC", group: "Grupo A" },
    { name: "FALCON FC", group: "Grupo A" },
    { name: "TG FC", group: "Grupo A" },
    { name: "FC DALLAS", group: "Grupo A" },

    { name: "LIONS FC", group: "Grupo B" },
    { name: "ATLÉTICO RF", group: "Grupo B" },
    { name: "VILARREAL", group: "Grupo B" },
    { name: "GOLDEN WARRIOS", group: "Grupo B" },
    { name: "CA NOTTS", group: "Grupo B" },
    { name: "OS LISOS TEAM", group: "Grupo B" },
    { name: "teste", group: "Grupo B" },
  ];

  for (const data of teamsData) {
    const existing = await teamRepository.findOneBy({ name: data.name });
    if (!existing) {
      const team = new Team();
      team.name = data.name;
      team.group = data.group;
      await teamRepository.save(team);
      console.log(`Time "${data.name}" criado.`);
    } else {
      console.log(`Time "${data.name}" já existe, pulando...`);
    }
  }

  console.log("Seed inicial finalizada!");
  process.exit(0);
}

seedInitialData().catch((error) => {
  console.error("Erro no seed:", error);
  process.exit(1);
});

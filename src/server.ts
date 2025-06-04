import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import teamsRouter from "./routes/teams";

const app = express();
app.use(express.json());

app.use("/teams", teamsRouter); // <- importante

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Banco conectado!");
    app.listen(3000, () => {
      console.log("🚀 Servidor rodando em http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("Erro na conexão:", err);
  });

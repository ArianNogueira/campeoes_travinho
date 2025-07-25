import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import teamsRouter from "./routes/teams";
import cors from "cors";
import matchRoutes from "./routes/matchRoutes";

const app = express();


app.use(express.json());
app.use(cors());

app.use("/teams", teamsRouter); // <- importante
app.use("/matches", matchRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Banco conectado!");
    app.listen(3001, () => {
      console.log("🚀 Servidor rodando em http://localhost:3001");
    });
  })
  .catch((err) => {
    console.error("Erro na conexão:", err);
  });

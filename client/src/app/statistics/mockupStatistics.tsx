import { StaticImageData } from "next/image";
import inter from "../../assets/emblemas/Inter_Miami.jpeg";
import thunder from "../../assets/emblemas/Thunder.jpeg";
import titans from "../../assets/emblemas/Titan_FC.jpeg";
import dalas from "../../assets/emblemas/FC_Dallas.jpeg";
import falcon from "../../assets/emblemas/Falcon_FC.jpeg";
import tungo from "../../assets/emblemas/Tungo_FC.jpeg";
import golden from "../../assets/emblemas/Golden_Warrios.jpeg";
// import vilarreal from "../../assets/emblemas/Villareal.jpeg";
// import lions from "../../assets/emblemas/Lions_FC.jpeg";
import notts from "../../assets/emblemas/CA_Notts.jpeg";
import lisos from "../../assets/emblemas/Os_Lisos_Team.jpeg";
import atletico from "../../assets/emblemas/Atletico.svg.png";

// Tipos
interface PlayerStats {
  id: number;
  name: string;
  team: string | StaticImageData;
  goals: number;
}

interface CardStats {
  id: number;
  name: string;
  team: string | StaticImageData;
  yellow: number;
  red: number;
}

interface TeamStats {
  id: number;
  name: string;
  goalsScored: number;
  goalsConceded: number;
}

// Dados mockados (para exemplo)
const topScorers: PlayerStats[] = [
  { id: 1, name: "Robinho", team: thunder, goals: 12 },
  { id: 2, name: "Robgol", team: inter, goals: 8 },
  { id: 3, name: "Ítalo", team: thunder, goals: 6 },
  { id: 4, name: "Gleyvison", team: titans, goals: 5 },
  { id: 5, name: "Alef", team: dalas, goals: 5 },
  { id: 6, name: "Renan", team: titans, goals: 5 },
  { id: 7, name: "Joanderson", team: titans, goals: 5 },
  { id: 8, name: "David", team: golden, goals: 4 },
  { id: 9, name: "Maycon", team: tungo, goals: 3 },
  { id: 10, name: "Pereu", team: lisos, goals: 3 },
];

const cards: CardStats[] = [
  { id: 1, name: "MAYCON", team: tungo, yellow: 2, red: 0 },
  { id: 2, name: "STHÊNIO", team: golden, yellow: 2, red: 0 },
  { id: 3, name: "CLAUDIO", team: notts, yellow: 2, red: 0 },
  { id: 4, name: "ÍTALO", team: thunder, yellow: 1, red: 0 },
  { id: 5, name: "PEREU", team: lisos, yellow: 1, red: 0 },
  { id: 6, name: "EDUARDO", team: atletico, yellow: 1, red: 0 },
  { id: 7, name: "PEDRO VITOR", team: falcon, yellow: 1, red: 0 },
  { id: 8, name: "ELTON", team: lisos, yellow: 1, red: 0 },
];

const teams: TeamStats[] = [
  { id: 1, name: "Thunder", goalsScored: 25, goalsConceded: 11 },
  { id: 2, name: "Villareal", goalsScored: 15, goalsConceded: 4 },
  { id: 3, name: "Golden", goalsScored: 8, goalsConceded: 12 },
];

const statisticsMockup = {
  topScorers,
  cards,
  teams,
};

export default statisticsMockup;

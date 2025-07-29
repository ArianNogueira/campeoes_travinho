import { StaticImageData } from "next/image";
import inter from "../../assets/emblemas/Inter_Miami.jpeg";
import thunder from "../../assets/emblemas/Thunder.jpeg";
import titans from "../../assets/emblemas/Titan_FC.jpeg";
import dalas from "../../assets/emblemas/FC_Dallas.jpeg";
import falcon from "../../assets/emblemas/Falcon_FC.jpeg";
import tungo from "../../assets/emblemas/Tungo_FC.jpeg";
import golden from "../../assets/emblemas/Golden_Warrios.jpeg";
import vilarreal from "../../assets/emblemas/Villareal.jpeg";
import lions from "../../assets/emblemas/Lions_FC.jpeg";
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
  { id: 1, name: "Robgol", team: inter, goals: 17 },
  { id: 2, name: "Robinho", team: thunder, goals: 12 },
  { id: 11, name: "João Pedro", team: atletico, goals: 6 },
  { id: 3, name: "Alef", team: dalas, goals: 6 },
  { id: 4, name: "Ítalo", team: thunder, goals: 6 },
  { id: 15, name: "David", team: golden, goals: 5 },
  { id: 12, name: "Kleberson", team: golden, goals: 5 },
  { id: 5, name: "Cl", team: vilarreal, goals: 5 },
  { id: 6, name: "Neyvison", team: titans, goals: 5 },
  { id: 7, name: "Joelson", team: lions, goals: 5 },
  { id: 8, name: "Gleyvison", team: titans, goals: 5 },
  { id: 9, name: "Renan", team: titans, goals: 5 },
  { id: 10, name: "Joanderson", team: titans, goals: 5 },
  { id: 13, name: "Eduardo", team: atletico, goals: 4 },
  { id: 14, name: "Dudu", team: dalas, goals: 4 },
  { id: 16, name: "Maycon", team: tungo, goals: 3 },
  { id: 17, name: "Pereu", team: lisos, goals: 3 },
  { id: 18, name: "Claudio", team: notts, goals: 3 },
  { id: 19, name: "Nigago", team: lisos, goals: 3 },
  { id: 20, name: "Gustavo", team: atletico, goals: 3 },
  { id: 21, name: "Mateus", team: falcon, goals: 3 },
];

const cards: CardStats[] = [
  { id: 19, name: "BRUNO", team: thunder, yellow: 1, red: 1 },
  { id: 3, name: "CLAUDIO", team: notts, yellow: 3, red: 0 },
  { id: 18, name: "LAURO", team: vilarreal, yellow: 2, red: 0 },
  { id: 20, name: "DANRLEY", team: lions, yellow: 1, red: 0 },
  // { id: 2, name: "EDUARDO", team: atletico, yellow: 2, red: 0 },
  // { id: 16, name: "GEDSON", team: atletico, yellow: 2, red: 0 },
  // { id: 17, name: "STHÊNIO", team: golden, yellow: 2, red: 0 },
  { id: 1, name: "MAYCON", team: tungo, yellow: 1, red: 0 },
  { id: 4, name: "ÍTALO", team: thunder, yellow: 1, red: 0 },
  { id: 5, name: "PEREU", team: lisos, yellow: 1, red: 0 },
  { id: 6, name: "GORDINHO", team: tungo, yellow: 1, red: 0 },
  // { id: 7, name: "EDUARDO", team: atletico, yellow: 1, red: 0 },
  { id: 8, name: "PEDRO VITOR", team: falcon, yellow: 1, red: 0 },
  { id: 9, name: "ELTON", team: lisos, yellow: 1, red: 0 },
  { id: 10, name: "JÚLIO ", team: notts, yellow: 1, red: 0 },
  // { id: 11, name: "LENNYO ", team: atletico, yellow: 1, red: 0 },
  // { id: 12, name: "GEDSON", team: atletico, yellow: 1, red: 0 },
  { id: 13, name: "NETO", team: notts, yellow: 1, red: 0 },
  { id: 14, name: "WEDERSON", team: lions, yellow: 1, red: 0 },
  { id: 15, name: "RUAN", team: inter, yellow: 1, red: 0 },
  // { id: 2, name: "EDUARDO", team: atletico, yellow: 0, red: 0 },
  // { id: 16, name: "GEDSON", team: atletico, yellow: 0, red: 0 },
  // { id: 17, name: "STHÊNIO", team: golden, yellow: 0, red: 0 },
];

const teams: TeamStats[] = [
  { id: 1, name: "Thunder FC", goalsScored: 26, goalsConceded: 14 },
  { id: 2, name: "CM Inter Miami", goalsScored: 24, goalsConceded: 9 },
  { id: 3, name: "Titans FC", goalsScored: 21, goalsConceded: 6 },
];

const statisticsMockup = {
  topScorers,
  cards,
  teams,
};

export default statisticsMockup;

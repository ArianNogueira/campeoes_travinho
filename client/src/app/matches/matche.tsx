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

export const matches = [
  {
    id: 1,
    round: 1,
    group: "A",
    date: "2025-06-15",
    time: "10:00",
    location: "Arena Central",
    teamA: {
      name: "CM INTER MIAMI",
      position: 1,
      emblem: inter,
    },
    teamB: {
      name: "THUNDER FC",
      position: 2,
      emblem: thunder,
    },
    scoreA: null,
    scoreB: null,
  },
  {
    id: 2,
    round: 1,
    group: "A",
    date: "2025-06-15",
    time: "11:00",
    location: "Arena Central",
    teamA: {
      name: "TITANS FC",
      position: 3,
      emblem: titans,
    },
    teamB: {
      name: "FALCON FC",
      position: 4,
      emblem: falcon,
    },
    scoreA: null,
    scoreB: null,
  },
  {
    id: 3,
    round: 1,
    group: "A",
    date: "2025-06-15",
    time: "12:00",
    location: "Arena Central",
    teamA: {
      name: "TG FC",
      position: 5,
      emblem: tungo,
    },
    teamB: {
      name: "FC DALLAS",
      position: 6,
      emblem: dalas,
    },
    scoreA: null,
    scoreB: null,
  },
  {
    id: 4,
    round: 2,
    group: "B",
    date: "2025-06-16",
    time: "10:00",
    location: "Estádio B",
    teamA: {
      name: "LIONS FC",
      position: 1,
      emblem: lions,
    },
    teamB: {
      name: "ATLÉTICO RF",
      position: 2,
      emblem: atletico,
    },
    scoreA: null,
    scoreB: null,
  },
  {
    id: 5,
    round: 2,
    group: "B",
    date: "2025-06-16",
    time: "11:00",
    location: "Estádio B",
    teamA: {
      name: "VILARREAL",
      position: 3,
      emblem: vilarreal,
    },
    teamB: {
      name: "GOLDEN WARRIORS",
      position: 4,
      emblem: golden,
    },
    scoreA: null,
    scoreB: null,
  },
  {
    id: 6,
    round: 2,
    group: "B",
    date: "2025-06-16",
    time: "12:00",
    location: "Estádio B",
    teamA: {
      name: "CA NOTTS",
      position: 5,
      emblem: notts,
    },
    teamB: {
      name: "OS LISOS TEAM",
      position: 6,
      emblem: lisos,
    },
    scoreA: null,
    scoreB: null,
  },
];

export const scoreboard = [
  {
    id: 4,
    home: "2",
    away: "3",
  },
  {
    id: 2,
    home: "3",
    away: "2",
  },
  {
    id: 3,
    home: "6",
    away: "1",
  },
  {
    id: 1,
    home: "3",
    away: "1",
  },
  {
    id: 5,
    home: "5",
    away: "0",
  },
  {
    id: 6,
    home: "3",
    away: "1",
  },
  {
    id: 7,
    home: "3",
    away: "5",
  },
  {
    id: 11,
    home: "5",
    away: "0",
  },
  {
    id: 9,
    home: "5",
    away: "3",
  },
  {
    id: 12,
    home: "4",
    away: "2",
  },
  {
    id: 8,
    home: "2",
    away: "3",
  },
  {
    id: 10,
    home: "(W.O) 3",
    away: "0",
  },
];

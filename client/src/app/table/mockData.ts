import inter from "../../assets/emblemas/Inter_Miami.jpeg"
import thunder from "../../assets/emblemas/Thunder.jpeg"
import titans from "../../assets/emblemas/Titan_FC.jpeg"
import falcon from "../../assets/emblemas/Falcon_FC.jpeg"
import tungo from "../../assets/emblemas/Tungo_FC.jpeg"
import dallas from "../../assets/emblemas/FC_Dallas.jpeg"
import lions from "../../assets/emblemas/Lions_FC.jpeg"
import atletico from "../../assets/emblemas/Atletico.svg.png"
import vilarreal from "../../assets/emblemas/Villareal.jpeg"
import goden from "../../assets/emblemas/Golden_Warrios.jpeg"
import notts from "../../assets/emblemas/CA_Notts.jpeg"
import lisos from "../../assets/emblemas/Os_Lisos_Team.jpeg"

export const standings = [
  // Grupo A
  {
    id: 1,
    team: "CM INTER MIAMI",
    group: "A",
    position: 1,
    points: 15,
    played: 5,
    won: 5,
    drawn: 0,
    lost: 0,
    goalsFor: 24,
    goalsAgainst: 9,
    goalDifference: 15,
    img: inter
  },
  {
    id: 2,
    team: "THUNDER FC",
    group: "A",
    position: 2,
    points: 9,
    played: 5,
    won: 3,
    drawn: 0,
    lost: 2,
    goalsFor: 26,
    goalsAgainst: 14,
    goalDifference: 12,
    img: thunder
  },
  {
    id: 3,
    team: "TITANS FC",
    group: "A",
    position: 3,
    points: 12,
    played: 5,
    won: 4,
    drawn: 0,
    lost: 1,
    goalsFor: 21,
    goalsAgainst: 6,
    goalDifference: 15,
    img: titans
  },
  {
    id: 4,
    team: "FALCON FC",
    group: "A",
    position: 4,
    points: 3,
    played: 5,
    won: 1,
    drawn: 0,
    lost: 4,
    goalsFor: 9,
    goalsAgainst: 35,
    goalDifference: -26,
    img: falcon
  },
  {
    id: 5,
    team: "TG FC",
    group: "A",
    position: 5,
    points: 0,
    played: 5,
    won: 0,
    drawn: 0,
    lost: 5,
    goalsFor: 6,
    goalsAgainst: 27,
    goalDifference: -21,
    img: tungo
  },
  {
    id: 6,
    team: "FC DALLAS",
    group: "A",
    position: 6,
    points: 6,
    played: 5,
    won: 2,
    drawn: 0,
    lost: 3,
    goalsFor: 17,
    goalsAgainst: 12,
    goalDifference: 5,
    img: dallas
  },

  // Grupo B
  {
    id: 7,
    team: "LIONS FC",
    group: "B",
    position: 1,
    points: 6,
    played: 5,
    won: 2,
    drawn: 0,
    lost: 3,
    goalsFor: 14,
    goalsAgainst: 19,
    goalDifference: -5,
    img: lions
  },
  {
    id: 8,
    team: "ATLÉTICO RF",
    group: "B",
    position: 2,
    points: 6,
    played: 5,
    won: 2,
    drawn: 0,
    lost: 3,
    goalsFor: 15,
    goalsAgainst: 18,
    goalDifference: -3,
    img: atletico
  },
  {
    id: 9,
    team: "VILLAREAL",
    group: "B",
    position: 3,
    points: 4,
    played: 5,
    won: 1,
    drawn: 1,
    lost: 3,
    goalsFor: 10,
    goalsAgainst: 9,
    goalDifference: 1,
    img: vilarreal
  },
  {
    id: 10,
    team: "GOLDEN WARRIOS",
    group: "B",
    position: 4,
    points: 13,
    played: 5,
    won: 4,
    drawn: 1,
    lost: 0,
    goalsFor: 18,
    goalsAgainst: 9,
    goalDifference: 9,
    img: goden
  },
  {
    id: 11,
    team: "CA NOTTS",
    group: "B",
    position: 5,
    points: 9,
    played: 5,
    won: 3,
    drawn: 0,
    lost: 2,
    goalsFor: 10,
    goalsAgainst: 9,
    goalDifference: 1,
    img: notts
  },
  {
    id: 12,
    team: "OS LISOS TEAM",
    group: "B",
    position: 6,
    points: 5,
    played: 5,
    won: 1,
    drawn: 2,
    lost: 2,
    goalsFor: 10,
    goalsAgainst: 13,
    goalDifference: -3,
    img: lisos
  },
];


export const topScorers = [
  { id: 1, name: "Robgol", team: "CM INTER MIAMI", goals: 17 },
  { id: 2, name: "Robinho", team: "THUNDER FC", goals: 12 },
  { id: 11, name: "João Pedro", team: "ATLÉTICO RF", goals: 6 },
  { id: 3, name: "Alef", team: "FC DALLAS", goals: 6 },
  { id: 4, name: "Ítalo", team: "THUNDER FC", goals: 6 },
  { id: 15, name: "David", team: "GOLDEN WARRIOS", goals: 5 },
];

export const bestDefenses = [
  { team: "TITANS FC", goalsAgainst: 6, cleanSheets: 0 },
  { team: "CM INTER MIAMI", goalsAgainst: 9, cleanSheets: 0 },
  { team: "VILLAREAL", goalsAgainst: 9, cleanSheets: 0 },
];

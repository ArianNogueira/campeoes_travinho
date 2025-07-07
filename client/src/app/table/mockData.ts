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
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    img: inter
  },
  {
    id: 2,
    team: "THUNDER FC",
    group: "A",
    position: 2,
    points: 3,
    played: 1,
    won: 1,
    drawn: 0,
    lost: 0,
    goalsFor: 6,
    goalsAgainst: 1,
    goalDifference: 5,
    img: thunder
  },
  {
    id: 3,
    team: "TITANS FC",
    group: "A",
    position: 3,
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    img: titans
  },
  {
    id: 4,
    team: "FALCON FC",
    group: "A",
    position: 4,
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    img: falcon
  },
  {
    id: 5,
    team: "TG FC",
    group: "A",
    position: 5,
    points: 0,
    played: 1,
    won: 0,
    drawn: 0,
    lost: 1,
    goalsFor: 1,
    goalsAgainst: 6,
    goalDifference: -5,
    img: tungo
  },
  {
    id: 6,
    team: "FC DALLAS",
    group: "A",
    position: 6,
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    img: dallas
  },

  // Grupo B
  {
    id: 7,
    team: "LIONS FC",
    group: "B",
    position: 1,
    points: 3,
    played: 1,
    won: 1,
    drawn: 0,
    lost: 0,
    goalsFor: 3,
    goalsAgainst: 2,
    goalDifference: 1,
    img: lions
  },
  {
    id: 8,
    team: "ATLÉTICO RF",
    group: "B",
    position: 2,
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    img: atletico
  },
  {
    id: 9,
    team: "VILLAREAL",
    group: "B",
    position: 3,
    points: 0,
    played: 1,
    won: 0,
    drawn: 0,
    lost: 1,
    goalsFor: 2,
    goalsAgainst: 3,
    goalDifference: -1,
    img: vilarreal
  },
  {
    id: 10,
    team: "GOLDEN WARRIOS",
    group: "B",
    position: 4,
    points: 3,
    played: 1,
    won: 1,
    drawn: 0,
    lost: 0,
    goalsFor: 3,
    goalsAgainst: 2,
    goalDifference: 1,
    img: goden
  },
  {
    id: 11,
    team: "CA NOTTS",
    group: "B",
    position: 5,
    points: 0,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    img: notts
  },
  {
    id: 12,
    team: "OS LISOS TEAM",
    group: "B",
    position: 6,
    points: 0,
    played: 1,
    won: 0,
    drawn: 0,
    lost: 1,
    goalsFor: 2,
    goalsAgainst: 3,
    goalDifference: -1,
    img: lisos
  },
];


export const topScorers = [
  { name: "Robinho", team: "THUNDER FC", goals: 3 },
  { name: "Willian. G", team: "THUNDER FC", goals: 2 },
  { name: "David", team: "GOLDEN WARRIOS", goals: 2 },
  { name: "Diniz", team: "LIONS FC", goals: 1 },
  { name: "Evanuel", team: "LIONS FC", goals: 1 },
];

export const bestDefenses = [
  { team: "THUNDER FC", goalsAgainst: 1, cleanSheets: 0 },
  { team: "LIONS FC", goalsAgainst: 2, cleanSheets: 0 },
  { team: "GOLDEN WARRIOS", goalsAgainst: 2, cleanSheets: 0 },
];

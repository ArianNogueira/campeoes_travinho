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
    points: 9,
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalsFor: 11,
    goalsAgainst: 6,
    goalDifference: 5,
    img: inter
  },
  {
    id: 2,
    team: "THUNDER FC",
    group: "A",
    position: 2,
    points: 9,
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalsFor: 23,
    goalsAgainst: 8,
    goalDifference: 15,
    img: thunder
  },
  {
    id: 3,
    team: "TITANS FC",
    group: "A",
    position: 3,
    points: 6,
    played: 3,
    won: 2,
    drawn: 0,
    lost: 1,
    goalsFor: 11,
    goalsAgainst: 5,
    goalDifference: 6,
    img: titans
  },
  {
    id: 4,
    team: "FALCON FC",
    group: "A",
    position: 4,
    points: 3,
    played: 3,
    won: 1,
    drawn: 0,
    lost: 2,
    goalsFor: 8,
    goalsAgainst: 19,
    goalDifference: -11,
    img: falcon
  },
  {
    id: 5,
    team: "TG FC",
    group: "A",
    position: 5,
    points: 0,
    played: 3,
    won: 0,
    drawn: 0,
    lost: 3,
    goalsFor: 6,
    goalsAgainst: 15,
    goalDifference: -9,
    img: tungo
  },
  {
    id: 6,
    team: "FC DALLAS",
    group: "A",
    position: 6,
    points: 0,
    played: 3,
    won: 0,
    drawn: 0,
    lost: 3,
    goalsFor: 6,
    goalsAgainst: 12,
    goalDifference: -6,
    img: dallas
  },

  // Grupo B
  {
    id: 7,
    team: "LIONS FC",
    group: "B",
    position: 1,
    points: 3,
    played: 3,
    won: 1,
    drawn: 0,
    lost: 2,
    goalsFor: 6,
    goalsAgainst: 11,
    goalDifference: -5,
    img: lions
  },
  {
    id: 8,
    team: "ATLÉTICO RF",
    group: "B",
    position: 2,
    points: 3,
    played: 3,
    won: 1,
    drawn: 0,
    lost: 2,
    goalsFor: 10,
    goalsAgainst: 7,
    goalDifference: -3,
    img: atletico
  },
  {
    id: 9,
    team: "VILLAREAL",
    group: "B",
    position: 3,
    points: 4,
    played: 3,
    won: 1,
    drawn: 1,
    lost: 1,
    goalsFor: 7,
    goalsAgainst: 3,
    goalDifference: 4,
    img: vilarreal
  },
  {
    id: 10,
    team: "GOLDEN WARRIOS",
    group: "B",
    position: 4,
    points: 9,
    played: 3,
    won: 3,
    drawn: 0,
    lost: 0,
    goalsFor: 10,
    goalsAgainst: 3,
    goalDifference: 7,
    img: goden
  },
  {
    id: 11,
    team: "CA NOTTS",
    group: "B",
    position: 5,
    points: 3,
    played: 3,
    won: 1,
    drawn: 0,
    lost: 2,
    goalsFor: 5,
    goalsAgainst: 9,
    goalDifference: -4,
    img: notts
  },
  {
    id: 12,
    team: "OS LISOS TEAM",
    group: "B",
    position: 6,
    points: 4,
    played: 3,
    won: 1,
    drawn: 1,
    lost: 1,
    goalsFor: 7,
    goalsAgainst: 6,
    goalDifference: 1,
    img: lisos
  },
];


export const topScorers = [
  { name: "Robinho", team: "THUNDER FC", goals: 11 },
  { name: "Robgol", team: "CM INTER MIAMI", goals: 6 },
  { name: "Ítalo", team: "THUNDER FC", goals: 6 },
  { name: "Joanderson", team: "TITANS FC", goals: 5 },
  { name: "David", team: "GOLDEN WARRIOS", goals: 4 },
  { name: "Renan", team: "TITANS FC", goals: 4 },
  { name: "CL", team: "VILARREAL", goals: 3 },
];

export const bestDefenses = [
  { team: "VILARREAL", goalsAgainst: 3, cleanSheets: 1 },
  { team: "GOLDEN WARRIOS", goalsAgainst: 3, cleanSheets: 0 },
  { team: "TITANS FC", goalsAgainst: 5, cleanSheets: 0 },
];

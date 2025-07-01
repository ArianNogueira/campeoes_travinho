import type { StaticImageData } from "next/image";

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

export const emblemMap: Record<string, StaticImageData> = {
  "CM INTER MIAMI": inter,
  "THUNDER FC": thunder,
  "TITANS FC": titans,
  "FALCON FC": falcon,
  "TG FC": tungo,
  "FC DALLAS": dalas,
  "LIONS FC": lions,
  "ATLÉTICO RF": atletico,
  VILARREAL: vilarreal,
  "GOLDEN WARRIOS": golden,
  "CA NOTTS": notts,
  "OS LISOS TEAM": lisos,
};

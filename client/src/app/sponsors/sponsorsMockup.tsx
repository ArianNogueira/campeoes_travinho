import vnx from "@/assets/VNX.jpeg";
import js from "@/assets/JS.jpeg";
import hw from "@/assets/HW.jpeg";
import vieira from "@/assets/VIEIRA.jpeg";
import ph from "@/assets/PH.jpeg";
import net from "@/assets/MARANHAO_NET.jpeg";
import wg from "@/assets/WG.jpeg";
import prefeitura from "@/assets/PREFEITURA.jpeg";
import jo from "@/assets/JO.jpeg";
import { StaticImageData } from "next/image";

interface Sponsor {
  id: number;
  name: string;
  insta: string;
  logo: string | StaticImageData; // URL ou caminho da imagem
  instagram: string; // Link para o Instagram
}

const sponsors: Sponsor[] = [
  {
    id: 1,
    name: "JS STORE",
    insta: "js.store_oficial",
    logo: js,
    instagram:
      "https://www.instagram.com/js.store_oficial?igsh=ajRta2hhaXN6cDBt",
  },
  {
    id: 2,
    name: "JOÃO DE OLIVEIRA",
    insta: "joaodeoliveirapfb",
    logo: jo,
    instagram:
      "https://www.instagram.com/joaodeoliveirapfb?igsh=MXhmbXVkOG45N3VweQ==",
  },
  {
    id: 3,
    name: "DEP. HEMETERIO WEBA",
    insta: "hemeterioweba",
    logo: hw,
    instagram:
      "https://www.instagram.com/hemeterioweba?igsh=MW9uZDU0MmdtYjdpdg==",
  },
  {
    id: 4,
    name: "PAULO HENRIQUE",
    insta: "paulohenrique.team",
    logo: ph,
    instagram:
      "https://www.instagram.com/paulohenrique.team?igsh=dXM2MGQzeHhkejVp",
  },
  {
    id: 5,
    name: "MARANHÃO NET",
    insta: "maranhaonetbaixada",
    logo: net,
    instagram:
      "https://www.instagram.com/maranhaonetbaixada?igsh=MWhocmVkd3A4emI5eQ==",
  },
  {
    id: 6,
    name: "VNX ENGENHARIA & SERVIÇOS",
    insta: "vnx_engenharia",
    logo: vnx,
    instagram:
      "https://www.instagram.com/vnx_engenharia?igsh=MWpoNTI3cHh4bHU2dQ==",
  },
  {
    id: 7,
    name: "VIEIRA COMERÉCIO E HORTIFRUTI",
    insta: "vieiracomerciohortifruti",
    logo: vieira,
    instagram:
      "https://www.instagram.com/vieiracomerciohortifruti?igsh=MXVzdTFmamdhcDRlcQ==",
  },
  {
    id: 8,
    name: "WG VEÍCULOS",
    insta: "wgveiculos_mzl",
    logo: wg,
    instagram: "https://www.instagram.com/wgveiculos_mzl?igsh=cXU2ejZhNnNnbjZl",
  },
  {
    id: 9,
    name: "SECRETARIA MUNICIPAL DE ESPORTES DE MIRINZAL",
    insta: "prefeiturademirinzal.oficial",
    logo: prefeitura,
    instagram:
      "https://www.instagram.com/prefeiturademirinzal.oficial?igsh=MTM0YjdpMHkxYWN5NQ==",
  },
  // Adicione mais patrocinadores aqui
];

export default sponsors;

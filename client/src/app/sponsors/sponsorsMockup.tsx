import vnx from "@/assets/VNX.png";
import js from "@/assets/JS.jpeg";
import hw from "@/assets/HW.png";
import vieira from "@/assets/VIEIRA.png";
import ph from "@/assets/PH.jpeg";
import net from "@/assets/MARANHAO_NET.png";
import wg from "@/assets/WG.jpeg";
import prefeitura from "@/assets/PREFEITURA.png";
import jo from "@/assets/JO.png";
import { StaticImageData } from "next/image";

interface Sponsor {
  id: number;
  name: string;
  mensage: string;
  insta: string;
  logo: string | StaticImageData;
  instagram: string;
}

const sponsors: Sponsor[] = [
  {
    id: 1,
    name: "JS STORE",
    mensage:
      "Conheça a JS STORE! Aqui você encontra tudo para seu smartphone! Trabalhamos com acessórios e equipamentos para as principais marcas do mercado, como iPhone, Samsung e Xiaomi. Qualidade, confiança e variedade em um só lugar!",
    insta: "js.store_oficial",
    logo: js,
    instagram:
      "https://www.instagram.com/js.store_oficial?igsh=ajRta2hhaXN6cDBt",
  },
  {
    id: 2,
    name: "JOÃO DE OLIVEIRA",
    mensage:
      "Gostaríamos de parabenizar o Secretário de Cultura, João Oliveira, pelo excelente trabalho à frente da pasta. Sua dedicação à valorização da cultura local e incentivo às expressões artísticas tem feito a diferença para nossa comunidade. Que o compromisso com a arte, a educação e a diversidade cultural siga inspirando novos projetos e transformações",
    insta: "joaodeoliveirapfb",
    logo: jo,
    instagram:
      "https://www.instagram.com/joaodeoliveirapfb?igsh=MXhmbXVkOG45N3VweQ==",
  },
  {
    id: 3,
    name: "DEP. HEMETERIO WEBA",
    mensage:
      "Nosso reconhecimento ao Deputado Hemetério Weba pelo trabalho comprometido em prol do desenvolvimento do Maranhão. Sua atuação firme e presente em diversas regiões tem contribuído para avanços importantes nas áreas de infraestrutura, saúde e bem-estar da população. Que o seu mandato continue sendo sinônimo de dedicação e resultados para o nosso povo",
    insta: "hemeterioweba",
    logo: hw,
    instagram:
      "https://www.instagram.com/hemeterioweba?igsh=MW9uZDU0MmdtYjdpdg==",
  },
  {
    id: 4,
    name: "PAULO HENRIQUE",
    mensage:
      "Parabenizamos o Personal e Professor Paulo Henrique pelo excelente trabalho e dedicação à promoção da saúde, bem-estar e qualidade de vida. Seu comprometimento com o desempenho e a evolução de cada aluno é inspiração para todos que buscam uma vida mais ativa e equilibrada. Sucesso sempre nessa missão de transformar vidas através do esporte!",
    insta: "paulohenrique.team",
    logo: ph,
    instagram:
      "https://www.instagram.com/paulohenrique.team?igsh=dXM2MGQzeHhkejVp",
  },
  {
    id: 5,
    name: "MARANHÃO NET",
    mensage:
      "A Maranhão Net conecta você ao mundo com a melhor internet da Baixada! Velocidade, estabilidade e atendimento de qualidade para transformar sua experiência online. Seja para trabalhar, estudar ou se divertir, a escolha certa é Maranhão Net – conectando sonhos, aproximando pessoas.",
    insta: "maranhaonetbaixada",
    logo: net,
    instagram:
      "https://www.instagram.com/maranhaonetbaixada?igsh=MWhocmVkd3A4emI5eQ==",
  },
  {
    id: 6,
    name: "VNX ENGENHARIA & SERVIÇOS",
    mensage:
      "A VNX Engenharia & Serviços é sinônimo de compromisso, qualidade e eficiência. Atuando com excelência em projetos, obras e soluções técnicas, a VNX se destaca pelo profissionalismo e pela entrega de resultados que transformam realidades. Construindo com responsabilidade, servindo com inovação.",
    insta: "vnx_engenharia",
    logo: vnx,
    instagram:
      "https://www.instagram.com/vnx_engenharia?igsh=MWpoNTI3cHh4bHU2dQ==",
  },
  {
    id: 7,
    name: "VIEIRA COMERÉCIO E HORTIFRUTI",
    mensage:
      "No Vieira Comércio e Hortifruti, você encontra qualidade, frescor e atendimento de confiança todos os dias! Frutas, verduras e produtos selecionados com carinho para levar saúde e sabor à sua mesa. Aqui, o compromisso é com você e sua família!",
    insta: "vieiracomerciohortifruti",
    logo: vieira,
    instagram:
      "https://www.instagram.com/vieiracomerciohortifruti?igsh=MXVzdTFmamdhcDRlcQ==",
  },
  {
    id: 8,
    name: "WG VEÍCULOS",
    mensage:
      "WG Veículos – Sua melhor opção em carros e motos, novos e seminovos! Variedade, qualidade e condições especiais para você sair de veículo novo com total confiança. Venha conhecer nosso estoque e encontre o seu próximo companheiro de estrada!",
    insta: "wgveiculos_mzl",
    logo: wg,
    instagram: "https://www.instagram.com/wgveiculos_mzl?igsh=cXU2ejZhNnNnbjZl",
  },
  {
    id: 9,
    name: "SECRETARIA MUNICIPAL DE ESPORTES DE MIRINZAL",
    mensage:
      "Agradecemos imensamente à Secretaria Municipal de Esportes de Mirinzal pelo apoio e patrocínio fundamental ao nosso torneio. Graças a essa parceria, pudemos realizar um evento de qualidade, promovendo a união, o esporte e o lazer para toda a comunidade.",
    insta: "prefeiturademirinzal.oficial",
    logo: prefeitura,
    instagram:
      "https://www.instagram.com/prefeiturademirinzal.oficial?igsh=MTM0YjdpMHkxYWN5NQ==",
  },
  // Adicione mais patrocinadores aqui
];

export default sponsors;

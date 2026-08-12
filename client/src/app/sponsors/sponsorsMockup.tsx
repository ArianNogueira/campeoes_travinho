import vnx from "@/assets/VNX.png";
import js from "@/assets/JS.jpeg";
import net from "@/assets/MARANHAO_NET.png";
import wg from "@/assets/WG.jpeg";
import prefeitura from "@/assets/PREFEITURA.png";
import jo from "@/assets/JO.png";
import mundo from "@/assets/MundoX.jpg";
import kl from "@/assets/KL_Construções.jpg";
import ev from "@/assets/EV.jpg";
import arnon from "@/assets/Arnon.jpg";
import lojao from "@/assets/Lojao_Popular.jpg";
import br from "@/assets/BR.jpg";
import popular from "@/assets/Popular_20_25.jpg";
import waldir from "@/assets/Waldir.jpg";

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
    name: "MARANHÃO NET",
    mensage:
      "A Maranhão Net conecta você ao mundo com a melhor internet da Baixada! Velocidade, estabilidade e atendimento de qualidade para transformar sua experiência online. Seja para trabalhar, estudar ou se divertir, a escolha certa é Maranhão Net – conectando sonhos, aproximando pessoas.",
    insta: "maranhaonetbaixada",
    logo: net,
    instagram:
      "https://www.instagram.com/maranhaonetbaixada?igsh=MWhocmVkd3A4emI5eQ==",
  },
  {
    id: 2,
    name: "WG VEÍCULOS",
    mensage:
      "WG Veículos – Sua melhor opção em carros e motos, novos e seminovos! Variedade, qualidade e condições especiais para você sair de veículo novo com total confiança. Venha conhecer nosso estoque e encontre o seu próximo companheiro de estrada!",
    insta: "wgveiculos_mzl",
    logo: wg,
    instagram: "https://www.instagram.com/wgveiculos_mzl?igsh=cXU2ejZhNnNnbjZl",
  },
  {
    id: 3,
    name: "SECRETARIA MUNICIPAL DE ESPORTES DE MIRINZAL",
    mensage:
      "Agradecemos imensamente à Secretaria Municipal de Esportes de Mirinzal pelo apoio e patrocínio fundamental ao nosso torneio. Graças a essa parceria, pudemos realizar um evento de qualidade, promovendo a união, o esporte e o lazer para toda a comunidade.",
    insta: "prefeiturademirinzal.oficial",
    logo: prefeitura,
    instagram:
      "https://www.instagram.com/prefeiturademirinzal.oficial?igsh=MTM0YjdpMHkxYWN5NQ==",
  },
  {
    id: 4,
    name: "JS STORE",
    mensage:
      "Conheça a JS STORE! Aqui você encontra tudo para seu smartphone! Trabalhamos com acessórios e equipamentos para as principais marcas do mercado, como iPhone, Samsung e Xiaomi. Qualidade, confiança e variedade em um só lugar!",
    insta: "js.store_oficial",
    logo: js,
    instagram:
      "https://www.instagram.com/js.store_oficial?igsh=ajRta2hhaXN6cDBt",
  },
  {
    id: 5,
    name: "JOÃO DE OLIVEIRA",
    mensage:
      "Gostaríamos de parabenizar o Secretário de Cultura, João Oliveira, pelo excelente trabalho à frente da pasta. Sua dedicação à valorização da cultura local e incentivo às expressões artísticas tem feito a diferença para nossa comunidade. Que o compromisso com a arte, a educação e a diversidade cultural siga inspirando novos projetos e transformações",
    insta: "joaodeoliveirapfb",
    logo: jo,
    instagram:
      "https://www.instagram.com/joaodeoliveirapfb?igsh=MXhmbXVkOG45N3VweQ==",
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
    name: "MUNDO X",
    mensage:
      "A MUNDO X tem tudo para acompanhar você no dia a dia! Encontre acessórios de informática, garrafas, relógios e muito mais, sempre com variedade, qualidade e aquele atendimento especial. Seja para trabalhar, estudar, se divertir ou simplesmente deixar sua rotina mais prática, a escolha certa é MUNDO X – acessórios para todos os momentos, do seu jeito!",
    insta: "",
    logo: mundo,
    instagram:
      "",
  },
  {
    id: 8,
    name: "KL CONSTRUÇÕES",
    mensage:
      "A KL CONSTRUÇÕES é sua parceira para construir, reformar e transformar seus projetos em realidade! Materiais de construção, qualidade, variedade e atendimento de confiança para você encontrar tudo o que precisa para sua obra. Seja para uma pequena reforma ou uma grande construção, a escolha certa é KL CONSTRUÇÕES – construindo sonhos, realizando projetos!",
    insta: "",
    logo: kl,
    instagram:
      "",
  },
  {
    id: 9,
    name: "EV EMPREENDIMENTOS",
    mensage:
      "A EV EMPREENDIMENTOS transforma oportunidades em grandes conquistas! Soluções, qualidade e compromisso para ajudar você a encontrar o que precisa e alcançar seus objetivos. Seja para investir, realizar um projeto ou dar um novo passo na vida, a escolha certa é EV EMPREENDIMENTOS – construindo oportunidades, realizando sonhos!",
    insta: "",
    logo: ev,
    instagram:
      "",
  },
  {
    id: 10,
    name: "LOJÃO POPULAR",
    mensage:
      "O LOJÃO POPULAR veste você com estilo, variedade e aquele preço que cabe no bolso! Roupas para todos os momentos, com opções para você renovar o visual e encontrar o look ideal para cada ocasião. Seja para o dia a dia, uma ocasião especial ou aquele passeio com a família, a escolha certa é LOJÃO POPULAR – moda, preço e estilo para todos!",
    insta: "",
    logo: lojao,
    instagram:
      "",
  },
  {
    id: 11,
    name: "BR ENGENHARIA",
    mensage:
      "A BR ENGENHARIA transforma projetos em realidade com qualidade, precisão e compromisso! Soluções em engenharia, experiência e responsabilidade para garantir segurança e eficiência em cada etapa. Seja para construir, reformar ou tirar um grande projeto do papel, a escolha certa é BR ENGENHARIA – planejando, construindo e realizando sonhos!",
    insta: "",
    logo: br,
    instagram:
      "",
  },
  {
    id: 12,
    name: "POPULAR 20 e 25",
    mensage:
      "A POPULAR 20 e 25 tem tudo para deixar seu dia a dia mais completo, prático e econômico! Uma grande variedade de produtos, preços acessíveis e opções para toda a família, sempre com qualidade e aquele atendimento especial. Seja para renovar a casa, presentear alguém ou encontrar aquele item que estava procurando, a escolha certa é POPULAR 20 e 25 – variedade, economia e praticidade em um só lugar!",
    insta: "",
    logo: popular,
    instagram:
      "",
  },
  {
    id: 13,
    name: "ARNON RICARDO",
    mensage:
      "Nosso agradecimento especial ao Arnon Ricardo Personal pelo apoio e patrocínio! Profissional dedicado à preparação física, saúde e qualidade de vida, o Arnon também acredita na força do esporte e apoia nosso projeto",
    insta: "",
    logo: arnon,
    instagram:
      "",
  },
  {
    id: 14,
    name: "WALDIR DE DESPACHANTE",
    mensage:
      "Nosso agradecimento especial ao companheiro Waldir pelo apoio e patrocínio! Sua parceria é fundamental para fortalecer nosso projeto e fazer a diferença. Agradecemos pela confiança, pelo incentivo e por acreditar no nosso trabalho.",
    insta: "",
    logo: waldir,
    instagram:
      "",
  },
];

export default sponsors;


type NewsItem = {
  id: number;
  title: string;
  date: string;
  summary: string;
};


export const news: NewsItem[] = [
  {
    id: 1,
    title: "Campeonato começa em 02 de Julho!",
    date: "2025-06-15",
    summary:
      "Preparem-se! A primeira rodada do Campeonato de Travinha será realizada no estádio das luzes com jogos emocionantes.",
  },
  {
    id: 2,
    title: "Time 'Thunder FC' reforça elenco",
    date: "2025-06-10",
    summary:
      "Os Thunder FC anunciam contratações importantes para fortalecer o time na busca pelo título.",
  },
  {
    id: 3,
    title: "Novas regras aprovadas para as partidas",
    date: "2025-06-08",
    summary:
      "A organização divulgou novas regras para garantir maior competitividade e fair play durante o campeonato.",
  },
  {
    id: 4,
    title: "Equipe do Villareal irá fazer sua estreia no campeonato",
    date: "2025-06-14",
    summary:
      "A equipe terá sua 1ª participação no campeonato, trazendo um novo desafio para os adversários.",
  },
];
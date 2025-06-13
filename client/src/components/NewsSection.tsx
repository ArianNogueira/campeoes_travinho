import NewsCard from "./NewsCard";

type NewsItem = {
  id: number;
  title: string;
  date: string;
  summary: string;
};

const news: NewsItem[] = [
  {
    id: 1,
    title: "Campeonato começa no próximo sábado!",
    date: "2025-06-15",
    summary:
      "Preparem-se! A primeira rodada do Campeonato de Travinha da Baixada será realizada no estádio municipal com jogos emocionantes.",
  },
  {
    id: 2,
    title: "Time 'Os Feras' reforça elenco",
    date: "2025-06-10",
    summary:
      "Os Feras anunciam contratações importantes para fortalecer o time na busca pelo título.",
  },
  {
    id: 3,
    title: "Novas regras aprovadas para as partidas",
    date: "2025-06-08",
    summary:
      "A organização divulgou novas regras para garantir maior competitividade e fair play durante o campeonato.",
  },
];

export default function NewsSection() {
  return (
    <div className="max-w-6xl py-10 mx-auto p-o">
      <h1 className="text-3xl font-bold text-[#102f4c] mb-8">
        Últimas Notícias
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-1">
        {news.map(({ id, title, date, summary }) => (
          <NewsCard
            key={id}
            title={title}
            date={date}
            description={summary}
            imageUrl="#"
          />
        ))}
      </div>
    </div>
  );
}

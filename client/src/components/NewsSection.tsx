import NewsCard from "./NewsCard";
import { news } from "@/components/mockNews";

export default function NewsSection() {
  return (
    <div className="max-w-6xl py-10 mx-auto px-5">
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

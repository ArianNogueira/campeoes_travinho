import NewsCard from "./NewsCard";
import { news } from "@/components/mockNews";
import "./scrolling.css"; // Importa o CSS com a animação

export default function NewsSection() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#102f4c] mb-6 text-center">
        Últimas Notícias
      </h1>

      <div className="overflow-hidden h-[400px] relative">
        <div className="animate-scrollNews space-y-4">
          {[...news, ...news].map(({ id, title, date, summary }, index) => (
            <NewsCard
              key={`${id}-${index}`}
              title={title}
              date={date}
              description={summary}
              imageUrl="#"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

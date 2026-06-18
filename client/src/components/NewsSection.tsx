"use client";

import { useCallback, useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { getNews, subscribeToTournamentChanges } from "@/services/tournamentService";
import type { NewsItem } from "@/types/tournament";
import "./scrolling.css";

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    try {
      setError(null);
      setNews(await getNews());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar notícias.");
    }
  }, []);

  useEffect(() => {
    loadNews();
    return subscribeToTournamentChanges(loadNews);
  }, [loadNews]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-center text-3xl font-bold text-[#102f4c]">
        Últimas Notícias
      </h1>

      {error ? (
        <p className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {news.length ? (
        <div className="relative h-[400px] overflow-hidden">
          <div className="animate-scrollNews space-y-4">
            {[...news, ...news].map((item, index) => (
              <NewsCard
                date={formatDate(item.published_at)}
                description={item.summary}
                imageUrl={item.image_url || undefined}
                key={`${item.id}-${index}`}
                title={item.title}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">
          Nenhuma notícia cadastrada.
        </p>
      )}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

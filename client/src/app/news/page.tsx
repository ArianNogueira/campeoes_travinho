"use client";

import { useCallback, useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";
import { getNews, subscribeToTournamentChanges } from "@/services/tournamentService";
import type { NewsItem } from "@/types/tournament";

export default function Noticias() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    try {
      setError(null);
      setNews(await getNews());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar notícias.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
    return subscribeToTournamentChanges(loadNews);
  }, [loadNews]);

  return (
    <div className="min-h-screen bg-[#fdfaf3] text-[#2d1f0f]">
      <div className="bg-[#557389] py-8 text-center text-white shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">
          Fique por dentro de tudo que acontece no campeonato
        </h1>
      </div>

      <div className="mx-auto max-w-6xl p-4">
        <h2 className="mt-5 text-center text-3xl font-bold text-[#102f4c]">
          Últimas Notícias
        </h2>

        {error ? (
          <div className="mx-auto mt-6 max-w-3xl rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <p className="py-12 text-center text-gray-500">Carregando notícias...</p>
        ) : news.length ? (
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <NewsCard
                date={formatDate(item.published_at)}
                description={item.summary}
                imageUrl={item.image_url || undefined}
                key={item.id}
                title={item.title}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-gray-500">
            Nenhuma notícia cadastrada.
          </p>
        )}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

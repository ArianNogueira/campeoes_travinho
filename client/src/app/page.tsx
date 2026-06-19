"use client";

import NewsSection from "@/components/NewsSection";
import TeamTable from "@/components/TeamTable";
import { Calendar, Trophy, Users, Target } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getHomeStats,
  subscribeToTournamentChanges,
  type HomeStats,
} from "@/services/tournamentService";

export default function Home() {
  const [homeStats, setHomeStats] = useState<HomeStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const loadHomeStats = useCallback(async () => {
    try {
      setStatsError(null);
      setHomeStats(await getHomeStats());
    } catch (err) {
      setStatsError(
        err instanceof Error ? err.message : "Erro ao carregar estatisticas."
      );
    }
  }, []);

  useEffect(() => {
    loadHomeStats();
    return subscribeToTournamentChanges(loadHomeStats);
  }, [loadHomeStats]);

  const summaryCards = useMemo(
    () => [
      {
        label: "Times Inscritos",
        value: homeStats ? String(homeStats.teams) : "-",
        icon: Users,
      },
      {
        label: "Jogos",
        value: homeStats ? String(homeStats.matches) : "-",
        icon: Trophy,
      },
      {
        label: "Jogadores",
        value: homeStats ? String(homeStats.players) : "-",
        icon: Target,
      },
      {
        label: "Proximos Jogos",
        value: homeStats ? String(homeStats.upcomingMatches) : "-",
        icon: Calendar,
      },
    ],
    [homeStats]
  );

  return (
    <div className="min-h-screen bg-[#d0bb94]">
      <section className="bg-gradient-to-r from-[#2b4d66] to-[#102f4c] py-16 text-[#d0bb94]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">
            O Maior Campeonato de Travinha da Baixada
          </h2>
          <p className="mb-8 text-xl text-[#718c99]">
            Muita emocao e o melhor do futebol amador
          </p>
          <div className="space-x-4">
            <Link href="/inscription" passHref>
              <button className="cursor-pointer rounded-lg bg-[#855b21] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#5e5035]">
                Inscrever Time
              </button>
            </Link>
            <Link href="/table" passHref>
              <button className="cursor-pointer rounded-lg border-2 border-[#d0bb94] px-8 py-3 font-semibold transition-colors hover:bg-[#d0bb94] hover:text-[#102f4c]">
                Ver Tabela
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#fdfaf3] py-12">
        <div className="container mx-auto px-4">
          {statsError ? (
            <p className="mx-auto mb-6 max-w-3xl rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {statsError}
            </p>
          ) : null}

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {summaryCards.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-lg bg-[#fffefb] p-6 text-center shadow-sm"
                >
                  <IconComponent className="mx-auto mb-3 h-8 w-8 text-[#2b4d66]" />
                  <div className="mb-1 text-2xl font-bold text-[#2d1f0f] md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#557489]">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <TeamTable />
      <NewsSection />
    </div>
  );
}

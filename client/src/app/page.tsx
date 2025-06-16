import NewsSection from "@/components/NewsSection";
import TeamTable from "@/components/TeamTable";
import { Calendar, Trophy, Users, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const stats = [
    { label: "Times Inscritos", value: "12", icon: Users },
    { label: "Jogos", value: "38", icon: Trophy },
    { label: "Jogadores", value: "72", icon: Target },
    { label: "Próximos Jogos", value: "02/07/2025", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-[#d0bb94]">
      <section className="bg-gradient-to-r from-[#2b4d66] to-[#102f4c] text-[#d0bb94] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            O Maior Campeonato de Travinha da Baixada
          </h2>
          <p className="text-xl mb-8 text-[#718c99]">
            12 times, muita emoção e o melhor do futebol amador
          </p>
          <div className="space-x-4">
            <Link href="/inscription" passHref>
              <button className="bg-[#855b21] hover:bg-[#5e5035] text-white cursor-pointer px-8 py-3 rounded-lg font-semibold transition-colors">
                Inscrever Time
              </button>
            </Link>
            <Link href="/table" passHref>
              <button className="border-2 border-[#d0bb94] hover:bg-[#d0bb94] cursor-pointer hover:text-[#102f4c] px-8 py-3 rounded-lg font-semibold transition-colors">
                Ver Tabela
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#fdfaf3]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-[#fffefb] rounded-lg shadow-sm"
                >
                  <IconComponent className="h-8 w-8 mx-auto mb-3 text-[#2b4d66]" />
                  <div className="text-2xl md:text-3xl font-bold text-[#2d1f0f] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-[#557489] text-sm">{stat.label}</div>
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

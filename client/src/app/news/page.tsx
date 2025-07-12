import { NextPage } from "next";
import Head from "next/head";
import NewsCard from "@/components/NewsCard";
import { news } from "@/components/mockNews";
import imageUrl from "@/assets/WhatsApp Image 2025-07-11 at 21.29.08.jpeg";
import Image from "next/image";

const Noticias: NextPage = () => {
  return (
    <>
      <Head>
        <title>Notícias | Campeonato Master</title>
        <meta
          name="description"
          content="Últimas notícias do campeonato master"
        />
      </Head>

      <div className="min-h-screen bg-[#fdfaf3] text-[#2d1f0f]">
        <div className="bg-[#557389] py-8 text-center text-white shadow-md">
          <h1 className="text-3xl font-bold tracking-wide">
            Fique por dentro de tudo que acontece no campeonato
          </h1>
        </div>

        <div className="max-w-6xl p-4 mx-auto">
          <h1 className="text-3xl font-bold text-[#102f4c] mt-5 text-center">
            Últimas Notícias
          </h1>

          <div className="grid max-w-6xl gap-8 px-6 py-12 mx-auto md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                description={item.summary}
                date={item.date}
              />
            ))}
            <div className="rounded-2xl overflow-hidden shadow-lg bg-[#f8f6f2] border border-[#d0bb94] transition-transform hover:scale-[1.01]">
              <Image
                src={imageUrl}
                alt="jogador bebendo"
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-[#2d1f0f] mb-2">
                  🔥 Crise no CA NOTTS se aprofunda
                </h3>
                <p className="text-sm text-[#5e5035] mb-3">
                  Em meio à má fase e derrotas, um jogador do CA NOTTS foi
                  flagrado curtindo em um bar 🍻. Ao ser questionado, afirmou
                  que o clima no elenco está tenso e há atraso de pagamento.
                </p>
                <span className="text-xs text-[#718c99]">11/07/2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Noticias;

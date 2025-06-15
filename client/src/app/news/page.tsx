import { NextPage } from "next";
import Head from "next/head";
import NewsCard from "@/components/NewsCard";
import { news } from "@/components/mockNews";

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
          </div>
        </div>
      </div>
    </>
  );
};

export default Noticias;

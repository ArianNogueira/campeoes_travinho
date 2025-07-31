// import Image from "next/image";
import React from "react";

interface NewsCardProps {
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  description,
  date,
  //   imageUrl,
}) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg bg-[#f8f6f2] border border-[#d0bb94] transition-transform hover:scale-[1.01]">
      {/* <Image src={imageUrl} alt={title} className="object-cover w-full h-48" /> */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-[#2d1f0f] mb-2">{title}</h3>
        <p className="text-sm text-[#5e5035] mb-3 whitespace-pre-line">
          {description}
        </p>
        <span className="text-xs text-[#718c99]">{date}</span>
      </div>
    </div>
  );
};

export default NewsCard;

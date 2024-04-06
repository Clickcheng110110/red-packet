"use client";

import { useRouter } from "next/navigation";

export interface CardProps {
  title: string;
  description: string;
  date: string;
}

function Index({ title, description, date }: CardProps) {
  const router = useRouter();
  return (
    <div className="p-[16px] mx-[16px] md:mx-0 md:p-[24px] bg-[#131415] rounded-[16px]">
      <h4 className="text-[18px] font-medium text-[#E6E6E6] line-clamp-2 leading-[24px]">
        {title}
      </h4>
      <p className="text-[14px] leading-[22px] line-clamp-3 mt-2 font-[400]">
        {description}
      </p>
      <div className="flex justify-between mt-[20px]">
        <p className="py-[8px] text-[#3D404E] text-[12px]">{date}</p>
        <button
          onClick={() => {
            router.push(`/detail/${title}`);
          }}
          className="inline-flex items-center justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-sm px-4 py-2 h-[32px] font-medium text-white rounded-full border-white border-[1px] hover:bg-white hover:text-black hover:font-bold bg-transparent"
        >
          Get{" "}
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            className="ml-2 h-4 w-4 scale-150"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18.25 15.5a.75.75 0 0 1-.75-.75V7.56L7.28 17.78a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L16.44 6.5H9.25a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
export default Index;

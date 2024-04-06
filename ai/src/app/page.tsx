import { mockWords } from "@/data/mock";
import Card from "@/components/Card";
export default function Home() {
  const renderCard = () => {
    return mockWords.map((item) => {
      return <Card key={item.title} {...item} />;
    });
  };
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <img
        alt=""
        width="1440"
        height="460"
        decoding="async"
        data-nimg="1"
        className="absolute z-0 m-auto"
        src="/homeBg.webp"
        style={{
          color: "transparent",
          objectFit: "contain",
          minHeight: "460px",
          objectPosition: "center center",
        }}
      ></img>
      <div className="w-full max-w-3xl md:max-w-6xl flex flex-col items-center">
        <h2 className="text-[48px] text-[#E6E6E6] font-[500] text-center leading-none max-w-[800px] mt-[132px]">
          <span className="text-gradient" datatype="Mapping the Web3 Knowledge">
            Mapping the Web3 Knowledge
          </span>
        </h2>
        <h2 className="text-[36px] text-[#E6E6E6] font-[500] text-center leading-1 mt-4">
          Building the largest open knowledge graph autonomously by our Web3
          community, covering various Web3 topics and fostering a robust crypto
          culture community.
        </h2>
      </div>
      <div className="w-full">
        <h3 className="text-[18px] text-[#E6E6E6] font-[500] mt-[60px] md:mb-[24px] mb-[12px] mx-[16px] md:mx-0">
          There are some hot wards for you to explore
        </h3>
        <div className="tools-card-grid-column">{renderCard()}</div>
      </div>
    </main>
  );
}

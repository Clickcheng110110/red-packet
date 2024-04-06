function Index() {
  return (
    <div className="fixed left-0 top-0 z-20 w-full bg-black">
      <div className="flex w-full h-[80px] fixed top-0 z-10 px-2 bg-black">
        <div className="m-auto flex w-full max-w-3xl md:max-w-6xl justify-between items-center">
          <div className="flex items-center md:gap-16 gap-0">
            <div className="hidden md:block">
              <ul className="flex text-[#E6E6E6] gap-16 items-center undefined">
                <li className="cursor-pointer">
                  <a className=" font-[600]" href="/">
                    Home
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a className="" href="/airdrop">
                    Airdrop
                  </a>
                </li>
                <li className="cursor-pointer">
                  <a className=" opacity-50 cursor-not-allowed" href="/airdrop">
                    Content Mining
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-white flex md:gap-4 gap-[4px] items-center">
            <a className=" opacity-50 cursor-not-allowed" href="/airdrop">
              Explore the Graph
            </a>
            {/* <button
              className="wallet-adapter-button wallet-adapter-button-trigger"
              type="button"
              style={{
                pointerEvents: "auto",
                background: "white",
                borderRadius: "240px",
                paddingTop: "0px",
                paddingBottom: "0px",
                height: "32px",
                color: "black",
              }}
            >
              Connect Wallet
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;

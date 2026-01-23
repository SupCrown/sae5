import cerclePng from "../assets/images/cercle.png";

export default function NextProduct() {
  return (
    <div className="relative h-[768px] bg-white text-black flex flex-col">

      {/* CONTENU CENTRAL */}
      <div className="flex-1 flex flex-col items-center justify-start gap-6">
        <img
          src={cerclePng}
          alt=""
          className="pointer-events-none select-none absolute top-[70px] left-1/2 -translate-x-1/2 w-[350px] opacity-25"
        />

        <img
          src={cerclePng}
          alt=""
          className="pointer-events-none select-none absolute top-[200px] left-[60px] w-[350px] opacity-25"
        />

        <h1 className="text-[70px] font-bold">Prochain colis</h1>
        <h2 className="text-[90px] font-bold m-[0px]">I 008 0023 04</h2>
        <h3 className="text-lg font-semibold m-[0px]">Effectué : X</h3>
      </div>

      {/* ZONE BOUTONS (BAS DE PAGE) */}
      <div className="flex justify-between items-end px-8 pb-8">
        <button className="bg-[#870000] text-white px-[100px] py-[100px] rounded-tr-[15px] text-[20px]">
          image
        </button>

        <button className="bg-[#000000] text-[#ffffff] px-[50px] py-[100px] rounded-tl-[15px] text-[20px]">
          COLIS MANQUANT
        </button>
      </div>
    </div>
  );
}

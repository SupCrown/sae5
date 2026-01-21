import chargement from "../assets/chargement.gif";

export default function DataLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-900 text-white">

      <h3 className="font-bold font-inter text-[30px] m-[5px]">
        Chargement des données
      </h3>

      <img src={chargement} alt="Chargement" className="w-40 h-40 mt-[70px]" />
    </div>
  );
}
import ProfileIcon from "../assets/images/ProfileIcon.png";
import cercles from "../assets/images/cercle.png";

function Dicter() {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundImage: `url(${cercles})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "white",
        }}
      >
        {/* Header */}
        <header className="w-full flex justify-between items-center p-4 bg-white shadow-md">
          <button className="text-xl">←</button>
          <img
            src={ProfileIcon}
            alt="Profile Icon"
            className="w-8 h-8 rounded-full"
          />
        </header>
  
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center">
            <div className="grid grid-cols-4 gap-4 text-lg font-semibold">
              <div>Zone</div>
              <div>Allée</div>
              <div>Empl.</div>
              <div>Niv.</div>
            </div>
  
            <p className="mt-4 text-gray-600">info complémentaire :</p>
            <p className="text-black font-bold">confirmé</p>
          </div>
  
          {/* Microphone Icon */}
          <div className="mt-10">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
              <div className="text-white text-2xl">🎤</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

export default Dicter;
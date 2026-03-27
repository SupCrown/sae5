import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import cerclePng from "../assets/images/cercle.png";


export default function AuthScreen() {
 const [codes, setCodes] = useState(["", "", ""]);
 const [status, setStatus] = useState("idle"); // idle | loading | error401 | error403
 const inputRefs = useRef([]);
 const navigate = useNavigate();


 useEffect(() => {
   if (inputRefs.current[0]) inputRefs.current[0].focus();
 }, []);


 const handleChange = async (e, index) => {
   const value = e.target.value;
   if (!/^[0-9]?$/.test(value)) return;


   setStatus("idle");
   const newCodes = [...codes];
   newCodes[index] = value;
   setCodes(newCodes);


   if (value && index < 2) {
     inputRefs.current[index + 1].focus();
   }


   if (value && index === 2) {
     const pin = newCodes.join("");
     setStatus("loading");
    
     try {
      const user = await authService.login(pin); 
      
      const role = user?.role || localStorage.getItem("role");

      console.log("Rôle détecté :", role);

      if (role === "ADMIN") {
        navigate("/gestion-prep");
      } else {
        navigate("/loading"); 
      }
    } catch (err) {
          if (err.message === "Identifiants incorrects") setStatus("error401");
          else if (err.message === "Accès refusé") setStatus("error403");
          else setStatus("errorServer");


       setCodes(["", "", ""]);
       inputRefs.current[0].focus();
     }
   }
 };


 const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (codes[index] === "" && index > 0) {
        const newCodes = [...codes];
        newCodes[index - 1] = ""; 
        setCodes(newCodes);
        inputRefs.current[index - 1].focus(); 
      }
    }
  };


 return (
   <div className="relative h-screen w-screen overflow-hidden bg-white flex flex-col items-center select-none">
     <div className="absolute top-0 left-0 w-full h-[6px] bg-[#870000] z-20" />


     {/* Cercles */}
     <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
       <img src={cerclePng} alt="" className="absolute top-[100px] left-1/2 -translate-x-1/2 w-[500px]" />
       <img src={cerclePng} alt="" className="absolute bottom-[80px] left-[250px] w-[420px]" />
       <img src={cerclePng} alt="" className="absolute bottom-[360px] right-[80px] w-[420px]" />
     </div>


     <div className="flex flex-col items-center mt-[160px] gap-16 z-10">
       <h1 className={`text-[80px] font-bold tracking-tight transition-all duration-300 ${status.includes('error') ? 'text-red-600 scale-105' : 'text-gray-900'}`}>
         {status === "error401" && "Code Incorrect"}
         {status === "error403" && "Accès Interdit"}
         {status === "idle" && "Identification"}
         {status === "loading" && "Vérification..."}
       </h1>


       <div className={`flex gap-10 ${status.includes('error') ? 'animate-shake' : ''}`}>
         {[0, 1, 2].map((i) => (
           <input
             key={i}
             ref={(el) => (inputRefs.current[i] = el)}
             type="password"
             value={codes[i]}
             disabled={status === "loading"}
             className={`w-[95px] h-[115px] bg-gray-200 border-2 text-center text-[60px] font-bold rounded-xl shadow-inner transition-all
               ${status.includes('error') ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-[#870000] focus:ring-4 focus:ring-[#870000]/20'}`}
             onChange={(e) => handleChange(e, i)}
             onKeyDown={(e) => handleKeyDown(e, i)}
           />
         ))}
       </div>
     </div>
   </div>
 );
}

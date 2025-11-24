import {useState} from "react";

const ResetButton = () => {
    const [isConfirming, setIsConfirming] = useState(false);


const handleReset = () => {
    localStorage.removeItem('ot_concursantes_votos');
    window.dispatchEvent(new Event('ot_vote_cast'));
    console.log("¡Votaciones reiniciadas!")

    setIsConfirming(false);
};

const handleClick = () => {
    if (isConfirming) {
        handleReset();
    } else {
        setIsConfirming(true);
        setTimeout(() => {
            setIsConfirming(false);
        }, 3000);
    }
}

return (
  <button
    onClick={handleClick}
    className={`
      px-5 py-2.5 rounded-xl font-semibold shadow-lg transition-all duration-300
      ${isConfirming
        ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/30 animate-pulse scale-105'
        : 'bg-gradient-to-br from-slate-700 to-slate-800 text-slate-100 hover:from-slate-600 hover:to-slate-700 shadow-slate-900/20 hover:scale-105 active:scale-95'
      }
    `}
  >
    {isConfirming ? '¡CONFIRMAR REINICIO!' : 'Reiniciar Votaciones'}
  </button>
);
};

export default ResetButton;
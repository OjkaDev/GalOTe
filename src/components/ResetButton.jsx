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
                px-4 py-2 rounded-lg font-semibold transition duration-300 shadow-md
                ${isConfirming 
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                }
            `}
        >
            {isConfirming ? '¡CONFIRMAR REINICIO! (3s)' : 'Reiniciar Votaciones'}
        </button>
    );
};

export default ResetButton;
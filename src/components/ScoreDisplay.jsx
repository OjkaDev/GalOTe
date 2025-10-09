import React, {useState, useEffect} from 'react';

const ScoreDisplay = ({ concursanteId }) => {
    const [scores, setScores] = useState(null);

    const getVotes = () => {  //Función que lee los votos del localStorage
        try {
            const storedVotes = localStorage.getItem('ot_concursantes_votos');
            if (storedVotes) {
                const votos = JSON.parse(storedVotes);
                return votos[concursanteId] || null;
            }
        } catch (e) {
            console.error("Error al leer localStorage:", e);
        }
        return null;
    };

    useEffect(() => { 
        // Carga las puntuaciones iniciales
        const initialScores = getVotes();
        setScores(initialScores);

        // Define el listener para futuras actualizaciones
        const updateScores = () => {
            setScores(getVotes());
        };

        window.addEventListener('ot_vote_cast', updateScores); //Evento global para re-rendedirzar.

        return () => window.removeEventListener('ot_vote_cast', updateScores); //Elimina el listener al desmontar el componente.
    }, [concursanteId]);

    if(!scores) {
        return <p className="text-center text-sm text-gray-500 mt-2">Sin votos registrados</p>
    }

    const totalScore = scores.Voz + scores.Actuacion + scores.General;
    const average = (totalScore / 3).toFixed(1);

     return (
        <div className="mt-3 pt-3 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-600 mb-2 text-center">Tus Últimos Votos:</h4>
            <div className="flex justify-around text-center">
                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">Voz</span>
                    <span className="text-lg font-bold text-indigo-700">{scores.Voz}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">Actuación</span>
                    <span className="text-lg font-bold text-indigo-700">{scores.Actuacion}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500">Media</span>
                    <span className="text-xl font-extrabold text-green-600">{average}</span>
                </div>
            </div>
        </div>
    );
};

export default ScoreDisplay;

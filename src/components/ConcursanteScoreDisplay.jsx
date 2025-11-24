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
  <div className="mt-4 pt-4 border-t border-slate-700">
    <h4 className="text-sm font-semibold text-slate-300 mb-3 text-center">
      Puntuación
    </h4>

    <div className="grid grid-cols-3 gap-3 text-center">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-slate-400">Voz</span>
        <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
          {scores.Voz}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-slate-400">Actuación</span>
        <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
          {scores.Actuacion}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-slate-400">Media</span>
        <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
          {average}
        </span>
      </div>
    </div>
  </div>
);
};

export default ScoreDisplay;

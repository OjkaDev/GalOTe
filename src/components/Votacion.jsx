import React, {useState} from "react";

const Categorias = ['Voz', 'Actuacion', 'General'];

const Votacion = ({ concursanteId, nombreConcursante, onVoteSuccess}) => { //Donde se guarda las puntuaciones.
    const [puntuaciones, setPuntuaciones] = useState ({
        Voz: '',
        Actuacion: '',
        General: '',
    });

const handleInputChange = (e) => {
    const {name, value } = e.target;

    let numValue = Math.max(0, Math.min(10, parseFloat(value) || 0));

    setPuntuaciones(prev => ({
        ...prev,
        [name]: numValue === 0 && value === '' ? '' : numValue,
    }));
};

    const handleSubmit = (e) => {
        e.preventDefault();

        //Obtenemos los votos existentes de localStorage y lo inicializa
        const votos = JSON.parse(localStorage.getItem('ot_concursantes_votos') || '{}'); 
        //Guarda las puntuaciones para el concursante actual
        votos[concursanteId] = {
            id: concursanteId,
            nombre: nombreConcursante,
            Voz: parseFloat(puntuaciones.Voz) || 0,
            Actuacion: parseFloat(puntuaciones.Actuacion) || 0,
            General: parseFloat(puntuaciones.General) || 0,
        };

        //Guarda los votos actualizados
        localStorage.setItem('ot_concursantes_votos', JSON.stringify(votos));
        console.log(`Votación guardada para ${nombreConcursante}:`, votos[concursanteId]);

        window.dispatchEvent(new Event ('ot_vote_cast')); //Evento para re-renderizar las tarjetas.

        setPuntuaciones({ Voz: '', Actuacion: '', General: ''}); //Resetea y cierra el modal.
        if (onVoteSuccess) {
            onVoteSuccess();
        }
    }

return (
  <form onSubmit={handleSubmit} className="space-y-5">
    <div className="grid grid-cols-3 gap-3 text-center text-sm font-medium">
      {Categorias.map(cat => (
        <div
          key={cat}
          className="bg-slate-800/70 border border-slate-700 rounded-xl p-3 shadow-inner"
        >
          <label
            htmlFor={`${concursanteId}-${cat}`}
            className="text-xs text-slate-300 block mb-2"
          >
            {cat}
          </label>
          <input
            id={`${concursanteId}-${cat}`}
            name={cat}
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={puntuaciones[cat]}
            onChange={handleInputChange}
            className="w-full bg-transparent text-center text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 rounded-md"
            placeholder="0-10"
            required
          />
        </div>
      ))}
    </div>

    <button
      type="submit"
      className="w-full bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-fuchsia-500/20 hover:shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
    >
      Emitir voto
    </button>
  </form>
);
};
export default Votacion;

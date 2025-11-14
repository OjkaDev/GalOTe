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
    <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center text-sm font-medium">
                {Categorias.map(cat => (
                    <div key={cat} className="bg-white p-2 rounded-lg border border-gray-300">
                        <label htmlFor={`${concursanteId}-${cat}`} className="text-xs text-gray-500 block mb-1">
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
                            className="w-full text-center text-gray-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md border-none"
                            placeholder="0-10"
                            required
                        />
                    </div>
                ))}
            </div>

            <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md disabled:bg-gray-400"
            >
                Emitir Voto
            </button>
        </form>
    );
};
export default Votacion;

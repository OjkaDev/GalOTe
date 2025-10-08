import React, {useState} from "react";

const Categorias = ['Voz', 'Actuación', 'General'];

const Votacion = ({ concursanteId, nombreConcursante, onVoteSuccess}) => { //Donde se guarda las puntuaciones.
    const [puntuaciones, setPuntuaciones] = useState ({
        Voz: '',
        Actuación: '',
        General: '',
    });

const handleInputChange = (e) => {
    const {name, value } = e.target;

    let numValue = Math.max(0, Math.min(10, parseInt(value) || 0));

    setPuntuaciones(prev => ({
        ...prev,
        [name]: numValue === 0 && value === '' ? '' : numValue,
    }));
};

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(`Votando por ${nombreConcursante}:`, puntuaciones);

        setPuntuaciones({ Voz: '', Actuación: '', General: ''});
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
                            step="1"
                            value={puntuaciones[cat]}
                            onChange={handleInputChange}
                            className="w-full text-center text-gray-900 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md border-none"
                            placeholder="10"
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

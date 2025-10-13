import {useState, useEffect} from 'react';

const calculateAverage = (scores) => { // Calcula la media de un concursante
    if (!scores) return 0;
    const totalScore = scores.Voz + scores.Actuacion + scores.General;
    return totalScore / 3;
};

export const useVotationData = (concursantesIniciales) => { //Lee los votos, establece la media y clasifica
    const [concursantes, setConcursantes] = useState(concursantesIniciales);

    const updateClassification = () => {
        const storedVotes = localStorage.getItem('ot_concursantes_votos');
        const votos = storedVotes ? JSON.parse(storedVotes) : {};

        let listaClasificada = concursantesIniciales.map(concursante => {
            const scores = votos[concursante.id];
            const media = scores ? calculateAverage(scores) : -1; //Se establece -1 para no votados

                   return {
                ...concursante,
                media,
                isFavorito: false, 
                isNominado: false
            };
        });
        // Variable para clasficiar los expulsados y activos
        const activos = listaClasificada.filter(c => c.estado !== 'expulsado');
        const expulsados = listaClasificada.filter(c => c.estado === 'expulsado');

        activos.sort((a, b) => b.media - a.media); //Ordena por media descendente
        // Identifica al Favorito. Asegura que haya al menos uno y su media sea > 0 (Probablemente lo cambie para que detectes los activos y tengan votos)
        if (activos.length > 0 && activos[0].media > 0) {
            activos[0].isFavorito = true;
        }
        
        const numNominados = Math.min(4, activos.length);  //Identifica los nominados... Desactiva al favorito(Previene que si hay menos concursantes pueda ser nominable)
        if (numNominados > 0) {
            for (let i = activos.length - numNominados; i < activos.length; i++) {
                if (!activos[i].isFavorito) {
                    activos[i].isNominado = true;
                }
            }
        }

        setConcursantes([...activos, ...expulsados]); //Recombinar y actualizar el estado.
    };
    useEffect(() => { //Se ejecuta al iniciar la página
        updateClassification();
    }, []);

    useEffect(() => { // Escucha el evento 'ot_vote_cast'
        window.addEventListener('ot_vote_cast', updateClassification);
        return () => window.removeEventListener('ot_vote_cast', updateClassification);
    }, []);

    return concursantes;
}
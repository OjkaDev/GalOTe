import React from 'react';
import { useVotationData } from '../hooks/useVotationData';
import ConcursanteCard from './ConcursanteCard.astro'; 
import ModalWrapper from './ModalWrapper'; 
import { fade } from 'astro:transitions';

const VotationGrid = ({ initialData }) => {
    const concursantesClasificados = useVotationData(initialData);

   return (
        <div 
            // Esto es JSX, pero la transición de Astro solo aplica si el componente es Astro, 
            // así que la pondremos en index.astro sobre este componente.
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {concursantesClasificados.map((concursante) => (
                <ModalWrapper
                    client:load // client:load en ModalWrapper se mantiene
                    key={concursante.id} // Añadimos la key (sugerencia de mejora pendiente)
                    concursante={concursante}
                >
                    <ConcursanteCard
                        nombre={concursante.nombre}
                        estado={concursante.estado}
                        imagen={concursante.imagen}
                        id={concursante.id}
                        
                        // Nuevas props para la clasificación
                        isFavorito={concursante.isFavorito} 
                        isNominado={concursante.isNominado} 
                    />
                </ModalWrapper>
            ))} 
        </div>
    );
};

export default VotationGrid;
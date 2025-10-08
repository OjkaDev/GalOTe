import React, { useState } from "react";
import Votacion from "./Votacion"; 

const ModalWrapper = ({ concursante, children }) => {
    
    const [isModalOpen, setIsModalOpen] = useState(false); 

    // Función que muestra el modal
    const toggleModal = () => {
        setIsModalOpen(true);
    };

    const openModal = () => {
        // Inicia la View Transition
        if (concursante.estado==='expulsado'){
            console.log(` ${concursante.nombre} está expulsado.`)
            return;
        }

        if (document.startViewTransition) {
            
            // Llama a la API de transición y hace la animación
            document.startViewTransition(() => {
                toggleModal();
            });
            
        } else {
            // En caso que no sea compatible abre la modal sin animación
            toggleModal();
        }
    };

    const closeModal = () => {
        
       // Cierra el modal con animación
       const toggleModalClose = () => {
             setIsModalOpen(false);
       };

        if (document.startViewTransition) {

            // Llama a la API de transición y hace la animación
            document.startViewTransition(() => {
               toggleModalClose();
           });

        } else {
           // En caso que no sea compatible cierra la modal sin animación
           toggleModalClose();
       }
    };
    const isExpulsado = concursante.estado === 'expulsado'; //Es una constante booleana para poder filtrar entre los expulsados.

    return (
        <>
            {/* 1. La Tarjeta (Sigue siendo el botón para abrir la modal) */}
            <div onClick={isExpulsado ? undefined : openModal} className={isExpulsado ? 'cursor-not-allowed' : 'cursor-pointer'}>
                {children}
            </div>

            {/* 2. La Modal/Isla Flotante */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm p-4"
                    onClick={closeModal} 
                >
                    {/* Contenido de la Modal: Aumentado el ancho a max-w-2xl */}
                    <div 
                        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl transform transition-all duration-300 scale-100"
                        onClick={(e) => e.stopPropagation()} 
                    >
                        {/* Botón de Cierre (X) */}
                        <button 
                            onClick={closeModal}
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-3xl font-light"
                        >
                            &times;
                        </button>
                        
                        {/* CONTENEDOR PRINCIPAL: Flexbox para Imagen y Votación */}
                        <div className="flex flex-col md:flex-row gap-6"> 
                            
                            {/* COLUMNA 1: IMAGEN DEL CONCURSANTE (Ocupa 1/3) */}
                            <div className="w-full md:w-1/3 flex-shrink-0">
                                <img
                                    src={concursante.imagen}
                                    alt={`Foto de ${concursante.nombre}`}
                                    // Aspecto 1/1 y centrado
                                    className="w-full h-auto object-cover rounded-xl shadow-md"
                                />
                                <h2 className="text-2xl font-bold text-center text-gray-800 mt-3">
                                    {concursante.nombre}
                                </h2>
                                <p className="text-sm text-center text-indigo-500 font-semibold uppercase mt-1">
                                    Estado: {concursante.estado}
                                </p>
                            </div>

                            {/* COLUMNA 2: VOTACIÓN (Ocupa 2/3) */}
                            <div className="w-full md:w-2/3 pt-4 border-t md:border-t-0 md:border-l md:pl-6 border-gray-200">
                                <h3 className="text-xl font-semibold mb-4 text-gray-600">
                                    Puntuaciones (0-10)
                                </h3>
                                
                                <Votacion 
                                    concursanteId={concursante.id} 
                                    nombreConcursante={concursante.nombre}
                                    onVoteSuccess={closeModal}
                                />
                                
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalWrapper;
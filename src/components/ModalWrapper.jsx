import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        const handleOpenModal = (e) => {
            const { id } = e.detail || {};
            if (id === concursante.id) {
                openModal();
            }
        };

        window.addEventListener("ot_open_modal", handleOpenModal);
        return () => window.removeEventListener("ot_open_modal", handleOpenModal);
    }, [concursante]);

    return (
  <>
    {/* Tarjeta */}
    <div
      onClick={isExpulsado ? undefined : openModal}
      className={
        isExpulsado
          ? 'cursor-not-allowed opacity-60'
          : 'cursor-pointer group'
      }
    >
      {children}
    </div>

    {/* Modal */}
    {isModalOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur p-4 transition-all"
        onClick={closeModal}
      >
        <div
          className="relative bg-slate-800/90 border border-slate-700 rounded-2xl shadow-2xl shadow-purple-900/20 w-full max-w-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 grid place-content-center w-9 h-9 rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white transition"
            aria-label="Cerrar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Contenido */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Columna imagen */}
            <div className="md:w-1/3 flex-shrink-0">
              <img
                src={concursante.imagen}
                alt={`Foto de ${concursante.nombre}`}
                className="w-full h-auto object-cover rounded-xl shadow-lg shadow-black/30"
              />
              <h2 className="mt-3 text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 text-center">
                {concursante.nombre}
              </h2>
              <p className="mt-1 text-sm text-center text-slate-400 font-semibold uppercase tracking-wide">
                Estado: {concursante.estado}
              </p>
            </div>

            {/* Columna votación */}
            <div className="md:w-2/3 pt-4 border-t border-slate-700 md:border-t-0 md:border-l md:pl-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-300 text-center">
                Puntuaciones
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
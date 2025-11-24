import { useEffect, useState, useRef } from "react";
import { concursantesData } from "../data/concursantes.js";

const ScoreDisplay = () => {
  const [votos, setVotos] = useState({});
  const [prevPositions, setPrevPositions] = useState({});
  const [highlight, setHighlight] = useState(null);
  const [deltas, setDeltas] = useState({});
  const [showModal, setShowModal] = useState(false); // Control del modal en móvil
  const [closing, setClosing] = useState(false);
  const listRefs = useRef({});

  // Función para leer los votos del localStorage
  const loadVotos = () => {
    const stored = JSON.parse(localStorage.getItem("ot_concursantes_votos") || "{}");
    setVotos(stored);
  };

  // Cargamos los votos al montar el componente
  useEffect(() => {
    loadVotos();
    const handleVoteEvent = () => loadVotos();
    window.addEventListener("ot_vote_cast", handleVoteEvent);
    return () => window.removeEventListener("ot_vote_cast", handleVoteEvent);
  }, []);

  // Ordenamos concursantes
  const sortedVotos = concursantesData
    .filter(c => c.estado !== "expulsado")
    .map(c => {
      const v = votos[c.id] || { Voz: 0, Actuacion: 0, General: 0 };
      const media = (v.Voz + v.Actuacion + v.General) / 3;
      return { ...c, media, ...v };
    })
    .sort((a, b) => b.media - a.media);

  // Marcamos favorito y nominados
  const allRated = sortedVotos.every(c => c.media > 0);
  const favoritoId = allRated ? sortedVotos[0].id : null;
  const nominadosIds = allRated ? sortedVotos.slice(-4).map(c => c.id) : [];

  // Animación de movimiento
  useEffect(() => {
    const newPositions = {};
    const newDeltas = {};

    sortedVotos.forEach((c) => {
      if (listRefs.current[c.id]) {
        const rect = listRefs.current[c.id].getBoundingClientRect();
        newPositions[c.id] = rect.top;

        if (prevPositions[c.id] !== undefined) {
          newDeltas[c.id] = prevPositions[c.id] - rect.top;

          if (prevPositions[c.id] > rect.top) {
            setHighlight(c.id);
            setTimeout(() => setHighlight(null), 500);
          }
        } else {
          newDeltas[c.id] = 0;
        }
      }
    });

    setPrevPositions(newPositions);
    setDeltas(newDeltas);
  }, [votos]);

  // Cerrar ranking cuando se abre un modal.
   useEffect(() => {
    const handleOpenModal = () => {
      setShowModal(false); // ✅ Aquí cerramos el ranking en móvil
    };

    window.addEventListener("ot_open_modal", handleOpenModal);
    return () => window.removeEventListener("ot_open_modal", handleOpenModal);
  }, []);

  
  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setClosing(false);
    }, 300);
  };

  return (
  <>
    {/* Versión Escritorio */}
    <div className="hidden lg:block">
      <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-5 w-72 shadow-2xl shadow-purple-900/20">
        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400 mb-4 text-center">
          Ranking de la Gala
        </h2>

        <ul className="space-y-2">
          {sortedVotos.map((c, idx) => (
            <li
              key={c.id}
              ref={(el) => (listRefs.current[c.id] = el)}
              className={`
                flex items-center justify-between px-3 py-2 rounded-xl
                transition-all duration-500 ease-out
                ${highlight === c.id ? "bg-emerald-400/20 scale-105 shadow-lg shadow-emerald-500/30" : ""}
                ${allRated && nominadosIds.includes(c.id) ? "bg-rose-500/20 border border-rose-500/40" : ""}
                ${!highlight && !(allRated && nominadosIds.includes(c.id)) ? "bg-slate-800/50 hover:bg-slate-700/60" : ""}
              `}
              style={{
                transform: deltas[c.id] ? `translateY(${deltas[c.id]}px)` : "translateY(0)",
              }}
              onTransitionEnd={() => setDeltas((prev) => ({ ...prev, [c.id]: 0 }))}
            >
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("ot_open_modal", { detail: { id: c.id, nombre: c.nombre } })
                  )
                }
                className="flex items-center gap-2 text-slate-100 hover:text-white transition"
              >
                <span className="text-slate-400 text-sm w-5">{idx + 1}.</span>
                <span>{c.nombre}</span>
                {allRated && c.id === favoritoId && <span className="text-yellow-300">⭐</span>}
                {allRated && nominadosIds.includes(c.id) && <span className="text-rose-400">❌</span>}
              </button>

              <span className="font-mono text-sm text-slate-200">{c.media.toFixed(1)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Versión Mobile */}
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setShowModal(true)}
        className="grid place-content-center w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-500 text-white shadow-lg shadow-fuchsia-500/30 active:scale-95 transition"
        aria-label="Abrir ranking"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 12h18M3 20h18" />
        </svg>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className={`
                bg-slate-800/90 border border-slate-700 w-full max-w-lg rounded-3xl p-6
                ${closing ? "animate-fadeOut" : "animate-fadeIn"}
              `}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-cyan-400">
                Ranking de la Gala
              </h2>
              <button
                 onClick={closeModal}
                className="p-2 rounded-full text-slate-300 hover:bg-slate-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ul className="space-y-2 max-h-[50vh] overflow-auto pr-2">
              {sortedVotos.map((c, idx) => (
                <li
                  key={c.id}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-xl
                    ${allRated && nominadosIds.includes(c.id) ? "bg-rose-500/20 border border-rose-500/40" : "bg-slate-800/50"}
                  `}
                >
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("ot_open_modal", { detail: { id: c.id, nombre: c.nombre } })
                      );
                      closeModal();
                    }}
                    className="flex items-center gap-2 text-slate-100"
                  >
                    <span className="text-slate-400 text-sm w-5">{idx + 1}.</span>
                    <span>{c.nombre}</span>
                    {allRated && c.id === favoritoId && <span className="text-yellow-300">⭐</span>}
                    {allRated && nominadosIds.includes(c.id) && <span className="text-rose-400">❌</span>}
                  </button>

                  <span className="font-mono text-sm text-slate-200">{c.media.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  </>
);
};

export default ScoreDisplay;

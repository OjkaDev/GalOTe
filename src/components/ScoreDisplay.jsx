import { useEffect, useState, useRef } from "react";
import { concursantesData } from "../data/concursantes.js";

const ScoreDisplay = () => {
  const [votos, setVotos] = useState({});
  const [prevPositions, setPrevPositions] = useState({});
  const [highlight, setHighlight] = useState(null);
  const [deltas, setDeltas] = useState({});
  const [showModal, setShowModal] = useState(false); // Control del modal en móvil
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

  // Contenido del ranking
  const RankingContent = (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full md:w-72 mx-auto mb-8">
      <h2 className="text-xl font-bold mb-2 text-center">Ranking de la Gala</h2>
      <ul className="space-y-2">
        {sortedVotos.map((c, index) => (
          <li
            key={c.id}
            ref={el => (listRefs.current[c.id] = el)}
            className={`flex justify-between items-center p-2 rounded-lg transition-all duration-500 ${
              highlight === c.id
                ? "bg-green-500 scale-105"
                : nominadosIds.includes(c.id) && allRated
                ? "bg-red-700"
                : "bg-gray-700"
            }`}
            style={{
              position: "relative",
              transform: deltas[c.id] ? `translateY(${deltas[c.id]}px)` : "translateY(0)"
            }}
            onTransitionEnd={() => setDeltas(prev => ({ ...prev, [c.id]: 0 }))}
          >
        <span
          className="flex items-center gap-2 cursor-pointer underline"
          onClick={() =>
          window.dispatchEvent(
          new CustomEvent("ot_open_modal", {
          detail: { id: c.id, nombre: c.nombre }
          }))}
          >
          {index + 1}. {c.nombre}
          {allRated && c.id === favoritoId && <span title="Favorito de la gala">⭐</span>}
          {allRated && nominadosIds.includes(c.id) && <span title="Posible nominado">❌</span>}
        </span>
            <span>{c.media.toFixed(1)}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* 💻 Versión escritorio */}
      <div className="hidden md:block">{RankingContent}</div>

      {/* 📱 Versión móvil: botón + modal */}
      <div className="md:hidden text-center mt-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-full text-2xl fixed top-16 right-4 z-50 shadow-lg"
        >
          ⋮
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] pointer-events-auto">
            <div className="relative w-11/12 max-w-md transform transition-all duration-300 scale-90 animate-scaleIn z-[10000] pointer-events-auto">
              {RankingContent}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-white text-2xl"
              >
                ✖
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ScoreDisplay;

import { useEffect, useState, useRef } from "react";
import {concursantesData} from "../data/concursantes.js";

const ScoreDisplay = () => {
  const [votos, setVotos] = useState({});
  const [prevPositions, setPrevPositions] = useState({});
  const [highlight, setHighlight] = useState(null);
  const [deltas, setDeltas] = useState({});
  const listRefs = useRef({}); // guardamos referencia a cada <li> para medir su posición


  // Función para leer los votos del localStorage
  const loadVotos = () => {
    const stored = JSON.parse(localStorage.getItem("ot_concursantes_votos") || "{}");
    setVotos(stored);
  };

  // Cargamos los votos al montar el componente
  useEffect(() => {
    loadVotos();

    // Escuchamos el evento global para actualizar cuando alguien vote
    const handleVoteEvent = () => {
      loadVotos();
    };
    window.addEventListener("ot_vote_cast", handleVoteEvent);

    // Limpiamos listener al desmontar
    return () => {
      window.removeEventListener("ot_vote_cast", handleVoteEvent);
    };
  }, []);

  // Convertimos votos a array y los ordenamos por puntuación general
  const sortedVotos = concursantesData
    .filter(c => c.estado !== "expulsado")
    .map(c => {
    const v = votos[c.id] || { Voz: 0, Actuacion: 0, General: 0 };
    const media = (v.Voz + v.Actuacion + v.General) / 3;
    return { ...c, media, ...v };
    })
    .sort((a, b) => b.media - a.media);

  const allRated = sortedVotos.every(c => c.media > 0);
  const favoritoId = allRated ? sortedVotos[0].id : null;
  const nominadosIds = allRated ? sortedVotos.slice(-4).map(c => c.id) : [];

    useEffect(() => {
    const newPositions = {};
    const newDeltas = {};

    sortedVotos.forEach((c) => {
      if (listRefs.current[c.id]) {
        const rect = listRefs.current[c.id].getBoundingClientRect();
        newPositions[c.id] = rect.top;

        if (prevPositions[c.id] !== undefined) {
          newDeltas[c.id] = prevPositions[c.id] - rect.top; // Diferencia vertical
        } else {
          newDeltas[c.id] = 0;
        }

        // Detectamos si subió de posición
        if (prevPositions[c.id] !== undefined && prevPositions[c.id] > rect.top) {
          setHighlight(c.id);
          setTimeout(() => setHighlight(null), 500); // Quitamos highlight después de 0.5s
        }
      }
    });

    setPrevPositions(newPositions);
    setDeltas(newDeltas);
  }, [votos]);

return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full max-w-md mx-auto mb-8">
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
            onTransitionEnd={() => {
              setDeltas(prev => ({ ...prev, [c.id]: 0 }));
            }}
          >
            <span className="flex items-center gap-2">
              {index + 1}. {c.nombre}
              {allRated && c.id === favoritoId && (
                <span title="Favorito de la gala">⭐</span>
              )}
              {allRated && nominadosIds.includes(c.id) && (
                <span title="Posible nominado">❌</span>
              )}
            </span>
            <span>{c.media.toFixed(1)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreDisplay;

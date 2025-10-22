import React, { useEffect, useState } from "react";

const ScoreDisplay = () => {
  const [votos, setVotos] = useState({});

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
  const sortedVotos = Object.values(votos).sort((a, b) => b.General - a.General);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full max-w-md mx-auto mb-8">
      <h2 className="text-xl font-bold mb-2 text-center">Ranking de la Gala</h2>
      <ul className="space-y-2">
        {sortedVotos.map((c, index) => (
          <li
            key={c.id}
            className="flex justify-between items-center bg-gray-700 p-2 rounded-lg"
          >
            <span>{c.nombre}</span>
            <span>{c.General}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreDisplay;

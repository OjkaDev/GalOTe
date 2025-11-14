import { useState } from "react";

export default function ToggleExpelled({ onToggle }) {
  const [showExpelled, setShowExpelled] = useState(true);

  const toggle = () => {
    const newValue = !showExpelled;
    setShowExpelled(newValue);
    onToggle(newValue);
  };

  return (
    <button
      onClick={toggle}
      className="px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition"
    >
      {showExpelled ? "Ocultar expulsados" : "Mostrar expulsados"}
    </button>
  );
}

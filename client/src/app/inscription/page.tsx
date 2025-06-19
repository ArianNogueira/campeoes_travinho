"use client";

import { useState } from "react";

const initialPlayer = { Nome: "", Numero: "", Posicao: "" };
import { teams } from "./teams";
import { toast, ToastContainer } from "react-toastify";

export default function InscriptionPage() {
  const [group, setGroup] = useState("A");
  const [captain, setCaptain] = useState(initialPlayer);
  const [players, setPlayers] = useState(
    Array.from({ length: 5 }, () => ({ ...initialPlayer }))
  );
  const [selectedTeam, setSelectedTeam] = useState("");

  const handlePlayerChange = (
    index: number,
    field: keyof typeof initialPlayer,
    value: string
  ) => {
    const updated = [...players];
    updated[index] = { ...updated[index], [field]: value };
    setPlayers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeam) {
      toast.error("Por favor, selecione um time.");
      return;
    }

    try {
      const payload = {
        name: selectedTeam,
        group,
        captain,
        players,
      };

      const response = await fetch(
        "https://campeoes-travinho.onrender.com/teams/dados",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const erroMsg = await response.text();
        toast.error(erroMsg || "Erro ao cadastar o time. Verifique os dados.");
      } else {
        toast.success("Time cadastrado com sucesso!");
        setSelectedTeam("");
        setGroup("A");
        setCaptain(initialPlayer);
        setPlayers(Array(5).fill(initialPlayer));
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      toast.error("Erro de conexão com o servidor.");
    }
  };

  const handleTeamChange = (teamName: string) => {
    setSelectedTeam(teamName);
    const found = teams.find((team) => team.name === teamName);
    if (found) {
      setGroup(found.group);
    }
  };

  return (
    <div className="mx-auto px-4 py-8 bg-gray-50 text-gray-400">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-[#557389] rounded-full">
            <span className="text-2xl text-white">⚽</span>
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Inscrição de Time
        </h1>
        <p className="text-gray-600">
          Cadastre seu time na Copa Campeões Travinho 2025
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block font-medium">Nome do Time</label>
          <select
            value={selectedTeam}
            onChange={(e) => handleTeamChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
            required
          >
            <option value="">Equipe</option>
            {teams.map((team) => (
              <option key={team.name} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Grupo</label>
          <select
            value={group}
            disabled
            onChange={(e) => setGroup(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="A">Grupo A</option>
            <option value="B">Grupo B</option>
          </select>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Capitão</h2>
          {["Nome", "Numero", "Posicao"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={captain[field as keyof typeof captain]}
              onChange={(e) =>
                setCaptain({ ...captain, [field]: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
          ))}
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Jogadores</h2>
          {players.map((player, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Nome"
                value={player.Nome || ""}
                onChange={(e) =>
                  handlePlayerChange(index, "Nome", e.target.value)
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Número"
                value={player.Numero || ""}
                onChange={(e) =>
                  handlePlayerChange(index, "Numero", e.target.value)
                }
                className="border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="Posição"
                value={player.Posicao || ""}
                onChange={(e) =>
                  handlePlayerChange(index, "Posicao", e.target.value)
                }
                className="border rounded px-3 py-2"
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-[#102f4c] text-white px-6 py-2 cursor-pointer rounded hover:bg-[#1c3d5a]"
        >
          Enviar
        </button>
        <ToastContainer position="top-right" autoClose={3000} />
        {/* {message && <p className="text-center mt-4 font-medium">{message}</p>} */}
      </form>
    </div>
  );
}

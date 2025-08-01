"use client";

type TeamInfo = {
  name: string;
  score: number;
  penaltiesHome?: number;
  penaltiesAway?: number;
};

type Match = {
  id: number;
  home: TeamInfo;
  away: TeamInfo;
  date: string;
  time: string;
  group: string;
  round: number | string;
  scoreHome?: number;
  scoreAway?: number;
  penaltiesHome?: number;
  penaltiesAway?: number;
};

type Player = {
  id: number;
  name: string;
  number: number;
};

type CardStatus = {
  yellow: boolean;
  red: boolean;
};

type CardsState = {
  home: { [playerId: number]: CardStatus };
  away: { [playerId: number]: CardStatus };
};

import { useEffect, useState } from "react";
import { emblemMap } from "./emblem";
import Image from "next/image";
import matchesJson from "./matches.json";

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedRound, setSelectedRound] = useState<string>("SEMIFINAL");
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [editData, setEditData] = useState({ date: "", time: "", round: 1 });
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [cards, setCards] = useState<CardsState>({
    home: {}, // { [playerId]: { yellow: boolean, red: boolean } }
    away: {},
  });

  const [players, setPlayers] = useState<{ home: Player[]; away: Player[] }>({
    home: [],
    away: [],
  });
  const [goals, setGoals] = useState<{
    home: Record<number, number>;
    away: Record<number, number>;
  }>({
    home: {},
    away: {},
  });
  const [captains, setCaptains] = useState<{
    home: string | null;
    away: string | null;
  }>({
    home: null,
    away: null,
  });

  const [isAdmin, setIsAdmin] = useState(false);

  function handleCardChange(
    side: "home" | "away",
    playerId: number,
    cardType: "yellow" | "red",
    checked: boolean
  ) {
    setCards((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        [playerId]: {
          ...prev[side][playerId],
          [cardType]: checked,
        },
      },
    }));
  }

  // useEffect(() => {
  //   async function fetchMatches() {
  //     try {
  //       const res = await fetch(
  //         "https://campeoes-travinho.onrender.com/matches"
  //       );
  //       const data = await res.json();
  //       setMatches(data);
  //     } catch (error) {
  //       console.error("Erro ao buscar partidas:", error);
  //     }
  //   }

  //   fetchMatches();
  // }, []);

  useEffect(() => {
    setMatches(matchesJson as Match[]);
  }, []);

  const teamsList = Array.from(
    new Set(matches.flatMap((m) => [m.home?.name, m.away?.name]))
  );

  const roundsList = Array.from(new Set(matches.map((m) => m.round)));

  // Separar por tipo e ordenar
  const numericRounds = roundsList
    .filter((r) => typeof r === "number")
    .sort((a, b) => Number(a) - Number(b));
  const stringRounds = roundsList.filter((r) => typeof r === "string");

  const finalRoundsList = [...numericRounds, ...stringRounds];

  const filteredMatches =
    selectedTeam === "all"
      ? matches.filter((m) => m.round.toString() === selectedRound)
      : matches.filter(
          (m) => m.home?.name === selectedTeam || m.away?.name === selectedTeam
        );

  const openEditModal = (match: Match) => {
    const senha = prompt("Digite a senha de administrador:");

    if (senha === "travinho2019") {
      setEditingMatch(match);
      // setEditData({
      //   date: match.date,
      //   time: match.time,
      //   round: match.round,
      // });
    } else {
      alert("Senha incorreta!");
    }
  };

  const handleAdminAccess = () => {
    if (isAdmin) return true;

    const senha = prompt("Digite a senha de administrador:");
    if (senha === "travinho2019") {
      setIsAdmin(true);
      return true;
    } else {
      alert("Senha incorreta!");
      return false;
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMatch) return;
    try {
      const res = await fetch(
        `https://campeoes-travinho.onrender.com/matches/${editingMatch.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );
      if (!res.ok) throw new Error("Erro ao atualizar");

      setEditingMatch(null);

      // Atualiza a lista
      const updated = await fetch(
        "https://campeoes-travinho.onrender.com/matches"
      );
      const data = await updated.json();
      setMatches(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getTotalGoals = (team: "home" | "away") =>
    Object.values(goals[team]).reduce((sum, g) => sum + g, 0);

  const handleGoalChange = (
    team: "home" | "away",
    playerId: number,
    value: number
  ) => {
    setGoals((prev) => ({
      ...prev,
      [team]: {
        ...prev[team],
        [playerId]: value,
      },
    }));
  };

  function openDetailsModal(match: Match) {
    if (!handleAdminAccess()) return;

    setSelectedMatch(match);
    // Aqui você pode buscar os jogadores no back-end se tiver essa estrutura
    fetch(`https://campeoes-travinho.onrender.com/matches/${match.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers({
          home: data.homePlayers || [],
          away: data.awayPlayers || [],
        });
        setCaptains({
          home: data.homeCaptain || null,
          away: data.awayCaptain || null,
        });
      })
      .catch((err) => {
        console.error("Erro ao carregar jogadores:", err);
        setPlayers({ home: [], away: [] });
      });
  }

  async function handleSaveMatch() {
    const payload = {
      matchId: selectedMatch!.id,
      goals: {
        ...goals.home,
        ...goals.away,
      },
      cards: {
        ...cards.home,
        ...cards.away,
      },
    };

    try {
      const res = await fetch(
        "https://campeoes-travinho.onrender.com/matches/salvar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Erro ao salvar");

      alert("Resultado salvo com sucesso!");
      setSelectedMatch(null);
    } catch (error) {
      alert("Erro ao salvar resultado");
      console.error(error);
    }
  }

  return (
    <div className="mx-auto py-6 px-5 md:px-20 bg-[#fdfaf3]">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Partidas
      </h1>

      {/* Filtros */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <div>
          <label className="mr-2 font-medium text-gray-700">
            Filtrar por time:
          </label>
          <select
            className="border rounded px-3 py-1 text-gray-700"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="all">Todos</option>
            {teamsList.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium text-gray-700">Rodada:</label>
          <select
            className="border rounded px-3 py-1 text-gray-700"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            disabled={selectedTeam !== "all"}
          >
            {finalRoundsList.map((round) => (
              <option key={round} value={round} className="text-center">
                {typeof round === "number" ? `${round}` : round}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Partidas */}
      {filteredMatches.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma partida encontrada.</p>
      ) : (
        filteredMatches.map((match) => (
          <div
            key={match.id}
            className="mx-auto border border-gray-200 rounded-xl p-4 shadow-md bg-white mb-6 max-w-xl md:max-w-full"
          >
            {/* Cabeçalho da partida: rodada + botão editar */}
            <div className="flex flex-col  sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <div className="text-center w-full text-sm text-indigo-600 font-semibold">
                {["QUARTAS DE FINAL", "SEMIFINAL", "FINAL"].includes(
                  match.round.toString().toUpperCase()
                ) ? (
                  <>
                    {match.round} {match.group && `· ${match.group}`}
                  </>
                ) : (
                  <>
                    Rodada {match.round} · Grupo {match.group}
                  </>
                )}
              </div>

              <div className="text-center sm:text-right">
                <button
                  className="bg-blue-600 px-3 py-1.5 text-sm text-white rounded hover:bg-blue-700 transition-colors"
                  onClick={() => openEditModal(match)}
                >
                  Editar
                </button>
                <button
                  className="bg-green-600 px-2 py-1.5 mt-1 text-sm text-white rounded hover:bg-green-700 transition-colors ml-2 md:ml-0"
                  onClick={() => openDetailsModal(match)}
                >
                  Partida
                </button>
              </div>
            </div>

            {/* Informações da partida */}
            <div className="flex justify-around items-center mb-4 text-sm text-gray-600 flex-wrap gap-2 text-center">
              <div className="flex gap-5">
                <div>
                  <span className="font-medium">Data:</span>
                  <span className="ml-1">{match.date}</span>
                </div>
                <div>
                  <span className="font-medium">Hora:</span>
                  <span className="ml-1">{match.time}</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Local: Praça Events Stadium</span>
              </div>
            </div>

            {/* Confronto responsivo */}
            <div className="grid grid-cols-3 items-center text-center gap-2 sm:gap-4">
              {/* Time A */}
              <div className="flex flex-col items-center justify-center gap-y-1">
                <Image
                  src={emblemMap[match.home?.name] || "/default-emblem.png"}
                  alt={match.home?.name}
                  width={50}
                  height={50}
                  className="rounded-full mb-1"
                />
                <p className="text-sm font-semibold text-gray-800 text-center max-w-[140px] truncate">
                  {match.home?.name}
                </p>
              </div>

              {/* Placar */}
              <div className="text-2xl font-bold text-gray-700 flex flex-col items-center justify-center h-full">
                {typeof match.home.score === "number" &&
                typeof match.away.score === "number"
                  ? `${match.home.score} x ${match.away.score}`
                  : "vs"}

                {typeof match.home.penaltiesHome === "number" &&
                typeof match.away.penaltiesAway === "number" ? (
                  <p className="text-xs text-gray-500 mt-1">
                    Pênaltis: <br /> ( {match.home.penaltiesHome} x{" "}
                    {match.away.penaltiesAway} )
                  </p>
                ) : null}
              </div>

              {/* Placar */}

              {/* Time B */}
              <div className="flex flex-col items-center justify-center gap-y-1">
                <Image
                  src={emblemMap[match.away?.name] || "/default-emblem.png"}
                  alt={match.away?.name}
                  width={50}
                  height={50}
                  className="rounded-full mb-1"
                />
                <p className="text-sm font-semibold text-gray-800 text-center max-w-[140px] truncate">
                  {match.away?.name}
                </p>
              </div>
            </div>
          </div>
        ))
      )}

      {editingMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
              Editar Partida
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-3 py-2 placeholder:text-black"
                  value={editData.date}
                  onChange={(e) =>
                    setEditData({ ...editData, date: e.target.value })
                  }
                  placeholder="DD/MM/AAAA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hora
                </label>
                <input
                  type="text"
                  className="mt-1 w-full border rounded px-3 py-2 placeholder:text-black"
                  value={editData.time}
                  onChange={(e) =>
                    setEditData({ ...editData, time: e.target.value })
                  }
                  placeholder="HH:MM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rodada
                </label>
                <input
                  type="number"
                  className="mt-1 w-full border rounded px-3 py-2 placeholder:text-black"
                  value={editData.round}
                  onChange={(e) =>
                    setEditData({ ...editData, round: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setEditingMatch(null)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveEdit}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl shadow-xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Detalhes da Partida
            </h2>
            <div className="text-center mb-4 text-xl font-bold text-gray-700">
              Placar: {getTotalGoals("home")} x {getTotalGoals("away")}
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Time da Casa */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-600 mb-2 text-center">
                  {selectedMatch.home.name}
                </h3>
                <ul className="space-y-2">
                  {captains.home && (
                    <p className="text-sm text-gray-600 text-center mb-2">
                      Capitão:{" "}
                      <span className="font-medium">{captains.home}</span>
                    </p>
                  )}
                  {players.home.map((player) => (
                    <li
                      key={player.id}
                      className="flex justify-between text-black"
                    >
                      <span>{player.name}</span>
                      {/* Campos de gol, cartão etc */}
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="w-10 border rounded px-1 text-center"
                          placeholder="G"
                          value={goals.home[player.id] || ""}
                          onChange={(e) =>
                            handleGoalChange(
                              "home",
                              player.id,
                              Number(e.target.value) || 0
                            )
                          }
                        />

                        <div className="flex flex-col items-center gap-1">
                          <div className="flex gap-4 text-xs text-gray-600 font-medium mb-1">
                            <span>A</span>
                            <span>V</span>
                          </div>
                          <div className="flex gap-4">
                            <input
                              type="checkbox"
                              title="Cartão Amarelo"
                              checked={cards.home[player.id]?.yellow || false}
                              onChange={(e) =>
                                handleCardChange(
                                  "home",
                                  player.id,
                                  "yellow",
                                  e.target.checked
                                )
                              }
                            />
                            <input
                              type="checkbox"
                              title="Cartão Vermelho"
                              checked={cards.home[player.id]?.red || false}
                              onChange={(e) =>
                                handleCardChange(
                                  "home",
                                  player.id,
                                  "red",
                                  e.target.checked
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Time Visitante */}
              <div>
                <h3 className="text-lg font-semibold text-indigo-600 mb-2 text-center">
                  {selectedMatch.away.name}
                </h3>
                <ul className="space-y-2">
                  {captains.away && (
                    <p className="text-sm text-gray-600 text-center mb-2">
                      Capitão:{" "}
                      <span className="font-medium">{captains.away}</span>
                    </p>
                  )}
                  {players.away.map((player) => (
                    <li
                      key={player.id}
                      className="flex justify-between text-black"
                    >
                      <span>{player.name}</span>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          className="w-10 border rounded px-1 text-center"
                          placeholder="G"
                          value={goals.away[player.id] || ""}
                          onChange={(e) =>
                            handleGoalChange(
                              "away",
                              player.id,
                              Number(e.target.value) || 0
                            )
                          }
                        />
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex gap-4 text-xs text-gray-600 font-medium mb-1">
                            <span>A</span>
                            <span>V</span>
                          </div>
                          <div className="flex gap-4">
                            <input
                              type="checkbox"
                              title="Cartão Amarelo"
                              checked={cards.away[player.id]?.yellow || false}
                              onChange={(e) =>
                                handleCardChange(
                                  "away",
                                  player.id,
                                  "yellow",
                                  e.target.checked
                                )
                              }
                            />
                            <input
                              type="checkbox"
                              title="Cartão Vermelho"
                              checked={cards.away[player.id]?.red || false}
                              onChange={(e) =>
                                handleCardChange(
                                  "away",
                                  player.id,
                                  "red",
                                  e.target.checked
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setSelectedMatch(null)}
              >
                Fechar
              </button>
              <button
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSaveMatch}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

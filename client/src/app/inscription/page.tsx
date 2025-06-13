"use client";

import React, { useState } from "react";

interface Player {
  name: string;
  playerNumber: number;
  position: string;
}

interface Captain {
  name: string;
  playerNumber: number;
  position: string;
}

interface TeamData {
  name: string;
  group: string;
  captain: Captain;
  players: Player[];
}

const positions = ["FIXO", "ALA ESQUERDA", "ALA DIREIRA", "PIVO"];

const groups = ["A", "B"];
const teams = [
  "ATLÉTICO RF",
  "CA NOTTS",
  "CM INTER MIAMI",
  "FALCON FC",
  "FC DALLAS",
  "GODEN WARRIOS",
  "LIONS FC",
  "OS LISOS TEAM",
  "TG FC",
  "THUNDER FC",
  "TITANS FC",
  "VILARREAL",
];

const teamToGroup = {
  "ATLÉTICO RF": "B",
  "CA NOTTS": "B",
  "CM INTER MIAMI": "A",
  "FALCON FC": "A",
  "FC DALLAS": "A",
  "GODEN WARRIOS": "B",
  "LIONS FC": "B",
  "OS LISOS TEAM": "B",
  "TG FC": "A",
  "THUNDER FC": "A",
  "TITANS FC": "A",
  VILARREAL: "B",
};

export default function RegistrationForm() {
  const [teamData, setTeamData] = useState<TeamData>({
    name: "",
    group: "",
    captain: { name: "", playerNumber: 0, position: "" },
    players: Array(5)
      .fill(null)
      .map(() => ({ name: "", playerNumber: 0, position: "" })),
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<string[]>([]);

  const validateStep = (step: number): boolean => {
    const newErrors: string[] = [];

    if (step === 1) {
      if (!teamData.name.trim()) {
        newErrors.push("Nome do time é obrigatório");
      }
      if (!teamData.group) {
        newErrors.push("Grupo é obrigatório");
      }
    }

    if (step === 2) {
      if (!teamData.captain.name.trim()) {
        newErrors.push("Nome do capitão é obrigatório");
      }
      if (!teamData.captain.playerNumber || teamData.captain.playerNumber < 1) {
        newErrors.push("Número do capitão deve ser maior que 0");
      }
      if (!teamData.captain.position) {
        newErrors.push("Posição do capitão é obrigatória");
      }
    }

    if (step === 3) {
      teamData.players.forEach((player, index) => {
        if (!player.name.trim()) {
          newErrors.push(`Nome do jogador ${index + 1} é obrigatório`);
        }
        if (!player.playerNumber || player.playerNumber < 1) {
          newErrors.push(`Número do jogador ${index + 1} deve ser maior que 0`);
        }
        if (!player.position) {
          newErrors.push(`Posição do jogador ${index + 1} é obrigatória`);
        }
      });

      // Verificar números duplicados
      const allNumbers = [
        teamData.captain.playerNumber,
        ...teamData.players.map((p) => p.playerNumber),
      ];
      const duplicates = allNumbers.filter(
        (num, index) => allNumbers.indexOf(num) !== index
      );
      if (duplicates.length > 0) {
        newErrors.push("Números de jogadores não podem ser duplicados");
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setErrors([]);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form
        setTeamData({
          name: "",
          group: "",
          captain: { name: "", playerNumber: 0, position: "" },
          players: Array(5)
            .fill(null)
            .map(() => ({ name: "", playerNumber: 0, position: "" })),
        });
        setCurrentStep(1);
      } else {
        throw new Error("Erro ao cadastrar time");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrors(["Erro ao cadastrar time. Tente novamente."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTeamData = (field: string, value: any) => {
    setTeamData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCaptain = (field: string, value: any) => {
    setTeamData((prev) => ({
      ...prev,
      captain: {
        ...prev.captain,
        [field]: value,
      },
    }));
  };

  const updatePlayer = (index: number, field: string, value: any) => {
    setTeamData((prev) => ({
      ...prev,
      players: prev.players.map((player, i) =>
        i === index ? { ...player, [field]: value } : player
      ),
    }));
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
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

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progresso</span>
            <span className="text-sm font-medium text-gray-600">
              {currentStep}/3
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 transition-all duration-300 bg-[#557389] rounded-full"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Dados do Time</span>
            <span>Capitão</span>
            <span>Jogadores</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="p-8 bg-white rounded-lg shadow-lg">
          {/* Success Message */}
          {submitStatus === "success" && (
            <div className="p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 mr-3 bg-green-500 rounded-full">
                  <span className="text-sm text-white">✓</span>
                </div>
                <div>
                  <h3 className="font-medium text-green-800">
                    Time cadastrado com sucesso!
                  </h3>
                  <p className="text-sm text-green-700">
                    Seu time foi inscrito no campeonato.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-sm text-white">!</span>
                </div>
                <div>
                  <h3 className="mb-2 font-medium text-red-800">
                    Corrija os seguintes erros:
                  </h3>
                  <ul className="space-y-1 text-sm text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Team Data */}
          {currentStep === 1 && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Dados do Time
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Nome do Time *
                  </label>
                  <select
                    value={teamData.name}
                    onChange={(e) => {
                      const selectedTeam = e.target.value;
                      updateTeamData("name", selectedTeam);
                      updateTeamData("group", teamToGroup[selectedTeam] || "");
                    }}
                    className="w-full px-4 py-3 text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  >
                    <option value="">Equipe</option>
                    {teams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Grupo *
                  </label>
                  <select
                    value={teamData.group}
                    disabled
                    onChange={(e) => updateTeamData("group", e.target.value)}
                    className="w-full px-4 py-3 text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                  >
                    <option value="">Grupo</option>
                    {groups.map((group) => (
                      <option key={group} value={group}>
                        Grupo {group}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Captain */}
          {currentStep === 2 && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Dados do Capitão
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Nome do Capitão *
                  </label>
                  <input
                    type="text"
                    value={teamData.captain.name}
                    onChange={(e) => updateCaptain("name", e.target.value)}
                    className="w-full px-4 py-3 text-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    placeholder="Ex: Ronaldo"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 text-gray-400 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Número da Camisa *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={teamData.captain.playerNumber || ""}
                      onChange={(e) =>
                        updateCaptain(
                          "playerNumber",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent "
                      placeholder="10"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Posição *
                    </label>
                    <select
                      value={teamData.captain.position}
                      onChange={(e) =>
                        updateCaptain("position", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                    >
                      <option value="">Selecione uma posição</option>
                      {positions.map((position) => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Players */}
          {currentStep === 3 && (
            <div>
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                Jogadores (5 obrigatórios)
              </h2>

              <div className="space-y-6 text-gray-400">
                {teamData.players.map((player, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <h3 className="mb-4 font-medium text-gray-900">
                      Jogador {index + 1}
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Nome *
                        </label>
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) =>
                            updatePlayer(index, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                          placeholder="Nome do jogador"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Número *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={player.playerNumber || ""}
                          onChange={(e) =>
                            updatePlayer(
                              index,
                              "playerNumber",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                          placeholder="Nº"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          Posição *
                        </label>
                        <select
                          value={player.position}
                          onChange={(e) =>
                            updatePlayer(index, "position", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        >
                          <option value="">Selecione</option>
                          {positions.map((position) => (
                            <option key={position} value={position}>
                              {position}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 text-white transition-colors bg-[#718c9a] rounded-lg hover:bg-[#5f7682]"
              >
                Próximo
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Cadastrando..." : "Finalizar Inscrição"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

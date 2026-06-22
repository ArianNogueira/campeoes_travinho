"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Hash, ShieldCheck, Shirt, UserRound, UsersRound } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import {
  // getRegisteredTeamIds,
  // getTeams,
  saveTeamInscription,
  subscribeToTournamentChanges,
} from "@/services/tournamentService";
import type { Team } from "@/types/tournament";

type PlayerForm = {
  name: string;
  number: string;
  position: string;
};

const emptyPlayer: PlayerForm = { name: "", number: "", position: "" };

export default function InscriptionPage() {
  // const [teams, setTeams] = useState<Team[]>([]);
  // const [registeredTeamIds, setRegisteredTeamIds] = useState<number[]>([]);
  const [captain, setCaptain] = useState<PlayerForm>(emptyPlayer);
  const [players, setPlayers] = useState<PlayerForm[]>(
    Array.from({ length: 5 }, () => ({ ...emptyPlayer }))
  );
  const [teamName, setTeamName] = useState("");
  // const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emblemFile, setEmblemFile] = useState<File | null>(null);

  const rosterPreview = useMemo(
    () => [
      { ...captain, role: "Capitão" },
      ...players.map((player, index) => ({
        ...player,
        role: `Jogador ${index + 1}`,
      })),
    ],
    [captain, players]
  );

  const completedPlayers = rosterPreview.filter(
    (player) => player.name && player.number && player.position
  ).length;

  // const loadData = useCallback(async () => {
  //   try {
  //     const [teamsData, registeredIds] = await Promise.all([
  //       getTeams(),
  //       getRegisteredTeamIds(),
  //     ]);
  //     setTeams(teamsData);
  //     setRegisteredTeamIds(registeredIds);
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error ? error.message : "Erro ao carregar equipes."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   loadData();
  //   return subscribeToTournamentChanges(loadData);
  // }, [loadData]);

  

  function updateCaptain(field: keyof PlayerForm, value: string) {
    setCaptain((current) => ({ ...current, [field]: value }));
  }

  function updatePlayer(index: number, field: keyof PlayerForm, value: string) {
    setPlayers((current) =>
      current.map((player, playerIndex) =>
        playerIndex === index ? { ...player, [field]: value } : player
      )
    );
  }

  function resetForm() {
    setTeamName("");
    setCaptain({ ...emptyPlayer });
    setPlayers(Array.from({ length: 5 }, () => ({ ...emptyPlayer })));
    setEmblemFile(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!teamName.trim()) {
      toast.error("Informe o nome do time.");
      return;
    }

    if (!emblemFile) {
      toast.error("Envie o escudo do time.");
      return;
    }

    const inscriptionPlayers = [
      {
        name: captain.name.trim(),
        number: Number(captain.number),
        position: captain.position.trim(),
        isCaptain: true,
      },
      ...players.map((player) => ({
        name: player.name.trim(),
        number: Number(player.number),
        position: player.position.trim(),
        isCaptain: false,
      })),
    ];

    if (inscriptionPlayers.some((player) => !player.name || !player.position)) {
      toast.error("Preencha nome e posição de todos os atletas.");
      return;
    }

    if (
      inscriptionPlayers.some(
        (player) => Number.isNaN(player.number) || player.number <= 0
      )
    ) {
      toast.error("Informe números de camisa válidos.");
      return;
    }

    const jerseyNumbers = inscriptionPlayers.map((player) => player.number);
    if (new Set(jerseyNumbers).size !== jerseyNumbers.length) {
      toast.error("Não repita números de camisa no mesmo time.");
      return;
    }

    try {
      setSaving(true);
      await saveTeamInscription(teamName.trim(), inscriptionPlayers, emblemFile);
      toast.success("Inscrição enviada com sucesso!");
      resetForm();
      // await loadData();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar inscrição."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fdfaf3] px-4 py-8 text-gray-800">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-lg bg-[#102f4c] px-6 py-8 text-white shadow">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#d0bb94]">
                Copa Campeões Travinho 2026
              </p>
              <h1 className="text-3xl font-bold md:text-4xl">
                Inscrição de Equipe
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[#d7e0e4] md:text-base">
                Cadastre o capitão e jogadores. O grupo de cada equipe não será
                informado aqui, pois será definido por sorteio.
              </p>
            </div>

            {/* <div className="grid grid-cols-2 gap-3 text-center sm:min-w-72">
              <SummaryBox label="Atletas" value={`${completedPlayers}/6`} />
              <SummaryBox
                label="Equipes livres"
                value={availableTeams.length.toString()}
              />
            </div> */}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <form
            className="rounded-lg bg-white p-5 shadow md:p-6"
            onSubmit={handleSubmit}
          >
            <section className="mb-8">
              {/* <SectionTitle
                description="Escolha a equipe inscrita. O sorteio dos grupos fica fora deste formulário."
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Equipe"
              /> */}

              {/* <label className="block text-sm font-medium text-gray-700">
                Nome do time
                <select
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-[#557389] focus:ring-2 focus:ring-[#557389]/20"
                  disabled={loading || saving}
                  onChange={(event) => setSelectedTeamId(event.target.value)}
                  required
                  value={selectedTeamId}
                >
                  <option value="">
                    {loading ? "Carregando equipes..." : "Selecione uma equipe"}
                  </option>
                  {availableTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label> */}

              <TextInput
                label="Nome do Time"
                onChange={setTeamName}
                placeholder="Digite o nome do seu time"
                value={teamName}
              />

              <label className="mt-2 block text-sm font-medium text-gray-700">
                Escudo do Time

                <input
                  accept="image/*"
                  className="mt-2 w-full rounded-lg border border-gray-300 p-2"
                  key={emblemFile?.name || "empty-emblem"}
                  onChange={(e) =>
                    setEmblemFile(e.target.files?.[0] ?? null)
                  }
                  required
                  type="file"
                />
              </label>

              {teamName && (
                <div className="mt-4 rounded-lg border border-[#d0bb94] bg-[#fdfaf3] px-4 py-3 text-sm text-[#5e5035]">
                  Time informado: <span className="font-semibold">{teamName}</span>.
                  O grupo será definido posteriormente por sorteio.
                </div>
              )}
            </section>

            <section className="mb-8">
              <SectionTitle
                description="O capitão também entra na lista de atletas do time."
                icon={<UserRound className="h-5 w-5" />}
                title="Capitão"
              />
              <div className="grid gap-3 md:grid-cols-[1fr_120px_180px]">
                <TextInput
                  label="Nome"
                  onChange={(value) => updateCaptain("name", value)}
                  placeholder="Nome do capitão"
                  value={captain.name}
                />
                <TextInput
                  label="Camisa"
                  min={1}
                  onChange={(value) => updateCaptain("number", value)}
                  placeholder="10"
                  type="number"
                  value={captain.number}
                />
                <TextInput
                  label="Posição"
                  onChange={(value) => updateCaptain("position", value)}
                  placeholder="Atacante"
                  value={captain.position}
                />
              </div>
            </section>

            <section>
              <SectionTitle
                description="Informe os cinco jogadores restantes da equipe."
                icon={<UsersRound className="h-5 w-5" />}
                title="Jogadores"
              />

              <div className="space-y-3">
                {players.map((player, index) => (
                  <div
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    key={index}
                  >
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#557389]">
                      <Shirt className="h-4 w-4" />
                      Jogador {index + 1}
                    </div>
                    <div className="grid gap-3 md:grid-cols-[1fr_120px_180px]">
                      <TextInput
                        label="Nome"
                        onChange={(value) => updatePlayer(index, "name", value)}
                        placeholder="Nome do jogador"
                        value={player.name}
                      />
                      <TextInput
                        label="Camisa"
                        min={1}
                        onChange={(value) =>
                          updatePlayer(index, "number", value)
                        }
                        placeholder="7"
                        type="number"
                        value={player.number}
                      />
                      <TextInput
                        label="Posição"
                        onChange={(value) =>
                          updatePlayer(index, "position", value)
                        }
                        placeholder="Meia"
                        value={player.position}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
                disabled={saving}
                onClick={resetForm}
                type="button"
              >
                Limpar
              </button>
              <button
                className="rounded-lg bg-[#102f4c] px-6 py-3 font-semibold text-white transition hover:bg-[#1c3d5a] disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? "Enviando..." : "Enviar inscrição"}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-lg bg-white p-5 shadow">
              <h2 className="mb-4 text-lg font-bold text-[#102f4c]">
                Prévia do elenco
              </h2>
              <div className="space-y-3">
                {rosterPreview.map((player) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2"
                    key={player.role}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-gray-800">
                        {player.name || player.role}
                      </div>
                      <div className="text-xs text-gray-500">
                        {player.position || "Posição pendente"}
                      </div>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d0bb94]/30 text-sm font-bold text-[#5e5035]">
                      {player.number || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#d0bb94] bg-[#fffaf0] p-5 text-sm text-[#5e5035]">
              <h3 className="mb-2 font-bold text-[#2d1f0f]">Observação</h3>
              <p>
                O sorteio dos grupos será feito depois. Esta inscrição salva
                apenas a equipe e seus respectivos atletas.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <ToastContainer autoClose={3000} position="top-right" />
    </main>
  );
}

function SectionTitle({
  description,
  icon,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center gap-2 text-lg font-bold text-[#102f4c]">
        {icon}
        {title}
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function SummaryBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/10 p-4">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-[#d0bb94]">
        {label}
      </div>
    </div>
  );
}

function TextInput({
  label,
  min,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  min?: number;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "number";
  value: string;
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      <span className="mb-1 flex items-center gap-1">
        {type === "number" ? <Hash className="h-3.5 w-3.5" /> : null}
        {label}
      </span>
      <input
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#557389] focus:ring-2 focus:ring-[#557389]/20"
        min={min}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Download,
  FileText,
  LogIn,
  Pencil,
  Save,
  Trophy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  generateTournamentMatches,
  getMatches,
  getMatchEvents,
  getPlayersByTeamIds,
  saveMatchResult,
  subscribeToTournamentChanges,
  updateMatchSchedule,
  type PlayerResultInput,
} from "@/services/tournamentService";
import type { Match, MatchEvent, Player } from "@/types/tournament";

type PlayerResultForm = Record<
  number,
  {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  }
>;

type ScheduleForm = {
  date: string;
  time: string;
  round: string;
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [selectedRound, setSelectedRound] = useState("all");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [summaryMatch, setSummaryMatch] = useState<Match | null>(null);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>({
    date: "",
    time: "",
    round: "",
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [resultForm, setResultForm] = useState<PlayerResultForm>({});
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUser, setAdminUser] = useState<string | null>(null);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [matchesData, eventsData] = await Promise.all([
        getMatches(),
        getMatchEvents(),
      ]);
      setMatches(matchesData);
      setEvents(eventsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    return subscribeToTournamentChanges(loadData);
  }, [loadData]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setAdminUser(data.user?.email || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdminUser(session?.user.email || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const teamsList = useMemo(
    () =>
      Array.from(
        new Set(
          matches.flatMap((match) => [
            match.home?.name || "",
            match.away?.name || "",
          ])
        )
      )
        .filter(Boolean)
        .sort(),
    [matches]
  );

  const roundsList = useMemo(
    () => Array.from(new Set(matches.map((match) => match.round))).sort(),
    [matches]
  );

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      const matchesTeam =
        selectedTeam === "all" ||
        match.home?.name === selectedTeam ||
        match.away?.name === selectedTeam;
      const matchesRound =
        selectedRound === "all" || match.round === selectedRound;

      return matchesTeam && matchesRound;
    });
  }, [matches, selectedRound, selectedTeam]);

  async function openResultModal(match: Match) {
    setSelectedMatch(match);
    setHomeScore(match.home_score || 0);
    setAwayScore(match.away_score || 0);

    try {
      const playersData = await getPlayersByTeamIds([
        match.home_team_id,
        match.away_team_id,
      ]);
      setPlayers(playersData);
      setResultForm(buildInitialResultForm(playersData, events, match.id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar jogadores."
      );
    }
  }

  function openScheduleModal(match: Match) {
    setEditingMatch(match);
    setScheduleForm({
      date: match.date,
      time: match.time,
      round: match.round,
    });
  }

  function updatePlayerResult(
    playerId: number,
    field: keyof PlayerResultForm[number],
    value: number
  ) {
    setResultForm((current) => ({
      ...current,
      [playerId]: {
        ...(current[playerId] || {
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        }),
        [field]: Math.max(0, value),
      },
    }));
  }

  async function handleSaveSchedule() {
    if (!editingMatch) return;

    try {
      setSaving(true);
      await updateMatchSchedule(editingMatch.id, scheduleForm);
      await loadData();
      setEditingMatch(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar partida.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveResult() {
    if (!selectedMatch) return;

    const payload: PlayerResultInput[] = players.map((player) => ({
      playerId: player.id,
      teamId: player.team_id,
      goals: resultForm[player.id]?.goals || 0,
      assists: resultForm[player.id]?.assists || 0,
      yellowCards: resultForm[player.id]?.yellowCards || 0,
      redCards: resultForm[player.id]?.redCards || 0,
    }));

    try {
      setSaving(true);
      await saveMatchResult({
        matchId: selectedMatch.id,
        homeScore,
        awayScore,
        events: payload,
      });
      await loadData();
      setSelectedMatch(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar resultado."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleAdminLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (authError) throw authError;
      setAdminPassword("");
      setAdminLoginOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao entrar como admin.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAdminLogout() {
    await supabase.auth.signOut();
    setAdminUser(null);
  }

  return (
    <div className="mx-auto min-h-screen bg-[#fdfaf3] px-5 py-6 md:px-20">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Partidas
      </h1>

      {/* <button
        className="rounded bg-[#102f4c] px-4 py-2 text-white hover:bg-[#1c3d5a] disabled:opacity-60 cursor-pointer"
        onClick={async () => {
          try {
            const total = await generateTournamentMatches(
              "2026-08-03"
            );

            alert(`${total} partidas geradas`);
          } catch (error) {
            alert(
              error instanceof Error
                ? error.message
                : "Erro ao gerar partidas"
            );
          }
        }}
      >
        Gerar Partidas
      </button> */}

      <div className="mx-auto mb-6 flex max-w-3xl justify-end">
        {adminUser ? (
          <div className="flex flex-col items-end gap-2 rounded-lg bg-white px-4 py-3 shadow sm:flex-row sm:items-center">
            <div className="text-sm text-gray-700">
              Admin conectado: <span className="font-semibold">{adminUser}</span>
            </div>
            <button
              className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              onClick={handleAdminLogout}
              type="button"
            >
              Sair
            </button>
          </div>
        ) : (
          <button
            className="inline-flex items-center gap-2 rounded bg-[#102f4c] px-4 py-2 text-sm font-semibold text-white shadow transition-colors hover:bg-[#1c3d5a]"
            onClick={() => setAdminLoginOpen(true)}
            type="button"
          >
            <LogIn className="h-4 w-4" />
            Entrar
          </button>
        )}
      </div>

      {error ? (
        <div className="mx-auto mb-6 max-w-3xl rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap justify-center gap-4">
        <label className="flex items-center gap-2 font-medium text-gray-700">
          Time
          <select
            className="rounded border px-3 py-1 text-gray-700"
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
          >
            <option value="all">Todos</option>
            {teamsList.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 font-medium text-gray-700">
          Rodada
          <select
            className="rounded border px-3 py-1 text-gray-700"
            value={selectedRound}
            onChange={(event) => setSelectedRound(event.target.value)}
          >
            <option value="all">Todas</option>
            {roundsList.map((round) => (
              <option key={round} value={round}>
                {round}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Carregando partidas...</p>
      ) : filteredMatches.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma partida encontrada.</p>
      ) : (
        <div className="space-y-6">
          {filteredMatches.map((match) => (
            <article
              key={match.id}
              className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-4 shadow-md"
            >
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-center text-sm font-semibold text-indigo-600 sm:text-left">
                  {match.round} {match.group_name ? `- Grupo ${match.group_name}` : ""}
                </div>
                {adminUser ? (
                  <div className="flex justify-center gap-2">
                    <button
                      className="inline-flex items-center gap-2 rounded bg-[#102f4c] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#1c3d5a]"
                      onClick={() => setSummaryMatch(match)}
                      type="button"
                    >
                      <FileText className="h-4 w-4" />
                      Súmula
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
                      onClick={() => openScheduleModal(match)}
                      type="button"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      className="inline-flex items-center gap-2 rounded bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700"
                      onClick={() => openResultModal(match)}
                      type="button"
                    >
                      <Trophy className="h-4 w-4" />
                      Adicionar Resultado
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-center text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-4 w-4" />
                  {match.date} - {match.time}
                </span>
                <span>{match.status === "finished" ? "Finalizada" : "Agendada"}</span>
              </div>

              <div className="grid grid-cols-3 items-center gap-3 text-center">
                <TeamBadge name={match.home?.name} emblemUrl={match.home?.emblem_url} />
                <div className="text-3xl font-bold text-gray-700">
                  {match.status === "finished"
                    ? `${match.home_score || 0} x ${match.away_score || 0}`
                    : "vs"}
                </div>
                <TeamBadge name={match.away?.name} emblemUrl={match.away?.emblem_url} />
              </div>
            </article>
          ))}
        </div>
      )}

      {editingMatch ? (
        <Modal title="Editar Partida" onClose={() => setEditingMatch(null)}>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Data
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-gray-800"
                value={scheduleForm.date}
                onChange={(event) =>
                  setScheduleForm({ ...scheduleForm, date: event.target.value })
                }
                type="date"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Hora
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-gray-800"
                value={scheduleForm.time}
                onChange={(event) =>
                  setScheduleForm({ ...scheduleForm, time: event.target.value })
                }
                type="time"
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Rodada
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-gray-800"
                value={scheduleForm.round}
                onChange={(event) =>
                  setScheduleForm({ ...scheduleForm, round: event.target.value })
                }
              />
            </label>
            <ModalActions
              disabled={saving}
              onCancel={() => setEditingMatch(null)}
              onSave={handleSaveSchedule}
            />
          </div>
        </Modal>
      ) : null}

      {adminLoginOpen ? (
        <Modal title="Entrar como admin" onClose={() => setAdminLoginOpen(false)}>
          <form className="space-y-4" onSubmit={handleAdminLogin}>
            <label className="block text-sm font-medium text-gray-700">
              Email admin
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-gray-800"
                onChange={(event) => setAdminEmail(event.target.value)}
                type="email"
                value={adminEmail}
              />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Senha
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-gray-800"
                onChange={(event) => setAdminPassword(event.target.value)}
                type="password"
                value={adminPassword}
              />
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button
                className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
                disabled={saving}
                onClick={() => setAdminLoginOpen(false)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="inline-flex items-center gap-2 rounded bg-[#102f4c] px-4 py-2 text-white hover:bg-[#1c3d5a] disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                <LogIn className="h-4 w-4" />
                {saving ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {summaryMatch ? (
        <SummaryModal
          events={events.filter((event) => event.match_id === summaryMatch.id)}
          match={summaryMatch}
          onClose={() => setSummaryMatch(null)}
        />
      ) : null}

      {selectedMatch ? (
        <Modal
          title={`${selectedMatch.home?.name || "Mandante"} x ${
            selectedMatch.away?.name || "Visitante"
          }`}
          onClose={() => setSelectedMatch(null)}
          wide
        >
          <div className="mb-6 grid grid-cols-2 gap-4">
            <label className="text-sm font-medium text-gray-700">
              Gols {selectedMatch.home?.name}
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-center text-gray-800"
                min={0}
                onChange={(event) => setHomeScore(Number(event.target.value))}
                type="number"
                value={homeScore}
              />
            </label>
            <label className="text-sm font-medium text-gray-700">
              Gols {selectedMatch.away?.name}
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-center text-gray-800"
                min={0}
                onChange={(event) => setAwayScore(Number(event.target.value))}
                type="number"
                value={awayScore}
              />
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PlayersResultTable
              title={selectedMatch.home?.name || "Mandante"}
              players={players.filter(
                (player) => player.team_id === selectedMatch.home_team_id
              )}
              resultForm={resultForm}
              onChange={updatePlayerResult}
            />
            <PlayersResultTable
              title={selectedMatch.away?.name || "Visitante"}
              players={players.filter(
                (player) => player.team_id === selectedMatch.away_team_id
              )}
              resultForm={resultForm}
              onChange={updatePlayerResult}
            />
          </div>

          <ModalActions
            disabled={saving}
            onCancel={() => setSelectedMatch(null)}
            onSave={handleSaveResult}
          />
        </Modal>
      ) : null}
    </div>
  );
}

function SummaryModal({
  events,
  match,
  onClose,
}: {
  events: MatchEvent[];
  match: Match;
  onClose: () => void;
}) {
  const homeEvents = events.filter((event) => event.team_id === match.home_team_id);
  const awayEvents = events.filter((event) => event.team_id === match.away_team_id);
  const statusLabel = match.status === "finished" ? "Finalizada" : "Agendada";

  function handleDownloadSummary() {
    const summary = buildMatchSummaryPdf(match, homeEvents, awayEvents, statusLabel);
    const fileName = `sumula-${slugify(match.home?.name || "mandante")}-x-${slugify(
      match.away?.name || "visitante"
    )}.pdf`;
    const blob = new Blob([summary], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Modal title="Súmula da Partida" onClose={onClose} wide>
      <section className="space-y-6 text-gray-800">
        <div className="flex justify-end">
          <button
            className="inline-flex items-center gap-2 rounded bg-[#855b21] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5e5035]"
            onClick={handleDownloadSummary}
            type="button"
          >
            <Download className="h-4 w-4" />
            Baixar PDF
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#102f4c]">
                {match.round} {match.group_name ? `- Grupo ${match.group_name}` : ""}
              </p>
              <h3 className="mt-1 text-2xl font-bold">
                {match.home?.name || "Mandante"} x {match.away?.name || "Visitante"}
              </h3>
            </div>
            <span className="w-fit rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
              {statusLabel}
            </span>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <SummaryInfo label="Data" value={formatDate(match.date)} />
            <SummaryInfo label="Horário" value={match.time || "A definir"} />
            <SummaryInfo
              label="Placar"
              value={
                match.status === "finished"
                  ? `${match.home_score || 0} x ${match.away_score || 0}`
                  : "A definir"
              }
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TeamSummary
            events={homeEvents}
            score={match.home_score}
            status={match.status}
            title={match.home?.name || "Mandante"}
          />
          <TeamSummary
            events={awayEvents}
            score={match.away_score}
            status={match.status}
            title={match.away?.name || "Visitante"}
          />
        </div>
      </section>
    </Modal>
  );
}

function buildMatchSummaryPdf(
  match: Match,
  homeEvents: MatchEvent[],
  awayEvents: MatchEvent[],
  statusLabel: string
) {
  const lines = buildMatchSummaryLines(match, homeEvents, awayEvents, statusLabel);
  const content = [
    "BT",
    "/F1 18 Tf",
    "50 790 Td",
    `(${escapePdfText("SUMULA DA PARTIDA")}) Tj`,
    "/F1 10 Tf",
    "0 -24 Td",
    ...lines.flatMap((line) => [`(${escapePdfText(line)}) Tj`, "0 -16 Td"]),
    "ET",
    ...buildPdfLineDrawings(),
  ].join("\n");
  const stream = content;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

function buildMatchSummaryLines(
  match: Match,
  homeEvents: MatchEvent[],
  awayEvents: MatchEvent[],
  statusLabel: string
) {
  const score =
    match.status === "finished"
      ? `${match.home_score || 0} x ${match.away_score || 0}`
      : "A definir";

  return [
    `Partida: ${match.home?.name || "Mandante"} x ${match.away?.name || "Visitante"}`,
    `Rodada: ${match.round || "A definir"}`,
    `Grupo: ${match.group_name || "A definir"}`,
    `Data: ${formatDate(match.date)}`,
    `Horário: ${match.time || "A definir"}`,
    `Status: ${statusLabel}`,
    `Placar: ${score}`,
    "",
    "EQUIPE DE ARBITRAGEM",
    "Arbitro principal: ______________________________________________",
    "Segundo arbitro: _______________________________________________",
    "Mesario: _______________________________________________________",
    "Responsavel da mesa: ___________________________________________",
    "",
    "RESPONSAVEIS DAS EQUIPES",
    `Responsavel ${match.home?.name || "Mandante"}: ________________________________`,
    `Responsavel ${match.away?.name || "Visitante"}: ________________________________`,
    "",
    "CONTROLE DA PARTIDA",
    "Inicio: ____________  Intervalo: ____________  Termino: ____________",
    "Observacoes:",
    "________________________________________________________________",
    "________________________________________________________________",
    "________________________________________________________________",
    "",
    "ASSINATURAS",
    "Arbitro: _________________________  Mesa: _______________________",
    "Capitao mandante: _________________  Capitao visitante: __________",
  ].flatMap((line) => line.split("\n"));
}

function buildTeamSummaryLines(
  teamName: string,
  score: number | null,
  status: Match["status"],
  events: MatchEvent[]
) {
  return [
    `${teamName.toUpperCase()} - ${status === "finished" ? score || 0 : "-"}`,
    formatEventsForDownload("Gols", events.filter((event) => event.type === "goal")),
    formatEventsForDownload("Assistências", events.filter((event) => event.type === "assist")),
    formatEventsForDownload(
      "Cartões amarelos",
      events.filter((event) => event.type === "yellow_card")
    ),
    formatEventsForDownload(
      "Cartões vermelhos",
      events.filter((event) => event.type === "red_card")
    ),
  ].join("\n");
}

function formatEventsForDownload(title: string, events: MatchEvent[]) {
  if (!events.length) {
    return `${title}: Nenhum registro.`;
  }

  return [
    `${title}:`,
    ...events.map((event) => {
      const playerNumber = event.player?.number ? `${event.player.number} - ` : "";
      const quantity = event.quantity > 1 ? ` (${event.quantity})` : "";

      return `- ${playerNumber}${event.player?.name || "Jogador não informado"}${quantity}`;
    }),
  ].join("\n");
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapePdfText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function buildPdfLineDrawings() {
  return [
    "0.7 w",
    "50 805 m 545 805 l S",
    "50 615 m 545 615 l S",
    "50 472 m 545 472 l S",
    "50 315 m 545 315 l S",
    "50 165 m 545 165 l S",
  ];
}

function SummaryInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-gray-100 bg-gray-50 px-3 py-2">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-800">{value}</p>
    </div>
  );
}

function TeamSummary({
  events,
  score,
  status,
  title,
}: {
  events: MatchEvent[];
  score: number | null;
  status: Match["status"];
  title: string;
}) {
  const goals = events.filter((event) => event.type === "goal");
  const assists = events.filter((event) => event.type === "assist");
  const yellowCards = events.filter((event) => event.type === "yellow_card");
  const redCards = events.filter((event) => event.type === "red_card");

  return (
    <article className="rounded-lg border border-gray-200 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="text-lg font-bold text-[#102f4c]">{title}</h4>
        <span className="rounded bg-[#102f4c] px-3 py-1 text-sm font-bold text-white">
          {status === "finished" ? score || 0 : "-"}
        </span>
      </div>

      <div className="space-y-4 text-sm">
        <EventList events={goals} title="Gols" />
        <EventList events={assists} title="Assistências" />
        <EventList events={yellowCards} title="Cartões amarelos" />
        <EventList events={redCards} title="Cartões vermelhos" />
      </div>
    </article>
  );
}

function EventList({ events, title }: { events: MatchEvent[]; title: string }) {
  return (
    <div>
      <p className="mb-1 font-semibold text-gray-700">{title}</p>
      {events.length ? (
        <ul className="space-y-1 text-gray-600">
          {events.map((event) => (
            <li key={event.id}>
              {event.player?.number ? `${event.player.number} - ` : ""}
              {event.player?.name || "Jogador não informado"}
              {event.quantity > 1 ? ` (${event.quantity})` : ""}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">Nenhum registro.</p>
      )}
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "A definir";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR").format(parsedDate);
}

function TeamBadge({
  name,
  emblemUrl,
}: {
  name?: string;
  emblemUrl?: string | null;
}) {
  const src = emblemUrl;

  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      {src ? (
        <img
          alt={name || "Escudo"}
          className="h-14 w-14 rounded-full object-cover"
          src={src}
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500">
          Time
        </div>
      )}
      <p className="max-w-[150px] truncate text-sm font-semibold text-gray-800">
        {name || "A definir"}
      </p>
    </div>
  );
}

function PlayersResultTable({
  title,
  players,
  resultForm,
  onChange,
}: {
  title: string;
  players: Player[];
  resultForm: PlayerResultForm;
  onChange: (
    playerId: number,
    field: keyof PlayerResultForm[number],
    value: number
  ) => void;
}) {
  return (
    <section>
      <h3 className="mb-3 text-center text-lg font-semibold text-indigo-700">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-sm">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2 text-left">Jogador</th>
              <th className="py-2 text-center">G</th>
              <th className="py-2 text-center">A</th>
              <th className="py-2 text-center">CA</th>
              <th className="py-2 text-center">CV</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id} className="border-b text-gray-800">
                <td className="py-2">
                  <span className="font-medium">{player.name}</span>
                  {player.is_captain ? (
                    <span className="ml-2 text-xs text-gray-500">Cap.</span>
                  ) : null}
                </td>
                {(["goals", "assists", "yellowCards", "redCards"] as const).map(
                  (field) => (
                    <td key={field} className="py-2 text-center">
                      <input
                        className="w-14 rounded border px-2 py-1 text-center"
                        min={0}
                        onChange={(event) =>
                          onChange(player.id, field, Number(event.target.value))
                        }
                        type="number"
                        value={resultForm[player.id]?.[field] || 0}
                      />
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className={`max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white p-6 shadow-xl ${
          wide ? "max-w-5xl" : "max-w-md"
        }`}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            Fechar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({
  disabled,
  onCancel,
  onSave,
}: {
  disabled: boolean;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <button
        className="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
        disabled={disabled}
        onClick={onCancel}
        type="button"
      >
        Cancelar
      </button>
      <button
        className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-60"
        disabled={disabled}
        onClick={onSave}
        type="button"
      >
        <Save className="h-4 w-4" />
        {disabled ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
}

function buildInitialResultForm(
  players: Player[],
  events: MatchEvent[],
  matchId: number
): PlayerResultForm {
  const form = Object.fromEntries(
    players.map((player) => [
      player.id,
      { goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
    ])
  ) as PlayerResultForm;

  for (const event of events.filter((item) => item.match_id === matchId)) {
    const current = form[event.player_id];
    if (!current) continue;

    if (event.type === "goal") current.goals = event.quantity;
    if (event.type === "assist") current.assists = event.quantity;
    if (event.type === "yellow_card") current.yellowCards = event.quantity;
    if (event.type === "red_card") current.redCards = event.quantity;
  }

  return form;
}

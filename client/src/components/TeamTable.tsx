"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTeams, subscribeToTournamentChanges } from "@/services/tournamentService";
import type { Team } from "@/types/tournament";

export default function TeamTable() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadTeams = useCallback(async () => {
    try {
      setError(null);
      setTeams(await getTeams());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar times.");
    }
  }, []);

  useEffect(() => {
    loadTeams();
    return subscribeToTournamentChanges(loadTeams);
  }, [loadTeams]);

  const groups = useMemo(() => {
    return teams.reduce<Record<string, Team[]>>((acc, team) => {
      acc[team.group_name] = [...(acc[team.group_name] || []), team];
      return acc;
    }, {});
  }, [teams]);

  const groupNames = Object.keys(groups).sort();

  return (
    <section className="min-h-[300px] bg-[#fdfaf3] px-4 py-8">
      <h3 className="mb-8 text-center text-2xl font-bold text-[#2d1f0f]">
        Times Inscritos
      </h3>

      {error ? (
        <p className="mx-auto mb-6 max-w-3xl rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mx-auto flex max-w-4xl flex-col gap-8 md:flex-row">
        {(groupNames.length ? groupNames : ["A", "B"]).map((groupName) => (
          <div className="flex-1 rounded-lg bg-white p-6 shadow" key={groupName}>
            <h4 className="mb-4 text-center text-xl font-semibold text-[#557489]">
              {groupName === "null"
                ? "Grupos a definir"
                : `Grupo ${groupName}`}
            </h4>
            <ul className="divide-y divide-[#d0bb94]">
              {(groupName !== null && (groups[groupName] || []).length) ? (
                groups[groupName].map((team) => (
                  <li
                    className="py-3 text-center font-medium uppercase text-[#2d1f0f]"
                    key={team.id}
                  >
                    {team.name}
                  </li>
                ))
              ) : (
                <li className="py-3 text-center font-medium text-[#2d1f0f]">
                  A definir
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

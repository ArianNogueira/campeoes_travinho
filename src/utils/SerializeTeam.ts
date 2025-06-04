import { Team } from "../entity/Team";

function serializeTeam(team: Team) {
  return {
    id: team.id,
    name: team.name,
    group: team.group,
    captain: {
      id: team.captain.id,
      name: team.captain.name,
      playerNumber: team.captain.playerNumber,
      position: team.captain.position,
    },
    players: team.players.map((p) => ({
      id: p.id,
      name: p.name,
      playerNumber: p.playerNumber,
      position: p.position,
    })),
  };
}

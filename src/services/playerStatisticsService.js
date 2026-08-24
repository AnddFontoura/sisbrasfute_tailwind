import api from "@/services/api"

export const playerStatisticsService = {
  getMatchStatistics(matchId) {
    return api.get(`/matches/${matchId}/statistics`)
  },

  saveMatchStatistics(matchId, statistics) {
    return api.post(`/matches/${matchId}/statistics`, { statistics })
  },

  getPlayerAccumulatedStats(teamId, teamPlayerId) {
    return api.get(`/team-player/${teamId}/statistics/${teamPlayerId}`)
  },
}

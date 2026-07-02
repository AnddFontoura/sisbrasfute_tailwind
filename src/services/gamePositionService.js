import api from "@/services/api"

export const fetchGamePositions = async (teamId = null) => {
  const { data } = await api.get("/game-positions/list", {
    params: { teamId },
  })

  return data?.gamePositions ?? []
}

export default fetchGamePositions

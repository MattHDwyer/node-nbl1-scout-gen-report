import axios, { AxiosError, AxiosResponse } from "axios";
type PlayerDetails = {
  playerName: string;
  playerId: string;
  playerImages: any;
}[];

export const fetchTeamStats = (teamId: string, xquarksrc: string) => {
  return axios
    .request({
      url: `https://prod.services.nbl.com.au/api_cache/nbl1/synergy?route=seasons/3de7ce6a-8f7f-11ee-bad3-bbd508c2b45e/entities/${teamId}/roster&format=true&include=persons&offset=0`,
      method: "GET",
      headers: {
        "x-quark-req-src": `${xquarksrc}`,
      },
    })
    .then((res: AxiosResponse) => {
      const data: any = res.data.includes.resources.persons;

      const player_name_ids: PlayerDetails = Object.values(data).map(
        (player: any) => {
          return {
            playerName: player.nameFullLocal,
            playerId: player.personId,
            playerImages: player.images,
          };
        }
      );
      return player_name_ids;
    })
    .then((player_name_ids) => {
      let promises = player_name_ids.map(async (player) => {
        return {
          playerName: player.playerName,
          playerId: player.playerId,
          playerCareerStats: await fetchPlayerCareerStats(
            player.playerId,
            xquarksrc
          ),
          player2023Stats: await fetchPlayerLastSeasonStats(
            player.playerId,
            xquarksrc
          ),
          playerImages: player.playerImages[0],
        };
      });
      return Promise.all(promises);
    })
    .then((playerStats) => {
      // sort player stats by points
      const playerStatsSorted = playerStats.sort((a, b) => {
        const pointsPerGameA = a.playerCareerStats.pointsPerGame || 0; // Default to 0 if pointsPerGame is undefined
        const pointsPerGameB = b.playerCareerStats.pointsPerGame || 0; // Default to 0 if pointsPerGame is undefined
        return pointsPerGameB - pointsPerGameA;
      });
      return playerStatsSorted;
    })
    .catch((error: AxiosError) => {
      console.error("Error:", error);
    });
};

const fetchPlayerCareerStatsRequest = (id: string, xquarksrc: string) =>
  axios.request({
    url: `https://prod.services.nbl.com.au/api_cache/nbl1/synergy?route=statistics/for/person/in/career/persons/${id}&format=true`,
    method: "GET",
    headers: {
      "x-quark-req-src": `${xquarksrc}`,
    },
  });

const fetchPlayerLastSeasonStatsRequest = (id: string, xquarksrc: string) =>
  axios.request({
    url: `https://prod.services.nbl.com.au/api_cache/nbl1/synergy?route=statistics/for/person/in/seasons/10efdc48-70a7-11ed-8fed-2d98d9fac4b4&format=true&personId=${id}&fields=statistics`,
    method: "GET",
    headers: {
      "x-quark-req-src": `${xquarksrc}`,
    },
  });

export const fetchPlayerCareerStats = async (id: string, xquarksrc: string) => {
  const careerData = await fetchPlayerCareerStatsRequest(id, xquarksrc);
  return careerData.data.data[0]?.statistics ?? {};
};

export const fetchPlayerLastSeasonStats = async (
  id: string,
  xquarksrc: string
) => {
  const lastSeasonData = await fetchPlayerLastSeasonStatsRequest(id, xquarksrc);
  return lastSeasonData.data.data[0]?.statistics ?? {};
};

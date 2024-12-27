import axios, { AxiosError, AxiosResponse } from "axios";
type PlayerDetails = {
  playerName: string;
  playerId: string;
  playerImages: any;
}[];

export const fetchTeamStats = (teamId: string) => {
  return axios
    .request({
      url: `https://prod.services.nbl.com.au/api_cache/nbl1/synergy?route=seasons/3de7ce6a-8f7f-11ee-bad3-bbd508c2b45e/entities/${teamId}/roster&format=true&include=persons&offset=0`,
      method: "GET",
      headers: {
        "x-quark-req-src": "web-nbl1-nbl1",
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
        try {
          return {
            playerName: player.playerName,
            playerId: player.playerId,
            playerCareerStats: await fetchPlayerCareerStats(player.playerId),
            player2023Stats: await fetchPlayerLastSeasonStats(player.playerId),
            player2024Stats: await fetchPlayerCurrentSeasonStast(
              player.playerId
            ),
            playerLastFiveGames: await fetchPlayerLastFiveGamesStats(
              player.playerId
            ),
            playerImages: player.playerImages[0],
          };
        } catch (err) {
          console.log("Error fetching player stats", err);
          console.log("PLAYER CAUSING ERROR: ", player.playerName);
        }
      });
      return Promise.all(promises);
    })
    .then((playerStats) => {
      // sort player stats by points
      const playerStatsSorted = playerStats.sort((a, b) => {
        const pointsPerGameA = a?.player2024Stats.pointsPerGame || 0; // Default to 0 if pointsPerGame is undefined
        const pointsPerGameB = b?.player2024Stats.pointsPerGame || 0; // Default to 0 if pointsPerGame is undefined
        return pointsPerGameB - pointsPerGameA;
      });
      return playerStatsSorted;
    })
    .catch((error: AxiosError) => {
      console.error("Error:", error);
    });
};

const fetchPlayerCurrentSeasonStatsRequest = (id: string) =>
  axios.request({
    url: `https://prod.services.nbl.com.au/api_cache/nbl1/synergy?route=statistics/for/person/in/seasons/3de7ce6a-8f7f-11ee-bad3-bbd508c2b45e&format=true&personId=${id}&fields=statistics`,
    method: "GET",
    headers: {
      "x-quark-req-src": "web-nbl1-nbl1",
    },
  });

const fetchPlayerCurrentSeasonLastFiveGamesRequest = (id: string) =>
  axios.request({
    url: `https://prod.services.nbl.com.au/api_cache/nbl1/synergy?route=statistics/for/person/in/seasons/3de7ce6a-8f7f-11ee-bad3-bbd508c2b45e&format=true&personId=${id}&fields=statistics&limit=5&`,
    method: "GET",
    headers: {
      "x-quark-req-src": "web-nbl1-nbl1",
    },
  });

const fetchPlayerCareerStatsRequest = (id: string) =>
  axios.request({
    url: `https://prod.services.nbl.com.au/api_cache/nbl1/synergy?route=statistics/for/person/in/career/persons/${id}&format=true`,
    method: "GET",
    headers: {
      "x-quark-req-src": "web-nbl1-nbl1",
    },
  });

const fetchPlayerLastSeasonStatsRequest = (id: string) =>
  axios.request({
    url: `https://prod.services.nbl.com.au/api_cache/nbl1/synergy?route=statistics/for/person/in/seasons/10efdc48-70a7-11ed-8fed-2d98d9fac4b4&format=true&personId=${id}&fields=statistics`,
    method: "GET",
    headers: {
      "x-quark-req-src": "web-nbl1-nbl1",
    },
  });

export const fetchPlayerCareerStats = async (id: string) => {
  const careerData = await fetchPlayerCareerStatsRequest(id);
  return careerData.data.data[0]?.statistics ?? {};
};

export const fetchPlayerLastSeasonStats = async (id: string) => {
  try {
    const lastSeasonData = await fetchPlayerLastSeasonStatsRequest(id);
    return lastSeasonData.data.data[0]?.statistics ?? {};
  } catch (err) {
    console.log("FAILED PLAYER ID: ", id);
    console.log(err);
    throw new Error("Error fetching player last season stats");
  }
};

export const fetchPlayerCurrentSeasonStast = async (id: string) => {
  const thisSeasonData = await fetchPlayerCurrentSeasonStatsRequest(id);
  return thisSeasonData.data.data[0]?.statistics ?? {};
};

export const fetchPlayerLastFiveGamesStats = async (id: string) => {
  try {
    const lastFiveGamesData =
      await fetchPlayerCurrentSeasonLastFiveGamesRequest(id);
    return lastFiveGamesData.data.data[0]?.statistics ?? {};
  } catch (err) {
    console.log(err);
  }
};

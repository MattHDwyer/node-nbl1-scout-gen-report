import axios from "axios";

export const fetchTeamDetails = () => {
  return axios
    .request({
      url: "https://apicdn.nbl1.com.au/nbl1/items/teams?sort=name&filter[status]=published&filter[conference]=south&filter[division]=women",
      method: "GET",
    })
    .then((res) => {
      const teamDetails = res.data.data.map((team: any) => {
        return {
          name: team.name,
          id: team.team_id,
          logoUrl: team.logo_url,
        };
      });
      return teamDetails;
    });
};

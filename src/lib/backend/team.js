import { RootBackend } from "./utils";

class Team {
  constructor() {
    this.TeamBackend = RootBackend;
    this.TeamBackend.defaults.url = '/team';
    this.TeamBackend.defaults.headers = {
      ...this.TeamBackend.defaults.headers,
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    };
  }

  async Create(name) {
    try {
      const res = await this.TeamBackend.post(`${this.TeamBackend.defaults.url}/create`, { 
        name:name
      });
      localStorage.removeItem("token")
      localStorage.setItem("token",res.data.message.token);
      return {
        success: true,
        secret: res.data.message.secret,
        msg: "Team Created successfully",
      }
    } catch (error) {
      return {
        success: false,
        msg: error.response ? error.response.data.message : "Unknown error occured",
        status: error.response ? error.response.status : 500,
        response: error.response,
      }
    }
  }

  info = async (id = null) => {
    try {
      let response;
      if (id) {
        response = await this.TeamBackend.get(`${this.TeamBackend.defaults.url}/info/${id}`);
      } else {
        response = await this.TeamBackend.get(`${this.TeamBackend.defaults.url}/info/me`);
      }
      return {
        success:true,
        info: {
          members: response.data.Members,
          solves: response.data.Solves,
          teamID: response.data.team_id,
          leaderID: response.data.team_leader,
          name: response.data.team_name,
          points: response.data.team_points,
          secret: response.data.team_secret,
        }
      }
    } catch (error) {
      return {
        success: false,
        msg: error.response ? error.response.data.message : "Unknown error occured",
        status: error.response ? error.response.status : 500,
        response: error.response,
      }
    }
  }

  async Join(name, secret) {
    try {
      const res = await this.TeamBackend.post(`${this.TeamBackend.defaults.url}/join`, {
        name:name, 
        secret:secret 
      });
      localStorage.removeItem("token")
      localStorage.setItem("token",res.data.message.token);
      return {
        success: true,
        msg: "User joined the team successfully",
      }
    } catch (error) {
      return {
        success: false,
        msg: error.response ? error.response.data.message : "Unknown error occured",
        status: error.response ? error.response.status : 500,
        response: error.response,
      }
    }
  }
}

export default Team;


import { RootBackend } from "./utils";

class User {
  constructor() {
    this.UserBackend = RootBackend;
    this.UserBackend.defaults.url = `/user`;
  }

  async SignUp(username, regno, email, password) {
    try {
      const res = await this.UserBackend.post(this.UserBackend.defaults.url + '/signup', {
        username: username,
        regno: regno,
        password: password,
        email: email
      });

      localStorage.setItem("token", res.data.message.token);
      return {
        success: true,
        msg: "User Signed Up successfully",
        status: res.status
      };
    } catch (error) {
      return {
        success: false,
        msg: error.response ? error.response.data.message : "Unknown error has occurred",
        response: error.response,
        status: error.response ? error.response.status : undefined
      };
    }
  }

  async Login(username, password) {
    try {
      const res = await this.UserBackend.post(this.UserBackend.defaults.url + '/login', {
        username: username,
        password: password
      });

      localStorage.setItem("token", res.data.message.token);

      return {
        success: true,
        msg: "User logged in successfully",
        status: res.status
      };
    } catch (error) {
      return {
        success: false,
        response: error.response,
        msg: error.response ? error.response.data.message : "Unknown error has occurred",
        status: error.response ? error.response.status : undefined
      };
    }
  }

  async HasValidSession() {
    return localStorage.getItem("token") !== null;
  }
}

export default User;

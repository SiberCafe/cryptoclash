import { RootBackend } from "./utils";

const getCategories = (type) => {
  if (typeof type !== "number") return ["Unknown"];

  const categories = [
    "WebExp",
    "BinExp",
    "OSINT",
    "Reversing",
    "Forensics",
    "Crypto",
    "Misc",
  ];

  const binary = type.toString(2).padStart(categories.length, "0").split("").reverse();

  return categories.filter((_, index) => binary[index] === "1");
};

class CTF {
  constructor() {
    this.CTFBackend = RootBackend
    this.CTFBackend.defaults.url = '/ctf'
    this.CTFBackend.defaults.headers = {
      ...this.CTFBackend.defaults.headers,
      'Authorization':`Bearer ${localStorage.getItem("token")}`
    }
  }

  info = async (id) => {
    try {
      const response = await this.CTFBackend.get(`${this.CTFBackend.defaults.url}/info/${id}`)
      return {
        success: true,
        info:{
          ID: response.data.message.ctf_id,
          name: response.data.message.name,
          description: response.data.message.description,
          author: response.data.message.author,
          type: getCategories(response.data.message.type), // Change this for the bits thing
          points: response.data.message.points,
          solver: response.data.message.solver,
          links: response.data.message.links
        }
      }
    } catch (error) {
      return {
        success: false,
        status: error.response ? error.response.status : 500,
        msg: error.response ? error.response.data.message : "Unknown error occured",
        response: error.response
      }
    }
  }

  list = async () => {
    try {
      const response = await this.CTFBackend.get(`${this.CTFBackend.defaults.url}/list`)
      return {
        success:true,
        list: response.data
      }
    } catch(error) {
      return {
        success:false,
        status: error.response ? error.response.status : 500,
        msg: error.response ? error.response.data.message : "Unknown error occured",
        response: error.response
      }
    }
  }

  submit = async (flag,id) => {
    try {
      await this.CTFBackend.post(`${this.CTFBackend.defaults.url}/submit`,{
        "ctf_id":id,
        flag: flag, 
      })
      return {
        success: true,
        msg: "Flag submitted successfully"
      }
    } catch (error) {
      return {
        success: false,
        blocked: error.response.status === 429,
        valid_flag: error.response.status === 429 ? null : error.response.status !== 403,
        already_solved: error.response.status === 429 ? null : error.response.status === 409,
        status: error.response.status,
        error: error.response.status === 500 ? error.response.data.message : "Unknown error occured",
      }
    }
  }
}

export default CTF;

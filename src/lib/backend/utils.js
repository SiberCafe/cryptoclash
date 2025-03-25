import axios from "axios";

export const RootBackend = axios.create({
  baseURL: 'https://ccb.roboticsclubvitc.co/api',
  headers: { 
    'Content-Type':'application/json'
  }
})

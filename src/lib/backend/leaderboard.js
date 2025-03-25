import { RootBackend } from "./utils";

class Leaderboard {
  constructor() {
    this.LBBackend = RootBackend;
    this.LBBackend.defaults.url = "/leaderboard";
    this.interval = 1500;
    this.data = null;
    this.listeners = new Set();
    this.timer = null;
    this.latestUpdate = Number(sessionStorage.getItem("latestUpdate")) || 0;
  }

  start = () => {
    if (this.timer) return;

    const fetchData = async () => {
      let url = this.latestUpdate === 0 
        ? `${this.LBBackend.defaults.url}` 
        : `${this.LBBackend.defaults.url}?time=${this.latestUpdate}`;

      try {
        const res = await this.LBBackend.get(url);
        
        if (res.status === 200) {
          if (res.data.time > this.latestUpdate) {
            this.data = res.data.leaderboard.sort((a, b) => b.points - a.points);
            this.latestUpdate = res.data.time;

            sessionStorage.setItem("latestUpdate", this.latestUpdate);
            sessionStorage.setItem("leaderboardData", JSON.stringify(this.data));

            this.notifyListeners({ status: 200, data: this.data });
          }
        } else if (res.status === 204) {
          this.notifyListeners({ status: 204 });
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      }
    };

    this.timer = setInterval(fetchData, this.interval);
    fetchData();
  };

  stop = () => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  };

  subscribe = (listener) => {
    this.listeners.add(listener);
    const cachedData = JSON.parse(sessionStorage.getItem("leaderboardData"));
    if (cachedData) {
      listener({ status: 200, data: cachedData });
    }
    return () => this.listeners.delete(listener);
  };

  notifyListeners = (response) => {
    this.listeners.forEach((listener) => listener(response));
  };
}

export default Leaderboard;


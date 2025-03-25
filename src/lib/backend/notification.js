import { RootBackend } from "./utils";

class Notification {
  constructor() {
    this.NotifBackend = RootBackend;
    this.NotifBackend.defaults.url = "/notification";
    this.data = null;
    this.listeners = new Set();
    this.interval = null;
    this.delay = 1000; // Default delay
  }

  start = () => {
    console.log("me called");
    if (this.interval) return; // Prevent duplicate intervals

    const fetchData = async () => {
      try {
        const res = await this.NotifBackend.get(this.NotifBackend.defaults.url);

        if (res.status === 200 && res.data.notification) {
          this.data = res.data.notification;
          this.notifyListeners();
          this.delay = 1000; // Delay 1s for next poll
        } else if (res.status === 204) {
          this.delay = 500; // Delay 0.5s for next poll
        }
      } catch (error) {
        console.error("Notification fetch error:", error);
        this.delay = 500; // Retry faster on error
      }
  
      this.interval = setTimeout(fetchData, this.delay); // Recursive polling with dynamic delay
    };

    fetchData(); // Immediate fetch on start
  };

  stop = () => {
    if (this.interval) {
      clearTimeout(this.interval); // Correctly stop the timeout
      this.interval = null;
    }
  };
  
  subscribe = (listener) => {
    this.listeners.add(listener);
    listener(this.data); // Send initial data if available
    return () => this.listeners.delete(listener);
  };

  notifyListeners = () => {
    this.listeners.forEach((listener) => listener(this.data));
  };

  update = (setData) => {
    this.subscribe((newData) => setData(newData));
  };
}

export default Notification;


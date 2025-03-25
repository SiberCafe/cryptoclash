import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { motion } from "framer-motion";
import ParticlesComponent from "../../components/main/particle";
import LeaderboardAPI from "../../lib/backend/leaderboard";

const Leaderboard = () => {
  const leaderboard = new LeaderboardAPI();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const retryDelay = 500;
  const location = useLocation();
  const [visible, setVisible] = useState(location.pathname === "/leaderboard");

  useEffect(() => {
    setVisible(location.pathname === "/leaderboard");
  }, [location]);

  useEffect(() => {
    if (!visible) return; // 🚀 If not visible, don't even start!

    let retryTimeout = null;
    const abortController = new AbortController(); // ✅ NEW: Abort controller

    const fetchData = async () => {
      try {
        const cachedData = JSON.parse(sessionStorage.getItem("leaderboardData"));
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error reading cached leaderboard data:", error);
      }

      const unsubscribe = leaderboard.subscribe((response) => {
        if (!visible || abortController.signal.aborted) return; // 🚀 STOP if not visible

        if (response.status === 200) {
          setData(response.data);
          sessionStorage.setItem("leaderboardData", JSON.stringify(response.data));
        } else if (response.status === 204) {
          console.log("⚠ No new data. Keeping existing leaderboard.");
        } else {
          console.error("❌ API Error! Retrying in 0.5s...");
          retryTimeout = setTimeout(fetchData, retryDelay);
        }
        setLoading(false);
      });

      leaderboard.start();

      return () => {
        clearTimeout(retryTimeout);
        unsubscribe(); // ✅ Ensures the subscription stops
        leaderboard.stop(); // ✅ NEW: Hard stop leaderboard calls
        abortController.abort(); // ✅ NEW: Cancel any ongoing requests
      };
    };

    fetchData();

    return () => {
      console.log("🛑 Cleaning up API calls...");
      clearTimeout(retryTimeout);
      leaderboard.stop();
      abortController.abort(); // 🚀 Ensure all calls are stopped
    };
  }, [visible]); // ✅ Runs only when visibility changes

  // Memoized search filter
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.map((team) => ({
      ...team,
      hidden: !team.team_name.toLowerCase().includes(search.toLowerCase()),
    }));
  }, [search, data]);

  // Search input handler
  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center min-h-screen bg-transparent text-white p-4 relative"
    >
      <ParticlesComponent id="particles" className="absolute inset-0 -z-10" />

      <div className="w-full max-w-5xl p-8 sm:p-12 bg-[#121212]/30 backdrop-blur-md rounded-xl 
                      border border-[#00FF00]/60 transition-all duration-500">
        
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-6 uppercase text-[#00FF00] tracking-wide 
                       bg-[#00FF00]/10 p-4 rounded-lg shadow-md border-b-4 border-[#ADFF2F]/70">
          Leaderboard
        </h2>

        {/* 🔍 Search Bar */}
        <div className="mb-6 flex justify-center w-full">
          <input
            type="text"
            placeholder="Search for a team..."
            className="w-full sm:w-3/4 p-3 text-lg rounded-lg border border-[#00FF00]/60 bg-[#1A1A1A]/50 text-white
                      focus:outline-none focus:ring-4 focus:ring-[#ADFF2F]/60 transition-all duration-300 shadow-md"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {loading && (
          <div className="text-center text-[#00FF00] text-xl py-6 animate-pulse">
            🚀 Fetching leaderboard...
          </div>
        )}

        {/* 🏆 Leaderboard Table */}
        <div className="overflow-x-auto">
          <Table className="w-full text-sm sm:text-lg">
            <TableHeader>
              <TableRow className="bg-[#0F0F0F]/50 text-[#00FF00] text-lg sm:text-xl shadow-md border-b-2 border-[#ADFF2F]/60">
                <TableHead className="text-left p-4 sm:p-6">Position</TableHead>
                <TableHead className="text-left p-4 sm:p-6">Team Name</TableHead>
                <TableHead className="text-left p-4 sm:p-6">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.some((team) => !team.hidden) ? (
                filteredData.map((team, index) =>
                  team.hidden ? null : (
                    <TableRow 
                      key={team.teamId} 
                      className="border-b border-[#00FF00]/40 text-lg sm:text-xl bg-[#161616]/40 
                                 transition-all duration-300 cursor-pointer 
                                 hover:scale-[1.03]"
                    >
                      <TableCell className="p-4 sm:p-6 text-[#00FF00] font-bold">{index + 1}</TableCell>
                      <TableCell className="p-4 sm:p-6">{team.team_name}</TableCell>
                      <TableCell className="p-4 sm:p-6">{team.points}</TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="text-center p-6 text-lg text-red-500">
                    🚨 No teams found!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;


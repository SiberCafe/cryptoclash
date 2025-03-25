import { useState, useEffect } from "react";
import ParticlesComponent from "../../components/main/particle";
import LockedCardDialog from "../../components/main/cards";
import { Toaster } from "../../components/ui/toaster";
import CTF from "../../lib/backend/ctf";

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCTFData = async () => {
      try {
        const ctf_data = new CTF();
        const data = await ctf_data.list(); // Wait for async function

        if (data.success) {
          setProblems(data.list);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false); // Stop loading when request completes
      }
    };

    fetchCTFData();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-6">
      {/* 🟢 Toaster Component for Showing Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <ParticlesComponent id="particles" className="absolute inset-0 -z-10" />

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-3xl sm:text-5xl font-bold text-green-500 text-center">
            ⏳ Loading challenges...
          </p>
        </div>
      ) : problems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {problems.map((problem) => (
            <LockedCardDialog key={problem.ctf_id} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-3xl sm:text-5xl font-bold text-green-500 text-center">
            🚀 No questions right now!
          </p>
          <p className="text-lg sm:text-xl text-green-400 mt-2 text-center">
            Check back later for new challenges.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


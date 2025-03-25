import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Lock, Unlock } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import CTF from "../../lib/backend/ctf";

const LockedCardDialog = ({ problem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [problemDetails, setProblemDetails] = useState(null);
  const { toast } = useToast();
  const ctfBackend = new CTF();

  const fetchProblemInfo = async (id) => {
    setLoading(true);
    const response = await ctfBackend.info(id);
    if (response.success) {
      setProblemDetails(response.info);
    } else {
      toast({
        title: "Error",
        description: response.msg || "Failed to fetch problem details.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleCardClick = () => {
    setShowDialog(true);
    fetchProblemInfo(problem.id);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    const response = await ctfBackend.submit(answer, problem.id);

    if (response.success) {
      toast({
        title: "Correct Flag!",
        description: "Well done! You solved the challenge 🎉",
        variant: "success",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: response.blocked ? "Too Many Attempts!" : "Incorrect Flag!",
        description: response.blocked
          ? "Slow down! You've submitted too many times."
          : response.already_solved
          ? "You've already solved this challenge!"
          : "Try again, keep hacking! 🚀",
        variant: "destructive",
      });
    }
    setAnswer("");
  };

  return (
    <div className="p-5 cursor-pointer">
      {/* 🔥 The part your team likes (kept same) */}
      <motion.div
        className="relative w-[200px] h-[200px] sm:w-[300px] sm:h-[200px] bg-[#121212] rounded-2xl shadow-[0_0_25px_#00FF00] 
        border-4 border-[#ADFF2F] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_#00FF00] hover:-translate-y-1"
        whileHover={{ rotate: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCardClick}
      >
        <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-[#ADFF2F] text-black px-6 py-2 text-lg font-bold rounded-md shadow-md">
          <h1>{problem.solved ? "Solved" : "Open"}</h1>
        </div>

        <motion.div 
          className="absolute inset-0 flex justify-center items-center"
          animate={{ scale: isOpen ? 1.2 : 1 }}
          transition={{ duration: 0.5 }}
        >
          {problem.solved ? (
            <Unlock size={70} className="text-[#ADFF2F] transition-all duration-500" />
          ) : (
            <Lock size={70} className="text-[#ADFF2F] transition-all duration-500" />
          )}
        </motion.div>

        <div className="absolute bottom-4 right-4 text-white px-5 py-2 rounded-lg text-lg font-bold shadow-md">
          {problem.points} Pts
        </div>
      </motion.div>

      {/* 🛠️ Improved Dialog Layout */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-[70vw] sm:max-w-[50vw] bg-[#121212] border-[#00FF00] border-2 shadow-lg text-white p-8 rounded-lg transition-all duration-300">
          
          <DialogTitle className="text-3xl font-bold text-[#ADFF2F] text-center">
            {loading ? "⏳ Loading..." : problemDetails ? problemDetails.name : "⚠️ Error"}
          </DialogTitle>

          {loading ? (
            <p className="text-xl text-green-400 text-center">⏳ Fetching challenge details...</p>
          ) : problemDetails ? (
            <div className="flex flex-col gap-5 mt-4">
              
              {/* 🖋️ Author (No Background) */}
              <p className="text-lg text-center text-gray-300">
                <span className="text-[#ADFF2F] font-semibold">By:</span>
                <span className="ml-2 font-medium">{problemDetails.author || "Unknown"}</span>
              </p>

              {/* 🟢 Category Boxes */}
              {problemDetails.type && problemDetails.type.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {problemDetails.type.map((category, index) => (
                    <span 
                      key={index}
                      className="bg-[#00FF00] text-black px-3 py-1 text-md font-semibold rounded-md shadow-md"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Challenge Description */}
              <p className="text-lg text-gray-100 bg-[#1C1C1C] p-4 rounded-md shadow-md">
                {problemDetails.description || "No description available."}
              </p>

              {/* Points Display */}
              <div className="text-center">
                <span className="bg-[#00FF00] text-black px-4 py-2 text-lg font-semibold rounded-md shadow-md">
                  {problemDetails.points || 0} Points
                </span>
              </div>

              {/* Links Section */}
              {problemDetails.links && problemDetails.links.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {problemDetails.links.map((link, index) => (
                    <a 
                      key={index} 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#00FF00] bg-[#1A1A1A] px-4 py-2 rounded-lg shadow-md hover:bg-[#00FF00] hover:text-black transition-all duration-300"
                    >
                       Link {index + 1}
                    </a>
                  ))}
                </div>
              )}

              {/* Flag Submission Box */}
              <div className="flex flex-col gap-3 mt-4">
                <input
                  type="text"
                  placeholder={problem.solved ? "🎉 Challenge Solved" : "Enter your Flag"}
                  className={`w-full p-4 text-lg rounded-md border-2 transition-all duration-300 shadow-md
                    ${problem.solved 
                      ? "border-gray-600 text-gray-400 bg-gray-800 cursor-not-allowed" 
                      : "border-[#00FF00] bg-[#1A1A1A] text-white focus:ring-4 focus:ring-[#ADFF2F]"
                    }`}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={problem.solved}
                />

                {!problem.solved && (
                  <Button 
                    className="w-full bg-[#00FF00] hover:bg-[#ADFF2F] text-black font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                    onClick={handleSubmit}
                  >
                    🚀 Submit Answer
                  </Button>
                )}
              </div>

            </div>
          ) : (
            <p className="text-xl text-red-500 text-center">⚠️ Failed to load details.</p>
          )}
          
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LockedCardDialog;


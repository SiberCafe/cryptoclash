import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { HyperText } from "../../components/magicui/hyper-text";
import ParticlesComponent from "../../components/main/particle";
import Team from "../../lib/backend/team";

const MainTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [teamSecret, setTeamSecret] = useState("");
  const [joinTeamName, setJoinTeamName] = useState("");
  const [joinSecret, setJoinSecret] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [showTeamNameDialog, setShowTeamNameDialog] = useState(false);
  const team_data = new Team();

  // Function to create a team
  
// Function to create a team
const handleCreateTeam = async () => {
  if (!teamName.trim()) {
    alert("Please enter a valid team name!");
    return;
  }

  const create_data = await team_data.Create(teamName);

  if (create_data.success) {
    setTeamSecret(create_data.secret);
    setShowCreateDialog(true);
    setShowTeamNameDialog(false);
  } else if (create_data.status === 400) {
    // If the team already exists, fetch the existing team info
    const team_info = await team_data.info();

    if (team_info.success) {
      alert("You are already in a team")
      setTeamName(team_info.info.name); // Set the existing team name
      setTeamSecret(team_info.info.secret); // Set the existing secret
      setShowCreateDialog(true);
      setShowTeamNameDialog(false);
    } else {
      alert("Error in retrieving team info: " + team_info.msg);
    }
  } else {
    alert("Error in creating team: " + create_data.msg);
  }
};

  // Function to join a team
  
  const handleJoinTeam = async () => {
    if (!joinTeamName.trim()) {
      alert("Please enter a team name!");
      return;
    }
    if (joinSecret.length !== 32) {
      alert("Please enter a valid 32-character secret key!");
      return;
    }

    const join_data = await team_data.Join(joinTeamName, joinSecret);

    if (join_data.success) {
      alert("Successfully joined the team!");
      setShowJoinDialog(false);
      setJoinTeamName("");
      setJoinSecret("");
    } else {
      alert("Joining failed: " + join_data.msg);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white p-6">
      <ParticlesComponent id="particles" className="absolute inset-0 -z-10" />

      {/* 🔥 ADD TEAM is back with HyperText */}
      <h1 className="text-4xl font-bold text-[#00FF00] mb-6">
        <HyperText>ADD TEAM</HyperText>
      </h1>

      {/* Buttons - Reduced Size */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex gap-6"
      >
        <Button 
          onClick={() => setShowTeamNameDialog(true)} 
          className="bg-[#00FF00] hover:bg-[#ADFF2F] text-black font-semibold py-2.5 px-6 text-base rounded-lg 
                    transition-all duration-300 transform hover:scale-105"
        >
          Create Team
        </Button>
        <Button 
          onClick={() => setShowJoinDialog(true)} 
          className="bg-[#FF3131] hover:bg-[#FF6347] text-black font-semibold py-2.5 px-6 text-base rounded-lg 
                    transition-all duration-300 transform hover:scale-105"
        >
          Join Team
        </Button>
      </motion.div>

      {/* Dialog for entering team name */}
      <Dialog open={showTeamNameDialog} onOpenChange={setShowTeamNameDialog}>
        <DialogContent className="bg-[#121212]/80 backdrop-blur-md border-[#00FF00] border-2 shadow-lg text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#ADFF2F] mb-4">Enter Team Name</h2>
          <input 
            type="text" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            placeholder="Team Name" 
            className="w-full p-3 text-black font-semibold text-lg rounded-lg"
          />
          <Button 
            onClick={handleCreateTeam} 
            className="w-full bg-[#00FF00] hover:bg-[#ADFF2F] text-black font-semibold py-2.5 rounded-lg text-lg mt-4 
                      transition-all duration-300 transform hover:scale-105"
          >
            Generate Secret
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog to show created team's secret */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-[#121212]/80 backdrop-blur-md border-[#00FF00] border-2 shadow-lg text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#ADFF2F] mb-4">Team Created</h2>
          <p className="text-lg mb-2">Team Name: <span className="font-bold">{teamName}</span></p>
          <motion.div 
            className="text-lg font-bold text-[#00FF00] bg-[#1A1A1A]/50 px-6 py-4 rounded-lg border-2 border-[#ADFF2F] 
                      shadow-md text-center break-all select-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            {teamSecret}
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Dialog to join a team */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="bg-[#121212]/80 backdrop-blur-md border-[#FF3131] border-2 shadow-lg text-white p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-[#FF3131] mb-4">Join a Team</h2>
          <input 
            type="text" 
            value={joinTeamName} 
            onChange={(e) => setJoinTeamName(e.target.value)} 
            placeholder="Team Name" 
            className="w-full p-3 text-black font-semibold text-lg rounded-lg mb-4"
          />
          <input 
            type="text" 
            value={joinSecret} 
            onChange={(e) => setJoinSecret(e.target.value)} 
            placeholder="Enter 32-character Secret Key" 
            maxLength="32"
            className="w-full p-3 text-black font-semibold text-lg rounded-lg mb-4"
          />
          <Button 
            onClick={handleJoinTeam} 
            className="w-full bg-[#FF3131] hover:bg-[#FF6347] text-black font-semibold py-2.5 rounded-lg text-lg 
                      transition-all duration-300 transform hover:scale-105"
          >
            Join Team
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainTeam;


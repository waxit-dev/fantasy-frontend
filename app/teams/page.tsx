import { User, Trophy } from "lucide-react";
import Link from 'next/link';
import SeasonCountdown from "@/components/SeasonCountdown";

export default async function Teams() {
  const teams = await fetch('http://localhost:5000/api/teams').then((res) => res.json());
  let completedSeasons: any[] = [];
  
  try {
    const seasons = await fetch('http://localhost:5000/api/seasons').then((res) => res.json());
    completedSeasons = seasons.seasons?.filter((s: any) => s.status === 'completed' && s.winnerTeamName) || [];
  } catch (error) {
    console.error('Error fetching seasons:', error);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex flex-row w-full justify-between h-5 mb-4">
          <h1><a href="/" className="underline">Home</a> > Leaderboard</h1>
          <SeasonCountdown />
        </div>
        
        {/* Previous Season Winners */}
        {completedSeasons.length > 0 && (
          <div className="w-full mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Previous Season Winners
            </h2>
            <div className="flex flex-wrap gap-4">
              {completedSeasons.map((season: any) => (
                <div key={season.id} className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-700">Season {season.seasonNumber}:</span>
                  <span className="text-blue-600 font-semibold">
                    {season.winnerTeamName}
                  </span>
                  <span className="text-gray-600">({season.winnerScore?.toFixed(2) || 0} pts)</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <Link href="/hall-of-fame" className="text-sm text-blue-600 underline">
                View Hall of Fame →
              </Link>
            </div>
          </div>
        )}
        
        <div className="flex flex-col w-full">
          {teams.map((team, i) => (
            <div key={team.id || i} className="flex flex-row justify-between items-center w-full mt-5 border border-gray-300 p-6">
              <div className="flex flex-row items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 font-bold text-lg">
                  {i + 1}
                </div>
                <User size={60} strokeWidth={0.5} className="border border-gray-300 rounded-full" />
                <p className="underline">
                  <Link href={`/teams/${team.slug}`}>{team.name}</Link>
                </p>
              </div>
              <div className="flex flex-row justify-between w-1/2 gap-8">
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600">Weekly Points</p>
                  <p className="font-semibold">{team.weekly_points || 0}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="font-semibold">{team.total_points || 0}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600">Avg Team Rating</p>
                  <p className="font-semibold">{(team.avg_team_rating || 0).toFixed(2)}</p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm text-gray-600">Leaderboard Score</p>
                  <p className="font-bold text-lg text-blue-600">{(team.leaderboard_score || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


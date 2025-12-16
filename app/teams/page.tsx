import { User } from "lucide-react";
import Link from 'next/link';

export default async function Teams() {
  const teams = await fetch('http://localhost:5000/api/teams').then((res) => res.json());

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex flex-row w-full justify-between h-5 mb-4">
          <h1><a href="/" className="underline">Home</a> > Leaderboard</h1>
          <p>Season Ends 42d 16h 15m 30s</p>
        </div>
        <div className="flex flex-col w-full">
          {teams.map((team, i) => (
            <div key={team.id || i} className="flex flex-row justify-between items-center w-full mt-5 border border-gray-300 p-6">
              <div className="flex flex-row items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 font-bold text-lg">
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


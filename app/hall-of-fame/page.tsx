import { Trophy, Medal, Award } from "lucide-react";
import Link from 'next/link';

export default async function HallOfFame() {
  const seasons = await fetch('http://localhost:5000/api/seasons').then((res) => res.json()).catch(() => ({ seasons: [] }));
  
  const completedSeasons = seasons.seasons?.filter((s: any) => s.status === 'completed' && s.winnerTeamName) || [];
  
  // Get snapshots for each completed season to show top 3
  const seasonsWithSnapshots = await Promise.all(
    completedSeasons.map(async (season: any) => {
      try {
        const snapshot = await fetch(`http://localhost:5000/api/seasons/${season.id}/snapshot`).then((res) => res.json()).catch(() => ({ snapshot: [] }));
        return {
          ...season,
          topThree: snapshot.snapshot?.slice(0, 3) || []
        };
      } catch (error) {
        return {
          ...season,
          topThree: []
        };
      }
    })
  );

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex flex-row w-full justify-between h-5 mb-4">
          <h1><a href="/" className="underline">Home</a> > Hall of Fame</h1>
        </div>
        
        <div className="w-full">
          <div className="mb-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Hall of Fame</h2>
            <p className="text-gray-600">Celebrating the champions of each season</p>
          </div>
          
          {seasonsWithSnapshots.length === 0 ? (
            <div className="flex justify-center items-center w-full h-64 border border-gray-300 p-6 rounded-lg">
              <p className="text-gray-500">No completed seasons yet. Be the first champion!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seasonsWithSnapshots.map((season: any) => (
                <div key={season.id} className="border border-gray-300 rounded-lg p-6 bg-gradient-to-br from-yellow-50 to-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-600" />
                      Season {season.seasonNumber}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {new Date(season.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Winner */}
                  <div className="mb-4 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Medal className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">Champion</span>
                    </div>
                    <Link 
                      href={`/teams/${season.winnerTeamId}`} 
                      className="text-xl font-bold text-yellow-900 hover:underline"
                    >
                      {season.winnerTeamName}
                    </Link>
                    <p className="text-sm text-gray-700 mt-1">
                      Score: {season.winnerScore?.toFixed(2) || 0}
                    </p>
                  </div>
                  
                  {/* Top 3 Podium */}
                  {season.topThree && season.topThree.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700 mb-2">Top 3</h4>
                      {season.topThree.map((team: any, index: number) => (
                        <div 
                          key={team.teamId} 
                          className={`flex items-center justify-between p-3 rounded ${
                            index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                            index === 1 ? 'bg-gray-100 border border-gray-300' :
                            'bg-orange-50 border border-orange-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {index === 0 && <Medal className="w-5 h-5 text-yellow-600" />}
                            {index === 1 && <Medal className="w-5 h-5 text-gray-500" />}
                            {index === 2 && <Award className="w-5 h-5 text-orange-600" />}
                            <span className="font-bold text-gray-700">#{team.position}</span>
                            <span className="font-semibold">
                              {team.teamName}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {team.leaderboardScore.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


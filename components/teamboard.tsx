"use client";
import { Forklift, Monitor, UserRound } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function TeamBoard() {
    const router = useRouter();

  const userTeam = localStorage.getItem("userTeam");

  if (!userTeam) {
      router.push("/auth/login");
  }

  const { name, slug, cash, total_points, weekly_points} = userTeam;

  // Ensure there are at least 5 players for the layout
  const topPlayers = players.slice(0, 3);
  const bottomPlayers = players.slice(3, 5);
  const officePositions = ['CS', 'CC', 'PR'];
  const warehousePositions = ['PI', 'PA'];

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex flex-row w-full h-5 mb-4 px-8 justify-between">
          <h1>{name} | TTP: {total_points} | WP: {weekly_points} | Cash: ${cash}</h1>
          <div className="flex flex-row">
            <a href="/teams" className="underline mx-2">Leaderboard</a>
            <a href="/players" className="underline">Player List</a>
          </div>
        </div>

        <div className="grid w-full h-full grid-cols-[30%_70%]">
          <div className="grid border border-gray-300 grid-rows-2">
            <div className="grid justify-center items-center">
              <Monitor size={240} strokeWidth={0.5} />
            </div>
            <div className="grid border-t border-gray-300 justify-center items-center">
              <Forklift size={240} strokeWidth={0.5} />
            </div>
          </div>

          {/* Players grid */}
          <div className="grid gap-0 border border-l-0 border-gray-300">
            {/* Top row with 3 columns */}
            <div className="grid grid-cols-3 divide-x divide-gray-300 border-t border-gray-300">
              {topPlayers.map((player, i) => (
                <div key={player.id} className="p-6 flex flex-col justify-between items-center">
                  <p>{officePositions[i]}</p>
                  <UserRound size={80} strokeWidth={0.25} className="border border-gray-300 rounded-full mt-2" />
                  <p>{player.name}</p>
                  <p>{player.overall.toFixed(1)}</p>
                  <div className="flex flex-col text-sm my-2">
                    <p>Attendance: {player.attendance}</p>
                    <p>Social: {player.social}</p>
                    <p>Productivity: {player.productivity}</p>
                    <p>Intensity: {player.intensity}</p>
                    <p>Specialty Rating: {player.specialty_rating}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row with 2 columns */}
            <div className="grid grid-cols-2 divide-x divide-gray-300 border-t border-gray-300">
              {bottomPlayers.map((player, i) => (
                <div key={player.id} className="p-6 flex flex-col justify-between items-center">
                  <p>{warehousePositions[i]}</p>
                  <UserRound size={80} strokeWidth={0.25} className="border border-gray-300 rounded-full mt-2" />
                  <p>{player.name}</p>
                  <p>{player.overall.toFixed(1)}</p>
                  <div className="flex flex-col text-sm my-2">
                    <p>Attendance: {player.ratings.attendance}</p>
                    <p>Social: {player.ratings.social}</p>
                    <p>Productivity: {player.ratings.productivity}</p>
                    <p>Intensity: {player.ratings.intensity}</p>
                    <p>Specialty Rating: {player.ratings.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

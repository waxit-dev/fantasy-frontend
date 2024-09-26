import { User } from "lucide-react";
import Link from 'next/link';

export default async function Teams() {
  const teams = await fetch('http://localhost:5000/api/teams').then((res) => res.json());
  console.log(teams[0].slug);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex flex-row w-full justify-between h-5 mb-4">
          <h1><a href="/" className="underline">Home</a> > Leaderboard</h1>
          <p>Season Ends 42d 16h 15m 30s</p>
        </div>
        <div className="flex flex-col w-full">
          {teams.map((team, i) => (
            <div key={i} className="flex flex-row justify-between items-center w-full mt-5 border border-gray-300 p-6">
              <div className="flex flex-row items-center">
                <User size={60} strokeWidth={0.5} className="border border-gray-300 rounded-full mr-4" />
                <p className="underline">
                  <Link href={`/teams/${team.slug}`}>{team.name}</Link>
                </p>
              </div>
              <div className="flex flex-row justify-between w-1/6">
                <div className="flex flex-col items-center"></div>
                <div className="flex flex-col items-center">
                  <p>WP</p>
                  <p>99</p>
                </div>
                <div className="flex flex-col items-center">
                  <p>TTP</p>
                  <p>{team.points}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


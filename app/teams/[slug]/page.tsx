import { Forklift, Monitor, UserRound } from "lucide-react";


// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const teams = await fetch('http://localhost:5000/api/teams').then((res) => res.json());

  // Return the dynamic params to populate the [slug] segment
  return teams.map((team) => ({
    slug: team.slug,  // Assuming the API returns a slug for each team
  }));
}

export default async function TeamProfile({ params }: { params: { slug: string } }) {
  // Fetch the specific team based on the slug from the URL
  const teamData = await fetch(`http://localhost:5000/api/teams/${params.slug}`).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch team');
    }
    return res.json();
  }).catch((error) => {
    console.error('Error fetching team:', error);
    return null;
  });

  if (!teamData || !teamData.userTeam) {
    return <div>Loading...</div>;  // Handle loading or error case
  }

  const { userTeam, userPlayers } = teamData;
  const { name, cash, total_points, weekly_points } = userTeam;
  const players = userPlayers || [];

  // Placeholder player object
  const placeholderPlayer = {
    "id": "00",
    "name": "Place Holder",
    "specialty": "None",
    "role": "None",
    "overall_rating": "00.0",
    "attendance": "00",
    "social": "00",
    "productivity": "00",
    "intensity": "00",
    "specialty_rating": "00",
    "salary": "00.00",
    "notion_name": null
  };

  // Function to fill missing positions with the placeholder player
  const fillPositions = (positions: string[], players: any[]) => {
    return positions.map(position => {
      const playerInPosition = players.find(player => player.position === position);
      return playerInPosition || { ...placeholderPlayer, position };
    });
  };

  // Ensure there are at least 5 players for the layout
  const officePositions = ['CS', 'CC', 'PR'];
  const warehousePositions = ['PI', 'PA'];
  // Fill missing office and warehouse positions
  const filledOfficePlayers = fillPositions(officePositions, players);
  const filledWarehousePlayers = fillPositions(warehousePositions, players);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex flex-row w-full h-5 mb-4 px-8 justify-between">
          <h1>{name} | TTP: {total_points} | WP: {weekly_points} | Cash: ${parseInt(cash).toFixed(0)}</h1>
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
              {filledOfficePlayers.map((player, i) => (
                <div key={1000 + i} className="p-6 flex flex-col justify-between items-center">
                  <p>{officePositions[i]}</p>
                  <UserRound size={80} strokeWidth={0.25} className="border border-gray-300 rounded-full mt-2" />
                  <p>{player.name}</p>
                  <p>{player.overall_rating}</p>
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
              {filledWarehousePlayers.map((player, i) => (
                <div key={2000 + i} className="p-6 flex flex-col justify-between items-center">
                  <p>{warehousePositions[i]}</p>
                  <UserRound size={80} strokeWidth={0.25} className="border border-gray-300 rounded-full mt-2" />
                  <p>{player.name}</p>
                  <p>{player.overall_rating}</p>
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
          </div>
        </div>
      </main>
    </div>
  );
}

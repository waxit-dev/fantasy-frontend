"use client";
import { Forklift, Monitor, UserRound } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function TeamBoard() {
    const router = useRouter();

    const storedTeam = localStorage.getItem("userTeam");
    let userTeam;
    if (storedTeam) {
        userTeam = JSON.parse(storedTeam);
    } else {
        router.push("/auth/login");
    }

    const storedPlayers = localStorage.getItem("teamPlayers");
    let players;

    if (storedPlayers) {
        try {
            players = JSON.parse(storedPlayers);
            if (players.length < 5) {
                let tempPlayers = Array(5 - players.length).fill(
                    {
                        id: 0,
                        name: "Select Player",
                        overall_rating: 0.00,
                        attendance: 0,
                        social: 0,
                        productivity: 0,
                        intensity: 0,
                        specialty_rating: 0,
                        salary: 0
                    }
                );
                players = [...players, ...tempPlayers];
            }
        } catch (error) {
            console.error("Error parsing JSON from localStorage.", error);
            players = Array(5).fill(
                {
                    id: 0,
                    name: "Select Player",
                    overall_rating: 0.00,
                    attendance: 0,
                    social: 0,
                    productivity: 0,
                    intensity: 0,
                    specialty_rating: 0,
                    salary: 0
                }
            );
        }
    } else {
        players = Array(5).fill(
            {
                id: 0,
                name: "Select Player",
                overall_rating: 0.00,
                attendance: 0,
                social: 0,
                productivity: 0,
                intensity: 0,
                specialty_rating: 0,
                salary: 0
            }
        );
    }

    const { name, cash, total_points, weekly_points } = userTeam;

    // Ensure there are at least 5 players for the layout
    //const topPlayers = players.slice(0, 3);
    //const bottomPlayers = players.slice(3, 5);
    const officePositions = ['CS', 'CC', 'PR'];
    const warehousePositions = ['PI', 'PA'];
    // Filter players based on their positions
    const officePlayers = players.filter(player => officePositions.includes(player.position));
    const warehousePlayers = players.filter(player => warehousePositions.includes(player.position));


    return (
        <div className="w-full h-full">
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
                        {officePlayers.map((player, i) => (
                            <div key={player.id} className="p-6 flex flex-col justify-between items-center">
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
                        {warehousePlayers.map((player, i) => (
                            <div key={player.id} className="p-6 flex flex-col justify-between items-center">
                                <p>{warehousePositions[i]}</p>
                                <UserRound size={80} strokeWidth={0.25} className="border border-gray-300 rounded-full mt-2" />
                                <p>{player.name}</p>
                                <p>{player.overall_rating}</p>
                                <div className="flex flex-col text-sm my-2">
                                    <p>Attendance: {player.attendance}</p>
                                    <p>Social: {player.social}</p>
                                    <p>Productivity: {player.productivity}</p>
                                    <p>Intensity: {player.intensity}</p>
                                    <p>Specialty Rating: {player.specialty}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

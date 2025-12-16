"use client";
import { Forklift, Monitor, UserRound } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function TeamBoard() {
    const router = useRouter();
    const [teamData, setTeamData] = useState<any>(null);
    const [players, setPlayers] = useState<any[]>([]);

    // Fetch team and players data
    const fetchTeamData = async () => {
        console.log('fetchTeamData');
        const storedTeam = localStorage.getItem("userTeam");
        if (storedTeam) {
            const userTeam = JSON.parse(storedTeam);

            // Assuming you have an endpoint to fetch updated team data
            const response = await fetch(`http://localhost:5000/api/teams/${userTeam.id}`);
            const data = await response.json();
            console.log(data);
            setTeamData(data.userTeam);
            setPlayers(data.userPlayers);
        } else {
            router.push("/auth/login");
        }
    };

    useEffect(() => {
        fetchTeamData(); // Initial data fetch when the component loads
    }, []); // Runs once on mount

    // Sell player function
    const sellPlayer = async (player: any) => {
        if (!teamData || !teamData.id || player.id === "00") return; // Can't sell placeholder

        try {
            const response = await fetch("http://localhost:5000/api/players/sell", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    teamId: teamData.id,
                    playerId: player.id,
                }),
            });

            if (response.ok) {
                // Refetch team and players data after a successful sale
                await fetchTeamData();
            } else {
                const errorData = await response.json();
                console.error('Failed to sell player:', errorData.message);
                alert(`Failed to sell player: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error selling player:', error);
            alert('Error selling player. Please try again.');
        }
    };
    // Function to fill missing positions with the placeholder player
    const fillPositions = (positions: string[], players: any[]) => {
        return positions.map(position => {
            let placeholderPlayer = {
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
            }
            const playerInPosition = players.find(player => player.position === position);
            return playerInPosition || { ...placeholderPlayer, position };
        });
    };

    if (!teamData) {
        return <div>Loading...</div>;
    }
    const { name, cash, total_points, weekly_points } = teamData;

    // Ensure there are at least 5 players for the layout
    const officePositions = ['CS', 'CC', 'PR'];
    const warehousePositions = ['PI', 'PA'];
    // Fill missing office and warehouse positions
    const filledOfficePlayers = fillPositions(officePositions, players);
    const filledWarehousePlayers = fillPositions(warehousePositions, players);

    return (
        <div className="w-full h-full">
            <div className="flex flex-row w-full h-5 mb-4 px-8 justify-between">
                <h1>{name} | TTP: {total_points} | WP: {weekly_points} | Cash: ${parseInt(cash).toFixed(0)}</h1>
                <div className="flex flex-row">
                    <a href="/teams" className="underline mx-2">Leaderboard</a>
                    <a href="/players" className="underline mx-2">Player List</a>
                    <a href="/tasks" className="underline">Task List</a>
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
                                    {player.salary && <p>Salary: ${parseFloat(player.salary).toFixed(2)}</p>}
                                </div>
                                {player.id !== "00" && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" size="sm" className="mt-2">
                                                SELL
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Sell {player.name}?</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to sell this player? You will receive ${parseFloat(player.salary || 0).toFixed(2)} back to your team's cash. This action cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="destructive" onClick={() => sellPlayer(player)}>
                                                    Confirm Sell
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )}
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
                                    {player.salary && <p>Salary: ${parseFloat(player.salary).toFixed(2)}</p>}
                                </div>
                                {player.id !== "00" && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" size="sm" className="mt-2">
                                                SELL
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Sell {player.name}?</DialogTitle>
                                                <DialogDescription>
                                                    Are you sure you want to sell this player? You will receive ${parseFloat(player.salary || 0).toFixed(2)} back to your team's cash. This action cannot be undone.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <Button variant="destructive" onClick={() => sellPlayer(player)}>
                                                    Confirm Sell
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

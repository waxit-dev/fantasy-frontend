"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react";
import { revalidatePath } from "next/cache";

const formatCurrency = (number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0, // Removes the decimal places
    }).format(number);
};

export default function PlayerList(params) {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState("");
    const storedTeam = localStorage.getItem("userTeam");
    let userTeam;
    if (storedTeam) {
        userTeam = JSON.parse(storedTeam);
    } else {
        router.push("/auth/login");
    }

    const storedPlayers = localStorage.getItem("teamPlayers");
    const players = JSON.parse(storedPlayers);
    const { name, cash } = userTeam;
    const [teamPlayersCount, setTeamPlayersCount] = useState(players.length);

    const buyPlayer = async (player) => {
        try {
            const response = await fetch("http://localhost:5000/api/players/purchase", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    teamId: userTeam.id,  // teamId from localStorage
                    playerId: player.id,
                    position: selectedRole
                }),
            });

            if (response.ok) {
                console.log(`Player ${player.id} successfully purchased!`);
                const data = await response.json();
                const updatedUserTeam = data.userTeam;
                const updatedTeamPlayers = data.teamPlayers;
                localStorage.setItem("teamPlayers", JSON.stringify(updatedTeamPlayers));
                localStorage.setItem("userTeam", JSON.stringify(updatedUserTeam));
                setTeamPlayersCount(updatedTeamPlayers.length);
                revalidatePath("/players");
            } else {
                console.error("Failed to purchase the player");
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };


    return (
        <div className="w-full h-full">
            <div className="flex flex-row w-full justify-between h-5 mb-4">
                <h1><a href="/" className="underline">Home</a> > Players</h1>
                <div className="flex flex-row justify-between">
                    <p>Cash ${cash} | Selected {teamPlayersCount}/5</p>
                </div>
            </div>
            <div className="flex flex-col w-full">
                {params.fetchedPlayers.map((player, i: number) => (
                    <div key={i} className="flex flex-row justify-between items-center w-full mt-5 border border-gray-300 p-6">
                        <div className="flex flex-row items-center">
                            <User size={60} strokeWidth={0.5} className="border border-gray-300 rounded-full mr-4" />
                            <p>{player.name}</p>
                        </div>
                        <div className="flex flex-row items-center justify-between w-1/2">
                            <div className="flex flex-col items-left w-1/5">
                                <p>{player.role}</p>
                            </div>
                            <div className="flex flex-col items-left w-1/12">
                                <p>{player.overall_rating}</p>
                            </div>
                            <div className="flex flex-col items-center w-1/5">
                                <p>{player.specialty}</p>
                                <p>{player.specialty_rating}</p>
                            </div>
                            <div className="flex flex-col items-left w-1/5">
                                <p>Attendance: {player.attendance}</p>
                                <p>Social: {player.social}</p>
                                <p>Productivity: {player.productivity}</p>
                                <p>Intensity: {player.intensity}</p>
                            </div>
                            <div className="flex flex-col items-center w-1/6">
                                <p className="mb-2">{formatCurrency(player.salary)}</p>
                                <Dialog>
                                    {players.some((matchedPlayer) => matchedPlayer.id === player.id) ? (
                                        <p>Contracted</p>
                                    ) : (
                                        <DialogTrigger asChild>
                                            <Button type="submit" onClick={() => buyPlayer(player)}>
                                                BUY
                                            </Button>
                                        </DialogTrigger>
                                    )}
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Buy {player.name}?</DialogTitle>
                                            <DialogDescription>
                                                Select a role for the player and click 'BUY'. This action can't be undone.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="role" className="text-right">
                                                    Role
                                                </Label>
                                                <Select onValueChange={setSelectedRole} value={selectedRole}>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CC">CC</SelectItem>
                                                        <SelectItem value="CS">CS</SelectItem>
                                                        <SelectItem value="PR">PR</SelectItem>
                                                        <SelectItem value="PI">PI</SelectItem>
                                                        <SelectItem value="PA">PA</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" onClick={() => buyPlayer(player)}>
                                                BUY
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    );
}




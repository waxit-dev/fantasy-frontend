import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const formatCurrency = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, // Removes the decimal places
  }).format(number);
};

export default async function Players() {
    //const players = [{ name: "test 1" }, { name: "test 2" }, { name: "test 3" }, { name: "test 4" }, { name: "test 5" }, { name: "test 6" }];
    const players = await fetch('http://localhost:5000/api/players').then((res) => res.json());
    return (
        <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col row-start-2 items-center sm:items-start">
                <div className="flex flex-row w-full justify-between h-5 mb-4">
                    <h1><a href="/" className="underline">Home</a> > Players</h1>
                    <div className="flex flex-row justify-between">
                        <p>Cash $000000 | Selected 0/5</p>
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    {players.map((player, i) => (
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
                                    <Button variant="outline">BUY</Button>
                                </div>
                            </div>
                        </div>
                    ))
                    }
                </div>
            </main>
        </div>
    );
}

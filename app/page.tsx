import { Forklift, Monitor, UserRound } from "lucide-react";
export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col row-start-2 items-center sm:items-start">
                <div className="flex flex-row w-full h-5 mb-4 px-8 justify-between">
                <h1>Quadrigis Electrix</h1>
                    <div className="flex flex-row">
                        <h1>Team Spend $4958</h1>
                        <a href="/teams" className="underline mx-2" >Leaderboard</a>
                        <a href="/players" className="underline" >Player List</a>
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
                    <div className="grid gap-0 border border-l-0 border-gray-300">
                        {/* Top row with 4 columns */}
                        <div className="grid grid-cols-3 divide-x divide-gray-300">
                            <div className="p-6 flex flex-col justify-between items-center">

                            </div>
                            <div className="p-6 flex flex-col justify-between items-center">

                            </div>
                            <div className="p-6 flex flex-col justify-between items-center">

                            </div>
                        </div>
                        {/* Bottom row with 3 columns */}
                        <div className="grid grid-cols-2 divide-x divide-gray-300 border-t border-gray-300">
                            <div className="p-6 flex flex-col justify-between items-center">

                            </div>
                            <div className="p-6 flex flex-col justify-between items-center">

                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

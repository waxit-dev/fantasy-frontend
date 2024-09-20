import { Forklift, Monitor, UserRound } from "lucide-react";
export default function Home() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col row-start-2 items-center sm:items-start">
                <div className="flex flex-col h-5 mb-4">
                    <h1>Project Quadrigis Electrix</h1>
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
                            <div className="p-6 flex flex-col justify-evenly items-center">
                                <p>CS</p>
                                <UserRound size={120} strokeWidth={0.25} className="border border-gray-300 rounded-full" />
                                <div className="flex flex-col">
                                    <p>Overall: 99</p>
                                    <p>Punctuality: 88</p>
                                    <p>Social: 77</p>
                                    <p>Productivity: 66</p>
                                    <p>Intensity: 55</p>
                                    <p>Specialty: 44</p>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col justify-evenly items-center">
                                <p>CC</p>
                                <UserRound size={120} strokeWidth={0.25} className="border border-gray-300 rounded-full" />
                                <div className="flex flex-col">
                                    <p>Overall: 99</p>
                                    <p>Punctuality: 88</p>
                                    <p>Social: 77</p>
                                    <p>Productivity: 66</p>
                                    <p>Intensity: 55</p>
                                    <p>Specialty: 44</p>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col justify-evenly items-center">
                                <p>PROD</p>
                                <UserRound size={120} strokeWidth={0.25} className="border border-gray-300 rounded-full" />
                                <div className="flex flex-col">
                                    <p>Overall: 99</p>
                                    <p>Punctuality: 88</p>
                                    <p>Social: 77</p>
                                    <p>Productivity: 66</p>
                                    <p>Intensity: 55</p>
                                    <p>Specialty: 44</p>
                                </div>
                            </div>
                        </div>
                        {/* Bottom row with 3 columns */}
                        <div className="grid grid-cols-2 divide-x divide-gray-300 border-t border-gray-300">
                            <div className="p-6 flex flex-col justify-evenly items-center">
                                <p>PI</p>
                                <UserRound size={120} strokeWidth={0.25} className="border border-gray-300 rounded-full" />
                                <div className="flex flex-col">
                                    <p>Overall: 99</p>
                                    <p>Punctuality: 88</p>
                                    <p>Social: 77</p>
                                    <p>Productivity: 66</p>
                                    <p>Intensity: 55</p>
                                    <p>Specialty: 44</p>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col justify-evenly items-center">
                                <p>PA</p>
                                <UserRound size={120} strokeWidth={0.25} className="border border-gray-300 rounded-full" />
                                <div className="flex flex-col">
                                    <p>Overall: 99</p>
                                    <p>Punctuality: 88</p>
                                    <p>Social: 77</p>
                                    <p>Productivity: 66</p>
                                    <p>Intensity: 55</p>
                                    <p>Specialty: 44</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

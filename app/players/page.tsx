import PlayerList from "@/components/playerlist";

export default async function Players() {
    const players = await fetch('http://localhost:5000/api/players').then((res) => res.json());

    return (
        <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col row-start-2 items-center sm:items-start">
                <PlayerList fetchedPlayers={players}/>
            </main>
        </div>
    );
}

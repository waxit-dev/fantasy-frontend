import TeamBoard from "@/components/teamboard";

export default async function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <TeamBoard />
      </main>
    </div>
  );
}

import RegisterForm from "@/components/register";

export default async function Register() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex flex-row w-full justify-between h-5 mb-4">
        </div>
        <div className="flex flex-col w-full items-center">
           <RegisterForm /> 
        </div>
      </main>
    </div>
  );
}

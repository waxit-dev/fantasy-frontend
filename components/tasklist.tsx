"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface Task {
    id: string;
    title: string;
    description?: string;
}

export default function TaskList() {
    const router = useRouter();
    const [teamData, setTeamData] = useState(null);

    // Define available tasks (templates)
    const availableTasks: Task[] = [
        {
            id: "add-product",
            title: "Add a product to the store",
            description: "Complete all steps to add a new product to the Shopify store"
        }
    ];

    // Fetch team data
    const fetchTeamData = async () => {
        const storedTeam = localStorage.getItem("userTeam");
        if (storedTeam) {
            const userTeam = JSON.parse(storedTeam);
            const response = await fetch(`http://localhost:5000/api/teams/${userTeam.id}`);
            const data = await response.json();
            setTeamData(data.userTeam);
        } else {
            router.push("/auth/login");
        }
    };

    useEffect(() => {
        fetchTeamData();
    }, []);

    if (!teamData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full h-full">
            <div className="flex flex-row w-full justify-between h-5 mb-4">
                <h1><a href="/" className="underline">Home</a> > Task List</h1>
            </div>
            <div className="flex flex-col w-full gap-4">
                {availableTasks.map((task) => (
                    <Link key={task.id} href={`/tasks/${task.id}`}>
                        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                            <CardHeader>
                                <CardTitle>{task.title}</CardTitle>
                                {task.description && (
                                    <CardDescription>{task.description}</CardDescription>
                                )}
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

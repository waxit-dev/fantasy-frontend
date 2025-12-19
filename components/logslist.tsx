"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface Delegation {
    delegatedTeamId: number;
    delegatedTeamName: string;
    delegatedTeamSlug: string;
    delegatingTeamId: number;
    delegatingTeamName: string;
    delegatingTeamSlug: string;
    pointsAwarded: number;
}

interface LogEntry {
    id: number;
    taskId: string;
    taskName: string;
    teamId: number;
    teamName: string;
    teamSlug: string;
    completedAt: string;
    pointsAwarded: number;
    delegations: Delegation[];
    disputeCount: number;
    isResolved: boolean;
    disputingTeamIds: number[];
}

export default function LogsList() {
    const router = useRouter();
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState<any>(null);
    const [disputingLogId, setDisputingLogId] = useState<number | null>(null);

    useEffect(() => {
        const storedTeam = localStorage.getItem("userTeam");
        if (storedTeam) {
            const userTeam = JSON.parse(storedTeam);
            console.log('Team data loaded:', userTeam);
            setTeamData(userTeam);
        } else {
            console.log('No team data found in localStorage');
        }
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/logs');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched logs:', data.logs);
                setLogs(data.logs || []);
            } else {
                console.error('Failed to fetch logs');
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDispute = async (log: LogEntry) => {
        if (!teamData || !teamData.id) {
            alert('You must be logged in to dispute a task completion');
            return;
        }

        if (log.teamId === teamData.id) {
            alert('You cannot dispute your own task completion');
            return;
        }

        if (log.isResolved) {
            alert('This dispute has already been resolved and penalties have been applied');
            return;
        }

        if (!confirm(`Are you sure you want to dispute this task completion by ${log.teamName}?`)) {
            return;
        }

        setDisputingLogId(log.id);

        try {
            const response = await fetch(`http://localhost:5000/api/teams/${teamData.id}/dispute`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    taskCompletionId: log.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.penaltiesApplied) {
                    alert(`Dispute recorded! ${log.teamName} has been fined $15,000 and lost 50 points.`);
                } else {
                    alert(`Dispute recorded! (${data.disputeCount}/3 disputes needed for penalties)`);
                }
                // Refresh logs to show updated dispute count
                fetchLogs();
            } else {
                alert(data.message || 'Failed to submit dispute');
            }
        } catch (error) {
            console.error('Error disputing task:', error);
            alert('Error submitting dispute. Please try again.');
        } finally {
            setDisputingLogId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="w-full h-full">
                <div className="flex flex-row w-full justify-between h-5 mb-4">
                    <h1><a href="/" className="underline">Home</a> {'>'} Logs</h1>
                </div>
                <div className="flex justify-center items-center w-full h-64">
                    <p>Loading logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <div className="flex flex-row w-full justify-between h-5 mb-4">
                <h1><a href="/" className="underline">Home</a> {'>'} Logs</h1>
            </div>
            <div className="flex flex-col w-full">
                {logs.length === 0 ? (
                    <div className="flex justify-center items-center w-full h-64 border border-gray-300 p-6">
                        <p className="text-gray-500">No completed tasks yet.</p>
                    </div>
                ) : (
                    logs.map((log, i) => (
                        <div key={log.id || i} className="flex flex-col w-full mt-5 border border-gray-300 p-6">
                            <div className="flex flex-row justify-between items-center w-full mb-4">
                                <div className="flex flex-row items-center gap-4">
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-lg">{log.taskName}</p>
                                        <p className="text-sm text-gray-600">
                                            Completed by{' '}
                                            <Link href={`/teams/${log.teamSlug}`} className="underline">
                                                {log.teamName}
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-8 items-center">
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm text-gray-600">Points Awarded</p>
                                        <p className="font-semibold text-lg text-green-600">{log.pointsAwarded.toFixed(1)}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm text-gray-600">Completed At</p>
                                        <p className="font-semibold">{formatDate(log.completedAt)}</p>
                                    </div>
                                    {log.disputeCount > 0 && (
                                        <div className="flex flex-col items-end">
                                            <p className="text-sm text-gray-600">Disputes</p>
                                            <p className={`font-semibold ${log.disputeCount >= 3 ? 'text-red-600' : 'text-orange-600'}`}>
                                                {log.disputeCount}/3
                                            </p>
                                        </div>
                                    )}
                                    {log.isResolved && (
                                        <div className="flex flex-col items-end">
                                            <p className="text-sm text-red-600 font-semibold">Penalties Applied</p>
                                            <p className="text-xs text-gray-600">-$15,000, -50 pts</p>
                                        </div>
                                    )}
                                    {teamData && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDispute(log)}
                                            disabled={
                                                log.teamId === teamData.id || 
                                                log.isResolved || 
                                                disputingLogId === log.id || 
                                                (log.disputingTeamIds && log.disputingTeamIds.includes(teamData.id))
                                            }
                                            className="ml-4"
                                        >
                                            {disputingLogId === log.id 
                                                ? 'Disputing...' 
                                                : (log.disputingTeamIds && log.disputingTeamIds.includes(teamData.id))
                                                ? 'Disputed'
                                                : log.teamId === teamData.id
                                                ? 'Your Task'
                                                : log.isResolved
                                                ? 'Resolved'
                                                : 'Dispute'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {log.delegations && log.delegations.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Delegations:</p>
                                    <div className="flex flex-col gap-2">
                                        {log.delegations.map((delegation, idx) => (
                                            <div key={idx} className="flex flex-row items-center gap-2 text-sm">
                                                <span className="text-gray-600">
                                                    <Link href={`/teams/${delegation.delegatingTeamSlug}`} className="underline">
                                                        {delegation.delegatingTeamName}
                                                    </Link>
                                                    {' delegated to '}
                                                    <Link href={`/teams/${delegation.delegatedTeamSlug}`} className="underline">
                                                        {delegation.delegatedTeamName}
                                                    </Link>
                                                    {' for '}
                                                    <span className="font-semibold text-green-600">{delegation.pointsAwarded.toFixed(1)} points</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


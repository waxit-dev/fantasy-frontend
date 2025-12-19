"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getTaskConfig, ChecklistItem as TaskChecklistItem } from "@/lib/taskConfig";

interface ChecklistItem {
    id: string;
    description: string;
    points: number; // Team points
    checked: boolean;
    delegatedTo?: number | null; // Team ID that this item is delegated to
    assignedPlayerId?: number | null; // Player ID assigned to this item
    attribute?: 'attendance' | 'social' | 'productivity' | 'intensity' | null; // Attribute for player points
    attributePoints?: number; // Points awarded to players with matching attribute (defaults to same as points)
    specialty?: string | null; // Specialty name (e.g., "Finer Details", "Operational Backbone")
    specialtyPoints?: number; // Points awarded to players with matching specialty
    subItems?: ChecklistItem[];
}

interface TaskInstance {
    id: string; // Unique instance ID
    taskId: string; // Task template ID
    items: ChecklistItem[];
    submitted: boolean;
    submittedAt?: string;
}

export default function TaskDetail() {
    const router = useRouter();
    const params = useParams();
    const taskId = params?.id as string;
    
    const [teamData, setTeamData] = useState(null);
    const [teamPlayers, setTeamPlayers] = useState<any[]>([]);
    const [taskInstance, setTaskInstance] = useState<TaskInstance | null>(null);
    const [allTeams, setAllTeams] = useState([]);
    const [delegationDialogOpen, setDelegationDialogOpen] = useState<{ [itemId: string]: boolean }>({});
    const [selectedTeamForDelegation, setSelectedTeamForDelegation] = useState<{ [itemId: string]: string }>({});
    const [playerAssignmentDialogOpen, setPlayerAssignmentDialogOpen] = useState<{ [itemId: string]: boolean }>({});
    const [selectedPlayerForAssignment, setSelectedPlayerForAssignment] = useState<{ [itemId: string]: string }>({});

    // Initialize task template with checklist items from config
    const getTaskTemplate = (taskId: string): ChecklistItem[] => {
        const taskConfig = getTaskConfig(taskId);
        if (!taskConfig) {
            console.warn(`Task config not found for taskId: ${taskId}`);
            return [];
        }

        // Convert task config items to checklist items with default state
        const convertItem = (item: TaskChecklistItem): ChecklistItem => {
            const checklistItem: ChecklistItem = {
                id: item.id,
                description: item.description,
                points: item.points,
                checked: false,
                delegatedTo: null,
                assignedPlayerId: null,
                attribute: item.attribute || null,
                attributePoints: item.attributePoints,
                specialty: item.specialty || null,
                specialtyPoints: item.specialtyPoints,
            };

            if (item.subItems) {
                checklistItem.subItems = item.subItems.map(convertItem);
            }

            return checklistItem;
        };

        return taskConfig.items.map(convertItem);
    };

    // Fetch team data
    const fetchTeamData = async () => {
        const storedTeam = localStorage.getItem("userTeam");
        if (storedTeam) {
            const userTeam = JSON.parse(storedTeam);
            const response = await fetch(`http://localhost:5000/api/teams/${userTeam.id}`);
            const data = await response.json();
            setTeamData(data.userTeam);
            setTeamPlayers(data.userPlayers || []);
        } else {
            router.push("/auth/login");
        }
    };

    // Fetch all teams for delegation
    const fetchAllTeams = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/teams');
            const teams = await response.json();
            setAllTeams(teams);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    // Load or create task instance
    const loadTaskInstance = () => {
        if (!taskId) return;

        const storedInstances = localStorage.getItem(`taskInstances_${taskId}`);
        
        let instances: TaskInstance[] = [];
        if (storedInstances) {
            instances = JSON.parse(storedInstances);
        }

        // Find the most recent unsubmitted instance
        const activeInstance = instances
            .filter(inst => !inst.submitted)
            .sort((a, b) => {
                // Sort by ID (which contains timestamp) descending to get most recent
                return b.id.localeCompare(a.id);
            })[0];
        
        if (activeInstance) {
            setTaskInstance(activeInstance);
        } else {
            // Create new instance if all are submitted or none exist
            const newInstance: TaskInstance = {
                id: `instance_${Date.now()}`,
                taskId: taskId,
                items: getTaskTemplate(taskId),
                submitted: false
            };
            instances.push(newInstance);
            setTaskInstance(newInstance);
            localStorage.setItem(`taskInstances_${taskId}`, JSON.stringify(instances));
        }
    };

    useEffect(() => {
        fetchTeamData();
        fetchAllTeams();
        loadTaskInstance();
    }, [taskId]);

    // Calculate points for a specific item and its sub-items
    const calculateItemPoints = (item: ChecklistItem): number => {
        if (!item.checked) return 0;
        let points = item.points;
        if (item.subItems) {
            points += item.subItems.reduce((sum, subItem) => sum + calculateItemPoints(subItem), 0);
        }
        return points;
    };

    // Calculate total points for checked items
    const calculateTotalPoints = (items: ChecklistItem[]): number => {
        return items.reduce((total, item) => total + calculateItemPoints(item), 0);
    };

    // Toggle item checked state
    const toggleItem = (itemId: string) => {
        if (!taskInstance) return;

        const updateItems = (items: ChecklistItem[]): ChecklistItem[] => {
            return items.map(item => {
                if (item.id === itemId) {
                    return { ...item, checked: !item.checked };
                }
                if (item.subItems) {
                    return { ...item, subItems: updateItems(item.subItems) };
                }
                return item;
            });
        };

        const updatedInstance = {
            ...taskInstance,
            items: updateItems(taskInstance.items)
        };

        setTaskInstance(updatedInstance);
        
        // Save to localStorage
        const storedInstances = localStorage.getItem(`taskInstances_${taskId}`);
        let instances: TaskInstance[] = storedInstances ? JSON.parse(storedInstances) : [];
        const index = instances.findIndex(inst => inst.id === updatedInstance.id);
        if (index >= 0) {
            instances[index] = updatedInstance;
        } else {
            instances.push(updatedInstance);
        }
        localStorage.setItem(`taskInstances_${taskId}`, JSON.stringify(instances));
    };

    // Delegate item to another team
    const delegateItem = (itemId: string) => {
        if (!taskInstance) return;
        
        const selectedTeamId = selectedTeamForDelegation[itemId];
        if (!selectedTeamId) return;

        const teamId = parseInt(selectedTeamId);
        const updateItems = (items: ChecklistItem[]): ChecklistItem[] => {
            return items.map(item => {
                if (item.id === itemId) {
                    return { ...item, delegatedTo: teamId };
                }
                if (item.subItems) {
                    return { ...item, subItems: updateItems(item.subItems) };
                }
                return item;
            });
        };

        const updatedInstance = {
            ...taskInstance,
            items: updateItems(taskInstance.items)
        };

        setTaskInstance(updatedInstance);
        
        // Save to localStorage
        const storedInstances = localStorage.getItem(`taskInstances_${taskId}`);
        let instances: TaskInstance[] = storedInstances ? JSON.parse(storedInstances) : [];
        const index = instances.findIndex(inst => inst.id === updatedInstance.id);
        if (index >= 0) {
            instances[index] = updatedInstance;
        } else {
            instances.push(updatedInstance);
        }
        localStorage.setItem(`taskInstances_${taskId}`, JSON.stringify(instances));
        
        setDelegationDialogOpen({ ...delegationDialogOpen, [itemId]: false });
        setSelectedTeamForDelegation({ ...selectedTeamForDelegation, [itemId]: '' });
    };

    // Remove delegation from an item
    const removeDelegation = (itemId: string) => {
        if (!taskInstance) return;

        const updateItems = (items: ChecklistItem[]): ChecklistItem[] => {
            return items.map(item => {
                if (item.id === itemId) {
                    return { ...item, delegatedTo: null };
                }
                if (item.subItems) {
                    return { ...item, subItems: updateItems(item.subItems) };
                }
                return item;
            });
        };

        const updatedInstance = {
            ...taskInstance,
            items: updateItems(taskInstance.items)
        };

        setTaskInstance(updatedInstance);
        
        // Save to localStorage
        const storedInstances = localStorage.getItem(`taskInstances_${taskId}`);
        let instances: TaskInstance[] = storedInstances ? JSON.parse(storedInstances) : [];
        const index = instances.findIndex(inst => inst.id === updatedInstance.id);
        if (index >= 0) {
            instances[index] = updatedInstance;
        } else {
            instances.push(updatedInstance);
        }
        localStorage.setItem(`taskInstances_${taskId}`, JSON.stringify(instances));
    };

    // Assign player to an item
    const assignPlayer = (itemId: string) => {
        if (!taskInstance) return;
        
        const selectedPlayerId = selectedPlayerForAssignment[itemId];
        if (!selectedPlayerId) return;

        const playerId = parseInt(selectedPlayerId);
        const updateItems = (items: ChecklistItem[]): ChecklistItem[] => {
            return items.map(item => {
                if (item.id === itemId) {
                    return { ...item, assignedPlayerId: playerId };
                }
                if (item.subItems) {
                    return { ...item, subItems: updateItems(item.subItems) };
                }
                return item;
            });
        };

        const updatedInstance = {
            ...taskInstance,
            items: updateItems(taskInstance.items)
        };

        setTaskInstance(updatedInstance);
        
        // Save to localStorage
        const storedInstances = localStorage.getItem(`taskInstances_${taskId}`);
        let instances: TaskInstance[] = storedInstances ? JSON.parse(storedInstances) : [];
        const index = instances.findIndex(inst => inst.id === updatedInstance.id);
        if (index >= 0) {
            instances[index] = updatedInstance;
        }
        localStorage.setItem(`taskInstances_${taskId}`, JSON.stringify(instances));
        
        setPlayerAssignmentDialogOpen({ ...playerAssignmentDialogOpen, [itemId]: false });
        setSelectedPlayerForAssignment({ ...selectedPlayerForAssignment, [itemId]: '' });
    };

    // Remove player assignment from an item
    const removePlayerAssignment = (itemId: string) => {
        if (!taskInstance) return;

        const updateItems = (items: ChecklistItem[]): ChecklistItem[] => {
            return items.map(item => {
                if (item.id === itemId) {
                    return { ...item, assignedPlayerId: null };
                }
                if (item.subItems) {
                    return { ...item, subItems: updateItems(item.subItems) };
                }
                return item;
            });
        };

        const updatedInstance = {
            ...taskInstance,
            items: updateItems(taskInstance.items)
        };

        setTaskInstance(updatedInstance);
        
        // Save to localStorage
        const storedInstances = localStorage.getItem(`taskInstances_${taskId}`);
        let instances: TaskInstance[] = storedInstances ? JSON.parse(storedInstances) : [];
        const index = instances.findIndex(inst => inst.id === updatedInstance.id);
        if (index >= 0) {
            instances[index] = updatedInstance;
        }
        localStorage.setItem(`taskInstances_${taskId}`, JSON.stringify(instances));
    };

    // Submit task and award points
    const submitTask = async () => {
        if (!taskInstance || !teamData) return;

        // Collect all player assignments, task items with attributes/specialties, and calculate points by team
        const pointsByTeam: { [teamId: number]: { points: number; playerAssignments: any[]; taskItems: any[]; taskProductivityBonus?: number } } = {};

        const processItem = (item: ChecklistItem, teamId: number) => {
            // Process this item if it's checked and has points
            if (item.checked && item.points > 0) {
                const effectiveTeamId = item.delegatedTo || teamId;
                if (!pointsByTeam[effectiveTeamId]) {
                    pointsByTeam[effectiveTeamId] = { points: 0, playerAssignments: [], taskItems: [] };
                }
                pointsByTeam[effectiveTeamId].points += item.points;
                
                // If player is assigned, add to assignments
                if (item.assignedPlayerId) {
                    pointsByTeam[effectiveTeamId].playerAssignments.push({
                        playerId: item.assignedPlayerId,
                        taskItemId: item.id,
                        points: item.points
                    });
                }

                // If item has an attribute, add to taskItems for attribute point awards
                if (item.attribute) {
                    pointsByTeam[effectiveTeamId].taskItems.push({
                        itemId: item.id,
                        attribute: item.attribute,
                        attributePoints: item.attributePoints || item.points // Default to same as team points if not specified
                    });
                }

                // If item has a specialty, add to taskItems for specialty point awards
                if (item.specialty && item.specialtyPoints) {
                    pointsByTeam[effectiveTeamId].taskItems.push({
                        itemId: item.id,
                        specialty: item.specialty,
                        specialtyPoints: item.specialtyPoints
                    });
                }
            }

            // Process sub-items recursively
            if (item.subItems) {
                item.subItems.forEach(subItem => processItem(subItem, teamId));
            }
        };

        // Process all items (including nested ones)
        const currentTeamId = (teamData as any).id;
        taskInstance.items.forEach(item => processItem(item, currentTeamId));

        // Add overall task productivity bonus and task category if configured
        const taskConfig = getTaskConfig(taskId);
        if (taskConfig?.productivityBonus && pointsByTeam[currentTeamId]) {
            pointsByTeam[currentTeamId].taskProductivityBonus = taskConfig.productivityBonus;
        }
        const taskCategory = taskConfig?.taskCategory;

        // Submit task completion for each team
        const updatePromises = Object.entries(pointsByTeam).map(async ([teamIdStr, data]) => {
            try {
                const teamId = Number(teamIdStr);
                // For the current user's team, use the new endpoint with player assignments
                const currentTeamId = (teamData as any).id;
                if (teamId === currentTeamId) {
                    const response = await fetch(`http://localhost:5000/api/teams/${teamId}/tasks/complete-with-players`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            taskId: taskId,
                            points: data.points,
                            playerAssignments: data.playerAssignments,
                            taskItems: data.taskItems || [], // Items with attributes/specialties for point awards
                            taskProductivityBonus: data.taskProductivityBonus || 0, // Overall task productivity bonus
                            taskTags: [], // TODO: Add task tags from task metadata
                            taskType: null, // TODO: Add task type from task metadata
                            taskCategory: taskCategory // 'warehouse' or 'office'
                        }),
                    });

                    if (response.ok) {
                        const responseData = await response.json();
                        setTeamData(responseData.team);
                    } else {
                        console.error(`Failed to complete task:`, await response.text());
                    }
                } else {
                    // For delegated teams, use the old endpoint (backward compatibility)
                    const response = await fetch(`http://localhost:5000/api/teams/${teamId}/tasks/complete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            points: data.points
                        }),
                    });

                    if (!response.ok) {
                        console.error(`Failed to update team ${teamId} points:`, await response.text());
                    }
                }
            } catch (error) {
                console.error(`Error updating team ${teamIdStr} points:`, error);
            }
        });

        await Promise.all(updatePromises);

        // Mark instance as submitted
        const updatedInstance = {
            ...taskInstance,
            submitted: true,
            submittedAt: new Date().toISOString()
        };

        setTaskInstance(updatedInstance);
        
        // Save to localStorage
        const storedInstances = localStorage.getItem(`taskInstances_${taskId}`);
        let instances: TaskInstance[] = storedInstances ? JSON.parse(storedInstances) : [];
        const index = instances.findIndex(inst => inst.id === updatedInstance.id);
        if (index >= 0) {
            instances[index] = updatedInstance;
        }
        localStorage.setItem(`taskInstances_${taskId}`, JSON.stringify(instances));

        // Redirect back to task list
        router.push('/tasks');
    };

    // Render checklist item recursively
    const renderChecklistItem = (item: ChecklistItem, level: number = 0) => {
        const indentStyles = level > 0 ? { marginLeft: `${level * 1.5}rem` } : {};
        const delegatedTeam = allTeams.find((team: any) => String(team.id) === String(item.delegatedTo));
        const assignedPlayer = teamPlayers.find((player: any) => player.id === item.assignedPlayerId);
        
        return (
            <div key={item.id} className="mb-2" style={indentStyles}>
                <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer flex-1">
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleItem(item.id)}
                            disabled={taskInstance?.submitted}
                            className="mr-2 w-4 h-4 cursor-pointer"
                        />
                        <span className={item.checked ? "line-through text-gray-500" : ""}>
                            {item.description}
                            {item.points > 0 && (
                                <span className="ml-2 text-sm font-semibold text-green-600">
                                    +{item.points} team pts
                                </span>
                            )}
                            {item.attribute && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                                    {item.attribute}: +{item.attributePoints || item.points}
                                </span>
                            )}
                            {item.specialty && item.specialtyPoints && (
                                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">
                                    Specialty({item.specialty}): +{item.specialtyPoints}
                                </span>
                            )}
                        </span>
                    </label>
                    {!taskInstance?.submitted && (
                        <div className="ml-4 flex items-center gap-2">
                            {/* Player Assignment */}
                            {item.assignedPlayerId ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-purple-600">
                                        👤 {assignedPlayer?.name || 'Unknown'}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removePlayerAssignment(item.id)}
                                        className="h-6 px-2 text-xs"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <Dialog
                                    open={playerAssignmentDialogOpen[item.id] || false}
                                    onOpenChange={(open) =>
                                        setPlayerAssignmentDialogOpen({ ...playerAssignmentDialogOpen, [item.id]: open })
                                    }
                                >
                                    <DialogTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-6 px-2 text-xs"
                                            disabled={!!item.delegatedTo}
                                        >
                                            Assign Player
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Assign Player</DialogTitle>
                                            <DialogDescription>
                                                Select a player to assign to this task item. The player will earn attribute points based on task completion.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="player" className="text-right">
                                                    Player
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        setSelectedPlayerForAssignment({ ...selectedPlayerForAssignment, [item.id]: value })
                                                    }
                                                    value={selectedPlayerForAssignment[item.id] || ''}
                                                >
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select a player" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {teamPlayers.map((player: any) => (
                                                            <SelectItem key={player.id} value={player.id.toString()}>
                                                                {player.name} ({player.overall_rating})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                onClick={() => assignPlayer(item.id)}
                                                disabled={!selectedPlayerForAssignment[item.id]}
                                            >
                                                Assign
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                            
                            {/* Team Delegation */}
                            {item.delegatedTo ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-blue-600">
                                        → {(delegatedTeam as any)?.name || 'Unknown'}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeDelegation(item.id)}
                                        className="h-6 px-2 text-xs"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <Dialog
                                    open={delegationDialogOpen[item.id] || false}
                                    onOpenChange={(open) =>
                                        setDelegationDialogOpen({ ...delegationDialogOpen, [item.id]: open })
                                    }
                                >
                                    <DialogTrigger asChild>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-6 px-2 text-xs"
                                            disabled={!!item.assignedPlayerId}
                                        >
                                            Delegate
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Delegate Item</DialogTitle>
                                            <DialogDescription>
                                                Select a team to delegate this item to. The delegated team will receive points for this item when the task is submitted.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="team" className="text-right">
                                                    Team
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        setSelectedTeamForDelegation({ ...selectedTeamForDelegation, [item.id]: value })
                                                    }
                                                    value={selectedTeamForDelegation[item.id] || ''}
                                                >
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select a team" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(allTeams as any[])
                                                            .filter((team: any) => team.id !== (teamData as any)?.id)
                                                            .map((team: any) => (
                                                                <SelectItem key={team.id} value={team.id.toString()}>
                                                                    {team.name}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                onClick={() => delegateItem(item.id)}
                                                disabled={!selectedTeamForDelegation[item.id]}
                                            >
                                                Delegate
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    )}
                </div>
                {item.subItems && (
                    <div className="ml-6 mt-1">
                        {item.subItems.map(subItem => renderChecklistItem(subItem, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    if (!teamData || !taskInstance) {
        return <div>Loading...</div>;
    }

    const totalPoints = calculateTotalPoints(taskInstance.items);
    const taskConfig = getTaskConfig(taskId);
    const taskTitle = taskConfig?.title || "Task";

    return (
        <div className="w-full h-full">
            <div className="flex flex-row w-full justify-between h-5 mb-4">
                <h1>
                    <a href="/" className="underline">Home</a> {'>'} 
                    <a href="/tasks" className="underline"> Task List</a> {'>'} 
                    {taskTitle}
                </h1>
                <div className="flex flex-row justify-between items-center gap-4">
                    <p>Total Points: <span className="font-semibold text-green-600">{totalPoints.toFixed(1)}</span></p>
                    {!taskInstance.submitted && (
                        <Button onClick={submitTask} disabled={totalPoints === 0}>
                            Submit Task
                        </Button>
                    )}
                    {taskInstance.submitted && (
                        <span className="text-green-600 font-semibold">Submitted ✓</span>
                    )}
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{taskTitle}</CardTitle>
                    <CardDescription>
                        {taskInstance.submitted 
                            ? `Submitted on ${new Date(taskInstance.submittedAt || '').toLocaleString()}`
                            : "Complete the checklist items below. You can delegate individual items to other teams."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {taskInstance.items.map(item => renderChecklistItem(item))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


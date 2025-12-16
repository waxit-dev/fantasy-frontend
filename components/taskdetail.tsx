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

interface ChecklistItem {
    id: string;
    description: string;
    points: number;
    checked: boolean;
    delegatedTo?: number | null; // Team ID that this item is delegated to
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
    const [taskInstance, setTaskInstance] = useState<TaskInstance | null>(null);
    const [allTeams, setAllTeams] = useState([]);
    const [delegationDialogOpen, setDelegationDialogOpen] = useState<{ [itemId: string]: boolean }>({});
    const [selectedTeamForDelegation, setSelectedTeamForDelegation] = useState<{ [itemId: string]: string }>({});

    // Initialize task template with checklist items
    const getTaskTemplate = (taskId: string): ChecklistItem[] => {
        if (taskId === "add-product") {
            return [
                { id: "1", description: "Set title", points: 1, checked: false, delegatedTo: null },
                { id: "2", description: "Set description", points: 1, checked: false, delegatedTo: null },
                { id: "3", description: "Upload media", points: 1, checked: false, delegatedTo: null },
                { id: "4", description: "Set product type", points: 0.5, checked: false, delegatedTo: null },
                { id: "5", description: "Set vendor", points: 0.5, checked: false, delegatedTo: null },
                { id: "6", description: "Set appropriate tags, especially trade related", points: 1, checked: false, delegatedTo: null },
                { id: "7", description: "Assign appropriate theme template", points: 0.5, checked: false, delegatedTo: null },
                { id: "8", description: "Set a default price greater than $0", points: 1, checked: false, delegatedTo: null },
                { id: "9", description: "Set SKU", points: 1, checked: false, delegatedTo: null },
                { id: "10", description: "Add variant options if necessary", points: 1.5, checked: false, delegatedTo: null },
                { id: "11", description: "Set appropriate metafields", points: 2, checked: false, delegatedTo: null },
                { id: "12", description: "Set meta title less than 66 characters", points: 1, checked: false, delegatedTo: null },
                { id: "13", description: "Set meta description less than 160 characters", points: 1, checked: false, delegatedTo: null },
                { id: "14", description: "Set appropriate sales channels", points: 0.5, checked: false, delegatedTo: null },
                { id: "15", description: "If necessary, set and confirm correct trade catalog pricing", points: 2, checked: false, delegatedTo: null },
                {
                    id: "16",
                    description: "Is the product a dangerous good?",
                    points: 0,
                    checked: false,
                    delegatedTo: null,
                    subItems: [
                        { id: "16-1", description: "No", points: 1, checked: false, delegatedTo: null },
                        {
                            id: "16-2",
                            description: "Yes",
                            points: 0,
                            checked: false,
                            delegatedTo: null,
                            subItems: [
                                { id: "16-2-1", description: "Add product information to DG Register", points: 2, checked: false, delegatedTo: null },
                                { id: "16-2-2", description: "Add product to Shopify DG Shipping Profile", points: 1, checked: false, delegatedTo: null },
                                { id: "16-2-3", description: "Add SKU to Starshipit DG Checkout Rules", points: 2, checked: false, delegatedTo: null },
                            ]
                        },
                    ]
                },
                { id: "17", description: "Confirm product is correctly linked and loaded in to Cin7 Core", points: 1, checked: false, delegatedTo: null },
                { id: "18", description: "Update inventory quantities in Cin7", points: 1, checked: false, delegatedTo: null },
                { id: "19", description: "Once product is finalised, confirm Bombley product load", points: 2, checked: false, delegatedTo: null },
                { id: "20", description: "Set product status to Active", points: 1, checked: false, delegatedTo: null },
            ];
        }
        return [];
    };

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

    // Submit task and award points
    const submitTask = async () => {
        if (!taskInstance || !teamData) return;

        // Calculate points for each checked item and group by team
        // We need to process items individually to respect delegation per item
        const pointsByTeam: { [teamId: number]: number } = {};

        const processItem = (item: ChecklistItem) => {
            // Process this item if it's checked and has points
            if (item.checked && item.points > 0) {
                const teamId = item.delegatedTo || teamData.id;
                pointsByTeam[teamId] = (pointsByTeam[teamId] || 0) + item.points;
            }

            // Process sub-items recursively
            if (item.subItems) {
                item.subItems.forEach(subItem => processItem(subItem));
            }
        };

        // Process all items (including nested ones)
        taskInstance.items.forEach(item => processItem(item));

        // Award points to each team
        const updatePromises = Object.entries(pointsByTeam).map(async ([teamId, points]) => {
            try {
                const response = await fetch(`http://localhost:5000/api/teams/${teamId}/tasks/complete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        points: points
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    // Update team data if it's the current user's team
                    if (String(teamId) === String(teamData.id)) {
                        setTeamData(data.team);
                    }
                } else {
                    console.error(`Failed to update team ${teamId} points:`, await response.text());
                }
            } catch (error) {
                console.error(`Error updating team ${teamId} points:`, error);
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
                                    +{item.points}
                                </span>
                            )}
                        </span>
                    </label>
                    {!taskInstance?.submitted && (
                        <div className="ml-4">
                            {item.delegatedTo ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-blue-600">
                                        → {delegatedTeam?.name || 'Unknown'}
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
                                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
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
                                                        {allTeams
                                                            .filter((team: any) => team.id !== teamData?.id)
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
    const taskTitle = taskId === "add-product" ? "Add a product to the store" : "Task";

    return (
        <div className="w-full h-full">
            <div className="flex flex-row w-full justify-between h-5 mb-4">
                <h1>
                    <a href="/" className="underline">Home</a> > 
                    <a href="/tasks" className="underline"> Task List</a> > 
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


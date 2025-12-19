"use client";
import { useEffect, useState } from "react";
import { Bell, X, Trophy, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    createdAt: string;
    isRead?: boolean;
}

export default function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [globalNotifications, setGlobalNotifications] = useState<Notification[]>([]);
    const [teamData, setTeamData] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const storedTeam = localStorage.getItem("userTeam");
        if (storedTeam) {
            const userTeam = JSON.parse(storedTeam);
            setTeamData(userTeam);
            fetchNotifications(userTeam.id);
        }
        fetchGlobalNotifications();
    }, []);

    const fetchNotifications = async (teamId: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/teams/${teamId}/notifications?unreadOnly=true`);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.notifications?.filter((n: Notification) => !n.isRead).length || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchGlobalNotifications = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/notifications/global?limit=10');
            if (response.ok) {
                const data = await response.json();
                setGlobalNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching global notifications:', error);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
                method: 'POST'
            });
            if (response.ok && teamData) {
                fetchNotifications(teamData.id);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'season_winner':
            case 'winner_announced':
                return <Trophy className="w-5 h-5 text-yellow-600" />;
            case 'season_ending_soon':
            case 'season_ended':
                return <AlertCircle className="w-5 h-5 text-orange-600" />;
            default:
                return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const allNotifications = [
        ...globalNotifications.map(n => ({ ...n, isGlobal: true })),
        ...notifications.map(n => ({ ...n, isGlobal: false }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </Button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                        {allNotifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            allNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                                        !notification.isRead && !notification.isGlobal ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => {
                                        if (!notification.isRead && !notification.isGlobal) {
                                            markAsRead(notification.id);
                                        }
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm">{notification.title}</p>
                                            <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.isRead && !notification.isGlobal && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


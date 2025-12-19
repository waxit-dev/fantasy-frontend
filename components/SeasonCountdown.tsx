"use client";
import { useEffect, useState } from "react";

interface SeasonInfo {
    hasActiveSeason: boolean;
    season?: {
        id: number;
        seasonNumber: number;
        startDate: string;
        endDate: string;
        status: string;
    };
    timeRemaining?: {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isExpired: boolean;
        formatted: string;
    };
}

export default function SeasonCountdown() {
    const [seasonInfo, setSeasonInfo] = useState<SeasonInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRemaining, setTimeRemaining] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        isExpired: boolean;
    } | null>(null);

    useEffect(() => {
        fetchSeasonInfo();
        
        // Update countdown every second
        const interval = setInterval(() => {
            if (seasonInfo?.timeRemaining && !seasonInfo.timeRemaining.isExpired) {
                updateCountdown(seasonInfo.season?.endDate || '');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seasonInfo?.season?.endDate]);

    const fetchSeasonInfo = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/seasons/current');
            if (response.ok) {
                const data = await response.json();
                setSeasonInfo(data);
                if (data.timeRemaining) {
                    setTimeRemaining({
                        days: data.timeRemaining.days,
                        hours: data.timeRemaining.hours,
                        minutes: data.timeRemaining.minutes,
                        seconds: data.timeRemaining.seconds,
                        isExpired: data.timeRemaining.isExpired
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching season info:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateCountdown = (endDate: string) => {
        const now = new Date();
        const end = new Date(endDate);
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) {
            setTimeRemaining({
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true
            });
            // Refresh season info to check if season ended
            fetchSeasonInfo();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining({
            days,
            hours,
            minutes,
            seconds,
            isExpired: false
        });
    };

    if (loading) {
        return <p className="text-sm text-gray-600">Loading season info...</p>;
    }

    if (!seasonInfo || !seasonInfo.hasActiveSeason) {
        return (
            <div className="flex flex-col items-end">
                <p className="text-sm text-gray-600">Season Status</p>
                <p className="font-semibold text-orange-600">No Active Season</p>
            </div>
        );
    }

    if (timeRemaining?.isExpired) {
        return (
            <div className="flex flex-col items-end">
                <p className="text-sm text-gray-600">Season {seasonInfo.season?.seasonNumber}</p>
                <p className="font-semibold text-red-600">Season Ended</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end">
            <p className="text-sm text-gray-600">
                Season {seasonInfo.season?.seasonNumber} Ends
            </p>
            <p className="font-semibold">
                {timeRemaining?.days || 0}d {timeRemaining?.hours || 0}h {timeRemaining?.minutes || 0}m {timeRemaining?.seconds || 0}s
            </p>
        </div>
    );
}


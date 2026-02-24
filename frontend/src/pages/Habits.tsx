import { useState, useEffect } from 'react';
import { Plus, Check, RefreshCw, Trash2, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { apiClient } from '../api/client';

interface Habit {
    _id: string;
    name: string;
    frequency: 'daily' | 'weekly';
    targetPerWeek: number;
}

const Habits = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [newHabitName, setNewHabitName] = useState('');
    const [loading, setLoading] = useState(true);

    // For testing UI, we'll store today's completed habit IDs
    const [completedToday, setCompletedToday] = useState<Record<string, boolean>>({});

    const fetchHabits = async () => {
        try {
            const { data } = await apiClient.get('/habits');
            setHabits(data.data);
            // In a real app we'd fetch today's logs to populate completedToday
        } catch (error) {
            console.error('Failed to fetch habits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleCreateHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;

        try {
            await apiClient.post('/habits', { name: newHabitName });
            setNewHabitName('');
            fetchHabits();
        } catch (error) {
            console.error('Failed to create habit', error);
        }
    };

    const handleCheckin = async (id: string, currentlyCompleted: boolean) => {
        const isCompleted = !currentlyCompleted;
        try {
            // Optimistic update
            setCompletedToday(prev => ({ ...prev, [id]: isCompleted }));
            await apiClient.post(`/habits/${id}/checkin`, { completed: isCompleted });
        } catch (error) {
            console.error('Failed to check in habit', error);
            // Revert optimistic update
            setCompletedToday(prev => ({ ...prev, [id]: currentlyCompleted }));
        }
    };

    const archiveHabit = async (id: string) => {
        try {
            setHabits((prev) => prev.filter((h) => h._id !== id));
            await apiClient.patch(`/habits/${id}/archive`);
        } catch (error) {
            console.error('Failed to archive habit', error);
            fetchHabits();
        }
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Habits</h1>
            </div>

            <Card className="p-4 sm:p-6 bg-surface border-none shadow-none">
                <form onSubmit={handleCreateHabit} className="flex gap-4">
                    <Input
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="Add a new habit..."
                        className="flex-1 bg-white border-none shadow-sm h-12 text-base"
                    />
                    <Button type="submit" size="lg" className="rounded-xl shadow-sm">
                        <Plus className="w-5 h-5 mr-2" />
                        Add Habit
                    </Button>
                </form>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pb-8">
                {loading ? (
                    <div className="col-span-1 md:col-span-2 animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-surface rounded-3xl w-full"></div>)}
                    </div>
                ) : habits.length === 0 ? (
                    <div className="col-span-1 md:col-span-2 py-12 text-center text-textMuted flex flex-col items-center">
                        <RefreshCw className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No habits yet.</p>
                        <p className="text-sm">Build consistency starting today.</p>
                    </div>
                ) : (
                    habits.map((habit) => {
                        const isDone = completedToday[habit._id] || false;

                        return (
                            <div
                                key={habit._id}
                                className={cn(
                                    "group relative p-6 bg-white rounded-3xl border border-border/40 shadow-sm transition-all duration-300 flex flex-col justify-between hover:shadow-apple",
                                    isDone && "bg-surface/50 border-transparent shadow-none"
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-textMain line-clamp-1">{habit.name}</h3>
                                        <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-textMuted">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {habit.frequency === 'daily' ? 'Daily' : `${habit.targetPerWeek}x a week`}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => archiveHabit(habit._id)}
                                        className="p-2 -mr-2 -mt-2 text-textMuted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xs font-semibold text-textMuted uppercase tracking-wider">
                                        Today
                                    </span>
                                    <button
                                        onClick={() => handleCheckin(habit._id, isDone)}
                                        className={cn(
                                            "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300",
                                            isDone
                                                ? "bg-primary text-white shadow-md scale-105"
                                                : "bg-surface text-textMuted hover:bg-black/5 hover:text-primary"
                                        )}
                                    >
                                        {isDone ? <Check className="w-5 h-5" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Habits;

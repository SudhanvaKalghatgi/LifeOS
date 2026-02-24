import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { CheckSquare, AlertCircle, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';
import { apiClient } from '../api/client';

interface DashboardSummary {
    tasks: { total: number; completed: number; overdue: number; dueToday: number };
    habits: { total: number; completionRate: number; mostMissed: string | null };
    expenses: { totalSpent: number; topCategory: string | null };
}

const Dashboard = () => {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const location = useLocation();

    const fetchSummary = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true);
        else setLoading(true);
        try {
            const { data } = await apiClient.get('/dashboard/summary');
            setSummary(data.data);
        } catch (error) {
            console.error("Failed to fetch dashboard summary", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Re-fetch every time the user navigates to /dashboard
    useEffect(() => {
        fetchSummary();
    }, [location.pathname, fetchSummary]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{getGreeting()}</h1>
                    <p className="text-textMuted text-sm">Here's your overview for today.</p>
                </div>
                <button
                    onClick={() => fetchSummary(true)}
                    disabled={refreshing}
                    className="flex items-center gap-2 text-sm font-medium text-textMuted hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-surface self-start sm:self-auto"
                >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 bg-surface rounded-3xl w-full"></div>)}
                </div>
            ) : summary ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">

                    {/* Tasks Overview */}
                    <Card className="p-6 transition-transform hover:-translate-y-1 hover:shadow-apple-hover">
                        <div className="flex items-center gap-3 text-textMain mb-4">
                            <div className="p-2.5 bg-black text-white rounded-xl">
                                <CheckSquare className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold text-lg">Tasks (7d)</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-textMuted font-medium">Total Active</span>
                                <span className="text-xl font-bold text-primary">{summary.tasks.total}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-textMuted font-medium">Completed</span>
                                <span className="text-xl font-bold text-green-600">{summary.tasks.completed}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Habits Overview */}
                    <Card className="p-6 transition-transform hover:-translate-y-1 hover:shadow-apple-hover">
                        <div className="flex items-center gap-3 text-textMain mb-4">
                            <div className="p-2.5 bg-black text-white rounded-xl">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold text-lg">Habits (7d)</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-textMuted font-medium">Completion</span>
                                <span className="text-xl font-bold text-primary">{summary.habits.completionRate}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-textMuted font-medium">Tracking</span>
                                <span className="text-xl font-bold text-primary">{summary.habits.total}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Expenses Overview */}
                    <Card className="p-6 transition-transform hover:-translate-y-1 hover:shadow-apple-hover">
                        <div className="flex items-center gap-3 text-textMain mb-4">
                            <div className="p-2.5 bg-black text-white rounded-xl">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <h2 className="font-semibold text-lg">Expenses (7d)</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-textMuted font-medium">Total Spent</span>
                                <span className="text-xl font-bold text-primary">₹{summary.expenses.totalSpent.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-textMuted font-medium">Top Category</span>
                                <span className="text-sm font-bold text-primary uppercase tracking-wide">{summary.expenses.topCategory || "None"}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Actionable Insights */}
                    <div className="md:col-span-2 lg:col-span-3 p-6 rounded-[2rem] bg-gradient-to-br from-surface to-surface/50 border border-white/40 shadow-sm relative overflow-hidden group">
                        {/* Decorative background glow */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-110" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white rounded-xl shadow-sm border border-border/20">
                                    <AlertCircle className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="font-semibold text-lg tracking-tight">Daily Insights</h2>
                            </div>
                            <div className="flex flex-col gap-3">
                                {summary.tasks.overdue > 0 && (
                                    <div className="flex items-start gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-red-100/50 shadow-sm transition-all hover:shadow-md">
                                        <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                        <p className="text-sm font-medium text-textMain leading-relaxed">
                                            You have <span className="text-red-500 font-bold">{summary.tasks.overdue} overdue tasks</span>. Prioritizing these today will help clear your backlog.
                                        </p>
                                    </div>
                                )}
                                {summary.habits.mostMissed && (
                                    <div className="flex items-start gap-3 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-border/20 shadow-sm transition-all hover:shadow-md">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                                        <p className="text-sm font-medium text-textMain leading-relaxed">
                                            Consistency check: your habit <span className="font-bold text-primary px-1 bg-surface rounded">'{summary.habits.mostMissed}'</span> needs some attention. Try setting a specific time for it today.
                                        </p>
                                    </div>
                                )}
                                {summary.tasks.overdue === 0 && !summary.habits.mostMissed && (
                                    <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-5 rounded-2xl border border-white shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                                            <CheckSquare className="w-4 h-4 ml-0.5" />
                                        </div>
                                        <p className="text-sm font-medium text-textMain">
                                            You are completely on track. Your systems are working perfectly — keep up the great work!
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            ) : (
                <div className="py-12 text-center text-textMuted text-sm font-medium">
                    Could not load dashboard data.
                </div>
            )}
        </div>
    );
};

export default Dashboard;

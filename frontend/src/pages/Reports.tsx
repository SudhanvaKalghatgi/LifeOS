import { useState, useEffect, useCallback } from 'react';
import { BarChart, TrendingUp, CheckSquare, Sparkles, ChevronRight, RefreshCw, IndianRupee } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiClient } from '../api/client';
import { useLocation } from 'react-router-dom';

interface AiInsights {
    summary: string;
    strengths: string[];
    improvements: string[];
    explanation: string;
}

interface WeeklyReport {
    _id: string;
    periodStart: string;
    periodEnd: string;
    tasks: { created: number; completed: number; completionRate: number };
    habits: { completed: number; expected: number; consistencyRate: number };
    expenses: { total: number; averagePerDay: number };
    productivityScore: number;
    aiInsights: AiInsights | null;
}

const ScoreRing = ({ score }: { score: number }) => {
    const color = score >= 75 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500';
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`text-6xl font-bold tracking-tight ${color}`}>{score}</div>
            <div className="text-sm font-medium text-textMuted mt-1">/ 100 Productivity Score</div>
        </div>
    );
};

const Reports = () => {
    const [report, setReport] = useState<WeeklyReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const location = useLocation();

    const fetchReport = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await apiClient.get('/reports/weekly/latest');
            setReport(data.data);
        } catch (error) {
            console.error('Failed to fetch report:', error);
            setReport(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReport();
    }, [location.pathname, fetchReport]);

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            // Direct call — backend now returns the full report synchronously
            const { data } = await apiClient.post('/automation/weekly-report');
            if (data.data) {
                setReport(data.data);
            } else {
                // fallback: fetch latest
                await fetchReport();
            }
        } catch (error) {
            console.error('Failed to generate report:', error);
            // Try fetching whatever exists
            await fetchReport();
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Weekly Report</h1>
                    {report && (
                        <p className="text-textMuted mt-1 text-sm">
                            {new Date(report.periodStart).toLocaleDateString()} – {new Date(report.periodEnd).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="rounded-full px-5 gap-2 self-start sm:self-auto"
                >
                    {generating ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> <span className="hidden sm:inline">Generating…</span></>
                    ) : (
                        <><Sparkles className="w-4 h-4" /> <span className="hidden sm:inline">Generate Report</span><span className="sm:hidden">Generate</span></>
                    )}
                </Button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-surface rounded-3xl w-full" />)}
                </div>
            ) : !report ? (
                <div className="py-20 text-center text-textMuted flex flex-col items-center">
                    <BarChart className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-2">No reports generated yet.</p>
                    <p className="text-sm mb-6">Click "Generate Report" to create your first weekly analysis with AI insights.</p>
                    <Button onClick={handleGenerate} disabled={generating} className="rounded-full px-6 gap-2">
                        {generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate Now</>}
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-6 animate-slide-up">

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-6 flex flex-col justify-between hover:shadow-apple-hover transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                                <CheckSquare className="w-5 h-5" />
                            </div>
                            <p className="text-3xl font-bold text-primary">{report.tasks.completed}</p>
                            <p className="text-sm font-medium text-textMuted mt-1">Tasks Completed</p>
                            <p className="text-xs text-textMuted mt-2">{report.tasks.completionRate}% completion rate</p>
                        </Card>

                        <Card className="p-6 flex flex-col justify-between hover:shadow-apple-hover transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <p className="text-3xl font-bold text-primary">{report.habits.completed}</p>
                            <p className="text-sm font-medium text-textMuted mt-1">Habit Check-ins</p>
                            <p className="text-xs text-textMuted mt-2">{report.habits.consistencyRate}% consistency</p>
                        </Card>

                        <Card className="p-6 flex flex-col justify-between hover:shadow-apple-hover transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                                <IndianRupee className="w-5 h-5" />
                            </div>
                            <p className="text-3xl font-bold text-primary">₹{report.expenses.total.toFixed(0)}</p>
                            <p className="text-sm font-medium text-textMuted mt-1">Total Expenses</p>
                            <p className="text-xs text-textMuted mt-2">₹{report.expenses.averagePerDay.toFixed(0)}/day avg</p>
                        </Card>

                        <Card className="p-6 flex flex-col justify-between hover:shadow-apple-hover transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <p className={`text-3xl font-bold ${report.productivityScore >= 75 ? 'text-green-600' : report.productivityScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                {report.productivityScore}
                            </p>
                            <p className="text-sm font-medium text-textMuted mt-1">Productivity Score</p>
                            <p className="text-xs text-textMuted mt-2">out of 100</p>
                        </Card>
                    </div>

                    {/* AI Insights */}
                    {report.aiInsights ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {/* Summary */}
                            <Card className="lg:col-span-3 p-6 bg-black text-white border-none">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-yellow-400" />
                                    <h2 className="text-lg font-semibold">AI Weekly Summary</h2>
                                </div>
                                <p className="text-white/80 leading-relaxed">{report.aiInsights.summary}</p>
                            </Card>

                            {/* Strengths */}
                            <Card className="p-6">
                                <h3 className="font-semibold text-base mb-4 text-green-600">💪 Strengths</h3>
                                <ul className="flex flex-col gap-3">
                                    {report.aiInsights.strengths.map((s, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-textMain">
                                            <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            {/* Improvements */}
                            <Card className="p-6">
                                <h3 className="font-semibold text-base mb-4 text-yellow-600">🎯 Areas to Improve</h3>
                                <ul className="flex flex-col gap-3">
                                    {report.aiInsights.improvements.map((imp, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-textMain">
                                            <ChevronRight className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            {imp}
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            {/* Score Explanation */}
                            <Card className="p-6">
                                <h3 className="font-semibold text-base mb-4 text-textMain">📊 Score Breakdown</h3>
                                <ScoreRing score={report.productivityScore} />
                                {report.aiInsights.explanation && (
                                    <p className="text-xs text-textMuted mt-2 leading-relaxed text-center">{report.aiInsights.explanation}</p>
                                )}
                            </Card>

                        </div>
                    ) : (
                        <Card className="p-8 text-center bg-surface border-none shadow-none">
                            <Sparkles className="w-10 h-10 mx-auto mb-3 text-textMuted opacity-40" />
                            <p className="font-medium text-textMuted">AI insights not yet generated for this report.</p>
                            <p className="text-sm text-textMuted mt-1 mb-4">Click "Generate Report" again to add AI analysis to this week's data.</p>
                            <Button onClick={handleGenerate} disabled={generating} size="sm" className="rounded-full gap-2">
                                {generating ? <><RefreshCw className="w-3 h-3 animate-spin" /> Generating…</> : <><Sparkles className="w-3 h-3" /> Add AI Insights</>}
                            </Button>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default Reports;

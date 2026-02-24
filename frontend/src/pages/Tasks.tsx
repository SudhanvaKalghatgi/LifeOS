import { useState, useEffect, useCallback } from 'react';
import { Plus, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { apiClient } from '../api/client';
import { useLocation } from 'react-router-dom';

interface Task {
    _id: string;
    title: string;
    status: 'todo' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    effort: 'S' | 'M' | 'L';
    dueDate?: string;
}

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const fetchTasks = useCallback(async () => {
        try {
            const { data } = await apiClient.get('/tasks');
            setTasks(data.data.tasks);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [location.pathname, fetchTasks]);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            await apiClient.post('/tasks', { title: newTaskTitle });
            setNewTaskTitle('');
            fetchTasks();
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    const toggleTask = async (id: string, isCompleted: boolean) => {
        try {
            // Optimistic update
            setTasks((prev) =>
                prev.map((t) =>
                    t._id === id ? { ...t, status: isCompleted ? 'done' : 'todo' } : t
                )
            );
            await apiClient.patch(`/tasks/${id}/toggle`, { isCompleted });
        } catch (error) {
            console.error('Failed to toggle task', error);
            fetchTasks();
        }
    };

    const archiveTask = async (id: string) => {
        try {
            setTasks((prev) => prev.filter((t) => t._id !== id));
            await apiClient.patch(`/tasks/${id}/archive`);
        } catch (error) {
            console.error('Failed to archive task', error);
            fetchTasks();
        }
    }

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Tasks</h1>
            </div>

            <Card className="p-4 bg-surface border-none shadow-none">
                <form onSubmit={handleCreateTask} className="flex gap-3">
                    <Input
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add a new task..."
                        className="flex-1 bg-white border-none shadow-sm h-11 text-base"
                    />
                    <Button type="submit" className="rounded-xl shadow-sm px-4 h-11 shrink-0">
                        <Plus className="w-5 h-5 sm:mr-2" />
                        <span className="hidden sm:inline">Add</span>
                    </Button>
                </form>
            </Card>

            <div className="flex flex-col gap-3 overflow-y-auto pb-8">
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-surface rounded-2xl w-full"></div>)}
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="py-12 text-center text-textMuted flex flex-col items-center">
                        <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No tasks yet.</p>
                        <p className="text-sm">Add one above to get started.</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task._id}
                            className={cn(
                                "group flex items-center justify-between p-4 bg-white rounded-2xl border border-border/40 shadow-sm transition-all duration-300 hover:shadow-apple",
                                task.status === 'done' && "opacity-75 bg-surface/50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleTask(task._id, task.status !== 'done')}
                                    className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                                        task.status === 'done'
                                            ? "bg-primary border-primary text-white"
                                            : "border-border text-transparent hover:border-textMuted"
                                    )}
                                >
                                    {task.status === 'done' && <CheckCircle2 className="w-4 h-4" />}
                                </button>
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-base font-medium transition-all",
                                        task.status === 'done' ? "text-textMuted line-through" : "text-textMain"
                                    )}>
                                        {task.title}
                                    </span>
                                    {task.dueDate && (
                                        <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-textMuted">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-stone-100 text-stone-600">
                                        {task.priority}
                                    </span>
                                    <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-zinc-100 text-zinc-600">
                                        {task.effort}
                                    </span>
                                </div>
                                <button onClick={() => archiveTask(task._id)} className="p-2 text-textMuted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Tasks;

import { useState, useEffect } from 'react';
import { Plus, DollarSign, Trash2, Tag, Calendar, CreditCard } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { apiClient } from '../api/client';

interface Expense {
    _id: string;
    amount: number;
    category: string;
    note: string;
    paymentMethod: string;
    spentAt: string;
}

const CATEGORIES = [
    "food", "travel", "shopping", "bills", "health",
    "rent", "education", "entertainment", "subscriptions", "others"
];

const PAYMENT_METHODS = ["upi", "cash", "card", "netbanking", "other"];

const Expenses = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('food');
    const [note, setNote] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        try {
            const { data } = await apiClient.get('/expenses');
            setExpenses(data.data.expenses);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleCreateExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount))) return;

        try {
            await apiClient.post('/expenses', {
                amount: Number(amount),
                category,
                note,
                paymentMethod
            });
            setAmount('');
            setNote('');
            fetchExpenses();
        } catch (error) {
            console.error('Failed to create expense', error);
        }
    };

    const archiveExpense = async (id: string) => {
        try {
            setExpenses((prev) => prev.filter((e) => e._id !== id));
            await apiClient.patch(`/expenses/${id}/archive`);
        } catch (error) {
            console.error('Failed to archive expense', error);
            fetchExpenses();
        }
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Expenses</h1>
            </div>

            <Card className="p-4 sm:p-6 bg-surface border-none shadow-none">
                <form onSubmit={handleCreateExpense} className="flex flex-col sm:flex-row gap-4">
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="sm:w-32 bg-white border-none shadow-sm h-12 text-base"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-12 rounded-xl border-none bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 appearance-none flex-1 sm:flex-none sm:w-40"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                    </select>
                    <Input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Note (optional)"
                        className="flex-1 bg-white border-none shadow-sm h-12 text-base"
                    />
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-12 rounded-xl border-none bg-white px-3 text-sm shadow-sm focus:ring-2 focus:ring-primary/20 appearance-none flex-1 sm:flex-none sm:w-32"
                    >
                        {PAYMENT_METHODS.map(method => (
                            <option key={method} value={method}>{method.toUpperCase()}</option>
                        ))}
                    </select>
                    <Button type="submit" size="lg" className="rounded-xl shadow-sm sm:w-auto w-full">
                        <Plus className="w-5 h-5 sm:mr-0 md:mr-2" />
                        <span className="hidden md:inline">Add</span>
                    </Button>
                </form>
            </Card>

            <div className="flex flex-col gap-3 overflow-y-auto pb-8">
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-surface rounded-2xl w-full"></div>)}
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="py-12 text-center text-textMuted flex flex-col items-center">
                        <DollarSign className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No expenses yet.</p>
                        <p className="text-sm">Track your transactions here.</p>
                    </div>
                ) : (
                    expenses.map((expense) => (
                        <div
                            key={expense._id}
                            className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-border/40 shadow-sm transition-all duration-300 hover:shadow-apple"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-textMuted">
                                    <Tag className="w-6 h-6" />
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-base font-semibold text-textMain capitalize">
                                        {expense.category}
                                    </span>
                                    <div className="flex items-center gap-3 mt-1 text-xs font-medium text-textMuted">
                                        {expense.note && <span className="max-w-[120px] truncate">{expense.note}</span>}
                                        {expense.note && <span>•</span>}
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(expense.spentAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-lg font-bold text-primary">
                                        ₹{expense.amount.toFixed(2)}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs font-medium text-textMuted uppercase mt-0.5">
                                        <CreditCard className="w-3 h-3" />
                                        {expense.paymentMethod}
                                    </div>
                                </div>
                                <button onClick={() => archiveExpense(expense._id)} aria-label="Archive expense" className="p-2 ml-2 text-textMuted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100">
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

export default Expenses;

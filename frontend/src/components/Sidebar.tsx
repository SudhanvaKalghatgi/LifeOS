import { NavLink } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { LayoutDashboard, CheckSquare, RefreshCw, DollarSign, BarChart2 } from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Habits', href: '/habits', icon: RefreshCw },
    { name: 'Expenses', href: '/expenses', icon: DollarSign },
    { name: 'Reports', href: '/reports', icon: BarChart2 },
];

const Sidebar = () => {
    return (
        <>
            {/* ─── DESKTOP SIDEBAR (md+) ─────────────────────────────────── */}
            <div className="hidden md:flex w-60 bg-surface border-r border-border h-full flex-col pt-8 pb-6 px-4 shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm tracking-tighter">OS</span>
                    </div>
                    <span className="font-semibold text-lg tracking-tight text-primary">LifeOS</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 focus:outline-none',
                                    isActive
                                        ? 'bg-white text-primary shadow-sm'
                                        : 'text-textMuted hover:bg-surfaceHover hover:text-textMain'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Profile */}
                <div className="mt-auto px-2 pt-6 border-t border-border flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <span className="text-sm font-medium text-textMain">Profile</span>
                </div>
            </div>

            {/* ─── MOBILE BOTTOM TAB BAR (< md) ─────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 py-2 safe-bottom">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            cn(
                                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[3rem]',
                                isActive
                                    ? 'text-primary'
                                    : 'text-textMuted'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <div className={cn(
                                    'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200',
                                    isActive ? 'bg-primary/10' : ''
                                )}>
                                    <item.icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-textMuted')} />
                                </div>
                                <span className={cn(
                                    'text-[10px] font-semibold leading-none',
                                    isActive ? 'text-primary' : 'text-textMuted'
                                )}>
                                    {item.name}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Profile button in mobile tab bar */}
                <div className="flex flex-col items-center gap-0.5 px-3 py-1.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                    <span className="text-[10px] font-semibold text-textMuted leading-none">Me</span>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export const AppLayout = () => {
    return (
        <div className="flex h-screen bg-background text-textMain overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8">
                <div className="max-w-5xl mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

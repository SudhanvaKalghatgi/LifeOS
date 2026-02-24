import { Link } from 'react-router-dom';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Button } from './ui/Button';

const PublicNavbar = () => {
    return (
        <nav className="fixed top-0 inset-x-0 h-16 bg-white/80 backdrop-blur-md border-b border-border/40 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                        <span className="text-white font-bold text-sm tracking-tighter">OS</span>
                    </div>
                    <span className="font-semibold text-lg tracking-tight text-primary">LifeOS</span>
                </Link>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <SignedIn>
                        <Link to="/dashboard">
                            <Button variant="ghost" className="font-medium">Go to Dashboard</Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="ghost" className="hidden sm:inline-flex font-medium">Log in</Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button className="font-medium rounded-full px-6 shadow-sm">Get Started</Button>
                        </SignUpButton>
                    </SignedOut>
                </div>

            </div>
        </nav>
    );
};

export default PublicNavbar;

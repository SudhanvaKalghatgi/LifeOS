import { SignUpButton } from '@clerk/clerk-react';
import { ArrowRight, CheckCircle2, BarChart3, LayoutDashboard, RefreshCcw, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import PublicNavbar from '../components/PublicNavbar';

const features = [
    {
        icon: LayoutDashboard,
        title: 'Centralized Dashboard',
        description: 'Get a bird\'s-eye view of your entire life. Tasks, habits, and expenses in one unified, beautiful interface.'
    },
    {
        icon: CheckCircle2,
        title: 'Smart Task Management',
        description: 'Break down your goals into actionable steps. Track priorities and never miss a deadline again.'
    },
    {
        icon: RefreshCcw,
        title: 'Habit Tracking',
        description: 'Build consistency with visual streaks and daily check-ins. Your progress, measured and celebrated.'
    },
    {
        icon: BarChart3,
        title: 'Financial Clarity',
        description: 'Log expenses seamlessly and understand your spending patterns with automated weekly summaries.'
    }
];

const Home = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-black selection:text-white">
            <PublicNavbar />

            {/* Hero Section */}
            <main className="flex-1 mt-16">
                <section className="relative pt-24 sm:pt-32 pb-20 overflow-hidden">

                    {/* subtle background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent -z-10" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in relative z-10">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-primary max-w-4xl mx-auto leading-[1.1]">
                            The operating system for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-700 to-black">personal life.</span>
                        </h1>

                        <p className="mt-8 text-xl text-textMuted max-w-2xl mx-auto leading-relaxed">
                            Experience the clarity of having your tasks, habits, and finances organized in one premium, carefully crafted workspace.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <SignUpButton mode="modal">
                                <Button size="lg" className="rounded-full px-8 text-base font-medium group transition-all duration-300 hover:shadow-apple-hover w-full sm:w-auto">
                                    Start for free
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </SignUpButton>
                            <p className="text-sm text-textMuted sm:ml-4 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                No credit card required
                            </p>
                        </div>

                        {/* Creative Abstract Showcase Widget */}
                        <div className="mt-16 sm:mt-24 relative mx-auto max-w-5xl animate-slide-up pb-10" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                            <div className="relative w-full aspect-[4/3] sm:aspect-[2/1] bg-gradient-to-tr from-surface via-background to-surface rounded-3xl border border-border/50 shadow-2xl overflow-hidden flex items-center justify-center group perspective-1000">
                                {/* Animated background elements */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-primary/5 blur-[120px] rounded-full mix-blend-multiply opacity-50 block duration-1000 group-hover:bg-primary/10 group-hover:scale-110" />
                                <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-blue-500/10 blur-[80px] sm:blur-[100px] rounded-full mix-blend-multiply opacity-50 duration-1000 group-hover:scale-110 group-hover:translate-y-10 group-hover:-translate-x-10" />
                                <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-purple-500/10 blur-[80px] sm:blur-[100px] rounded-full mix-blend-multiply opacity-50 duration-1000 group-hover:scale-110 group-hover:-translate-y-10 group-hover:translate-x-10" />

                                {/* Decorative Grid */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0" />

                                {/* Floating Cards */}
                                <div className="relative z-10 flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 items-center justify-center w-full px-4 sm:px-12 pointer-events-none">
                                    {/* Card 1: Habit */}
                                    <div className="hidden md:flex flex-col w-56 lg:w-64 p-5 lg:p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl transform md:-rotate-6 md:translate-y-8 md:translate-x-4 group-hover:-translate-y-4 group-hover:-rotate-3 group-hover:-translate-x-2 transition-all duration-700 ease-out">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                                                <RefreshCcw className="w-5 h-5" />
                                            </div>
                                            <div className="font-semibold text-gray-800">Daily Read</div>
                                        </div>
                                        <div className="flex gap-1.5 mb-4">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <div key={i} className={`h-1.5 rounded-full flex-1 ${i <= 3 ? 'bg-green-500' : 'bg-gray-200'}`} />
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-500 font-medium">3 day streak! Keep it up.</div>
                                    </div>

                                    {/* Card 2: Main Task */}
                                    <div className="flex flex-col w-full max-w-xs sm:max-w-sm p-5 lg:p-6 bg-white/95 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-2xl z-20 transform group-hover:-translate-y-6 group-hover:scale-105 transition-all duration-700 ease-out">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="text-[10px] sm:text-xs font-bold tracking-wider text-blue-600 mb-1.5 uppercase">Today's Priority</div>
                                                <div className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Ship MVP Frontend</div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm shrink-0">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 bg-gray-50/80 p-3 sm:p-3.5 rounded-xl border border-gray-100">
                                                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                                </div>
                                                <span className="text-xs sm:text-sm font-medium text-gray-500 line-through">Design System</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white p-3 sm:p-3.5 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 relative z-10 shrink-0" />
                                                <span className="text-xs sm:text-sm font-medium text-gray-800 relative z-10">API Integration</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card 3: Finances */}
                                    <div className="hidden lg:flex flex-col w-56 lg:w-64 p-5 lg:p-6 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl transform rotate-6 translate-y-8 -translate-x-4 group-hover:-translate-y-4 group-hover:rotate-3 group-hover:translate-x-2 transition-all duration-700 ease-out delay-75">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
                                                <BarChart3 className="w-5 h-5" />
                                            </div>
                                            <div className="font-semibold text-gray-800">Weekly Spend</div>
                                        </div>
                                        <div className="flex items-end gap-2 h-16 sm:h-20 mb-3">
                                            {[40, 70, 45, 90, 60].map((h, i) => (
                                                <div key={i} className="flex-1 bg-purple-100 rounded-t-md relative overflow-hidden">
                                                    <div className="absolute bottom-0 w-full bg-purple-500 transition-all duration-1000 ease-out rounded-t-sm start-0 group-hover:h-full" style={{ height: `${h}%` }} />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xs text-center text-gray-500 font-medium">Under budget by <span className="text-purple-600 font-bold">$120</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-primary">Everything you need. Nothing you don't.</h2>
                            <p className="mt-4 text-lg text-textMuted">Built with a focus on speed, aesthetics, and getting out of your way.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, idx) => (
                                <div key={idx} className="p-6 rounded-3xl bg-surface border border-transparent hover:border-border/60 transition-colors group">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-primary group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
                                    <p className="text-textMuted text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-black text-white text-center">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8">Ready to upgrade your life?</h2>
                        <SignUpButton mode="modal">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full px-10 text-lg font-medium shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-300">
                                Join LifeOS Today
                            </Button>
                        </SignUpButton>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-background py-8 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-sm text-textMuted">
                    <div className="flex items-center gap-2 font-medium mb-4 sm:mb-0">
                        <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-[10px] tracking-tighter">OS</span>
                        </div>
                        <span className="text-primary">LifeOS</span>
                    </div>
                    <p>© {new Date().getFullYear()} LifeOS. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;

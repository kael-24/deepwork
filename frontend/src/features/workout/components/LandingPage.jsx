import { Link } from "react-router-dom";

const FeatureCard = ({ icon, title, desc }) => (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
        <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

const StepCard = ({ num, title, desc }) => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
            {num}
        </div>
        <div>
            <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
        </div>
    </div>
);

const TechBadge = ({ name, color }) => (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${color} transition-transform hover:scale-105`}>
        {name}
    </span>
);

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

            {/* ═══════════════ HERO ═══════════════ */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-80" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />

                <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 text-sm font-medium text-green-700 mb-8 shadow-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Open-source recreational project
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                        Train smarter with
                        <span className="block bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                            deepwork
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        A full-stack workout tracker that lets you design custom routines,
                        execute them with real-time timers, and review every session in detail.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="px-8 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-base"
                        >
                            Get Started — It's Free
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 shadow-sm text-base"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="https://github.com/kael-24"
                            target="_blank"
                            className="px-8 py-3.5 bg-black text-white font-semibold rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 shadow-sm text-base"
                        >
                            Visit My Github
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════ FEATURES ═══════════════ */}
            <section className="max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">Features</p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Everything you need to level up</h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FeatureCard
                        icon="🏋️"
                        title="Custom Workout Builder"
                        desc="Design routines with Prepare, Work, Rest, Rest-Between-Sets, and Cooldown exercise types. Set timers, reps, and reorder via drag-and-drop."
                    />
                    <FeatureCard
                        icon="⏱️"
                        title="Real-Time Play Mode"
                        desc="Execute workouts with a live countdown timer, auto-advance between exercises, and a Lock UI mode to prevent accidental taps."
                    />
                    <FeatureCard
                        icon="📊"
                        title="Session History & Analytics"
                        desc="Every completed workout is saved with per-exercise duration tracking. Review past sessions and monitor your consistency."
                    />
                    <FeatureCard
                        icon="📥"
                        title="Export to Excel"
                        desc="Download your entire workout history as an .xlsx spreadsheet for offline analysis or record keeping."
                    />
                    <FeatureCard
                        icon="🔐"
                        title="Secure Authentication"
                        desc="Local email/password signup with JWT sessions, Google OAuth integration, and full password reset via email."
                    />
                    <FeatureCard
                        icon="🖱️"
                        title="Drag & Drop Ordering"
                        desc="Rearrange exercises within a workout or reorder workouts on your dashboard with intuitive drag-and-drop."
                    />
                </div>
            </section>

            {/* ═══════════════ HOW IT WORKS ═══════════════ */}
            <section className="bg-gradient-to-br from-gray-50 to-green-50/50 py-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">How It Works</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">From creation to completion</h2>
                    </div>

                    <div className="space-y-8">
                        <StepCard num="1" title="Create a Workout"
                            desc="Name your routine and add exercises. Choose the type (Prepare, Work, Rest, Cooldown), set a countdown timer or stopwatch, and configure reps for work sets." />
                        <StepCard num="2" title="Play Your Workout"
                            desc="Hit Play to launch the session. A full-screen timer guides you through each exercise, auto-advancing when the countdown ends. Lock the UI to avoid accidental navigation." />
                        <StepCard num="3" title="Review Your Results"
                            desc="After finishing, view a detailed breakdown showing total duration, start/end times, and how long you spent on every single exercise." />
                        <StepCard num="4" title="Track Your Progress"
                            desc="Browse your complete workout history sorted by date. Download the data as an Excel file for deeper analysis or personal archiving." />
                    </div>
                </div>
            </section>

            {/* ═══════════════ TECH STACK ═══════════════ */}
            <section className="max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-14">
                    <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">Tech Stack</p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Built with modern technologies</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Frontend */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">🖥️ Frontend</h3>
                        <p className="text-sm text-gray-500 mb-5">Client-side SPA with reactive state management</p>
                        <div className="flex flex-wrap gap-2">
                            <TechBadge name="React 19" color="bg-sky-50 text-sky-700 border-sky-200" />
                            <TechBadge name="Vite 7" color="bg-violet-50 text-violet-700 border-violet-200" />
                            <TechBadge name="Tailwind CSS 4" color="bg-cyan-50 text-cyan-700 border-cyan-200" />
                            <TechBadge name="React Router 7" color="bg-red-50 text-red-700 border-red-200" />
                            <TechBadge name="TanStack Query 5" color="bg-orange-50 text-orange-700 border-orange-200" />
                            <TechBadge name="Zustand" color="bg-amber-50 text-amber-700 border-amber-200" />
                            <TechBadge name="dnd-kit" color="bg-pink-50 text-pink-700 border-pink-200" />
                            <TechBadge name="Firebase Auth" color="bg-yellow-50 text-yellow-700 border-yellow-200" />
                        </div>
                    </div>

                    {/* Backend */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">⚙️ Backend</h3>
                        <p className="text-sm text-gray-500 mb-5">RESTful API with token-based auth &amp; NoSQL storage</p>
                        <div className="flex flex-wrap gap-2">
                            <TechBadge name="Node.js" color="bg-green-50 text-green-700 border-green-200" />
                            <TechBadge name="Express 5" color="bg-gray-100 text-gray-700 border-gray-300" />
                            <TechBadge name="MongoDB" color="bg-emerald-50 text-emerald-700 border-emerald-200" />
                            <TechBadge name="Mongoose 8" color="bg-red-50 text-red-700 border-red-200" />
                            <TechBadge name="JWT" color="bg-indigo-50 text-indigo-700 border-indigo-200" />
                            <TechBadge name="bcrypt" color="bg-slate-100 text-slate-700 border-slate-300" />
                            <TechBadge name="Passport" color="bg-teal-50 text-teal-700 border-teal-200" />
                            <TechBadge name="Resend Email" color="bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ ABOUT THE DEVELOPER ═══════════════ */}
            <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-3xl shadow-lg shadow-green-500/30">
                        👨‍💻
                    </div>
                    <p className="text-sm font-bold text-green-400 uppercase tracking-widest mb-3">About the Developer</p>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Kyle D. Buendia</h2>
                    <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                        Computer Science Student at <span className="text-green-400 font-semibold">Iloilo Science and Technology University</span>
                    </p>
                    <p className="text-gray-400 leading-relaxed max-w-xl mx-auto mb-8">
                        DeepWork is a recreational full-stack project built to explore modern web development
                        practices — from building a RESTful API with Express and MongoDB, to crafting a reactive
                        single-page application with React 19, Zustand, and TanStack Query. It showcases
                        secure JWT + Google OAuth authentication, real-time workout execution with timer
                        management, drag-and-drop UI, and data export capabilities.
                    </p>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-white/10">
                        <span className="text-green-400">✦</span> Built with passion as a learning journey
                    </div>
                </div>
                <div className="flex flex-col items-center gap-5 pt-5 justify-center">
                    <Link
                        to="https://github.com/kael-24"
                        target="_blank"
                        className="px-8 py-3.5 bg-white text-black font-semibold rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 shadow-sm text-base"
                    >
                        Visit My Github
                    </Link>
                    <Link
                        to="https://github.com/kael-24/deepwork"
                        target="_blank"
                        className="px-8 py-3.5 bg-white text-black font-semibold rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 shadow-sm text-base"
                    >
                        Visit deepwork source code
                    </Link>
                </div>
            </section>

            {/* ═══════════════ CTA FOOTER ═══════════════ */}
            <section className="max-w-5xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                    Ready to start training?
                </h2>
                <p className="text-gray-500 mb-8 text-lg">Create your free account and build your first workout in minutes.</p>
                <Link
                    to="/signup"
                    className="inline-flex px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-lg"
                >
                    Create Free Account →
                </Link>
                <p className="mt-12 text-sm text-gray-400">
                    © 2026 deepwork — Built by Kyle D. Buendia
                </p>
            </section>
        </div>
    );
};

export default LandingPage;

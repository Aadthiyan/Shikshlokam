"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            {/* Header */}
            <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
                                D
                            </div>
                            <h2 className="text-xl font-bold text-foreground">DIET Training OS</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <SignInButton mode="modal">
                                <button className="rounded-lg border border-input px-6 py-2 text-sm font-semibold hover:bg-muted transition-smooth">
                                    Sign In
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth">
                                    Get Started
                                </button>
                            </SignUpButton>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-muted-foreground">Powered by AI • NEP 2020 Aligned</span>
                    </div>

                    <h1 className="mb-6 text-6xl font-bold leading-tight">
                        Personalized Teacher Training
                        <br />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Made Simple
                        </span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
                        AI-powered platform for DIETs and SCERTs to create contextualized,
                        micro-learning-based teacher training plans aligned with NEP 2020
                    </p>

                    <div className="flex items-center justify-center gap-4">
                        <SignUpButton mode="modal">
                            <button className="rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth hover-lift">
                                Start Free Trial
                            </button>
                        </SignUpButton>
                        <a
                            href="#features"
                            className="rounded-lg border border-input px-8 py-4 text-lg font-semibold hover:bg-muted transition-smooth"
                        >
                            Learn More
                        </a>
                    </div>

                    <p className="mt-6 text-sm text-muted-foreground">
                        ✓ No credit card required • ✓ 14-day free trial • ✓ Cancel anytime
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y bg-card/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-6 py-16">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center">
                            <div className="mb-2 text-5xl font-bold text-primary">10K+</div>
                            <div className="text-sm font-medium text-muted-foreground">Teachers Trained</div>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 text-5xl font-bold text-secondary">500+</div>
                            <div className="text-sm font-medium text-muted-foreground">Training Plans</div>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 text-5xl font-bold text-accent">24</div>
                            <div className="text-sm font-medium text-muted-foreground">DIETs Connected</div>
                        </div>
                        <div className="text-center">
                            <div className="mb-2 text-5xl font-bold text-success">95%</div>
                            <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="mx-auto max-w-7xl px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="mb-4 text-4xl font-bold">Everything You Need</h2>
                    <p className="text-xl text-muted-foreground">
                        Comprehensive tools for modern teacher training
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Feature 1 */}
                    <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">AI-Powered Insights</h3>
                        <p className="text-muted-foreground">
                            Get intelligent recommendations and auto-generated training plans based on real classroom needs
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Cohort Management</h3>
                        <p className="text-muted-foreground">
                            Automatically group teachers with similar needs for efficient, targeted training sessions
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Impact Analytics</h3>
                        <p className="text-muted-foreground">
                            Track training effectiveness with comprehensive reports and data-driven insights
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Learning Network</h3>
                        <p className="text-muted-foreground">
                            Share and discover successful training plans from DIETs across India
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">Gamification</h3>
                        <p className="text-muted-foreground">
                            Engage users with badges, streaks, and leaderboards for better participation
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-xl font-bold">AI Assistant</h3>
                        <p className="text-muted-foreground">
                            Get instant help and personalized suggestions from our intelligent AI assistant
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="mx-auto max-w-4xl px-6 py-20 text-center">
                    <h2 className="mb-6 text-4xl font-bold">
                        Ready to Transform Teacher Training?
                    </h2>
                    <p className="mb-10 text-xl text-muted-foreground">
                        Join hundreds of DIETs already using our platform
                    </p>
                    <SignUpButton mode="modal">
                        <button className="rounded-lg bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth hover-lift">
                            Start Your Free Trial
                        </button>
                    </SignUpButton>
                    <p className="mt-6 text-sm text-muted-foreground">
                        No credit card required • 14-day free trial
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-card">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                    D
                                </div>
                                <span className="font-bold">DIET Training OS</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Empowering teacher training with AI
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Product</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Company</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground">About</a></li>
                                <li><a href="#" className="hover:text-foreground">Contact</a></li>
                                <li><a href="#" className="hover:text-foreground">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 font-semibold">Legal</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                                <li><a href="#" className="hover:text-foreground">Terms</a></li>
                                <li><a href="#" className="hover:text-foreground">Security</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                        © 2026 DIET Training OS. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

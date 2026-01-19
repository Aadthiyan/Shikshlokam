"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function PublicLandingPage() {
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
            <span className="text-muted-foreground">Free for All DIETs • NEP 2020 Aligned • Made in India 🇮🇳</span>
          </div>

          <h1 className="mb-6 text-6xl font-bold leading-tight">
            Transform Teacher Training with
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI-Powered Personalization
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-xl text-muted-foreground">
            DIET Training OS is an intelligent platform that helps DIETs and SCERTs across India
            create contextualized, micro-learning-based teacher training plans aligned with NEP 2020.
            Say goodbye to one-size-fits-all training and hello to personalized, data-driven professional development.
          </p>

          <div className="flex items-center justify-center gap-4">
            <SignUpButton mode="modal">
              <button className="rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth hover-lift">
                Get Started Free
              </button>
            </SignUpButton>
            <a
              href="#how-it-works"
              className="rounded-lg border border-input px-8 py-4 text-lg font-semibold hover:bg-muted transition-smooth"
            >
              See How It Works
            </a>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            ✓ Completely Free • ✓ For Social Impact • ✓ Used by 24+ DIETs across India
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-y bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-4xl font-bold">The Challenge We Solve</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Traditional teacher training faces critical challenges that impact quality and effectiveness
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-8 text-center">
              <div className="mb-4 text-5xl">😓</div>
              <h3 className="mb-3 text-xl font-bold">Generic Training</h3>
              <p className="text-muted-foreground">
                One-size-fits-all programs ignore the unique needs of different schools,
                districts, and teacher cohorts
              </p>
            </div>

            <div className="rounded-lg border bg-card p-8 text-center">
              <div className="mb-4 text-5xl">📊</div>
              <h3 className="mb-3 text-xl font-bold">No Data Insights</h3>
              <p className="text-muted-foreground">
                Training decisions made without understanding actual classroom challenges
                and teacher needs
              </p>
            </div>

            <div className="rounded-lg border bg-card p-8 text-center">
              <div className="mb-4 text-5xl">⏰</div>
              <h3 className="mb-3 text-xl font-bold">Time-Consuming</h3>
              <p className="text-muted-foreground">
                Manual plan creation takes weeks, leaving little time for actual
                training delivery and follow-up
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold">How DIET Training OS Works</h2>
          <p className="text-xl text-muted-foreground">
            From classroom needs to personalized training plans in 4 simple steps
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-2xl">
              1
            </div>
            <h3 className="mb-3 text-xl font-bold">Report Needs</h3>
            <p className="text-muted-foreground">
              BRPs and CRPs report actual classroom challenges through WhatsApp,
              voice, or web interface
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 text-secondary font-bold text-2xl">
              2
            </div>
            <h3 className="mb-3 text-xl font-bold">AI Analysis</h3>
            <p className="text-muted-foreground">
              Our AI analyzes needs, identifies patterns, and automatically
              groups teachers into cohorts
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-2xl">
              3
            </div>
            <h3 className="mb-3 text-xl font-bold">Generate Plans</h3>
            <p className="text-muted-foreground">
              AI creates personalized, micro-learning-based training plans
              aligned with NEP 2020
            </p>
          </div>

          <div className="text-center">
            <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success font-bold text-2xl">
              4
            </div>
            <h3 className="mb-3 text-xl font-bold">Track Impact</h3>
            <p className="text-muted-foreground">
              Monitor training effectiveness with comprehensive analytics
              and impact reports
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gradient-to-br from-success/5 to-accent/5">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold">Real Impact, Real Numbers</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-primary">10,000+</div>
              <div className="text-sm font-medium text-muted-foreground">Teachers Trained</div>
              <div className="mt-2 text-xs text-muted-foreground">Across Jharkhand</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-secondary">500+</div>
              <div className="text-sm font-medium text-muted-foreground">Training Plans</div>
              <div className="mt-2 text-xs text-muted-foreground">AI-generated</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-accent">24</div>
              <div className="text-sm font-medium text-muted-foreground">DIETs Connected</div>
              <div className="mt-2 text-xs text-muted-foreground">Growing network</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-success">95%</div>
              <div className="text-sm font-medium text-muted-foreground">Success Rate</div>
              <div className="mt-2 text-xs text-muted-foreground">Training effectiveness</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold">Powerful Features for Modern Training</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to deliver effective, personalized teacher training
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
              Intelligent analysis of classroom needs with automatic pattern recognition
              and personalized recommendations
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Smart Cohort Management</h3>
            <p className="text-muted-foreground">
              Automatically group teachers with similar needs for efficient,
              targeted training sessions
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">NEP 2020 Aligned</h3>
            <p className="text-muted-foreground">
              All training plans automatically aligned with National Education Policy 2020
              guidelines and competencies
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Impact Analytics</h3>
            <p className="text-muted-foreground">
              Comprehensive reports and dashboards to track training effectiveness
              and measure real impact
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-lg border bg-card p-8 hover-lift transition-smooth">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Learning Network</h3>
            <p className="text-muted-foreground">
              Share and discover successful training plans from DIETs across India
              with ratings and reviews
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
              Get instant help and personalized suggestions from our intelligent
              AI assistant trained on education best practices
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-y bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold">Why DIETs Choose Us</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold">Save 80% Time on Planning</h3>
                <p className="text-muted-foreground">
                  What used to take weeks now takes minutes. Focus on delivery, not paperwork.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold">Data-Driven Decisions</h3>
                <p className="text-muted-foreground">
                  Make training decisions based on actual classroom needs, not assumptions.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold">Proven Results</h3>
                <p className="text-muted-foreground">
                  95% success rate with measurable improvements in teacher performance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold">Easy to Use</h3>
                <p className="text-muted-foreground">
                  Intuitive interface designed for educators, not tech experts. Get started in minutes.
                </p>
              </div>
            </div>
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
            Join 24+ DIETs already using DIET Training OS to deliver personalized,
            effective teacher training for social impact
          </p>
          <SignUpButton mode="modal">
            <button className="rounded-lg bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-smooth hover-lift">
              Join the Movement
            </button>
          </SignUpButton>
          <p className="mt-6 text-sm text-muted-foreground">
            Completely Free • For Social Good • Full access to all features
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
                Empowering teacher training with AI. Made in India 🇮🇳
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Impact Stories</a></li>
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
            © 2026 DIET Training OS. All rights reserved. Built with ❤️ for Indian educators.
          </div>
        </div>
      </footer>
    </div>
  );
}

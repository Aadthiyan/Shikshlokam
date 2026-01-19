"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
    id: number;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: Date;
}

interface UserContext {
    totalPlans: number;
    totalCohorts: number;
    totalNeeds: number;
    recentPlans: Array<{ id: string; name: string }>;
    recentCohorts: Array<{ id: string; name: string }>;
}

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "system",
            content: "👋 Hello! I'm your AI Training Assistant with access to your platform data. I can help you with:\n\n• Analyzing your existing plans and cohorts\n• Creating effective training plans\n• Suggesting improvements based on your data\n• Answering questions about pedagogy\n• Best practices for teacher training\n\nHow can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userContext, setUserContext] = useState<UserContext | null>(null);
    const [showTemplates, setShowTemplates] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch user context on mount
    useEffect(() => {
        fetchUserContext();
    }, []);

    const fetchUserContext = async () => {
        try {
            const [plansRes, cohortsRes, needsRes] = await Promise.all([
                fetch("/api/plans"),
                fetch("/api/cohorts"),
                fetch("/api/needs"),
            ]);

            const [plansData, cohortsData, needsData] = await Promise.all([
                plansRes.json(),
                cohortsRes.json(),
                needsRes.json(),
            ]);

            setUserContext({
                totalPlans: plansData.plans?.length || 0,
                totalCohorts: cohortsData.cohorts?.length || 0,
                totalNeeds: needsData.needs?.length || 0,
                recentPlans: plansData.plans?.slice(0, 3).map((p: any) => ({ id: p.id, name: p.name })) || [],
                recentCohorts: cohortsData.cohorts?.slice(0, 3).map((c: any) => ({ id: c.id, name: c.name })) || [],
            });
        } catch (error) {
            console.error("Failed to fetch user context:", error);
        }
    };

    const handleSend = async (customMessage?: string) => {
        const messageText = customMessage || input;
        if (!messageText.trim() || isLoading) return;

        const userMessage: Message = {
            id: messages.length + 1,
            role: "user",
            content: messageText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Build context-aware prompt
            let contextPrompt = "";
            if (userContext) {
                contextPrompt = `\n\n[User Context: The user has ${userContext.totalPlans} training plans, ${userContext.totalCohorts} cohorts, and ${userContext.totalNeeds} needs in their system.`;
                if (userContext.recentPlans.length > 0) {
                    contextPrompt += ` Recent plans: ${userContext.recentPlans.map(p => p.name).join(", ")}.`;
                }
                if (userContext.recentCohorts.length > 0) {
                    contextPrompt += ` Recent cohorts: ${userContext.recentCohorts.map(c => c.name).join(", ")}.`;
                }
                contextPrompt += "]";
            }

            const response = await fetch("/api/ai-assistant", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map((m) => ({
                        role: m.role,
                        content: m.role === "user" && userContext ? m.content + contextPrompt : m.content,
                    })),
                }),
            });

            const data = await response.json();

            if (data.success) {
                const assistantMessage: Message = {
                    id: messages.length + 2,
                    role: "assistant",
                    content: data.message,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } else {
                throw new Error(data.error);
            }
        } catch (error: any) {
            const errorMessage: Message = {
                id: messages.length + 2,
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const quickActions = [
        {
            label: "Analyze My Latest Plan",
            action: () => {
                if (userContext && userContext.recentPlans.length > 0) {
                    handleSend(`Analyze my latest training plan: "${userContext.recentPlans[0].name}". What improvements can you suggest?`);
                } else {
                    handleSend("I don't have any training plans yet. Can you help me create one?");
                }
            },
        },
        {
            label: "Suggest Plan for My Cohort",
            action: () => {
                if (userContext && userContext.recentCohorts.length > 0) {
                    handleSend(`I have a cohort called "${userContext.recentCohorts[0].name}". What training plan would you recommend?`);
                } else {
                    handleSend("Help me create a cohort and suggest a training plan for it.");
                }
            },
        },
        {
            label: "Best Practices Summary",
            action: () => handleSend("Give me a summary of best practices for teacher training in low-resource settings."),
        },
        {
            label: "Compare with Standards",
            action: () => handleSend("How do my training plans compare with NEP 2020 and NISHTHA FLN standards?"),
        },
    ];

    const templates = [
        {
            title: "FLN Training Plan Template",
            description: "Foundational Literacy and Numeracy for Primary 1-3",
            prompt: "Create a detailed FLN training plan template for primary grades 1-3, including session objectives, activities, and assessment methods.",
        },
        {
            title: "Digital Literacy Plan",
            description: "Basic digital skills for teachers",
            prompt: "Design a training plan for digital literacy covering basic computer skills, educational apps, and online resources for teachers.",
        },
        {
            title: "Assessment Techniques",
            description: "Modern assessment methods",
            prompt: "Create a training plan focused on formative and summative assessment techniques aligned with NEP 2020.",
        },
        {
            title: "Classroom Management",
            description: "Effective classroom strategies",
            prompt: "Develop a training plan for classroom management techniques suitable for large class sizes and diverse learners.",
        },
    ];

    const quickQuestions = [
        "How do I create an effective FLN training plan?",
        "What are best practices for low-infrastructure settings?",
        "How can I improve teacher engagement?",
        "What modules work best for primary grades?",
    ];

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Back to Home
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold">AI Training Assistant</h1>
                            <p className="text-muted-foreground">
                                Context-aware AI with access to your plans, cohorts, and needs
                            </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-success"></div>
                            <span className="text-sm font-medium">AI Online</span>
                        </div>
                    </div>
                </div>

                {/* User Context Summary */}
                {userContext && (
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border bg-card p-4">
                            <div className="text-2xl font-bold text-primary">{userContext.totalPlans}</div>
                            <div className="text-sm text-muted-foreground">Your Training Plans</div>
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <div className="text-2xl font-bold text-secondary">{userContext.totalCohorts}</div>
                            <div className="text-sm text-muted-foreground">Your Cohorts</div>
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                            <div className="text-2xl font-bold text-accent">{userContext.totalNeeds}</div>
                            <div className="text-sm text-muted-foreground">Identified Needs</div>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Chat Interface */}
                    <div className="lg:col-span-2">
                        <div className="rounded-lg border bg-card shadow-lg">
                            {/* Messages */}
                            <div className="h-[600px] overflow-y-auto p-6">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-4 ${message.role === "user"
                                                ? "bg-primary text-primary-foreground"
                                                : message.role === "assistant"
                                                    ? "bg-secondary/10 text-foreground"
                                                    : "bg-accent/10 text-foreground"
                                                }`}
                                        >
                                            <div className="mb-1 flex items-center gap-2">
                                                <span className="text-xs font-semibold opacity-70">
                                                    {message.role === "user"
                                                        ? "You"
                                                        : message.role === "assistant"
                                                            ? "AI Assistant"
                                                            : "System"}
                                                </span>
                                                <span className="text-xs opacity-50">
                                                    {message.timestamp.toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="whitespace-pre-wrap text-sm font-medium">
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="mb-4 flex justify-start">
                                        <div className="rounded-lg bg-secondary/10 p-4">
                                            <div className="flex gap-1">
                                                <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                                                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.2s]"></div>
                                                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0.4s]"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t p-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                        placeholder="Ask me anything about teacher training..."
                                        disabled={isLoading}
                                        className="flex-1 rounded-lg border bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={isLoading || !input.trim()}
                                        className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>
                            <div className="space-y-2">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        onClick={action.action}
                                        disabled={isLoading}
                                        className="w-full rounded-lg border bg-gradient-to-r from-primary/10 to-secondary/10 p-3 text-left text-sm font-semibold hover:from-primary/20 hover:to-secondary/20 disabled:opacity-50"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Templates */}
                        <div className="rounded-lg border bg-card p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold">Templates</h2>
                                <button
                                    onClick={() => setShowTemplates(!showTemplates)}
                                    className="text-sm text-primary hover:underline"
                                >
                                    {showTemplates ? "Hide" : "Show"}
                                </button>
                            </div>
                            {showTemplates && (
                                <div className="space-y-3">
                                    {templates.map((template, index) => (
                                        <div
                                            key={index}
                                            className="cursor-pointer rounded-lg border bg-background p-3 hover:bg-muted"
                                            onClick={() => handleSend(template.prompt)}
                                        >
                                            <div className="mb-1 font-semibold text-sm">{template.title}</div>
                                            <div className="text-xs text-muted-foreground">{template.description}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Questions */}
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-lg font-bold">Quick Questions</h2>
                            <div className="space-y-2">
                                {quickQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setInput(question)}
                                        className="w-full rounded-lg border bg-background p-3 text-left text-sm hover:bg-muted"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Capabilities */}
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-lg font-bold">Enhanced Capabilities</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Context-aware responses</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Analyze your actual plans</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Personalized suggestions</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Quick action templates</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Training plan templates</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Best practice comparisons</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

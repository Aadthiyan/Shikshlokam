"use client";

import { useState } from "react";
import Link from "next/link";

export default function WhatsAppDemoPage() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            from: "system",
            text: "Welcome to DIET Training OS WhatsApp Bot! 🎓",
            time: "10:00 AM",
        },
        {
            id: 2,
            from: "system",
            text: "Report classroom needs by sending a message. Example:\n\n'Kanke block, 15 schools, FLN gaps, primary class, low infrastructure'",
            time: "10:00 AM",
        },
    ]);

    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            from: "user",
            text: inputMessage,
            time: new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
            }),
        };

        setMessages([...messages, userMessage]);
        setInputMessage("");
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            const botMessage = {
                id: messages.length + 2,
                from: "bot",
                text: "✅ Need received!\n\n📍 Cluster: Kanke\n📚 Issue: FLN gaps\n🎓 Grade: Primary (1-3)\n🏗️ Infrastructure: Low\n\n✨ Your need has been recorded and will be used to create personalized training plans!\n\nNeed ID: #" + Math.random().toString(36).substr(2, 9).toUpperCase(),
                time: new Date().toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                }),
            };

            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        }, 2000);
    };

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
                    <h1 className="mb-2 text-3xl font-bold">WhatsApp Integration Demo</h1>
                    <p className="text-muted-foreground">
                        See how BRPs can report needs via WhatsApp - the most accessible platform in rural India
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* WhatsApp Mock UI */}
                    <div className="rounded-lg border bg-card shadow-lg">
                        {/* WhatsApp Header */}
                        <div className="flex items-center gap-3 border-b bg-[#075E54] p-4 text-white">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#075E54]">
                                🤖
                            </div>
                            <div>
                                <div className="font-semibold">DIET Training OS Bot</div>
                                <div className="text-xs text-white/80">Online</div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-[500px] overflow-y-auto bg-[#E5DDD5] p-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-3 flex ${message.from === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-lg p-3 ${message.from === "user"
                                            ? "bg-[#DCF8C6]"
                                            : message.from === "bot"
                                                ? "bg-white"
                                                : "bg-[#FFF4C4]"
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap text-sm text-gray-900 font-medium">{message.text}</div>
                                        <div className="mt-1 text-right text-xs text-gray-700">
                                            {message.time}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="mb-3 flex justify-start">
                                    <div className="rounded-lg bg-white p-3">
                                        <div className="flex gap-1">
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.2s]"></div>
                                            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="flex gap-2 border-t bg-white p-4">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#075E54]"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="rounded-full bg-[#075E54] p-3 text-white hover:bg-[#064E46]"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Info Panel */}
                    <div className="space-y-6">
                        {/* How it Works */}
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-xl font-bold">How It Works</h2>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                        1
                                    </div>
                                    <div>
                                        <div className="font-semibold">BRP Sends Message</div>
                                        <div className="text-sm text-muted-foreground">
                                            BRP sends a WhatsApp message describing the classroom need
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary font-bold">
                                        2
                                    </div>
                                    <div>
                                        <div className="font-semibold">AI Processes Message</div>
                                        <div className="text-sm text-muted-foreground">
                                            Our AI extracts cluster, issue, grade, and infrastructure details
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
                                        3
                                    </div>
                                    <div>
                                        <div className="font-semibold">Need Created</div>
                                        <div className="text-sm text-muted-foreground">
                                            Need is automatically added to the system
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-success/10 text-success font-bold">
                                        4
                                    </div>
                                    <div>
                                        <div className="font-semibold">Confirmation Sent</div>
                                        <div className="text-sm text-muted-foreground">
                                            BRP receives confirmation with need ID
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Example Messages */}
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-xl font-bold">Example Messages</h2>
                            <div className="space-y-3">
                                <button
                                    onClick={() =>
                                        setInputMessage(
                                            "Kanke block, 15 schools, FLN gaps, primary class, low infrastructure"
                                        )
                                    }
                                    className="w-full rounded-lg border bg-background p-3 text-left text-sm hover:bg-muted"
                                >
                                    "Kanke block, 15 schools, FLN gaps, primary class, low infrastructure"
                                </button>

                                <button
                                    onClick={() =>
                                        setInputMessage(
                                            "Ranchi, Math and Science problems, upper primary, medium infrastructure"
                                        )
                                    }
                                    className="w-full rounded-lg border bg-background p-3 text-left text-sm hover:bg-muted"
                                >
                                    "Ranchi, Math and Science problems, upper primary, medium infrastructure"
                                </button>

                                <button
                                    onClick={() =>
                                        setInputMessage(
                                            "Dumka tribal area, language mismatch, all grades, low resources"
                                        )
                                    }
                                    className="w-full rounded-lg border bg-background p-3 text-left text-sm hover:bg-muted"
                                >
                                    "Dumka tribal area, language mismatch, all grades, low resources"
                                </button>
                            </div>
                        </div>

                        {/* Benefits */}
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-xl font-bold">Why WhatsApp?</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Most popular messaging app in rural India</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Works on basic smartphones</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Low data usage</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>Familiar interface for BRPs</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success">✓</span>
                                    <span>No app installation needed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

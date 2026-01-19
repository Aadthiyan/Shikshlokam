"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SharedPlan {
    id: string;
    name: string;
    dietName: string;
    district: string;
    state: string;
    successRate: number;
    teachersImpacted: number;
    primaryIssues: string[];
    gradeBand: string;
    language: string;
    adaptedBy: number;
    createdAt: string;
    rating: number;
    reviewCount: number;
    reviews?: Review[];
}

interface Review {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    helpful: number;
}

interface Question {
    id: string;
    userName: string;
    question: string;
    answer?: string;
    date: string;
}

export default function LearningNetworkPage() {
    const [plans, setPlans] = useState<SharedPlan[]>([]);
    const [filteredPlans, setFilteredPlans] = useState<SharedPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [minSuccessRate, setMinSuccessRate] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState<SharedPlan | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showQAModal, setShowQAModal] = useState(false);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newReview, setNewReview] = useState("");
    const [newQuestion, setNewQuestion] = useState("");
    const [adaptationRequest, setAdaptationRequest] = useState("");
    const [recommendations, setRecommendations] = useState<SharedPlan[]>([]);

    const mockPlans: SharedPlan[] = [
        {
            id: "1",
            name: "Tribal FLN Excellence Program",
            dietName: "Ranchi DIET",
            district: "Ranchi",
            state: "Jharkhand",
            successRate: 95,
            teachersImpacted: 156,
            primaryIssues: ["FLN_gaps", "language_mismatch"],
            gradeBand: "Primary 1-3",
            language: "Hindi + Santhali",
            adaptedBy: 12,
            createdAt: "2026-01-10",
            rating: 4.8,
            reviewCount: 15,
            reviews: [
                { id: "1", userName: "Priya Singh", rating: 5, comment: "Excellent program! Very effective for tribal areas.", date: "2026-01-15", helpful: 8 },
                { id: "2", userName: "Amit Kumar", rating: 4, comment: "Good results, needed minor adaptations for our district.", date: "2026-01-14", helpful: 5 },
            ],
        },
        {
            id: "2",
            name: "Low-Resource Math Mastery",
            dietName: "Dumka DIET",
            district: "Dumka",
            state: "Jharkhand",
            successRate: 92,
            teachersImpacted: 89,
            primaryIssues: ["low_infrastructure"],
            gradeBand: "Primary 4-5",
            language: "Hindi",
            adaptedBy: 8,
            createdAt: "2026-01-12",
            rating: 4.6,
            reviewCount: 10,
        },
        {
            id: "3",
            name: "Digital Literacy for Rural Teachers",
            dietName: "Hazaribagh DIET",
            district: "Hazaribagh",
            state: "Jharkhand",
            successRate: 88,
            teachersImpacted: 124,
            primaryIssues: ["digital_literacy"],
            gradeBand: "All Grades",
            language: "Hindi",
            adaptedBy: 15,
            createdAt: "2026-01-08",
            rating: 4.7,
            reviewCount: 18,
        },
        {
            id: "4",
            name: "Inclusive Education Framework",
            dietName: "Bokaro DIET",
            district: "Bokaro",
            state: "Jharkhand",
            successRate: 90,
            teachersImpacted: 78,
            primaryIssues: ["special_needs"],
            gradeBand: "Primary 1-5",
            language: "Hindi",
            adaptedBy: 6,
            createdAt: "2026-01-14",
            rating: 4.9,
            reviewCount: 8,
        },
        {
            id: "5",
            name: "Assessment Techniques Workshop",
            dietName: "Dhanbad DIET",
            district: "Dhanbad",
            state: "Jharkhand",
            successRate: 87,
            teachersImpacted: 102,
            primaryIssues: ["assessment_gaps"],
            gradeBand: "Upper Primary 6-8",
            language: "Hindi",
            adaptedBy: 10,
            createdAt: "2026-01-11",
            rating: 4.5,
            reviewCount: 12,
        },
        {
            id: "6",
            name: "Classroom Management Mastery",
            dietName: "Giridih DIET",
            district: "Giridih",
            state: "Jharkhand",
            successRate: 91,
            teachersImpacted: 67,
            primaryIssues: ["classroom_management"],
            gradeBand: "All Grades",
            language: "Hindi",
            adaptedBy: 9,
            createdAt: "2026-01-13",
            rating: 4.4,
            reviewCount: 7,
        },
    ];

    useEffect(() => {
        fetchSharedPlans();
        generateRecommendations();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [plans, filter, searchQuery, minSuccessRate]);

    const fetchSharedPlans = async () => {
        try {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setPlans(mockPlans);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error("Failed to fetch shared plans:", error);
            setLoading(false);
        }
    };

    const generateRecommendations = () => {
        // Simulate AI recommendations based on user's plans
        const recommended = mockPlans.slice(0, 3);
        setRecommendations(recommended);
    };

    const applyFilters = () => {
        let filtered = [...plans];

        // Filter by category
        if (filter === "high-success") {
            filtered = filtered.filter(p => p.successRate >= 90);
        } else if (filter === "trending") {
            filtered = filtered.sort((a, b) => b.adaptedBy - a.adaptedBy);
        } else if (filter === "recent") {
            filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (filter === "top-rated") {
            filtered = filtered.sort((a, b) => b.rating - a.rating);
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.primaryIssues.some(issue => issue.toLowerCase().includes(query)) ||
                p.gradeBand.toLowerCase().includes(query)
            );
        }

        // Success rate filter
        if (minSuccessRate > 0) {
            filtered = filtered.filter(p => p.successRate >= minSuccessRate);
        }

        setFilteredPlans(filtered);
    };

    const submitReview = () => {
        if (!selectedPlan || !newReview) return;

        const review: Review = {
            id: Date.now().toString(),
            userName: "Current User",
            rating: newRating,
            comment: newReview,
            date: new Date().toISOString(),
            helpful: 0,
        };

        // Update plan with new review
        const updatedPlans = plans.map(p => {
            if (p.id === selectedPlan.id) {
                const reviews = [...(p.reviews || []), review];
                const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                return {
                    ...p,
                    reviews,
                    reviewCount: reviews.length,
                    rating: totalRating / reviews.length,
                };
            }
            return p;
        });

        setPlans(updatedPlans);
        setNewReview("");
        setNewRating(5);
        setShowReviewModal(false);
        alert("Review submitted successfully!");
    };

    const submitQuestion = () => {
        if (!newQuestion) return;

        alert("Question submitted! The plan creator will be notified.");
        setNewQuestion("");
        setShowQAModal(false);
    };

    const requestAdaptation = () => {
        if (!adaptationRequest) return;

        alert("Adaptation request sent! The DIET will review your request.");
        setAdaptationRequest("");
        setShowRequestModal(false);
    };

    const getSuccessColor = (rate: number) => {
        if (rate >= 90) return "text-success";
        if (rate >= 75) return "text-accent";
        return "text-warning";
    };

    const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => interactive && onRate && onRate(star)}
                        className={`text-xl ${interactive ? 'cursor-pointer hover:scale-110' : ''} ${star <= rating ? 'text-yellow-500' : 'text-gray-300'
                            }`}
                        disabled={!interactive}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="mx-auto max-w-7xl">
                {/* Review Modal */}
                {showReviewModal && selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="rounded-lg bg-white p-8 max-w-md w-full shadow-2xl dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Write a Review</h2>
                                <button onClick={() => setShowReviewModal(false)} className="text-2xl">×</button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Your Rating</label>
                                {renderStars(newRating, true, setNewRating)}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Your Review</label>
                                <textarea
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    placeholder="Share your experience with this plan..."
                                    className="w-full rounded-lg border px-4 py-2 h-32"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={submitReview}
                                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                                >
                                    Submit Review
                                </button>
                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="flex-1 rounded-lg border px-6 py-3 font-semibold hover:bg-muted"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Q&A Modal */}
                {showQAModal && selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="rounded-lg bg-white p-8 max-w-md w-full shadow-2xl dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Ask a Question</h2>
                                <button onClick={() => setShowQAModal(false)} className="text-2xl">×</button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Your Question</label>
                                <textarea
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="Ask the plan creator about implementation, resources, etc..."
                                    className="w-full rounded-lg border px-4 py-2 h-32"
                                />
                            </div>
                            <div className="mb-6 text-sm text-muted-foreground">
                                {selectedPlan.dietName} will be notified and can respond to your question.
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={submitQuestion}
                                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                                >
                                    Submit Question
                                </button>
                                <button
                                    onClick={() => setShowQAModal(false)}
                                    className="flex-1 rounded-lg border px-6 py-3 font-semibold hover:bg-muted"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Request Adaptation Modal */}
                {showRequestModal && selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="rounded-lg bg-white p-8 max-w-md w-full shadow-2xl dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Request Adaptation Help</h2>
                                <button onClick={() => setShowRequestModal(false)} className="text-2xl">×</button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Your Request</label>
                                <textarea
                                    value={adaptationRequest}
                                    onChange={(e) => setAdaptationRequest(e.target.value)}
                                    placeholder="Describe what help you need to adapt this plan to your context..."
                                    className="w-full rounded-lg border px-4 py-2 h-32"
                                />
                            </div>
                            <div className="mb-6 text-sm text-muted-foreground">
                                {selectedPlan.dietName} can provide guidance on adapting this plan for your needs.
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={requestAdaptation}
                                    className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
                                >
                                    Send Request
                                </button>
                                <button
                                    onClick={() => setShowRequestModal(false)}
                                    className="flex-1 rounded-lg border px-6 py-3 font-semibold hover:bg-muted"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                            <h1 className="mb-2 text-3xl font-bold">Cross-DIET Learning Network</h1>
                            <p className="text-muted-foreground">
                                Share, rate, and collaborate on successful training plans across India
                            </p>
                        </div>
                    </div>
                </div>

                {/* Network Stats */}
                <div className="mb-8 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4 text-center">
                        <div className="text-3xl font-bold text-primary">24</div>
                        <div className="text-sm text-muted-foreground">DIETs Connected</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-center">
                        <div className="text-3xl font-bold text-secondary">156</div>
                        <div className="text-sm text-muted-foreground">Plans Shared</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-center">
                        <div className="text-3xl font-bold text-accent">892</div>
                        <div className="text-sm text-muted-foreground">Adaptations</div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 text-center">
                        <div className="text-3xl font-bold text-success">87%</div>
                        <div className="text-sm text-muted-foreground">Avg Success Rate</div>
                    </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="mb-8 rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6">
                        <h2 className="mb-4 text-xl font-bold">💡 Recommended for You</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Based on your plans and needs, we think you'll find these helpful:
                        </p>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {recommendations.map((plan) => (
                                <div key={plan.id} className="rounded-lg border bg-white dark:bg-gray-800 p-4">
                                    <h3 className="font-bold text-sm mb-2">{plan.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
                                        {renderStars(plan.rating)}
                                        <span className="text-xs text-muted-foreground">({plan.reviewCount})</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">{plan.dietName}</div>
                                    <button
                                        onClick={() => {
                                            const element = document.getElementById(`plan-${plan.id}`);
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        View Plan →
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                    <div className="flex gap-4 flex-wrap">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by keywords, issues, or grade level..."
                            className="flex-1 min-w-[300px] rounded-lg border px-4 py-2"
                        />
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Min Success:</label>
                            <select
                                value={minSuccessRate}
                                onChange={(e) => setMinSuccessRate(Number(e.target.value))}
                                className="rounded-lg border px-4 py-2"
                            >
                                <option value="0">Any</option>
                                <option value="75">75%+</option>
                                <option value="85">85%+</option>
                                <option value="90">90%+</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => setFilter("all")}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === "all" ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
                                }`}
                        >
                            All Plans
                        </button>
                        <button
                            onClick={() => setFilter("top-rated")}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === "top-rated" ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
                                }`}
                        >
                            ⭐ Top Rated
                        </button>
                        <button
                            onClick={() => setFilter("high-success")}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === "high-success" ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
                                }`}
                        >
                            High Success (90%+)
                        </button>
                        <button
                            onClick={() => setFilter("trending")}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === "trending" ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
                                }`}
                        >
                            🔥 Trending
                        </button>
                        <button
                            onClick={() => setFilter("recent")}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold ${filter === "recent" ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
                                }`}
                        >
                            Recently Added
                        </button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Showing {filteredPlans.length} of {plans.length} plans
                    </div>
                </div>

                {/* Shared Plans Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading plans...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPlans.map((plan) => (
                            <div
                                key={plan.id}
                                id={`plan-${plan.id}`}
                                className="rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
                            >
                                {/* Header */}
                                <div className="mb-4">
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="font-bold text-lg">{plan.name}</h3>
                                        <div className={`text-2xl font-bold ${getSuccessColor(plan.successRate)}`}>
                                            {plan.successRate}%
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {plan.dietName} • {plan.district}, {plan.state}
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mb-4 flex items-center gap-2">
                                    {renderStars(plan.rating)}
                                    <span className="text-sm font-semibold">{plan.rating.toFixed(1)}</span>
                                    <span className="text-xs text-muted-foreground">({plan.reviewCount} reviews)</span>
                                </div>

                                {/* Stats */}
                                <div className="mb-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-background p-3">
                                        <div className="text-xs text-muted-foreground">Teachers</div>
                                        <div className="font-bold">{plan.teachersImpacted}</div>
                                    </div>
                                    <div className="rounded-lg bg-background p-3">
                                        <div className="text-xs text-muted-foreground">Adapted By</div>
                                        <div className="font-bold">{plan.adaptedBy} DIETs</div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="mb-4 space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium">Grade:</span> {plan.gradeBand}
                                    </div>
                                    <div>
                                        <span className="font-medium">Language:</span> {plan.language}
                                    </div>
                                    <div>
                                        <span className="font-medium">Issues:</span>
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {plan.primaryIssues.map((issue) => (
                                                <span
                                                    key={issue}
                                                    className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                                                >
                                                    {issue.replace(/_/g, " ")}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <button className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                                            View Details
                                        </button>
                                        <button className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted">
                                            Adapt
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedPlan(plan);
                                                setShowReviewModal(true);
                                            }}
                                            className="flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                                        >
                                            ⭐ Write Review
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedPlan(plan);
                                                setShowQAModal(true);
                                            }}
                                            className="flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                                        >
                                            ❓ Ask Question
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedPlan(plan);
                                                setShowRequestModal(true);
                                            }}
                                            className="flex-1 rounded-lg border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
                                        >
                                            🤝 Request Help
                                        </button>
                                    </div>
                                </div>

                                {/* Reviews Preview */}
                                {plan.reviews && plan.reviews.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="text-xs font-semibold mb-2">Recent Review:</div>
                                        <div className="rounded-lg bg-background p-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                {renderStars(plan.reviews[0].rating)}
                                                <span className="text-xs font-semibold">{plan.reviews[0].userName}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {plan.reviews[0].comment}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Success Stories */}
                <div className="mt-12 rounded-lg border bg-gradient-to-br from-success/5 to-accent/5 p-6">
                    <h2 className="mb-6 text-2xl font-bold">Success Stories</h2>
                    <div className="space-y-4">
                        <div className="rounded-lg border bg-card p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="text-2xl">🏆</span>
                                <span className="font-bold">Ranchi → Hazaribagh → Bokaro</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Ranchi DIET's "Tribal FLN Excellence Program" achieved 95% success rate. Hazaribagh
                                DIET adapted it and got 90% success. Bokaro DIET then adapted Hazaribagh's version
                                and achieved 88% success. <strong>Total impact: 367 teachers, 5,500+ students!</strong>
                            </p>
                        </div>

                        <div className="rounded-lg border bg-card p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <span className="text-2xl">🌟</span>
                                <span className="font-bold">Network Effect in Action</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Dumka DIET's "Low-Resource Math Mastery" has been adapted by 8 DIETs across 3 states.
                                Average success rate: 89%. <strong>Combined impact: 650+ teachers trained!</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

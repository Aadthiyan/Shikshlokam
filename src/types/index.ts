/**
 * TypeScript type definitions for DIET Training OS
 */

import { Prisma } from "@prisma/client";

// ============================================
// DATABASE TYPES
// ============================================

export type User = Prisma.UserGetPayload<{}>;
export type Cluster = Prisma.ClusterGetPayload<{}>;
export type NeedSignal = Prisma.NeedSignalGetPayload<{}>;
export type Cohort = Prisma.CohortGetPayload<{}>;
export type Module = Prisma.ModuleGetPayload<{}>;
export type Plan = Prisma.PlanGetPayload<{}>;
export type PlanSession = Prisma.PlanSessionGetPayload<{}>;
export type SessionFeedback = Prisma.SessionFeedbackGetPayload<{}>;

// With relations
export type CohortWithNeedSignals = Prisma.CohortGetPayload<{
    include: { needSignals: { include: { needSignal: { include: { cluster: true } } } } };
}>;

export type PlanWithSessions = Prisma.PlanGetPayload<{
    include: { sessions: { include: { module: true } }; cohort: true };
}>;

export type NeedSignalWithCluster = Prisma.NeedSignalGetPayload<{
    include: { cluster: true };
}>;

// ============================================
// FORM INPUT TYPES
// ============================================

export interface NeedSignalInput {
    clusterId: string;
    grades: string[];
    subjects: string[];
    issueTags: string[];
    notes?: string;
    metrics?: {
        readingBelowGradeLevelPercent?: number;
        attendanceRate?: number;
        teacherStudentRatio?: string;
    };
    reportedBy?: string;
}

export interface CohortInput {
    name: string;
    description: string;
    tags: string[];
    primaryIssues: string[];
    language?: string;
    gradeBand?: string;
    infrastructureLevel?: "HIGH" | "MEDIUM" | "LOW";
    needSignalIds: string[];
}

export interface ModuleInput {
    title: string;
    theme: string;
    competencyTags: string[];
    durationMinutes: number;
    gradeBand: string;
    language: string;
    infraTags: string[];
    description: string;
    objectives: string[];
    contentUrl?: string;
}

export interface PlanInput {
    name: string;
    cohortId: string;
    sessions: PlanSessionInput[];
}

export interface PlanSessionInput {
    moduleId: string;
    orderIndex: number;
    title: string;
    objectives: string[];
    trainerNotes?: string;
}

export interface SessionFeedbackInput {
    planSessionId: string;
    relevanceScore: number;
    confidenceScore: number;
    comments?: string;
    unresolvedIssues?: string[];
}

// ============================================
// INFRASTRUCTURE TYPES
// ============================================

export interface InfrastructureDetails {
    electricity: "yes" | "no" | "intermittent";
    internet: boolean;
    projector: boolean;
    library: boolean;
    libraryBooks?: number;
    computerLab: boolean;
    toilets: boolean;
    drinkingWater: boolean;
    playground: boolean;
}

export interface Demographics {
    tribalPopulationPercent?: number;
    scStPercent?: number;
    girlsEnrollmentPercent?: number;
}

// ============================================
// ISSUE & TAG TYPES
// ============================================

export type IssueTag =
    | "FLN_gaps"
    | "student_absenteeism"
    | "multi_grade_classroom"
    | "language_mismatch"
    | "classroom_behavior"
    | "tlm_shortage"
    | "low_infrastructure"
    | "teacher_shortage"
    | "special_needs"
    | "digital_divide";

export type CompetencyTag =
    | "reading_pedagogy"
    | "numeracy_skills"
    | "assessment_techniques"
    | "classroom_management"
    | "inclusive_pedagogy"
    | "cultural_sensitivity"
    | "language_teaching"
    | "behavior_management"
    | "resource_creation"
    | "differentiated_instruction"
    | "formative_assessment"
    | "digital_literacy"
    | "collaborative_learning"
    | "critical_thinking"
    | "socio_emotional_learning";

export type ModuleTheme =
    | "FLN"
    | "Classroom Management"
    | "Language Contextualization"
    | "Inclusive Pedagogy"
    | "TLMs"
    | "Assessment"
    | "Digital Learning"
    | "Pedagogy";

export type GradeBand = "primary_1_3" | "primary_4_5" | "secondary_6_8" | "all";

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================
// AI SERVICE TYPES
// ============================================

export interface AIGeneratedPlan {
    sessions: {
        sessionNumber: number;
        moduleId: string;
        title: string;
        objectives: string[];
        trainerNotes: string;
        rationale: string;
    }[];
    overallRationale: string;
}

export interface CohortProfile {
    issues: string[];
    language: string;
    gradeBand: string;
    infrastructureLevel: string;
    context: string;
    teacherCount: number;
}

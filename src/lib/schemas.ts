/**
 * Form Schemas & Validation
 * Zod schemas for all forms in the application
 */

import { z } from "zod";

// ============================================
// NEEDS CAPTURE FORM
// ============================================

export const needsCaptureSchema = z.object({
    clusterId: z.string().min(1, "Please select a cluster"),
    grades: z
        .array(z.string())
        .min(1, "Please select at least one grade")
        .max(8, "Maximum 8 grades can be selected"),
    subjects: z
        .array(z.string())
        .min(1, "Please select at least one subject")
        .max(10, "Maximum 10 subjects can be selected"),
    issueTags: z
        .array(z.string())
        .min(1, "Please select at least one issue")
        .max(10, "Maximum 10 issues can be selected"),
    notes: z.string().optional(),
    reportedBy: z.string().min(2, "Name must be at least 2 characters").optional(),
    metrics: z
        .object({
            readingBelowGradeLevelPercent: z.number().min(0).max(100).optional(),
            attendanceRate: z.number().min(0).max(100).optional(),
            teacherStudentRatio: z.string().optional(),
        })
        .optional(),
});

export type NeedsCaptureFormData = z.infer<typeof needsCaptureSchema>;

// ============================================
// CONSTANTS
// ============================================

export const GRADE_OPTIONS = [
    { value: "1", label: "Grade 1" },
    { value: "2", label: "Grade 2" },
    { value: "3", label: "Grade 3" },
    { value: "4", label: "Grade 4" },
    { value: "5", label: "Grade 5" },
    { value: "6", label: "Grade 6" },
    { value: "7", label: "Grade 7" },
    { value: "8", label: "Grade 8" },
];

export const SUBJECT_OPTIONS = [
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
    { value: "Social Studies", label: "Social Studies" },
    { value: "Environmental Studies", label: "Environmental Studies (EVS)" },
    { value: "Local Language", label: "Local Language" },
    { value: "Art & Craft", label: "Art & Craft" },
    { value: "Physical Education", label: "Physical Education" },
    { value: "Computer Science", label: "Computer Science" },
];

export const ISSUE_TAG_OPTIONS = [
    {
        value: "FLN_gaps",
        label: "FLN Gaps",
        description: "Foundational Literacy & Numeracy challenges",
    },
    {
        value: "student_absenteeism",
        label: "Student Absenteeism",
        description: "High dropout or irregular attendance",
    },
    {
        value: "multi_grade_classroom",
        label: "Multi-Grade Classroom",
        description: "Teaching multiple grades simultaneously",
    },
    {
        value: "language_mismatch",
        label: "Language Mismatch",
        description: "Home language differs from instruction language",
    },
    {
        value: "classroom_behavior",
        label: "Classroom Behavior",
        description: "Behavior management challenges",
    },
    {
        value: "tlm_shortage",
        label: "TLM Shortage",
        description: "Lack of teaching-learning materials",
    },
    {
        value: "low_infrastructure",
        label: "Low Infrastructure",
        description: "No electricity, internet, or basic facilities",
    },
    {
        value: "teacher_shortage",
        label: "Teacher Shortage",
        description: "Insufficient teachers for student population",
    },
    {
        value: "special_needs",
        label: "Special Needs",
        description: "Students with disabilities or special requirements",
    },
    {
        value: "digital_divide",
        label: "Digital Divide",
        description: "Lack of access to digital learning resources",
    },
];

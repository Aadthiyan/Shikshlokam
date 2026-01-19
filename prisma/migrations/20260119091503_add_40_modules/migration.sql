-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PLANNER', 'BRP', 'CRP', 'TRAINER');

-- CreateEnum
CREATE TYPE "InfraLevel" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "diet_name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'PLANNER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clusters" (
    "id" TEXT NOT NULL,
    "udise_code" TEXT,
    "name" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "block" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'Jharkhand',
    "languages" TEXT[],
    "primary_language" TEXT NOT NULL,
    "infrastructure_level" "InfraLevel" NOT NULL,
    "type" TEXT,
    "schools_count" INTEGER NOT NULL DEFAULT 0,
    "teacher_count_estimate" INTEGER NOT NULL DEFAULT 0,
    "student_count_estimate" INTEGER NOT NULL DEFAULT 0,
    "infrastructure_details" JSONB,
    "demographics" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clusters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "need_signals" (
    "id" TEXT NOT NULL,
    "cluster_id" TEXT NOT NULL,
    "user_id" TEXT,
    "grades" TEXT[],
    "subjects" TEXT[],
    "issue_tags" TEXT[],
    "notes" TEXT,
    "metrics" JSONB,
    "reported_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "need_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohorts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "primary_issues" TEXT[],
    "language" TEXT,
    "grade_band" TEXT,
    "infrastructure_level" "InfraLevel",
    "teacher_count_estimate" INTEGER NOT NULL DEFAULT 0,
    "cluster_count" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cohorts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cohort_need_signals" (
    "cohort_id" TEXT NOT NULL,
    "need_signal_id" TEXT NOT NULL,

    CONSTRAINT "cohort_need_signals_pkey" PRIMARY KEY ("cohort_id","need_signal_id")
);

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "competency_tags" TEXT[],
    "duration_minutes" INTEGER NOT NULL,
    "grade_band" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "infra_tags" TEXT[],
    "description" TEXT NOT NULL,
    "objectives" TEXT[],
    "content_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cohort_id" TEXT NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'DRAFT',
    "total_duration_minutes" INTEGER NOT NULL DEFAULT 0,
    "session_count" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_sessions" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "session_number" INTEGER NOT NULL,
    "order_index" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "objectives" TEXT[],
    "duration_minutes" INTEGER NOT NULL DEFAULT 45,
    "trainer_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_feedbacks" (
    "id" TEXT NOT NULL,
    "plan_session_id" TEXT NOT NULL,
    "user_id" TEXT,
    "relevance_score" INTEGER NOT NULL,
    "confidence_score" INTEGER NOT NULL,
    "comments" TEXT,
    "unresolved_issues" TEXT[],
    "trainer_notes" TEXT,
    "teacher_reactions" TEXT,
    "submitted_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "session_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clusters_udise_code_key" ON "clusters"("udise_code");

-- CreateIndex
CREATE INDEX "clusters_district_block_idx" ON "clusters"("district", "block");

-- CreateIndex
CREATE INDEX "clusters_infrastructure_level_idx" ON "clusters"("infrastructure_level");

-- CreateIndex
CREATE INDEX "need_signals_cluster_id_idx" ON "need_signals"("cluster_id");

-- CreateIndex
CREATE INDEX "need_signals_created_at_idx" ON "need_signals"("created_at");

-- CreateIndex
CREATE INDEX "cohorts_created_at_idx" ON "cohorts"("created_at");

-- CreateIndex
CREATE INDEX "cohorts_infrastructure_level_idx" ON "cohorts"("infrastructure_level");

-- CreateIndex
CREATE INDEX "modules_theme_idx" ON "modules"("theme");

-- CreateIndex
CREATE INDEX "modules_grade_band_idx" ON "modules"("grade_band");

-- CreateIndex
CREATE INDEX "modules_language_idx" ON "modules"("language");

-- CreateIndex
CREATE INDEX "plans_cohort_id_idx" ON "plans"("cohort_id");

-- CreateIndex
CREATE INDEX "plans_status_idx" ON "plans"("status");

-- CreateIndex
CREATE INDEX "plans_created_at_idx" ON "plans"("created_at");

-- CreateIndex
CREATE INDEX "plan_sessions_plan_id_idx" ON "plan_sessions"("plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "plan_sessions_plan_id_order_index_key" ON "plan_sessions"("plan_id", "order_index");

-- CreateIndex
CREATE INDEX "session_feedbacks_plan_session_id_idx" ON "session_feedbacks"("plan_session_id");

-- CreateIndex
CREATE INDEX "session_feedbacks_created_at_idx" ON "session_feedbacks"("created_at");

-- AddForeignKey
ALTER TABLE "need_signals" ADD CONSTRAINT "need_signals_cluster_id_fkey" FOREIGN KEY ("cluster_id") REFERENCES "clusters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "need_signals" ADD CONSTRAINT "need_signals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohorts" ADD CONSTRAINT "cohorts_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_need_signals" ADD CONSTRAINT "cohort_need_signals_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cohort_need_signals" ADD CONSTRAINT "cohort_need_signals_need_signal_id_fkey" FOREIGN KEY ("need_signal_id") REFERENCES "need_signals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_cohort_id_fkey" FOREIGN KEY ("cohort_id") REFERENCES "cohorts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plans" ADD CONSTRAINT "plans_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_sessions" ADD CONSTRAINT "plan_sessions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_sessions" ADD CONSTRAINT "plan_sessions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_feedbacks" ADD CONSTRAINT "session_feedbacks_plan_session_id_fkey" FOREIGN KEY ("plan_session_id") REFERENCES "plan_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_feedbacks" ADD CONSTRAINT "session_feedbacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

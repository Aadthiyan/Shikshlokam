import NeedsCaptureForm from "@/components/NeedsCaptureForm";

export const metadata = {
    title: "Report Classroom Needs | DIET Training OS",
    description: "Report classroom needs and challenges to create personalized teacher training plans",
};

export default function NeedsCaptureFormPage() {
    return (
        <div className="min-h-screen bg-background p-8">
            <NeedsCaptureForm />
        </div>
    );
}

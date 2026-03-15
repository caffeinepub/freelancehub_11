import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, FolderPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateProject } from "../hooks/useQueries";

const CATEGORIES = [
  "Web Development",
  "Mobile",
  "Design",
  "Marketing",
  "Writing",
  "Other",
];

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const createProject = useCreateProject();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!category) {
      toast.error("Select a category.");
      return;
    }
    if (!budget || Number(budget) <= 0) {
      toast.error("Enter a valid budget.");
      return;
    }
    if (!deadline) {
      toast.error("Set a deadline.");
      return;
    }

    try {
      const projectId = await createProject.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category,
        budget: BigInt(Math.round(Number(budget))),
        deadline,
      });
      toast.success("Project posted successfully!");
      navigate({
        to: "/project/$projectId",
        params: { projectId: projectId.toString() },
      });
    } catch {
      toast.error("Failed to create project. Please try again.");
    }
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/client/dashboard" })}
        data-ocid="create_project.button"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <FolderPlus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">
            Post a New Project
          </h1>
          <p className="text-sm text-muted-foreground">
            Describe your project and start receiving proposals.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card/60 border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">
              Project Details
            </CardTitle>
            <CardDescription>
              Be as specific as possible to attract the right talent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build a React Dashboard with Dark Mode"
                required
                data-ocid="create_project.input"
                className="bg-input/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you need, deliverables, and any requirements..."
                rows={5}
                data-ocid="create_project.textarea"
                className="bg-input/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    data-ocid="create_project.select"
                    className="bg-input/50"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="budget">Budget (USD) *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    $
                  </span>
                  <Input
                    id="budget"
                    type="number"
                    min="1"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="2500"
                    required
                    data-ocid="create_project.input"
                    className="bg-input/50 pl-7"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                min={minDateStr}
                onChange={(e) => setDeadline(e.target.value)}
                required
                data-ocid="create_project.input"
                className="bg-input/50"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/client/dashboard" })}
            data-ocid="create_project.cancel_button"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createProject.isPending}
            data-ocid="create_project.submit_button"
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            {createProject.isPending ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Posting...
              </>
            ) : (
              "Post Project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Briefcase, Loader2, Plus, UserCheck, X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { useRegisterUser } from "../hooks/useQueries";

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useRegisterUser();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error("Please select your role.");
      return;
    }
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (skills.length === 0) {
      toast.error("Add at least one skill.");
      return;
    }

    try {
      await registerUser.mutateAsync({
        name: name.trim(),
        bio: bio.trim(),
        skills,
        hourlyRate: BigInt(Math.round(Number(hourlyRate) || 0)),
        role,
      });
      toast.success("Profile created! Welcome to FreelanceHub.");
      if (role === UserRole.client) navigate({ to: "/client/dashboard" });
      else navigate({ to: "/freelancer/dashboard" });
    } catch (_err) {
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl">
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">
          Set Up Your Profile
        </h1>
        <p className="text-muted-foreground">
          One-time setup — takes less than 2 minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">I want to...</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole(UserRole.client)}
              data-ocid="register.select"
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                role === UserRole.client
                  ? "border-primary bg-primary/10"
                  : "border-border/60 bg-card hover:border-primary/40"
              }`}
            >
              <Briefcase
                className={`w-6 h-6 mb-2 ${role === UserRole.client ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="font-display font-semibold text-sm">
                Hire Talent
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Post projects & manage freelancers
              </div>
            </button>
            <button
              type="button"
              onClick={() => setRole(UserRole.freelancer)}
              data-ocid="register.select"
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                role === UserRole.freelancer
                  ? "border-primary bg-primary/10"
                  : "border-border/60 bg-card hover:border-primary/40"
              }`}
            >
              <UserCheck
                className={`w-6 h-6 mb-2 ${role === UserRole.freelancer ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="font-display font-semibold text-sm">
                Offer Services
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Browse projects & submit proposals
              </div>
            </button>
          </div>
        </div>

        <Card className="bg-card/60 border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-base">
              Your Details
            </CardTitle>
            <CardDescription>This is how others will see you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alejandra Vega"
                required
                data-ocid="register.input"
                className="bg-input/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell clients or freelancers about yourself..."
                rows={3}
                data-ocid="register.textarea"
                className="bg-input/50 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="skills">Skills *</Label>
              <div className="flex gap-2">
                <Input
                  id="skills"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. React, Design, Copywriting"
                  data-ocid="register.input"
                  className="bg-input/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addSkill}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="gap-1 pr-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  $
                </span>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="50"
                  data-ocid="register.input"
                  className="bg-input/50 pl-7"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          disabled={registerUser.isPending}
          data-ocid="register.submit_button"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
        >
          {registerUser.isPending ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Creating
              Profile...
            </>
          ) : (
            "Create Profile & Continue"
          )}
        </Button>
      </form>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  Clock,
  DollarSign,
  FolderOpen,
  Plus,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useProfile } from "../context/ProfileContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useClientProjects } from "../hooks/useQueries";

const CATEGORY_COLORS: Record<string, string> = {
  "Web Development": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Mobile: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Marketing: "bg-green-500/10 text-green-400 border-green-500/20",
  Writing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function ClientDashboard() {
  const { identity } = useInternetIdentity();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const principal = identity?.getPrincipal();
  const { data: projects, isLoading } = useClientProjects(principal);

  const openProjects = projects?.filter((p) => p.isOpen) ?? [];
  const closedProjects = projects?.filter((p) => !p.isOpen) ?? [];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10"
      >
        <div>
          <p className="text-sm text-muted-foreground mb-1">Client Dashboard</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Welcome back,{" "}
            <span className="text-primary">{profile?.name ?? "..."}</span>
          </h1>
        </div>
        <Button
          onClick={() => navigate({ to: "/client/projects/new" })}
          data-ocid="client.primary_button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
        >
          <Plus className="w-4 h-4" /> Post New Project
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Total Projects",
            value: projects?.length ?? 0,
            icon: Briefcase,
          },
          { label: "Open", value: openProjects.length, icon: TrendingUp },
          { label: "Closed", value: closedProjects.length, icon: FolderOpen },
          {
            label: "Total Budget",
            value: `$${(projects ?? []).reduce((s, p) => s + Number(p.budget), 0).toLocaleString()}`,
            icon: DollarSign,
          },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card/60 border-border/60">
            <CardContent className="pt-5">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <stat.icon className="w-4 h-4" />
                <span className="text-xs">{stat.label}</span>
              </div>
              <div className="font-display text-2xl font-bold">
                {isLoading ? "..." : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          data-ocid="client.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card/60 border-border/60">
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : projects?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="client.empty_state"
          className="text-center py-20 border border-dashed border-border/60 rounded-2xl"
        >
          <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">
            No projects yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Post your first project and start receiving proposals from top
            freelancers.
          </p>
          <Button
            onClick={() => navigate({ to: "/client/projects/new" })}
            data-ocid="client.primary_button"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 w-4 h-4" /> Post First Project
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {openProjects.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent inline-block" />{" "}
                Open Projects ({openProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {openProjects.map((project, i) => (
                  <motion.div
                    key={project.id.toString()}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    data-ocid={`client.item.${i + 1}`}
                  >
                    <Card
                      className="card-glow-hover bg-card/60 border-border/60 cursor-pointer"
                      onClick={() =>
                        navigate({
                          to: "/project/$projectId",
                          params: { projectId: project.id.toString() },
                        })
                      }
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="font-display text-base">
                            {project.title}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={`text-xs shrink-0 border ${CATEGORY_COLORS[project.category] ?? CATEGORY_COLORS.Other}`}
                          >
                            {project.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-primary flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            {Number(project.budget).toLocaleString()}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />{" "}
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {closedProjects.length > 0 && (
            <div>
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />{" "}
                Closed Projects ({closedProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {closedProjects.map((project, i) => (
                  <motion.div
                    key={project.id.toString()}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    data-ocid={`client.item.${openProjects.length + i + 1}`}
                  >
                    <Card
                      className="card-glow-hover bg-card/40 border-border/40 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                      onClick={() =>
                        navigate({
                          to: "/project/$projectId",
                          params: { projectId: project.id.toString() },
                        })
                      }
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="font-display text-base">
                            {project.title}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="text-xs shrink-0"
                          >
                            Closed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            ${Number(project.budget).toLocaleString()}
                          </span>
                          <span className="text-muted-foreground">
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

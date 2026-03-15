import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  Search,
  Send,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ProposalStatus } from "../backend";
import { useProfile } from "../context/ProfileContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAllOpenProjects,
  useFreelancerProposals,
} from "../hooks/useQueries";

const CATEGORY_COLORS: Record<string, string> = {
  "Web Development": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Mobile: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Marketing: "bg-green-500/10 text-green-400 border-green-500/20",
  Writing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const PROPOSAL_STATUS_ICON: Record<ProposalStatus, React.ReactNode> = {
  [ProposalStatus.pending]: <Clock className="w-4 h-4 text-yellow-400" />,
  [ProposalStatus.accepted]: <CheckCircle className="w-4 h-4 text-green-400" />,
  [ProposalStatus.rejected]: <XCircle className="w-4 h-4 text-red-400" />,
};

export default function FreelancerDashboard() {
  const { identity } = useInternetIdentity();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("browse");

  const principal = identity?.getPrincipal();
  const { data: openProjects, isLoading: projectsLoading } =
    useAllOpenProjects();
  const { data: myProposals, isLoading: proposalsLoading } =
    useFreelancerProposals(principal);

  const filtered =
    openProjects?.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <p className="text-sm text-muted-foreground mb-1">
          Freelancer Dashboard
        </p>
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          Welcome,{" "}
          <span className="text-primary">{profile?.name ?? "..."}</span>
        </h1>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Open Projects",
            value: openProjects?.length ?? 0,
            icon: Briefcase,
          },
          {
            label: "My Proposals",
            value: myProposals?.length ?? 0,
            icon: Send,
          },
          {
            label: "Accepted",
            value:
              myProposals?.filter((p) => p.status === ProposalStatus.accepted)
                .length ?? 0,
            icon: CheckCircle,
          },
          {
            label: "Hourly Rate",
            value: `$${Number(profile?.hourlyRate ?? 0)}/hr`,
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
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-secondary/50">
          <TabsTrigger
            value="browse"
            data-ocid="freelancer.tab"
            className="gap-2"
          >
            <Briefcase className="w-4 h-4" /> Browse Projects
          </TabsTrigger>
          <TabsTrigger
            value="proposals"
            data-ocid="freelancer.tab"
            className="gap-2"
          >
            <Send className="w-4 h-4" /> My Proposals
          </TabsTrigger>
        </TabsList>

        {/* Browse Projects */}
        <TabsContent value="browse">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by title, category, description..."
              data-ocid="freelancer.search_input"
              className="pl-9 bg-input/50"
            />
          </div>

          {projectsLoading ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              data-ocid="freelancer.loading_state"
            >
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-card/60 border-border/60">
                  <CardContent className="pt-6 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="freelancer.empty_state"
              className="text-center py-16 border border-dashed border-border/60 rounded-2xl"
            >
              <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">
                {search
                  ? `No projects matching "${search}"`
                  : "No open projects right now. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id.toString()}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`project.item.${i + 1}`}
                >
                  <Card
                    className="card-glow-hover bg-card/60 border-border/60 cursor-pointer h-full"
                    onClick={() =>
                      navigate({
                        to: "/project/$projectId",
                        params: { projectId: project.id.toString() },
                      })
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="font-display text-base leading-snug">
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
          )}
        </TabsContent>

        {/* My Proposals */}
        <TabsContent value="proposals">
          {proposalsLoading ? (
            <div className="space-y-3" data-ocid="freelancer.loading_state">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : myProposals?.length === 0 ? (
            <div
              data-ocid="freelancer.empty_state"
              className="text-center py-16 border border-dashed border-border/60 rounded-2xl"
            >
              <Send className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-display font-semibold mb-2">
                No proposals yet
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Browse open projects and submit your first proposal.
              </p>
              <Button
                variant="outline"
                onClick={() => setActiveTab("browse")}
                data-ocid="freelancer.secondary_button"
              >
                Browse Projects
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myProposals?.map((proposal, i) => (
                <motion.div
                  key={proposal.id.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  data-ocid={`proposal.item.${i + 1}`}
                >
                  <Card className="bg-card/60 border-border/60">
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {PROPOSAL_STATUS_ICON[proposal.status]}
                          <button
                            type="button"
                            className="font-display font-semibold text-sm hover:text-primary transition-colors"
                            onClick={() =>
                              navigate({
                                to: "/project/$projectId",
                                params: {
                                  projectId: proposal.projectId.toString(),
                                },
                              })
                            }
                          >
                            View Project #{proposal.projectId.toString()}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              proposal.status === ProposalStatus.accepted
                                ? "border-green-500/20 text-green-400"
                                : proposal.status === ProposalStatus.rejected
                                  ? "border-red-500/20 text-red-400"
                                  : "border-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {proposal.status}
                          </Badge>
                          <span className="font-semibold text-primary text-sm">
                            ${Number(proposal.proposedPrice).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {proposal.coverLetter}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Clock,
  DollarSign,
  Loader2,
  Send,
  Star,
  User,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ProposalStatus, UserRole } from "../backend";
import { useProfile } from "../context/ProfileContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useProjectProposals,
  useReviewProposal,
  useSubmitProposal,
} from "../hooks/useQueries";

const STATUS_STYLES: Record<ProposalStatus, string> = {
  [ProposalStatus.pending]:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  [ProposalStatus.accepted]:
    "bg-green-500/10 text-green-400 border-green-500/20",
  [ProposalStatus.rejected]: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/project/$projectId" });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { profile } = useProfile();
  const { actor, isFetching } = useActor();

  const [proposalOpen, setProposalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!actor) return null;
      const projects = await actor.getAllOpenProjects();
      const found = projects.find((p) => p.id.toString() === projectId);
      if (found) return found;
      return null;
    },
    enabled: !!actor && !isFetching,
  });

  const { data: proposals, isLoading: proposalsLoading } = useProjectProposals(
    projectId ? BigInt(projectId) : undefined,
  );

  const reviewProposal = useReviewProposal();
  const submitProposal = useSubmitProposal();

  const isClient = profile?.role === UserRole.client;
  const isFreelancer = profile?.role === UserRole.freelancer;
  const callerPrincipal = identity?.getPrincipal().toString();

  const hasMyProposal =
    isFreelancer &&
    proposals?.some((p) => p.freelancer.toString() === callerPrincipal);

  const handleReview = async (proposalId: bigint, accept: boolean) => {
    try {
      await reviewProposal.mutateAsync({
        proposalId,
        accept,
        projectId: BigInt(projectId),
      });
      toast.success(accept ? "Proposal accepted!" : "Proposal rejected.");
    } catch {
      toast.error("Failed to update proposal.");
    }
  };

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim()) {
      toast.error("Cover letter required.");
      return;
    }
    if (!proposedPrice || Number(proposedPrice) <= 0) {
      toast.error("Enter a valid price.");
      return;
    }
    try {
      await submitProposal.mutateAsync({
        projectId: BigInt(projectId),
        coverLetter: coverLetter.trim(),
        proposedPrice: BigInt(Math.round(Number(proposedPrice))),
      });
      toast.success("Proposal submitted!");
      setProposalOpen(false);
      setCoverLetter("");
      setProposedPrice("");
    } catch {
      toast.error("Failed to submit proposal.");
    }
  };

  if (projectLoading) {
    return (
      <div
        className="container mx-auto px-4 py-10 max-w-3xl"
        data-ocid="project.loading_state"
      >
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-8" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          navigate({
            to: isClient ? "/client/dashboard" : "/freelancer/dashboard",
          })
        }
        data-ocid="project.button"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      {/* Project Info */}
      {project ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card/60 border-border/60 mb-8">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="font-display text-2xl">
                  {project.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      project.isOpen
                        ? "text-xs border-green-500/20 text-green-400 bg-green-500/10"
                        : "text-xs border-muted"
                    }
                  >
                    {project.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              )}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-sm">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-primary">
                    ${Number(project.budget).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">budget</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </div>
              </div>

              {/* Freelancer: submit proposal */}
              {isFreelancer && project.isOpen && !hasMyProposal && (
                <div className="pt-2">
                  <Dialog open={proposalOpen} onOpenChange={setProposalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        data-ocid="project.primary_button"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2"
                      >
                        <Send className="w-4 h-4" /> Submit Proposal
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className="bg-card border-border/80 max-w-lg"
                      data-ocid="project.dialog"
                    >
                      <DialogHeader>
                        <DialogTitle className="font-display">
                          Submit Your Proposal
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleSubmitProposal}
                        className="space-y-4 mt-2"
                      >
                        <div className="space-y-1.5">
                          <Label>Cover Letter *</Label>
                          <Textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Introduce yourself and explain why you're the best fit..."
                            rows={5}
                            required
                            data-ocid="project.textarea"
                            className="bg-input/50 resize-none"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Your Price (USD) *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                              $
                            </span>
                            <Input
                              type="number"
                              min="1"
                              value={proposedPrice}
                              onChange={(e) => setProposedPrice(e.target.value)}
                              placeholder="1500"
                              required
                              data-ocid="project.input"
                              className="bg-input/50 pl-7"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setProposalOpen(false)}
                            data-ocid="project.cancel_button"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={submitProposal.isPending}
                            data-ocid="project.submit_button"
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            {submitProposal.isPending ? (
                              <>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />{" "}
                                Sending...
                              </>
                            ) : (
                              "Send Proposal"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
              {isFreelancer && hasMyProposal && (
                <Badge
                  variant="outline"
                  className="border-green-500/20 text-green-400 bg-green-500/10"
                >
                  ✓ Proposal submitted
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <Card className="bg-card/60 border-border/60 mb-8">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              Project not found or no longer available.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Proposals */}
      <div>
        <h2 className="font-display text-xl font-bold mb-4">
          Proposals
          {proposals && (
            <span className="text-muted-foreground font-normal text-base ml-2">
              ({proposals.length})
            </span>
          )}
        </h2>

        {proposalsLoading ? (
          <div className="space-y-3" data-ocid="project.loading_state">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : proposals?.length === 0 ? (
          <div
            data-ocid="project.empty_state"
            className="text-center py-12 border border-dashed border-border/60 rounded-xl"
          >
            <Send className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No proposals yet. Be the first to apply!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals?.map((proposal, i) => (
              <motion.div
                key={proposal.id.toString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                data-ocid={`proposal.item.${i + 1}`}
              >
                <Card className="bg-card/60 border-border/60">
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <button
                            type="button"
                            className="text-sm font-semibold hover:text-primary transition-colors"
                            onClick={() =>
                              navigate({
                                to: "/freelancers/$principal",
                                params: {
                                  principal: proposal.freelancer.toString(),
                                },
                              })
                            }
                          >
                            View Profile
                          </button>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {proposal.freelancer.toString().slice(0, 20)}...
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${STATUS_STYLES[proposal.status]}`}
                        >
                          {proposal.status}
                        </Badge>
                        <span className="font-semibold text-primary text-sm">
                          ${Number(proposal.proposedPrice).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {proposal.coverLetter}
                    </p>

                    {/* Client accept/reject */}
                    {isClient &&
                      proposal.status === ProposalStatus.pending &&
                      project?.isOpen && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={reviewProposal.isPending}
                            onClick={() => handleReview(proposal.id, true)}
                            data-ocid={`proposal.confirm_button.${i + 1}`}
                            className="gap-1.5 border-green-500/30 text-green-400 hover:bg-green-500/10"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={reviewProposal.isPending}
                            onClick={() => handleReview(proposal.id, false)}
                            data-ocid={`proposal.delete_button.${i + 1}`}
                            className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </div>
                      )}
                    {isClient &&
                      proposal.status === ProposalStatus.accepted && (
                        <div className="mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigate({
                                to: "/rate/$projectId/$freelancerPrincipal",
                                params: {
                                  projectId,
                                  freelancerPrincipal:
                                    proposal.freelancer.toString(),
                                },
                              })
                            }
                            data-ocid={`proposal.secondary_button.${i + 1}`}
                            className="gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5" /> Rate Freelancer
                          </Button>
                        </div>
                      )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

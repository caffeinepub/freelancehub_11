import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@dfinity/principal";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StarRating } from "../components/StarRating";
import { useAddRating } from "../hooks/useQueries";

export default function RateFreelancerPage() {
  const { projectId, freelancerPrincipal } = useParams({
    from: "/rate/$projectId/$freelancerPrincipal",
  });
  const navigate = useNavigate();
  const addRating = useAddRating();

  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) {
      toast.error("Please select a star rating.");
      return;
    }

    let freelancer: Principal;
    try {
      freelancer = Principal.fromText(freelancerPrincipal);
    } catch {
      toast.error("Invalid freelancer principal.");
      return;
    }

    try {
      await addRating.mutateAsync({
        freelancer,
        projectId: BigInt(projectId),
        stars: BigInt(stars),
        comment: comment.trim(),
      });
      toast.success("Rating submitted! Thank you for your feedback.");
      navigate({ to: "/client/dashboard" });
    } catch {
      toast.error("Failed to submit rating. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          navigate({ to: "/project/$projectId", params: { projectId } })
        }
        data-ocid="rate.button"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Project
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Star className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Rate Freelancer</h1>
          <p className="text-sm text-muted-foreground">
            Share your experience to help others.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card/60 border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base">
              Your Review
            </CardTitle>
            <CardDescription>Project #{projectId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Overall Rating *</Label>
              <div className="flex items-center gap-3">
                <StarRating
                  value={stars}
                  interactive
                  onChange={setStars}
                  size="lg"
                  data-ocid="rate.toggle"
                />
                {stars > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {
                      ["Terrible", "Poor", "Average", "Good", "Excellent"][
                        stars - 1
                      ]
                    }
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="comment">Comment (optional)</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe your experience working with this freelancer..."
                rows={4}
                data-ocid="rate.textarea"
                className="bg-input/50 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/client/dashboard" })}
            data-ocid="rate.cancel_button"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={addRating.isPending || stars === 0}
            data-ocid="rate.submit_button"
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
          >
            {addRating.isPending ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Rating"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

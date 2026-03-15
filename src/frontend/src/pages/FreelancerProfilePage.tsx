import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@dfinity/principal";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, DollarSign, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { RatingDisplay, StarRating } from "../components/StarRating";
import { useFreelancerRatings, useUserProfile } from "../hooks/useQueries";

export default function FreelancerProfilePage() {
  const { principal } = useParams({ from: "/freelancers/$principal" });
  const navigate = useNavigate();

  let parsedPrincipal: Principal | undefined;
  try {
    parsedPrincipal = Principal.fromText(principal);
  } catch {
    parsedPrincipal = undefined;
  }

  const { data: profile, isLoading: profileLoading } =
    useUserProfile(parsedPrincipal);
  const { data: ratings, isLoading: ratingsLoading } =
    useFreelancerRatings(parsedPrincipal);

  const isLoading = profileLoading || ratingsLoading;

  if (isLoading) {
    return (
      <div
        className="container mx-auto px-4 py-10 max-w-2xl"
        data-ocid="profile.loading_state"
      >
        <Skeleton className="h-8 w-48 mb-6" />
        <Card className="bg-card/60 border-border/60 mb-6">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: "/freelancers" })}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Card className="bg-card/60 border-border/60">
          <CardContent className="pt-6 text-center py-16">
            <p className="text-muted-foreground">Profile not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate({ to: "/freelancers" })}
        data-ocid="profile.button"
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" /> All Freelancers
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Profile Card */}
        <Card className="bg-card/60 border-border/60 card-glow">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center font-display font-bold text-primary text-2xl shrink-0">
                {profile.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-2xl font-bold mb-1">
                  {profile.name}
                </h1>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-foreground">
                    ${Number(profile.hourlyRate)}
                  </span>
                  <span>/ hour</span>
                </div>
                {ratings && <RatingDisplay ratings={ratings} />}
              </div>
            </div>

            {profile.bio && (
              <p className="text-muted-foreground mt-5 leading-relaxed">
                {profile.bio}
              </p>
            )}

            {profile.skills.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ratings */}
        <Card className="bg-card/60 border-border/60">
          <CardHeader>
            <CardTitle className="font-display text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              Reviews ({ratings?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!ratings || ratings.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No reviews yet.
              </p>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating, i) => (
                  <motion.div
                    key={`rating-${rating.projectId.toString()}-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    data-ocid={`profile.item.${i + 1}`}
                    className="border-b border-border/40 last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <StarRating value={Number(rating.stars)} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        Project #{rating.projectId.toString()}
                      </span>
                    </div>
                    {rating.comment && (
                      <p className="text-sm text-muted-foreground">
                        {rating.comment}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

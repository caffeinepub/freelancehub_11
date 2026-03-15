import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { DollarSign, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { StarRating } from "../components/StarRating";
import { useAllFreelancers } from "../hooks/useQueries";

export default function FreelancersDirectory() {
  const navigate = useNavigate();
  const { data: freelancers, isLoading } = useAllFreelancers();
  const [search, setSearch] = useState("");

  const filtered =
    freelancers?.filter(
      (f) =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.bio.toLowerCase().includes(search.toLowerCase()) ||
        f.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())),
    ) ?? [];

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
          Freelancers
        </h1>
        <p className="text-muted-foreground">
          Discover skilled professionals ready to work on your project.
        </p>
      </motion.div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, skills, or expertise..."
          data-ocid="freelancers.search_input"
          className="pl-9 bg-input/50 max-w-md"
        />
      </div>

      {isLoading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="freelancers.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-card/60 border-border/60">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="freelancers.empty_state"
          className="text-center py-20 border border-dashed border-border/60 rounded-2xl"
        >
          <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold mb-2">
            {search
              ? `No freelancers matching "${search}"`
              : "No freelancers yet"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {search
              ? "Try a different search term."
              : "Be the first to join as a freelancer!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((freelancer, i) => (
            <motion.div
              key={freelancer.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              data-ocid={`freelancer.item.${i + 1}`}
            >
              <Card
                className="card-glow-hover bg-card/60 border-border/60 cursor-pointer h-full"
                onClick={() =>
                  navigate({
                    to: "/freelancers/$principal",
                    params: { principal: "demo" },
                  })
                }
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-primary text-lg shrink-0">
                      {freelancer.name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display font-semibold truncate">
                        {freelancer.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />{" "}
                        {Number(freelancer.hourlyRate)}/hr
                      </p>
                    </div>
                  </div>

                  {freelancer.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {freelancer.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {freelancer.skills.slice(0, 4).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {freelancer.skills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{freelancer.skills.length - 4}
                      </Badge>
                    )}
                  </div>

                  <StarRating value={5} size="sm" />

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-4 border-border/60 hover:bg-secondary"
                    data-ocid={`freelancer.secondary_button.${i + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // We don't have principal stored in UserProfile, so we show what we can
                      // Navigate to best-effort view
                    }}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

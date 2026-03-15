import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Clock,
  DollarSign,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { UserRole } from "../backend";
import { StarRating } from "../components/StarRating";
import { useProfile } from "../context/ProfileContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAllFreelancers, useAllOpenProjects } from "../hooks/useQueries";

const SAMPLE_PROJECTS = [
  {
    title: "E-commerce Platform Redesign",
    category: "Web Development",
    budget: 4500,
    deadline: "2026-04-15",
  },
  {
    title: "iOS Fitness Tracking App",
    category: "Mobile",
    budget: 8000,
    deadline: "2026-05-20",
  },
  {
    title: "Brand Identity & Logo Design",
    category: "Design",
    budget: 1200,
    deadline: "2026-03-30",
  },
  {
    title: "SEO Campaign for SaaS Product",
    category: "Marketing",
    budget: 2200,
    deadline: "2026-04-01",
  },
  {
    title: "Technical Blog Content Series",
    category: "Writing",
    budget: 900,
    deadline: "2026-03-25",
  },
  {
    title: "React Dashboard with Analytics",
    category: "Web Development",
    budget: 5500,
    deadline: "2026-05-10",
  },
];

const SAMPLE_FREELANCERS = [
  {
    name: "Alejandra Vega",
    role: "Full-Stack Developer",
    hourlyRate: 85,
    skills: ["React", "Node.js", "TypeScript"],
    rating: 4.9,
    reviews: 47,
  },
  {
    name: "Marcus Chen",
    role: "UI/UX Designer",
    hourlyRate: 70,
    skills: ["Figma", "Tailwind", "Prototyping"],
    rating: 4.8,
    reviews: 38,
  },
  {
    name: "Priya Sharma",
    role: "Mobile Developer",
    hourlyRate: 90,
    skills: ["React Native", "Swift", "Firebase"],
    rating: 5.0,
    reviews: 29,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Web Development": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Mobile: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  Marketing: "bg-green-500/10 text-green-400 border-green-500/20",
  Writing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export default function LandingPage() {
  const { login, isLoggingIn, isInitializing, identity } =
    useInternetIdentity();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { data: liveProjects } = useAllOpenProjects();
  const { data: liveFreelancers } = useAllFreelancers();

  const displayProjects =
    liveProjects && liveProjects.length > 0 ? liveProjects.slice(0, 6) : null;
  const displayFreelancers =
    liveFreelancers && liveFreelancers.length > 0
      ? liveFreelancers.slice(0, 3)
      : null;

  const handleCTA = () => {
    if (!identity) {
      login();
      return;
    }
    if (!profile) {
      navigate({ to: "/register" });
      return;
    }
    if (profile.role === UserRole.client) navigate({ to: "/client/dashboard" });
    else navigate({ to: "/freelancer/dashboard" });
  };

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-freelancehub.dim_1600x900.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.80 0.19 65) 1px, transparent 1px), linear-gradient(90deg, oklch(0.80 0.19 65) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container mx-auto px-4 relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 font-semibold px-3 py-1">
              <Zap className="w-3 h-3 mr-1" /> The Decentralized Freelance
              Marketplace
            </Badge>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              Find <span className="text-gradient-amber">Elite Talent.</span>
              <br />
              Ship Great Work.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
              Connect with world-class freelancers and ambitious clients.
              Powered by the Internet Computer — transparent, fast, and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleCTA}
                disabled={isLoggingIn || isInitializing}
                data-ocid="landing.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-8 shadow-amber"
              >
                {isLoggingIn
                  ? "Connecting..."
                  : identity
                    ? "Go to Dashboard"
                    : "Get Started Free"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ to: "/freelancers" })}
                data-ocid="landing.secondary_button"
                className="border-border/80 hover:bg-secondary"
              >
                <Users className="mr-2 w-4 h-4" /> Browse Freelancers
              </Button>
            </div>

            <div className="mt-14 flex flex-wrap gap-8">
              {[
                { label: "Active Freelancers", value: "2,400+" },
                { label: "Projects Completed", value: "18,000+" },
                { label: "Client Satisfaction", value: "98%" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why FreelanceHub?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built on the Internet Computer — every transaction is transparent
              and trustless.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Shield,
                title: "Trustless Payments",
                desc: "Smart contract escrow protects both clients and freelancers automatically.",
              },
              {
                icon: TrendingUp,
                title: "Verified Ratings",
                desc: "Blockchain-backed reputation system. Every review is immutable and authentic.",
              },
              {
                icon: Clock,
                title: "Instant Proposals",
                desc: "Freelancers respond in hours, not days. Real-time matching powered by ICP.",
              },
              {
                icon: DollarSign,
                title: "Zero Platform Fees",
                desc: "Keep what you earn. Our on-chain model eliminates expensive intermediaries.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="card-glow-hover h-full bg-card/60 border-border/60">
                  <CardContent className="pt-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-base mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Projects */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Open Projects
              </h2>
              <p className="text-muted-foreground">
                Latest opportunities waiting for the right talent.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/freelancer/dashboard" })}
              data-ocid="landing.secondary_button"
              className="hidden md:flex border-border/80"
            >
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayProjects
              ? displayProjects.map((project, i) => (
                  <motion.div
                    key={project.id.toString()}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    data-ocid={`project.item.${i + 1}`}
                  >
                    <Card className="card-glow-hover bg-card/60 border-border/60 h-full">
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
                          <span className="font-semibold text-primary">
                            ${Number(project.budget).toLocaleString()}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : SAMPLE_PROJECTS.map((project, i) => (
                  <motion.div
                    key={project.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    data-ocid={`project.item.${i + 1}`}
                  >
                    <Card className="card-glow-hover bg-card/60 border-border/60 h-full">
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
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-primary">
                            ${project.budget.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />{" "}
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* Top Freelancers */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
                Top Freelancers
              </h2>
              <p className="text-muted-foreground">
                Handpicked professionals with proven track records.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/freelancers" })}
              data-ocid="landing.secondary_button"
              className="hidden md:flex border-border/80"
            >
              All Freelancers <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {displayFreelancers
              ? displayFreelancers.map((freelancer, i) => (
                  <motion.div
                    key={freelancer.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    data-ocid={`freelancer.item.${i + 1}`}
                  >
                    <Card className="card-glow-hover bg-card/60 border-border/60">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-11 h-11 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-primary">
                            {freelancer.name[0]}
                          </div>
                          <div>
                            <p className="font-display font-semibold text-sm">
                              {freelancer.name}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {freelancer.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {freelancer.skills.slice(0, 3).map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-xs"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <StarRating value={5} size="sm" />
                          <span className="text-sm font-semibold text-primary">
                            ${Number(freelancer.hourlyRate)}/hr
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              : SAMPLE_FREELANCERS.map((freelancer, i) => (
                  <motion.div
                    key={freelancer.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    data-ocid={`freelancer.item.${i + 1}`}
                  >
                    <Card className="card-glow-hover bg-card/60 border-border/60">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-11 h-11 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-display font-bold text-primary">
                            {freelancer.name[0]}
                          </div>
                          <div>
                            <p className="font-display font-semibold text-sm">
                              {freelancer.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {freelancer.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {freelancer.skills.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-xs"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                            <span className="text-sm font-medium">
                              {freelancer.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({freelancer.reviews})
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-primary">
                            ${freelancer.hourlyRate}/hr
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 border-t border-border/40">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/5 p-12 text-center"
          >
            <div className="absolute inset-0 noise-bg" />
            <div className="relative z-10">
              <Briefcase className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Building?
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Join thousands of clients and freelancers already working on the
                Internet Computer.
              </p>
              <Button
                size="lg"
                onClick={handleCTA}
                disabled={isLoggingIn || isInitializing}
                data-ocid="landing.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base px-10 shadow-amber"
              >
                {identity ? "Go to Dashboard" : "Join FreelanceHub"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

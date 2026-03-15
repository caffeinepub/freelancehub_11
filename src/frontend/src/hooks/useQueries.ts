import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserRole } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useAllOpenProjects() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["openProjects"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOpenProjects();
    },
    enabled: !!actor && !isFetching,
    staleTime: 15_000,
  });
}

export function useAllFreelancers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allFreelancers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFreelancers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useClientProjects(client: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["clientProjects", client?.toString()],
    queryFn: async () => {
      if (!actor || !client) return [];
      return actor.getClientProjects(client);
    },
    enabled: !!actor && !isFetching && !!client,
    staleTime: 15_000,
  });
}

export function useProjectProposals(projectId: bigint | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["proposals", projectId?.toString()],
    queryFn: async () => {
      if (!actor || projectId === undefined) return [];
      return actor.getProjectProposals(projectId);
    },
    enabled: !!actor && !isFetching && projectId !== undefined,
    staleTime: 10_000,
  });
}

export function useFreelancerProposals(freelancer: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["freelancerProposals", freelancer?.toString()],
    queryFn: async () => {
      if (!actor || !freelancer) return [];
      return actor.getFreelancerProposals(freelancer);
    },
    enabled: !!actor && !isFetching && !!freelancer,
    staleTime: 10_000,
  });
}

export function useUserProfile(principal: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userProfile", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getUserProfile(principal);
    },
    enabled: !!actor && !isFetching && !!principal,
    staleTime: 30_000,
  });
}

export function useFreelancerRatings(freelancer: Principal | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["freelancerRatings", freelancer?.toString()],
    queryFn: async () => {
      if (!actor || !freelancer) return [];
      return actor.getFreelancerRatings(freelancer);
    },
    enabled: !!actor && !isFetching && !!freelancer,
    staleTime: 15_000,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      bio: string;
      skills: string[];
      hourlyRate: bigint;
      role: UserRole;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerUser(
        data.name,
        data.bio,
        data.skills,
        data.hourlyRate,
        data.role,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["callerProfile", identity?.getPrincipal().toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["allFreelancers"] });
    },
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      bio: string;
      skills: string[];
      hourlyRate: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateUserProfile(
        data.name,
        data.bio,
        data.skills,
        data.hourlyRate,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["callerProfile", identity?.getPrincipal().toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["allFreelancers"] });
    },
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category: string;
      budget: bigint;
      deadline: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProject(
        data.title,
        data.description,
        data.category,
        data.budget,
        data.deadline,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientProjects", identity?.getPrincipal().toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["openProjects"] });
    },
  });
}

export function useSubmitProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (data: {
      projectId: bigint;
      coverLetter: string;
      proposedPrice: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitProposal(
        data.projectId,
        data.coverLetter,
        data.proposedPrice,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["proposals", variables.projectId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["freelancerProposals", identity?.getPrincipal().toString()],
      });
    },
  });
}

export function useReviewProposal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      proposalId: bigint;
      accept: boolean;
      projectId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.reviewProposal(data.proposalId, data.accept);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["proposals", variables.projectId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["openProjects"] });
      queryClient.invalidateQueries({ queryKey: ["clientProjects"] });
    },
  });
}

export function useAddRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      freelancer: Principal;
      projectId: bigint;
      stars: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addRating(
        data.freelancer,
        data.projectId,
        data.stars,
        data.comment,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["freelancerRatings", variables.freelancer.toString()],
      });
    },
  });
}

export function useCloseProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.closeProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientProjects", identity?.getPrincipal().toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["openProjects"] });
    },
  });
}

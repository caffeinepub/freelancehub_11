import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Rating {
    client: Principal;
    comment: string;
    stars: bigint;
    projectId: bigint;
    freelancer: Principal;
}
export interface Project {
    id: bigint;
    client: Principal;
    title: string;
    description: string;
    deadline: string;
    isOpen: boolean;
    category: string;
    budget: bigint;
}
export interface Proposal {
    id: bigint;
    status: ProposalStatus;
    coverLetter: string;
    projectId: bigint;
    proposedPrice: bigint;
    freelancer: Principal;
}
export interface UserProfile {
    bio: string;
    name: string;
    role: UserRole;
    hourlyRate: bigint;
    skills: Array<string>;
}
export enum ProposalStatus {
    pending = "pending",
    rejected = "rejected",
    accepted = "accepted"
}
export enum UserRole {
    client = "client",
    freelancer = "freelancer"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addRating(freelancer: Principal, projectId: bigint, stars: bigint, comment: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    closeProject(projectId: bigint): Promise<void>;
    createProject(title: string, description: string, category: string, budget: bigint, deadline: string): Promise<bigint>;
    getAllFreelancers(): Promise<Array<UserProfile>>;
    getAllOpenProjects(): Promise<Array<Project>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getClientProjects(client: Principal): Promise<Array<Project>>;
    getFreelancerProposals(freelancer: Principal): Promise<Array<Proposal>>;
    getFreelancerRatings(freelancer: Principal): Promise<Array<Rating>>;
    getProjectProposals(projectId: bigint): Promise<Array<Proposal>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(name: string, bio: string, skills: Array<string>, hourlyRate: bigint, role: UserRole): Promise<void>;
    reviewProposal(proposalId: bigint, accept: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitProposal(projectId: bigint, coverLetter: string, proposedPrice: bigint): Promise<bigint>;
    updateUserProfile(name: string, bio: string, skills: Array<string>, hourlyRate: bigint): Promise<void>;
}

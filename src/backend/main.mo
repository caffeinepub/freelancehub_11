import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  public type UserRole = {
    #client;
    #freelancer;
  };

  public type UserProfile = {
    name : Text;
    bio : Text;
    skills : [Text];
    hourlyRate : Nat;
    role : UserRole;
  };

  public type Project = {
    id : Nat;
    client : Principal;
    title : Text;
    description : Text;
    category : Text;
    budget : Nat;
    deadline : Text;
    isOpen : Bool;
  };

  public type ProposalStatus = {
    #pending;
    #accepted;
    #rejected;
  };

  public type Proposal = {
    id : Nat;
    projectId : Nat;
    freelancer : Principal;
    coverLetter : Text;
    proposedPrice : Nat;
    status : ProposalStatus;
  };

  public type Rating = {
    client : Principal;
    freelancer : Principal;
    projectId : Nat;
    stars : Nat;
    comment : Text;
  };

  // Comparison modules
  module Project {
    public func compare(p1 : Project, p2 : Project) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  module Proposal {
    public func compare(p1 : Proposal, p2 : Proposal) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  // State
  let projects = Map.empty<Nat, Project>();
  let proposals = Map.empty<Nat, Proposal>();
  let ratings = Map.empty<Nat, Rating>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProjectId = 0;
  var nextProposalId = 0;
  var nextRatingId = 0;

  // Authorization (mixin)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Management
  public shared ({ caller }) func registerUser(name : Text, bio : Text, skills : [Text], hourlyRate : Nat, role : UserRole) : async () {
    // Registration should be open to guests who are becoming users
    // No authorization check needed here as this is the entry point
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered");
    };
    let profile : UserProfile = {
      name;
      bio;
      skills;
      hourlyRate;
      role;
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateUserProfile(name : Text, bio : Text, skills : [Text], hourlyRate : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    let existingProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?profile) { profile };
    };
    let updatedProfile : UserProfile = {
      name;
      bio;
      skills;
      hourlyRate;
      role = existingProfile.role;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    // Public query - anyone can view user profiles (for marketplace browsing)
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Project Management
  public shared ({ caller }) func createProject(title : Text, description : Text, category : Text, budget : Nat, deadline : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create projects");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    if (profile.role != #client) {
      Runtime.trap("Only clients can create projects");
    };

    let project : Project = {
      id = nextProjectId;
      client = caller;
      title;
      description;
      category;
      budget;
      deadline;
      isOpen = true;
    };
    projects.add(nextProjectId, project);
    nextProjectId += 1;
    project.id;
  };

  public shared ({ caller }) func closeProject(projectId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can close projects");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?p) { p };
    };
    if (project.client != caller) {
      Runtime.trap("Only project owner can close project");
    };

    let updatedProject = { project with isOpen = false };
    projects.add(projectId, updatedProject);
  };

  public query ({ caller }) func getAllOpenProjects() : async [Project] {
    // Public query - anyone can browse open projects
    projects.values().filter(func(p) { p.isOpen }).toArray().sort();
  };

  public query ({ caller }) func getClientProjects(client : Principal) : async [Project] {
    // Public query - anyone can view client's projects
    projects.values().filter(func(p) { p.client == client }).toArray().sort();
  };

  // Proposal Handling
  public shared ({ caller }) func submitProposal(projectId : Nat, coverLetter : Text, proposedPrice : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit proposals");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?p) { p };
    };
    if (profile.role != #freelancer) {
      Runtime.trap("Only freelancers can submit proposals");
    };

    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?p) { p };
    };
    if (not project.isOpen) {
      Runtime.trap("Project is not open for proposals");
    };

    let proposal : Proposal = {
      id = nextProposalId;
      projectId;
      freelancer = caller;
      coverLetter;
      proposedPrice;
      status = #pending;
    };
    proposals.add(nextProposalId, proposal);
    nextProposalId += 1;
    proposal.id;
  };

  public shared ({ caller }) func reviewProposal(proposalId : Nat, accept : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can review proposals");
    };
    let proposal = switch (proposals.get(proposalId)) {
      case (null) { Runtime.trap("Proposal not found") };
      case (?p) { p };
    };

    let project = switch (projects.get(proposal.projectId)) {
      case (null) { Runtime.trap("Associated project not found") };
      case (?p) { p };
    };
    if (project.client != caller) {
      Runtime.trap("Only project owner can review proposals");
    };
    if (not project.isOpen) {
      Runtime.trap("Project is closed");
    };

    let updatedStatus : ProposalStatus = if (accept) { #accepted } else { #rejected };
    let updatedProposal = { proposal with status = updatedStatus };
    proposals.add(proposalId, updatedProposal);

    if (accept) {
      let closedProject = { project with isOpen = false };
      projects.add(project.id, closedProject);
    };
  };

  public query ({ caller }) func getProjectProposals(projectId : Nat) : async [Proposal] {
    // Public query - anyone can view proposals for a project
    proposals.values().filter(func(p) { p.projectId == projectId }).toArray().sort();
  };

  public query ({ caller }) func getFreelancerProposals(freelancer : Principal) : async [Proposal] {
    // Public query - anyone can view freelancer's proposals
    proposals.values().filter(func(p) { p.freelancer == freelancer }).toArray().sort();
  };

  // Ratings
  public shared ({ caller }) func addRating(freelancer : Principal, projectId : Nat, stars : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add ratings");
    };
    if (stars < 1 or stars > 5) {
      Runtime.trap("Stars must be between 1 and 5");
    };
    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?p) { p };
    };
    if (project.client != caller) {
      Runtime.trap("Only project owner can rate freelancer");
    };

    let rating : Rating = {
      client = caller;
      freelancer;
      projectId;
      stars;
      comment;
    };
    ratings.add(nextRatingId, rating);
    nextRatingId += 1;
  };

  public query ({ caller }) func getFreelancerRatings(freelancer : Principal) : async [Rating] {
    // Public query - anyone can view freelancer ratings
    ratings.values().filter(func(r) { r.freelancer == freelancer }).toArray();
  };

  public query ({ caller }) func getAllFreelancers() : async [UserProfile] {
    // Public query - anyone can browse all freelancers
    userProfiles.values().filter(func(p) { p.role == #freelancer }).toArray();
  };
};

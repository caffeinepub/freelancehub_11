import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { UserRole } from "./backend";
import { Layout } from "./components/Layout";
import { ProfileProvider, useProfile } from "./context/ProfileContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import ClientDashboard from "./pages/ClientDashboard";
import CreateProjectPage from "./pages/CreateProjectPage";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import FreelancerProfilePage from "./pages/FreelancerProfilePage";
import FreelancersDirectory from "./pages/FreelancersDirectory";
import LandingPage from "./pages/LandingPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import RateFreelancerPage from "./pages/RateFreelancerPage";
import RegisterPage from "./pages/RegisterPage";

function RootLayout() {
  return (
    <ProfileProvider>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster richColors position="bottom-right" />
    </ProfileProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  if (isInitializing)
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="app.loading_state"
      >
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  if (!identity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Please sign in to continue.</p>
      </div>
    );
  }
  return <>{children}</>;
}

function ProfileGuard({ children }: { children: React.ReactNode }) {
  const { profile, isLoading } = useProfile();
  const { identity } = useInternetIdentity();
  if (!identity) return <AuthGuard>{children}</AuthGuard>;
  if (isLoading)
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="app.loading_state"
      >
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    );
  if (profile === null) {
    return <RegisterPage />;
  }
  return <>{children}</>;
}

function ClientGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProfileGuard>
      <ClientRoleCheck>{children}</ClientRoleCheck>
    </ProfileGuard>
  );
}

function ClientRoleCheck({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  if (profile && profile.role !== UserRole.client) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">This page is for clients only.</p>
      </div>
    );
  }
  return <>{children}</>;
}

function FreelancerGuard({ children }: { children: React.ReactNode }) {
  return (
    <ProfileGuard>
      <FreelancerRoleCheck>{children}</FreelancerRoleCheck>
    </ProfileGuard>
  );
}

function FreelancerRoleCheck({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  if (profile && profile.role !== UserRole.freelancer) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">
          This page is for freelancers only.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: function RegisterGuarded() {
    return (
      <AuthGuard>
        <RegisterPage />
      </AuthGuard>
    );
  },
});

const clientDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client/dashboard",
  component: function ClientDashboardGuarded() {
    return (
      <ClientGuard>
        <ClientDashboard />
      </ClientGuard>
    );
  },
});

const createProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/client/projects/new",
  component: function CreateProjectGuarded() {
    return (
      <ClientGuard>
        <CreateProjectPage />
      </ClientGuard>
    );
  },
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/project/$projectId",
  component: function ProjectDetailGuarded() {
    return (
      <ProfileGuard>
        <ProjectDetailPage />
      </ProfileGuard>
    );
  },
});

const freelancerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/freelancer/dashboard",
  component: function FreelancerDashboardGuarded() {
    return (
      <FreelancerGuard>
        <FreelancerDashboard />
      </FreelancerGuard>
    );
  },
});

const freelancersDirectoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/freelancers",
  component: FreelancersDirectory,
});

const freelancerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/freelancers/$principal",
  component: FreelancerProfilePage,
});

const rateFreelancerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rate/$projectId/$freelancerPrincipal",
  component: function RateGuarded() {
    return (
      <ClientGuard>
        <RateFreelancerPage />
      </ClientGuard>
    );
  },
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  clientDashboardRoute,
  createProjectRoute,
  projectDetailRoute,
  freelancerDashboardRoute,
  freelancersDirectoryRoute,
  freelancerProfileRoute,
  rateFreelancerRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

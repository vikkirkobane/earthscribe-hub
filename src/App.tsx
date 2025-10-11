import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Quests from "./pages/Quests";
import AIAdvisor from "./pages/AIAdvisor";
import Plots from "./pages/Plots";
import Impact from "./pages/Impact";
import Leaderboard from "./pages/Leaderboard";

// Create router with future flags to prevent warnings
const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/quests",
    element: (
      <ProtectedRoute>
        <Layout>
          <Quests />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/ai-advisor",
    element: (
      <ProtectedRoute>
        <Layout>
          <AIAdvisor />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/plots",
    element: (
      <ProtectedRoute>
        <Layout>
          <Plots />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/impact",
    element: (
      <ProtectedRoute>
        <Layout>
          <Impact />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/leaderboard",
    element: (
      <ProtectedRoute>
        <Layout>
          <Leaderboard />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Layout>
          <Profile />
        </Layout>
      </ProtectedRoute>
    )
  },
  { path: "*", element: <NotFound /> }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

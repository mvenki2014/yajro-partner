import * as React from "react";
import { Routes, Route, useNavigate, useParams, useSearchParams, Navigate } from "react-router-dom";
import { ShellProvider } from "@/context/ShellContext";
import { MobileShell } from "@/components/layout/MobileShell";
import { routesConfig, RouteConfig } from "./config";
import { User } from "@/hooks/useAuth";

interface AppRoutesProps {
  user: User | null;
}

export function AppRoutes({ user }: AppRoutesProps) {
  const navigate = useNavigate();

  const handleNavigation = (page: string) => {
    switch (page) {
      case "dashboard":
        navigate("/");
        break;
      case "services":
        navigate("/services");
        break;
      case "orders":
        navigate("/orders");
        break;
      case "earnings":
        navigate("/earnings");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "availability":
        navigate("/availability");
        break;
      default:
        navigate("/");
    }
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <ShellProvider>
      <MobileShell>
        <Routes>
          {routesConfig.map((route) => {
            const RouteElement = (
              <RouteWrapper
                route={route}
                user={user}
                handleNavigation={handleNavigation}
              />
            );

            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.protected ? (
                    <ProtectedRoute>{RouteElement}</ProtectedRoute>
                  ) : (
                    <PublicRoute>{RouteElement}</PublicRoute>
                  )
                }
              />
            );
          })}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MobileShell>
    </ShellProvider>
  );
}

interface RouteWrapperProps {
  route: RouteConfig;
  user: User | null;
  handleNavigation: (page: string) => void;
}

function RouteWrapper({ route, user, handleNavigation }: RouteWrapperProps) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const props = route.props
    ? route.props(params, searchParams, navigate, {
        user,
        handleNavigation,
      })
    : {};

  const Element = route.element;
  return <Element {...props} />;
}

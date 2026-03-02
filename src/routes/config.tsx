import * as React from "react";
import { Login } from "@/screens/Login";
import { PartnerDashboard } from "@/modules/dashboard/PartnerDashboard";
import { PartnerServices } from "@/modules/services/PartnerServices";
import { PartnerOrders } from "@/screens/PartnerOrders";
import { PartnerEarnings } from "@/screens/PartnerEarnings";
import { PartnerProfile } from "@/screens/PartnerProfile";
import { PartnerAvailability } from "@/screens/PartnerAvailability";
import { useAuth, User } from "@/hooks/useAuth";
import { NavigateFunction, Params } from "react-router-dom";

export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  protected?: boolean;
  props?: (
    params: Readonly<Params<string>>,
    searchParams: URLSearchParams,
    navigate: NavigateFunction,
    extra: { user: User | null; handleNavigation: (page: string) => void }
  ) => any;
}

export const routesConfig: RouteConfig[] = [
  {
    path: "/login",
    element: Login,
    props: (_, __, navigate) => ({
      onLogin: () => {
        navigate("/");
      },
    }),
  },
  {
    path: "/",
    protected: true,
    element: PartnerDashboard,
    props: (_, __, ___, { handleNavigation }) => ({
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/services",
    protected: true,
    element: PartnerServices,
    props: (_, __, ___, { handleNavigation }) => ({
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/orders",
    protected: true,
    element: PartnerOrders,
    props: (_, __, ___, { handleNavigation }) => ({
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/earnings",
    protected: true,
    element: PartnerEarnings,
    props: (_, __, ___, { handleNavigation }) => ({
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/profile",
    protected: true,
    element: PartnerProfile,
    props: (_, __, navigate, { handleNavigation }) => {
      const { logout } = useAuth();
      return {
        onNavigate: handleNavigation,
        onLogout: async () => {
          await logout();
          navigate("/login");
        },
      };
    },
  },
  {
    path: "/availability",
    protected: true,
    element: PartnerAvailability,
    props: (_, __, navigate) => ({
      onBack: () => navigate("/"),
    }),
  },
];

import * as React from "react";
import { Login } from "@/screens/Login";
import { PartnerDashboard } from "@/screens/PartnerDashboard";
import { PartnerServices } from "@/screens/PartnerServices";
import { PartnerOrders } from "@/screens/PartnerOrders";
import { PartnerEarnings } from "@/screens/PartnerEarnings";
import { PartnerProfile } from "@/screens/PartnerProfile";
import { PartnerAvailability } from "@/screens/PartnerAvailability";

export interface RouteConfig {
  path: string;
  element: React.ComponentType<any>;
  protected?: boolean;
  props?: (params: any, searchParams: URLSearchParams, navigate: any, extra: any) => any;
}

export const routesConfig: RouteConfig[] = [
  {
    path: "/login",
    element: Login,
    props: (_, __, navigate, { setUser }) => ({
      onLogin: (userData: any) => {
        setUser(userData);
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
    props: (_, __, navigate, { handleNavigation, setUser }) => ({
      onNavigate: handleNavigation,
      onLogout: () => {
        setUser(null);
        navigate("/login");
      },
    }),
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

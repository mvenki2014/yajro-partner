import * as React from "react";
import { Login } from "@/screens/Login";
import { PartnerDashboard } from "@/modules/dashboard/PartnerDashboard";
import { PartnerServices } from "@/modules/services/PartnerServices";
import { PartnerOrders } from "@/screens/PartnerOrders";
import { PartnerEarnings } from "@/screens/PartnerEarnings";
import { PartnerProfile } from "@/screens/PartnerProfile";
import { PartnerAvailability } from "@/screens/PartnerAvailability";
import { PartnerServiceDetails } from "@/screens/PartnerServiceDetails";
import { PartnerOrderDetails } from "@/screens/PartnerOrderDetails";
import { PartnerServiceForm } from "@/screens/PartnerServiceForm";
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
    path: "/services/:serviceId",
    protected: true,
    element: PartnerServiceDetails,
    props: (params, __, ___, { handleNavigation }) => ({
      serviceId: params.serviceId,
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/services/form",
    protected: true,
    element: PartnerServiceForm,
  },
  {
    path: "/services/form/:serviceId",
    protected: true,
    element: PartnerServiceForm,
    props: (params) => ({
      serviceId: params.serviceId,
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
    path: "/orders/:orderId",
    protected: true,
    element: PartnerOrderDetails,
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

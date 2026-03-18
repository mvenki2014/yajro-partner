import * as React from "react";
import { Login } from "@/screens/Login";
import { Dashboard } from "@/modules/dashboard/Dashboard";
import { Services } from "@/modules/services/Services";
import { MyOrders } from "@/screens/MyOrders";
import { MyEarnings } from "@/screens/MyEarnings";
import { Profile } from "@/screens/Profile";
import { ManageAvailability } from "@/screens/ManageAvailability";
import { ServiceDetails } from "@/screens/ServiceDetails";
import { OrderDetails } from "@/screens/OrderDetails";
import { ServiceForm } from "@/screens/ServiceForm";
import { KycScreen } from "@/modules/kyc/KycScreen";
import { KycFormScreen } from "@/modules/kyc/KycFormScreen";
import { User } from "@/hooks/useAuth";
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
    element: Dashboard,
    props: (_, __, ___, { handleNavigation }) => ({
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/services",
    protected: true,
    element: Services,
    props: (_, __, ___, { handleNavigation }) => ({
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/services/:serviceId",
    protected: true,
    element: ServiceDetails,
    props: (params, __, ___, { handleNavigation }) => ({
      serviceId: params.serviceId,
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/services/form",
    protected: true,
    element: ServiceForm,
  },
  {
    path: "/services/form/:serviceId",
    protected: true,
    element: ServiceForm,
    props: (params) => ({
      serviceId: params.serviceId,
    }),
  },
  {
    path: "/orders",
    protected: true,
    element: MyOrders,
    props: (_, __, ___, { handleNavigation }) => ({
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/orders/:orderId",
    protected: true,
    element: OrderDetails,
  },
  {
    path: "/earnings",
    protected: true,
    element: MyEarnings,
    props: (_, __, ___, { handleNavigation }) => ({
      onNavigate: handleNavigation,
    }),
  },
  {
    path: "/profile",
    protected: true,
    element: Profile,
    props: (_, __, navigate, { handleNavigation }) => {
      return {
        onNavigate: handleNavigation,
        onLogout: () => {
          navigate("/login");
        },
      };
    },
  },
  {
    path: "/availability",
    protected: true,
    element: ManageAvailability,
    props: (_, __, navigate) => ({
      onBack: () => navigate("/"),
    }),
  },
  {
    path: "/kyc",
    protected: true,
    element: KycScreen,
    props: (_, __, navigate) => ({
      onBack: () => navigate("/profile"),
    }),
  },
  {
    path: "/kyc/form",
    protected: true,
    element: KycFormScreen,
    props: (_, __, navigate) => ({
      onBack: () => navigate("/kyc"),
      onSuccess: () => navigate("/kyc"),
    }),
  },
];

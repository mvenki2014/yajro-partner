import * as React from "react";
import { Route } from "@/types";
import { Home } from "@/screens/Home";
import { Services } from "@/screens/Services";
import { ServiceDetail } from "@/screens/ServiceDetail";
import { Booking } from "@/screens/Booking";
import { CheckoutTracking } from "@/screens/CheckoutTracking";

export function App() {
  const [route, setRoute] = React.useState<Route>({ name: "home" });
  const [selectedServiceId, setSelectedServiceId] = React.useState(
    "satyanarayana-vratam"
  );

  const handleNavigation = (page: string, categoryId?: string) => {
    switch (page) {
      case "home":
        setRoute({ name: "home" });
        break;
      case "services":
        setRoute({ name: "services", categoryId });
        break;
      case "bookings":
        setRoute({ name: "bookings" });
        break;
      case "tracking":
        setRoute({ name: "tracking" });
        break;
      case "account":
        setRoute({ name: "account" });
        break;
      default:
        setRoute({ name: "home" });
    }
  };

  if (route.name === "home") {
    return (
      <Home
        onSelectService={(serviceId) => {
          setSelectedServiceId(serviceId);
          setRoute({ name: "service", serviceId });
        }}
        onOpenBooking={() => {
          setRoute({ name: "booking", serviceId: selectedServiceId, tierId: "silver" });
        }}
        onNavigate={handleNavigation}
      />
    );
  }

  if (route.name === "services") {
    return (
      <Services
        initialCategory={route.categoryId}
        onSelectService={(serviceId) => {
          setSelectedServiceId(serviceId);
          setRoute({ name: "service", serviceId });
        }}
        onNavigate={handleNavigation}
      />
    );
  }

  if (route.name === "service") {
    return (
      <ServiceDetail
        serviceId={route.serviceId}
        onBack={() => setRoute({ name: "services" })}
        onContinue={(tierId) => {
          setRoute({ name: "booking", serviceId: route.serviceId, tierId });
        }}
      />
    );
  }

  if (route.name === "booking") {
    return (
      <Booking
        serviceId={route.serviceId}
        tierId={route.tierId}
        onBack={() => setRoute({ name: "service", serviceId: route.serviceId })}
        onConfirm={() => setRoute({ name: "checkout", serviceId: route.serviceId, tierId: route.tierId })}
      />
    );
  }

  if (route.name === "checkout" || route.name === "tracking") {
    return (
      <CheckoutTracking
        serviceId={route.serviceId}
        tierId={route.tierId}
        onBack={() => setRoute({ name: "booking", serviceId: route.serviceId, tierId: route.tierId })}
        onReset={() => {
          setRoute({ name: "home" });
        }}
      />
    );
  }

  // For bookings and account pages - show placeholder for now
  if (route.name === "bookings" || route.name === "account") {
    return (
      <Home
        onSelectService={(serviceId) => {
          setSelectedServiceId(serviceId);
          setRoute({ name: "service", serviceId });
        }}
        onOpenBooking={() => {
          setRoute({ name: "booking", serviceId: selectedServiceId, tierId: "silver" });
        }}
        onNavigate={handleNavigation}
      />
    );
  }

  return (
    <Home
      onSelectService={(serviceId) => {
        setSelectedServiceId(serviceId);
        setRoute({ name: "service", serviceId });
      }}
      onOpenBooking={() => {
        setRoute({ name: "booking", serviceId: selectedServiceId, tierId: "silver" });
      }}
      onNavigate={handleNavigation}
    />
  );
}

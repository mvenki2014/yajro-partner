export type Tab = "home" | "services" | "bookings" | "tracking" | "account";

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type PackageTier = {
  id: "bronze" | "silver" | "gold";
  name: string;
  price: number;
  includesSamagri: boolean;
  highlights: string[];
};

export type Service = {
  id: string;
  title: string;
  subtitle: string;
  durationMins: number;
  significance: string;
  baseFromPrice: number;
  packages: PackageTier[];
  languages: string[];
  categoryId: string;
};

export type Poojari = {
  id: string;
  name: string;
  languages: string[];
  experienceYears: number;
  templeAffiliation: string;
  rating: number;
  reviews: number;
  verified: boolean;
  specialties: string[];
};

export type Route =
  | { name: "home" }
  | { name: "services"; categoryId?: string }
  | { name: "service"; serviceId: string }
  | { name: "booking"; serviceId: string; tierId: string }
  | { name: "checkout"; serviceId: string; tierId: string }
  | { name: "bookings" }
  | { name: "tracking" }
  | { name: "account" };

export type ServiceCardProps = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  popular?: boolean;
  image?: string;
  onSelect: (id: string) => void;
};

export type Tab =
  | "dashboard"
  | "services"
  | "orders"
  | "earnings"
  | "profile"
  | "availability"
  | "home"
  | "bookings"
  | "tracking"
  | "account";

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type PackageTier = {
  id: "basic" | "standard" | "premium";
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

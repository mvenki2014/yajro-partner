export type PriestProfile = {
  fullName: string;
  mobile: string;
  email: string;
  experienceYears: number;
  languages: string[];
  serviceAreas: string[];
  rating: number;
  totalReviews: number;
  completedPoojas: number;
  verified: boolean;
};

export type ServicePackage = {
  name: "Basic" | "Standard" | "Premium";
  price: number;
  description: string;
};

export type PartnerService = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  basePrice: number;
  customPrice: boolean;
  visitType: "Home Visit" | "Temple Visit" | "Both";
  requiredItems: string[];
  enabled: boolean;
  packages?: ServicePackage[];
};

export type PartnerBookingStatus =
  | "Pending"
  | "Accepted"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type PartnerBooking = {
  id: string;
  customerName: string;
  address: string;
  dateTime: string;
  serviceType: string;
  amount: number;
  notes: string;
  status: PartnerBookingStatus;
};

export const priestProfile: PriestProfile = {
  fullName: "Pandit Vishwanath Sharma",
  mobile: "9876543210",
  email: "vishwanath@yajro.in",
  experienceYears: 12,
  languages: ["Telugu", "Hindi", "English", "Sanskrit"],
  serviceAreas: ["Hyderabad 500081", "Secunderabad 500003", "Miyapur 500049"],
  rating: 4.8,
  totalReviews: 246,
  completedPoojas: 534,
  verified: true,
};

export const partnerServices: PartnerService[] = [
  {
    id: "svc-1",
    name: "Satyanarayana Pooja",
    category: "Pooja",
    description: "Traditional vrata pooja for health, prosperity, and family wellbeing.",
    duration: "2h 30m",
    basePrice: 3500,
    customPrice: true,
    visitType: "Home Visit",
    requiredItems: ["Kalash", "Coconut", "Flowers", "Prasadam items"],
    enabled: true,
    packages: [
      { name: "Basic", price: 3500, description: "Standard pooja with essential rituals" },
      { name: "Standard", price: 5000, description: "Comprehensive pooja with additional offerings" },
      { name: "Premium", price: 7500, description: "Grand ritual with extended duration and special materials" }
    ]
  },
  {
    id: "svc-2",
    name: "Griha Pravesh",
    category: "Ceremony",
    description: "Vastu-aligned new home entry ritual with homam.",
    duration: "3h 30m",
    basePrice: 7000,
    customPrice: true,
    visitType: "Both",
    requiredItems: ["Mango leaves", "Milk", "Havan samagri"],
    enabled: true,
  },
  {
    id: "svc-3",
    name: "Rudrabhishekam",
    category: "Homam",
    description: "Lord Shiva abhishekam with Rudram chanting.",
    duration: "1h 45m",
    basePrice: 4200,
    customPrice: false,
    visitType: "Temple Visit",
    requiredItems: ["Panchamrutam", "Bilva leaves", "Abhishekam dravyam"],
    enabled: false,
  },
];

export const partnerBookings: PartnerBooking[] = [
  {
    id: "ord-1001",
    customerName: "Raghavendra Rao",
    address: "Madhapur, Hyderabad",
    dateTime: "Today • Morning Slot (06 AM - 09 AM)",
    serviceType: "Satyanarayana Pooja",
    amount: 3500,
    notes: "Please bring extra flowers and kumkum.",
    status: "Pending",
  },
  {
    id: "ord-1002",
    customerName: "Sowmya N",
    address: "Kondapur, Hyderabad",
    dateTime: "Tomorrow • Morning Slot (08 AM - 11 AM)",
    serviceType: "Griha Pravesh",
    amount: 7000,
    notes: "Muhurtam starts at 8:20 AM.",
    status: "Accepted",
  },
  {
    id: "ord-1003",
    customerName: "Rakesh Kumar",
    address: "Begumpet, Hyderabad",
    dateTime: "28 Feb • Evening Slot (04 PM - 07 PM)",
    serviceType: "Rudrabhishekam",
    amount: 4200,
    notes: "Include laghu nyasam.",
    status: "In Progress",
  },
];

export const earningsSummary = {
  total: 128500,
  weekly: 18300,
  monthly: 72400,
  commission: 10250,
  walletBalance: 24200,
};

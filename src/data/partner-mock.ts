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
  image?: string;
  packages?: ServicePackage[];
};

export const ORDER_STATUS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type PartnerBookingStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export type PartnerBooking = {
  id: string;
  customerName: string;
  address: string;
  dateTime: string;
  serviceType: string;
  amount: number;
  notes: string;
  status: PartnerBookingStatus;
  customerPhone: string;
  location: {
    lat: number;
    lng: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  serviceImage?: string;
  itemsRequested?: string[];
  packageName?: string;
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
    customerPhone: "+91 98765 43210",
    address: "Flat 402, Sai Residency, Madhapur, Hyderabad",
    location: {
      lat: 17.4483,
      lng: 78.3915,
      addressLine1: "Flat 402, Sai Residency",
      addressLine2: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500081"
    },
    dateTime: "Today • Morning Slot (06 AM - 09 AM)",
    serviceType: "Satyanarayana Pooja",
    amount: 3500,
    notes: "Please bring extra flowers and kumkum.",
    status: "Pending",
    serviceImage: "https://images.unsplash.com/photo-1609154767012-331529e7d73b?auto=format&fit=crop&q=80&w=200",
    itemsRequested: ["Kalash", "Coconut", "Mango Leaves"],
    packageName: "Basic"
  },
  {
    id: "ord-1002",
    customerName: "Sowmya N",
    customerPhone: "+91 98765 43211",
    address: "H.No 12-5, Kondapur Main Road, Kondapur, Hyderabad",
    location: {
      lat: 17.4622,
      lng: 78.3568,
      addressLine1: "H.No 12-5",
      addressLine2: "Kondapur Main Road, Kondapur",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500084"
    },
    dateTime: "Tomorrow • Morning Slot (08 AM - 11 AM)",
    serviceType: "Griha Pravesh",
    amount: 7000,
    notes: "Muhurtam starts at 8:20 AM.",
    status: "Accepted",
    serviceImage: "https://images.unsplash.com/photo-1585909665970-21c6217217f3?auto=format&fit=crop&q=80&w=200",
    itemsRequested: ["Havan Samagri", "Ghee", "Milk"],
    packageName: "Premium"
  },
  {
    id: "ord-1003",
    customerName: "Rakesh Kumar",
    customerPhone: "+91 98765 43212",
    address: "Apartment 101, Begumpet, Hyderabad",
    location: {
      lat: 17.4399,
      lng: 78.4608,
      addressLine1: "Apartment 101",
      addressLine2: "Begumpet",
      city: "Hyderabad",
      state: "Telangana",
      zipCode: "500016"
    },
    dateTime: "28 Feb • Evening Slot (04 PM - 07 PM)",
    serviceType: "Rudrabhishekam",
    amount: 4200,
    notes: "Include laghu nyasam.",
    status: "In Progress",
    serviceImage: "https://images.unsplash.com/photo-1590161401392-50d405230869?auto=format&fit=crop&q=80&w=200",
    itemsRequested: ["Honey", "Curd", "Ghee", "Milk"],
    packageName: "Standard"
  },
];

export const earningsSummary = {
  total: 128500,
  weekly: 18300,
  monthly: 72400,
  commission: 10250,
  walletBalance: 24200,
};

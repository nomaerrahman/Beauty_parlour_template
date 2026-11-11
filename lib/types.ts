export type CategoryId = "hair" | "skin" | "makeup" | "nails" | "spa";

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
}

export interface Service {
  id: string;
  category: CategoryId;
  title: string;
  description: string;
  duration: number; // minutes
  priceFrom: number;
  priceTo: number;
  benefits: string[];
  image: string;
  popular?: boolean;
  /** Used by the consultation quiz to score recommendations */
  tags: QuizTag[];
}

export interface AddOn {
  id: string;
  title: string;
  duration: number;
  price: number;
  description: string;
}

export type Specialty = "Master Colorist" | "Esthetician" | "Bridal Makeup Artist" | "Nail Artist" | "Spa Therapist";

export interface Specialist {
  id: string;
  name: string;
  role: string;
  specialty: Specialty;
  categories: CategoryId[];
  yearsExperience: number;
  certifications: string[];
  bio: string;
  instagram: string;
  image: string;
  portfolio: string[];
  /** Weekday indexes (0 = Sunday) this specialist works */
  workingDays: number[];
}

export type GalleryTag = "Hair Color" | "Bridal Makeup" | "Glass Skin Facial" | "Nail Art";

export interface GalleryItem {
  id: string;
  tag: GalleryTag;
  title: string;
  image: string;
  specialistId: string;
  tall?: boolean;
}

export interface Transformation {
  id: string;
  label: string;
  treatment: string;
  image: string;
  /** CSS filter applied to simulate the "before" state in the demo */
  beforeFilter: string;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  treatment: string;
  quote: string;
  date: string;
}

export type QuizTag =
  | "dry" | "oily" | "combination" | "sensitive"
  | "natural" | "glam" | "relax" | "refresh"
  | "express" | "standard" | "indulgent";

export interface BookingDraft {
  serviceIds: string[];
  specialistId: string | "any" | null;
  date: string | null; // ISO yyyy-mm-dd
  time: string | null; // "10:30"
  addOnIds: string[];
  customer: { name: string; email: string; phone: string; notes: string };
}

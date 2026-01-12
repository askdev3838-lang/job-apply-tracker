import { ApplicationStatus, WorkType } from "@/types";

// Status configuration with colors and labels
export const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string }
> = {
  applied: {
    label: "Applied",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-950",
  },
  test_case: {
    label: "Test Case",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-950",
  },
  hr_interview: {
    label: "HR Interview",
    color: "text-cyan-700 dark:text-cyan-400",
    bgColor: "bg-cyan-100 dark:bg-cyan-950",
  },
  technical_interview: {
    label: "Technical Interview",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-950",
  },
  management_interview: {
    label: "Management Interview",
    color: "text-indigo-700 dark:text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-950",
  },
  offer: {
    label: "Offer",
    color: "text-amber-700 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-950",
  },
  accepted: {
    label: "Accepted",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
};

// Status order for sorting
export const STATUS_ORDER: ApplicationStatus[] = [
  "applied",
  "test_case",
  "hr_interview",
  "technical_interview",
  "management_interview",
  "offer",
  "accepted",
  "rejected",
];

// Work type configuration
export const WORK_TYPE_CONFIG: Record<
  WorkType,
  { label: string; icon: string }
> = {
  remote: { label: "Remote", icon: "🏠" },
  hybrid: { label: "Hybrid", icon: "🔄" },
  onsite: { label: "On-site", icon: "🏢" },
};

// Default sources
export const DEFAULT_SOURCES = [
  "LinkedIn",
  "Indeed",
  "Glassdoor",
  "Kariyer.net",
  "Company Website",
  "Referral",
  "AngelList",
  "WeWorkRemotely",
  "Remote.co",
  "Other",
];

// Default industries
export const DEFAULT_INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Education",
  "Gaming",
  "Consulting",
  "Media & Entertainment",
  "Telecommunications",
  "Manufacturing",
  "Real Estate",
  "Travel & Hospitality",
  "Automotive",
  "Energy",
  "Food & Beverage",
  "Other",
];

// Local storage keys
export const STORAGE_KEYS = {
  APPLICATIONS: "job-apply-track-applications",
  SETTINGS: "job-apply-track-settings",
};

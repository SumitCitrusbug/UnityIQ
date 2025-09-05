import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj);
  } catch (error) {
    return "Invalid Date";
  }
}

export function formatDateTime(date: Date | string) {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  } catch (error) {
    return "Invalid Date";
  }
}

export function formatTime(date: Date | string) {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return "Invalid Time";
    }
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
  } catch (error) {
    return "Invalid Time";
  }
}

export function isOverdue(dueDate: Date | string) {
  try {
    const dateObj = new Date(dueDate);
    if (isNaN(dateObj.getTime())) {
      return false;
    }
    return dateObj < new Date();
  } catch (error) {
    return false;
  }
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

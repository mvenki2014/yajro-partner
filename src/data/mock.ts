import { Category, Service, Poojari } from "@/types";
import appData from "./app-data.json";
import servicesContent from "./services-content.json";

export const categories: Category[] = appData.categories as Category[];
export const services: Service[] = appData.services as Service[];
export const poojaris: Poojari[] = appData.poojaris as Poojari[];
export const promoBanners = appData.promoBanners;
export const shubhDaysISO = appData.shubhDaysISO;

// Content for Services page
export const allCategories = servicesContent.categories;
export const allServices = servicesContent.services;

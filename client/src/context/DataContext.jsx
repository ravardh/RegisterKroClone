import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../config/api";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [services, setServices] = useState({});
  const [allServices, setAllServices] = useState([]);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [featuredLoaded, setFeaturedLoaded] = useState(false);
  const [reviewsLoaded, setReviewsLoaded] = useState(false);

  // Critical nav + home data in one parallel burst
  useEffect(() => {
    let cancelled = false;

    const initializeData = async () => {
      try {
        const [
          categoriesRes,
          subCategoriesRes,
          servicesRes,
          featuredRes,
          reviewsRes,
        ] = await Promise.all([
          axiosInstance.get("/public/categories"),
          axiosInstance.get("/public/subcategories-grouped"),
          axiosInstance.get("/public/services-grouped"),
          axiosInstance
            .get("/public/services/featured")
            .catch(() => ({ data: { data: [] } })),
          axiosInstance
            .get("/public/feedback")
            .catch(() => ({ data: { data: [] } })),
        ]);

        if (cancelled) return;

        setCategories(categoriesRes.data.data || []);
        setSubCategories(subCategoriesRes.data.data || {});
        setServices(servicesRes.data.data || {});
        setFeaturedServices(featuredRes.data.data || []);
        setReviews(reviewsRes.data.data || []);
        setFeaturedLoaded(true);
        setReviewsLoaded(true);
        setIsDataLoaded(true);

        // Non-critical: load after first paint / when idle
        const loadDeferred = () => {
          axiosInstance
            .get("/public/team")
            .then((teamRes) => {
              if (!cancelled) setTeamMembers(teamRes.data.data || []);
            })
            .catch((teamErr) => console.error("Failed to fetch team:", teamErr));

          axiosInstance
            .get("/public/services")
            .then((response) => {
              if (!cancelled) setAllServices(response.data.data || []);
            })
            .catch((error) =>
              console.error("Failed to fetch all services:", error)
            );
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          window.requestIdleCallback(loadDeferred, { timeout: 2500 });
        } else {
          setTimeout(loadDeferred, 800);
        }
      } catch (error) {
        console.error("Error initializing app data:", error);
        if (!cancelled) {
          setFeaturedLoaded(true);
          setReviewsLoaded(true);
          setIsDataLoaded(true);
        }
      }
    };

    initializeData();
    return () => {
      cancelled = true;
    };
  }, []);

  const contextValue = {
    categories,
    subCategories,
    services,
    allServices,
    featuredServices,
    reviews,
    teamMembers,
    isDataLoaded,
    featuredLoaded,
    reviewsLoaded,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useAppData = () => useContext(DataContext);

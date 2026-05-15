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

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [categoriesRes, subCategoriesRes, servicesRes] =
          await Promise.all([
            axiosInstance.get("/public/categories"),
            axiosInstance.get("/public/subcategories-grouped"),
            axiosInstance.get("/public/services-grouped"),
          ]);

        setCategories(categoriesRes.data.data || []);
        setSubCategories(subCategoriesRes.data.data || {});
        setServices(servicesRes.data.data || {});

        try {
          const teamRes = await axiosInstance.get("/public/team");
          setTeamMembers(teamRes.data.data || []);
        } catch (teamErr) {
          console.error("Failed to fetch team:", teamErr);
        }

        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error initializing app data:", error);
        setIsDataLoaded(true); // Still mark as loaded so UI doesn't hang
      }
    };

    initializeData();
  }, []);

  // Fetch all services (flat list for search) - separate call
  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        const response = await axiosInstance.get("/public/services");
        setAllServices(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch all services:", error);
      }
    };

    fetchAllServices();
  }, []);

  // Fetch featured services
  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        const response = await axiosInstance.get("/public/services/featured");
        setFeaturedServices(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch featured services:", error);
      }
    };

    fetchFeaturedServices();
  }, []);

  // Fetch reviews/feedback
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get("/public/feedback");
        setReviews(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    fetchReviews();
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
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useAppData = () => useContext(DataContext);

"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export interface Planet {
  id?: number;
  name: string;
  image?: string;
  model?: string; 
}

const BASE_URL = "http://localhost:8000";
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export const usePlanets = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/planets");

      // Handle both array and { data: [...] } formats
      const rawData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      const normalized = rawData.map((p: Planet) => ({
        ...p,
        image: p.image
          ? p.image.startsWith("http")
            ? p.image
            : `${BASE_URL}${p.image}`
          : undefined,
        model: p.model
          ? p.model.startsWith("http")
            ? p.model
            : `${BASE_URL}${p.model}`
          : undefined,
      }));

      setPlanets(normalized);
    } catch (err: unknown) {
      console.error("Error fetching planets:", err);
      setError("Failed to fetch planets");
      setPlanets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  return { planets, loading, error, refetch: fetchPlanets };
};

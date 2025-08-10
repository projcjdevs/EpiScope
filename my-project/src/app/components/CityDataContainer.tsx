"use client";

import { useState, useEffect } from "react";
import { fetchOutBreaks } from "../utils/fetchData";
import CityDataCard from "./CityDataCard";

export default function CityDataContainer() {
  const [cityData, setCityData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOutBreaks()
      .then(data => {
        setCityData(data);         // Adjust as needed for your data shape
        setIsVisible(true);        // Show the card on load
      })
      .catch(err => setError(String(err)));
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <CityDataCard
      cityData={cityData}
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
    />
  );
}
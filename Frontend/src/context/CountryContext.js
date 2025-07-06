import React, { createContext, useState, useEffect } from "react";

export const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "India",
    currency_code: "INR",
    currency_name: "Indian Rupee",
  });
  const [tempCurrency, setTempCurrency] = useState("Indian Rupee");

  // Fetch all countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://vendor-f6gw.onrender.com/api/countries");
        const data = await response.json();
        if (data.status === "success") {
          setCountries(data.countries);

          // Check if there's a saved country in localStorage
          const savedCountry = localStorage.getItem("selectedCountry");
          if (savedCountry) {
            const parsedCountry = JSON.parse(savedCountry);
            const matchedCountry = data.countries.find(country => country.name === parsedCountry.name);
            if (matchedCountry) {
              setSelectedCountry(matchedCountry);
              setTempCurrency(matchedCountry.currency_name);
            } else {
              const defaultCountry = data.countries.find(country => country.name === "India") || data.countries[0];
              if (defaultCountry) {
                setSelectedCountry(defaultCountry);
                setTempCurrency(defaultCountry.currency_name);
                localStorage.setItem("selectedCountry", JSON.stringify(defaultCountry));
              }
            }
          } else {
            const defaultCountry = data.countries.find(country => country.name === "India") || data.countries[0];
            if (defaultCountry) {
              setSelectedCountry(defaultCountry);
              setTempCurrency(defaultCountry.currency_name);
              localStorage.setItem("selectedCountry", JSON.stringify(defaultCountry));
            }
          }
        } else {
          console.error("Failed to fetch countries");
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  return (
    <CountryContext.Provider
      value={{
        countries,
        selectedCountry,
        setSelectedCountry,
        tempCurrency,
        setTempCurrency,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};
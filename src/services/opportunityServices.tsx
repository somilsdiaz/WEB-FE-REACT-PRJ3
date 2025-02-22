import { Opportunities } from "../types/opportunities";

const API_URL = "https://web-fe-react-prj3-api-lebw.onrender.com";

export const createOpportunity = async (opportunity: Opportunities) => {
  const response = await fetch(`${API_URL}/opportunities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(opportunity),
  });

  if (!response.ok) {
    throw new Error("Error al crear la oportunidad");
  }

  return response.json();
};
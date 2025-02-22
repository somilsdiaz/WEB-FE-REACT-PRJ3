import { FollowUpActivity } from "../types/followups";

const API_URL = "https://web-fe-react-prj3-api-lebw.onrender.com";

export const createFollowUp = async (followUp: FollowUpActivity): Promise<FollowUpActivity> => {
    const response = await fetch(`${API_URL}/follow-ups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(followUp),
    });
    if (!response.ok) {
      throw new Error("Error al crear el seguimiento");
    }
    return response.json();
  };
  
  export const fetchFollowUpsByOpportunity = async (opportunityId: string): Promise<FollowUpActivity[]> => {
    const response = await fetch(`${API_URL}/follow-ups?opportunityId=${opportunityId}`);
    if (!response.ok) {
      throw new Error("Error al obtener los seguimientos");
    }
    return response.json();
  };
  
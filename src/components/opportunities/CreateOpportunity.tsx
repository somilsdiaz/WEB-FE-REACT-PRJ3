import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OpportunityForm from "./OpportunityForm";
import { createOpportunity } from "../../services/opportunityServices";
import { addOpportunityToClient } from "../../services/clientServices";
import { Opportunities } from "../../types/opportunities";
import { ClientType } from "../../types/clients";
import MainLayout from "../../layouts/MainLayout";

const CreateOpportunity: React.FC = () => {
  const navigate = useNavigate();

  const initialOpportunityState: Opportunities = {
    id: "",
    client: "",
    businessName: "",
    businessLine: "outsourcing recursos",
    description: "",
    estimatedValue: 0,
    estimatedDate: new Date(),
    status: "Apertura",
  };
  
  const [opportunity, setOpportunity] = useState<Opportunities>(initialOpportunityState);
  const [clients, setClients] = useState<ClientType[]>([]);

  const handleOpportunityChange = (updatedOpportunity: Opportunities) => {
    setOpportunity(updatedOpportunity);
  };

  const handleCreateOpportunity = async () => {
    try {
      await createOpportunity(opportunity);

      const selectedClient = clients.find((client) => client.name === opportunity.client);

      if (selectedClient) {
        await addOpportunityToClient(selectedClient.id, opportunity);

        alert("Oportunidad creada y asociada al cliente con éxito");
        navigate("/OpportunitiesPage");
      } else {
        alert("Cliente no encontrado");
      }
    } catch (error) {
      console.log("Error creando oportunidad: ", error);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("https://web-fe-react-prj3-api-lebw.onrender.com/clients");
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.log("Error al cargar los clientes:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <MainLayout>
      <OpportunityForm
        opportunity={opportunity}
        clients={clients}
        onChange={handleOpportunityChange}
        onSubmit={handleCreateOpportunity}
      />
    </MainLayout>
  );
};

export default CreateOpportunity;

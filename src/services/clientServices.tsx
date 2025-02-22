
import { ClientType } from '../types/clients';
import { Opportunities } from "../types/opportunities";
import { ContactType } from "../types/clients";
import axios from 'axios';

const API_URL = 'https://web-fe-react-prj3-api-lebw.onrender.com';

export const fetchClients = async (): Promise<ClientType[]> => {
  try {
    const response = await axios.get(`${API_URL}/clients`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw new Error("Customers could not be obtained");
  }
};


export const createClient = async (client: ClientType) => {
  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(client),
  });

  if (!response.ok) {
    throw new Error('Error al crear el cliente');
  }

  return response.json();
};

export const addOpportunityToClient = async (clientId: number, opportunity: Opportunities) => {
  // Primero obtenemos el cliente actual
  const clientResponse = await fetch(`${API_URL}/clients/${clientId}`);
  if (!clientResponse.ok) {
    throw new Error("Error al obtener el cliente");
  }
  const clientData: ClientType = await clientResponse.json();

  // Agregamos la nueva oportunidad al array de oportunidades
  const updatedClient = {
    ...clientData,
    opportunities: [...(clientData.opportunities || []), opportunity],
  };

  // Hacemos la solicitud para actualizar solo las oportunidades del cliente
  const response = await fetch(`${API_URL}/clients/${clientId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedClient),
  });

  if (!response.ok) {
    throw new Error("Error al agregar la oportunidad al cliente");
  }

  return response.json();
};


export const fetchClientById = async (clientId: string): Promise<ClientType> => {
  const response = await fetch(`${API_URL}/clients/${clientId}`);
  if (!response.ok) {
    throw new Error("Error al obtener el cliente");
  }
  return response.json();
};

export const fetchContactsByClient = async (clientId: string): Promise<ContactType[]> => {
  const response = await fetch(`${API_URL}/clients/${clientId}/contacts`); // Ajusta la URL según el endpoint
  if (!response.ok) {
    throw new Error("Error al obtener los contactos del cliente");
  }
  return response.json();
};
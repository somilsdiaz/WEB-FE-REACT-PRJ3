//OppDetailsLow.tsx

import React, { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaRegCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaDollarSign,
  FaCalendarDay,
} from "react-icons/fa";
import FollowUpModal from "../followUps/FollowUpModal";
import {Button} from "@mui/material";
import {PlusCircle} from 'lucide-react';

interface Opportunity {
  id: string;
  businessName: string;
  businessLine: string;
  description: string;
  estimatedValue: number;
  estimatedDate: string;
  status: string;
}

interface FollowUpActivity {
  contactType: string;
  contactDate: string;
  clientContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  salesExecutive: string;
  description: string;
  additionalNotes: string;
}

const OppDetailsLow: React.FC = () => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [followUps, setFollowUps] = useState<FollowUpActivity[]>([]);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  useEffect(() => {
    const savedOpportunity = localStorage.getItem("selectedOpportunity");
    if (savedOpportunity) {
      const opportunityData = JSON.parse(savedOpportunity);
      setOpportunity(opportunityData);
      fetchFollowUps(opportunityData.id);
    }
  }, []);

  const fetchFollowUps = async (opportunityId: string) => {
    try {
      const response = await fetch(`https://web-fe-react-prj3-api-lebw.onrender.com/follow`);
      const data = await response.json();
      
      // Filtrar todos los elementos que coinciden con el opportunityId
      const followUpData = data.filter((follow: any) => follow.opportunityId === opportunityId);
      
      // Obtener todas las actividades de seguimiento de los elementos filtrados
      const allFollowUpActivities = followUpData.flatMap((follow: any) => follow.followUpActivities);
      
      // Establecer los seguimientos en el estado
      setFollowUps(allFollowUpActivities);
    } catch (error) {
      console.error("Error fetching follow-up activities:", error);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);
  
  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "GANADA":
        return <FaCheckCircle className="text-green-600" />;
      case "PERDIDA":
        return <FaExclamationCircle className="text-red-600" />;
      case "EN PROCESO":
        return <FaRegCalendarAlt className="text-blue-600" />;
      default:
        return <FaRegCalendarAlt className="text-gray-600" />;
    }
  };

  if (!opportunity) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No se encontró información de la oportunidad</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FaClipboardList className="mr-3 text-blue-600 text-2xl" />
          <h4 className="text-xl font-semibold flex items-center">
            Seguimiento de: {opportunity.businessLine}
          </h4>
        </div>
        <Button
          onClick={() => setIsFollowUpModalOpen(true)}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PlusCircle size={16} />}
          style={{ paddingLeft: '8px', fontWeight: 'bold'}}
        >
          Crear Seguimiento
        </Button>
      </div>

      {/* Información de la oportunidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center space-x-2">
          <FaDollarSign className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Valor Estimado:
          </span>
          <span className="text-sm font-semibold text-green-600">
            ${opportunity.estimatedValue.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FaCalendarDay className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Fecha inicio:
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {opportunity.estimatedDate}
          </span>
        </div>
      </div>

      {/* Estado de la oportunidad */}
      <div className="flex items-center space-x-2 mb-6">
        {getStatusIcon(opportunity.status)}
        <span
          className={`font-semibold text-lg ${opportunity.status === "GANADA"
            ? "text-green-600"
            : opportunity.status === "PERDIDA"
              ? "text-red-600"
              : "text-blue-600"
            }`}
        >
          {opportunity.status}
        </span>
      </div>

      <div className="hidden lg:block">
        {/* Tabla de Seguimientos */}
        <table className="w-full border-t bg-white rounded-lg shadow-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Fecha</th>
              <th className="p-4 text-left text-sm font-semibold">
                Tipo de Contacto
              </th>
              <th className="p-4 text-left text-sm font-semibold">Ejecutivo</th>
              <th className="p-4 text-left text-sm font-semibold">
                Contacto del Cliente
              </th>
              <th className="p-4 text-left text-sm font-semibold">
                Descripción
              </th>
              <th className="p-4 text-left text-sm font-semibold">
                Notas Adicionales
              </th>
            </tr>
          </thead>
          <tbody>
            {followUps.map((followUp, index) => (
              <tr
                key={index}
                className="hover:bg-gray-200 transition duration-300"
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {followUp.contactDate}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {followUp.contactType}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {followUp.salesExecutive}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {`${followUp.clientContact.firstName} ${followUp.clientContact.lastName}`}
                  <br />
                  <a
                    href={`mailto:${followUp.clientContact.email}`}
                    className="text-blue-600 underline"
                  >
                    {followUp.clientContact.email}
                  </a>
                  <br />
                  <span>{followUp.clientContact.phone}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {followUp.description}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {followUp.additionalNotes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block lg:hidden">
        <div className="space-y-4">
          {followUps.map((followUp) => (
            <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">
                {followUp.contactDate}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
                <p className="mr-4">
                  <strong>Tipo:</strong> {followUp.contactType}
                </p>
                <p>
                  <strong>Ejecutivo:</strong> {followUp.salesExecutive}
                </p>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                <p>
                  <strong>Contacto del Cliente:</strong>
                </p>
                <p>{`${followUp.clientContact.firstName} ${followUp.clientContact.lastName}`}</p>
                <a
                  href={`mailto:${followUp.clientContact.email}`}
                  className="text-blue-600 underline text-xs"
                >
                  {followUp.clientContact.email}
                </a>
                <p className="text-xs">{followUp.clientContact.phone}</p>
              </div>
              <div className="text-sm text-gray-700 mb-2">
                <p>
                  <strong>Descripción:</strong> {followUp.description}
                </p>
              </div>
              <div className="text-sm text-gray-700">
                <p>
                  <strong>Notas Adicionales:</strong> {followUp.additionalNotes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showToast && (
        <div className="fixed mt-20 top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-all transform duration-500 ease-in-out z-50">
          {toastMessage} 🎉
        </div>
      )}

      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => setIsFollowUpModalOpen(false)}
        opportunityId={opportunity.id}
        onUpdate={() => {
          fetchFollowUps(opportunity.id); 
          setToastMessage(`El seguimiento se ha creado correctamente.`);
          setShowToast(true);
      }} 
      />

    </div>
  );
};

export default OppDetailsLow;
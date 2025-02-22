import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaTimes, FaRegCalendarAlt, FaCheckCircle, FaExclamationCircle, FaDollarSign, FaCalendarDay } from 'react-icons/fa';

interface Opportunity {
    id: string;
    description: string;
    status: string;
    businessName: string;
    businessLine: string;
    estimatedValue: number;
    estimatedDate: string;
    clientId: string;
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

interface ClientDetailLowProps {
    opportunity: Opportunity;
    onClose: () => void;
}

const ClientDetailLow: React.FC<ClientDetailLowProps> = ({ opportunity, onClose }) => {
    const [followUps, setFollowUps] = useState<FollowUpActivity[]>([]);

    useEffect(() => {
        fetchFollowUps();
    }, [opportunity]);

    const fetchFollowUps = async () => {
        try {
          const response = await fetch(`https://web-fe-react-prj3-api-lebw.onrender.com/follow`);
          const data = await response.json();
      
          // Filtrar todos los elementos que coinciden con el opportunityId
          const followUpData = data.filter((follow: any) => follow.opportunityId === opportunity.id);
          
          // Obtener todas las actividades de seguimiento de los elementos filtrados
          const allFollowUpActivities = followUpData.flatMap((follow: any) => follow.followUpActivities);
          
          // Establecer los seguimientos en el estado
          setFollowUps(allFollowUpActivities);
        } catch (error) {
          console.error('Error fetching follow-up activities:', error);
        }
      };
      
    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case 'GANADA':
                return <FaCheckCircle className="text-green-600" />;
            case 'PERDIDA':
                return <FaExclamationCircle className="text-red-600" />;
            case 'EN PROCESO':
                return <FaRegCalendarAlt className="text-blue-600" />;
            default:
                return <FaRegCalendarAlt className="text-gray-600" />;
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-xl">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <FaClipboardList className="mr-3 text-blue-600 text-2xl" />
                    <h4 className="text-xl font-semibold flex items-center">Seguimiento de: {opportunity.businessLine}</h4>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full p-2"
                        aria-label="Cerrar"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>
            </div>

            {/* Información de la oportunidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center space-x-2">
                    <FaDollarSign className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Valor Estimado:</span>
                    <span className="text-sm font-semibold text-green-600">${opportunity.estimatedValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <FaCalendarDay className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Fecha Estimada:</span>
                    <span className="text-sm font-semibold text-blue-600">{opportunity.estimatedDate}</span>
                </div>
            </div>

            {/* Estado de la oportunidad */}
            <div className="flex items-center space-x-2 mb-6">
                {getStatusIcon(opportunity.status)}
                <span className={`font-semibold text-lg ${
                    opportunity.status === 'GANADA' ? 'text-green-600' : 
                    opportunity.status === 'PERDIDA' ? 'text-red-600' : 
                    'text-blue-600'
                }`}>
                    {opportunity.status}
                </span>
            </div>

            <div className="hidden lg:block">
                <table className="w-full border-t bg-white rounded-lg shadow-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="p-4 text-left text-sm font-semibold">Fecha</th>
                            <th className="p-4 text-left text-sm font-semibold">Tipo de Contacto</th>
                            <th className="p-4 text-left text-sm font-semibold">Ejecutivo</th>
                            <th className="p-4 text-left text-sm font-semibold">Contacto del Cliente</th>
                            <th className="p-4 text-left text-sm font-semibold">Descripción</th>
                            <th className="p-4 text-left text-sm font-semibold">Notas Adicionales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {followUps.map((followUp, index) => (
                            <tr key={index} className="hover:bg-gray-200 transition duration-300">
                                <td className="px-4 py-3 text-sm text-gray-700">{followUp.contactDate}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{followUp.contactType}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{followUp.salesExecutive}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {`${followUp.clientContact.firstName} ${followUp.clientContact.lastName}`}
                                    <br />
                                    <a href={`mailto:${followUp.clientContact.email}`} className="text-blue-600 underline">
                                        {followUp.clientContact.email}
                                    </a>
                                    <br />
                                    <span>{followUp.clientContact.phone}</span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{followUp.description}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">{followUp.additionalNotes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="block lg:hidden">
                <div className="space-y-4">
                    {followUps.map((followUp, index) => (
                        <div key={index} className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                {followUp.contactDate}
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
                                <p className="mr-4"><strong>Tipo:</strong> {followUp.contactType}</p>
                                <p><strong>Ejecutivo:</strong> {followUp.salesExecutive}</p>
                            </div>
                            <div className="text-sm text-gray-700 mb-2">
                                <p><strong>Contacto del Cliente:</strong></p>
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
                                <p><strong>Descripción:</strong> {followUp.description}</p>
                            </div>
                            <div className="text-sm text-gray-700">
                                <p><strong>Notas Adicionales:</strong> {followUp.additionalNotes}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientDetailLow;
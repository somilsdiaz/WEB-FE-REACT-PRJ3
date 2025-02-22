import React, { useEffect, useState } from 'react';
import SeguimientoOportunidad from './ClientDetailLow';
import { FaCity, FaSyncAlt, FaArrowCircleRight } from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io';

interface Client {
  id: string;
  nit: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  active: boolean;
  opportunities: string[];
}

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

const getStatusStyle = (status: string) => {
  switch (status.toUpperCase()) {
    case 'GANADA':
      return { icon: <IoMdCheckmarkCircle className="text-green-800" />, bgColor: 'bg-green-100', textColor: 'text-green-800' };
    case 'PERDIDA':
      return { icon: <IoMdCloseCircle className="text-red-800" />, bgColor: 'bg-red-100', textColor: 'text-red-800' };
    case 'EN PROCESO':
      return { icon: <FaSyncAlt className="text-blue-800 animate-spin" />, bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    case 'CANCELADA':
      return { icon: <FaArrowCircleRight className="text-gray-800" />, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    default:
      return { icon: <FaArrowCircleRight className="text-gray-800" />, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  }
};

const ClientDetails: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  
  useEffect(() => {
    const savedClient = localStorage.getItem('selectedClient');
    if (savedClient) {
      const client = JSON.parse(savedClient);
      setSelectedClientId(client.id);
    }

    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://web-fe-react-prj3-api-lebw.onrender.com/clients');
        const data = await response.json();
        setClients(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError('No se pudieron cargar los clientes.');
      } finally {
        setLoading(false);
      }
    };

    const fetchOpportunities = async () => {
      const response = await fetch('https://web-fe-react-prj3-api-lebw.onrender.com/opportunities');
      const data = await response.json();
      setOpportunities(data);
    };

    fetchClients();
    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter(opportunity =>
    clients.some(client => client.id === selectedClientId && client.opportunities.includes(opportunity.id))
  );

  const handleFollowUpClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowFollowUp(true);
  };

  const handleCloseFollowUp = () => {
    setShowFollowUp(false);
    setSelectedOpportunity(null);
  };

  

  return (
    <div className="container mx-auto p-6 bg-[#f3f4f6] rounded-lg shadow-lg transition-all ease-in-out duration-300">
      <div className="w-full bg-white rounded-lg shadow-md">
        <div className="bg-gray-50 border-b p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center"><MdBusinessCenter className="mr-2 text-blue-500" /> Oportunidades de negocio</h2>
        </div>
        {loading ? (
          <p className="p-6 text-center text-blue-600 font-medium animate-pulse flex items-center"><FaSyncAlt className="mr-2 animate-spin" /> Cargando clientes...</p>
        ) : error ? (
          <p className="p-6 text-red-500 font-semibold text-center">{error}</p>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <FaCity className="w-6 h-6 text-gray-500" aria-label="Ubicación del cliente" />
              <div>
                <p className="text-sm text-gray-500">Ciudad</p>
                <p className="font-medium text-black">{clients.find(client => client.id === selectedClientId)?.city}</p>
              </div>
            </div>
          </div>
        )}



        <div className="p-6 overflow-auto">

              {/* Para móviles */}
              <div className="block lg:hidden">
                {filteredOpportunities.length > 0 ? (
                  <ul className="space-y-4">
                    {filteredOpportunities.map((opportunity) => (
                      <li
                        key={opportunity.id}
                        className="bg-white rounded-lg shadow-sm p-4 border hover:bg-gray-50 transition-all ease-in-out duration-200"
                        role="listitem"
                      >
                        <div className="text-sm font-semibold text-gray-700">Nombre Negocio:</div>
                        <div className="text-sm mb-2">{opportunity.businessName}</div>

                        <div className="text-sm font-semibold text-gray-700">Línea de Negocio:</div>
                        <div className="text-sm mb-2">{opportunity.businessLine}</div>

                        <div className="text-sm font-semibold text-gray-700">Descripción:</div>
                        <div className="text-sm mb-2">{opportunity.description}</div>

                        <div className="text-sm font-semibold text-gray-700">Valor Estimado:</div>
                        <div className="text-sm mb-2">{opportunity.estimatedValue}</div>

                        <div className="text-sm font-semibold text-gray-700">Fecha Estimada:</div>
                        <div className="text-sm mb-2">{opportunity.estimatedDate}</div>

                        <div className="text-sm font-semibold text-gray-700">Estado:</div>
                        <div className="py-2 px-3 text-center whitespace-nowrap w-[70px] mb-2">
                          {(() => {
                            const statusStyle = getStatusStyle(opportunity.status); // Obtener estilo basado en el estado
                            return (
                              <span
                                className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${statusStyle.textColor} ${statusStyle.bgColor}`}
                                role="status"
                                aria-label={`Estado: ${opportunity.status}`}
                              >
                                {statusStyle.icon} <span className="ml-1">{opportunity.status}</span>
                              </span>
                            );
                          })()}
                        </div>

                        <div>
                          <button
                            className="text-blue-600 text-sm hover:text-blue-800 font-semibold transition-all duration-150 flex items-center"
                            onClick={() => handleFollowUpClick(opportunity)}
                            aria-expanded={showFollowUp}
                            aria-controls="follow-up-section"
                          >
                            <FaArrowCircleRight className="mr-1" /> Seguimiento
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-gray-500" aria-live="polite">
                    No hay oportunidades disponibles para este cliente.
                  </div>
                )}
                {showFollowUp && selectedOpportunity && (
                <div id="follow-up-section" className="mt-6 transition-transform ease-in-out duration-300 transform scale-105">
                  <SeguimientoOportunidad opportunity={selectedOpportunity} onClose={handleCloseFollowUp} />
                </div>
              )}
            </div>



            {/*Para desktop*/}
            <div className="hidden lg:block">
              <table className="w-full border-t bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="p-4 text-left text-sm font-semibold">Nombre Negocio</th>
                    <th className="p-4 text-left text-sm font-semibold">Línea de Negocio</th>
                    <th className="p-4 text-left text-sm font-semibold">Descripción</th>
                    <th className="p-4 text-left text-sm font-semibold">Valor Estimado</th>
                    <th className="p-4 text-left text-sm font-semibold">Fecha Estimada</th>
                    <th className="p-4 text-left text-sm font-semibold">Estado</th>
                    <th className="p-4 text-left text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpportunities.length > 0 ? (
                    filteredOpportunities.map((opportunity) => {
                      return (
                        <tr key={opportunity.id} className="border-b hover:bg-gray-50 transition-all ease-in-out duration-150">
                          <td className="text-sm p-4">{opportunity.businessName}</td>
                          <td className="text-sm p-4">{opportunity.businessLine}</td>
                          <td className="text-sm p-4">{opportunity.description}</td>
                          <td className="text-sm p-4">{opportunity.estimatedValue}</td>
                          <td className="text-sm p-4">{opportunity.estimatedDate}</td>
                          <td className="py-2 px-3 text-center whitespace-nowrap w-[70px]">
                          {(() => {
                            const statusStyle = getStatusStyle(opportunity.status);  // Obtener estilo basado en el estado
                            return (
                              <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold ${statusStyle.textColor} ${statusStyle.bgColor}`}>
                                {statusStyle.icon} <span className="ml-1">{opportunity.status}</span>
                              </span>
                                );
                              })()}
                            </td>
                          <td className="p-4">
                            <button
                              className="text-blue-600 text-sm hover:text-blue-800 font-semibold transition-all duration-150 flex items-center"
                              onClick={() => handleFollowUpClick(opportunity)}
                              aria-expanded={showFollowUp}
                              aria-controls="follow-up-section"
                            >
                              <FaArrowCircleRight className="mr-1" /> Seguimiento
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        No hay oportunidades disponibles para este cliente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {showFollowUp && selectedOpportunity && (
                <div id="follow-up-section" className="mt-6 transition-transform ease-in-out duration-300 transform">
                  <SeguimientoOportunidad opportunity={selectedOpportunity} onClose={handleCloseFollowUp} />
                </div>
              )}
            </div>


          </div>
      </div>
    </div>
  );
};

export default ClientDetails;

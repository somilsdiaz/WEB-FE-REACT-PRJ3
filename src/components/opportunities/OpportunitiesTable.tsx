//OpportunitiesTable.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import DeleteDialog from '../dialogs/DeleteDialog';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import UpdateOpportunity from './UpdateOpportunity';

interface Opportunity {
  id: string;
  client: string;
  businessName: string;
  businessLine:
    | "outsourcing recursos"
    | "desarrollo web"
    | "desarrollo mobile"
    | "consultoría TI";
  description: string;
  estimatedValue: number;
  estimatedDate: Date;
  status: "Apertura" | "En Estudio" | "Orden de Compra" | "Ejecutada";
}

const OpportunitiesTable = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 8;
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('https://web-fe-react-prj3-api-lebw.onrender.com/opportunities');
      if (!response.ok) {
        throw new Error(`Error al obtener las oportunidades: ${response.statusText}`);
      }
      const data = await response.json();
      
      setOpportunities(Array.isArray(data) ? data : [data]);
      setError(null);
    } catch (error) {
      console.error('Error al obtener las oportunidades:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);


  const handleDeleteOpportunity = async (id: string) => {
    try {
      const response = await fetch(`https://web-fe-react-prj3-api-lebw.onrender.com/opportunities/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error(`Error al eliminar la oportunidad: ${response.statusText}`);
      }
  
      setOpportunities(prevOpportunities => {
        const updatedOpportunities = prevOpportunities.filter(opp => opp.id !== id);
        console.log('Oportunidades actualizadas:', updatedOpportunities);
        return updatedOpportunities;
      });
  
      const remainingItems = opportunities.length - 1;
      const maxPages = Math.ceil(remainingItems / resultsPerPage);
      if (currentPage >= maxPages) {
        setCurrentPage(Math.max(0, maxPages - 1));
      }
    } catch (error) {
      console.error('Error al eliminar la oportunidad:', error);
      setError('Error al eliminar la oportunidad');
    }
  };

  const currentOpportunities = opportunities.slice(
    currentPage * resultsPerPage,
    (currentPage + 1) * resultsPerPage
  );

  const handleOpportunityClick = (opportunity: Opportunity) => {
    localStorage.setItem('selectedOpportunity', JSON.stringify(opportunity));
    navigate('/OppDetailsPage');
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'EN ESTUDIO':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800'
        };
      case 'EJECUTADA':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800'
        };
      case 'APERTURA':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800'
        };
      case 'ORDEN DE COMPRA':
        return {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800'
        };
    }
  };

  const handleUpdateClick = (opportunity: Opportunity) => {

    setSelectedOpportunity(opportunity);
    setShowUpdateModal(true);
  };

  const handleOpportunityUpdate = async (updatedOpportunity: Opportunity) => {

    try {
      const response = await fetch(`https://web-fe-react-prj3-api-lebw.onrender.com/opportunities/${updatedOpportunity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOpportunity),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la oportunidad');
      }

      setOpportunities(prevOpportunities => 
        prevOpportunities.map(opp => 
          opp.id === updatedOpportunity.id ? updatedOpportunity : opp
        )
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al actualizar la oportunidad');
    } 
  };

  if (loading) {
    return <div className="flex justify-center p-4">Cargando...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto overflow-y-auto max-w-full border border-gray-100 rounded-md shadow-xl scrollbar-custom">
        <table className="table-auto bg-white w-full rounded-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm">
              <th className="py-3 px-4 text-center font-semibold w-[120px]">Nombre Negocio</th>
              <th className="py-3 px-4 text-center font-semibold w-[120px]">Línea Negocio</th>
              <th className="py-3 px-4 text-center font-semibold w-[300px]">Descripción</th>
              <th className="py-3 px-4 text-center font-semibold w-[120px]">Valor Estimado</th>
              <th className="py-3 px-4 text-center font-semibold w-[120px]">Fecha Estimada</th>
              <th className="py-3 px-4 text-center font-semibold w-[120px]">Estado</th>
              <th className="py-3 px-4 text-center font-semibold w-[250px]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentOpportunities.map((opportunity, index) => (
              <tr 
                key={opportunity.id}
                className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'} text-sm text-gray-700`}
              >
                <td className="py-4 px-2 text-center w-[120px] hover:underline" onClick={() => handleOpportunityClick(opportunity)}>
                  {opportunity.businessName}
                </td>
                <td className="py-4 px-2 text-center w-[120px]">{opportunity.businessLine}</td>
                <td className="py-4 px-2 text-center w-[300px] break-words">{opportunity.description}</td>
                <td className="py-4 px-2 text-center w-[120px]">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(opportunity.estimatedValue)}
                </td>
                <td className="py-4 px-2 text-center w-[120px]">
                  {new Date(new Date(opportunity.estimatedDate).getTime() + new Date(opportunity.estimatedDate).getTimezoneOffset() * 60000)
                    .toISOString()
                    .split('T')[0]}
                </td>
                <td className="py-4 px-2 text-center w-[120px]">
                  {(() => {
                    const styles = getStatusStyle(opportunity.status);
                    return (
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${styles.textColor} ${styles.bgColor}`}>
                        {opportunity.status}
                      </span>
                    );
                  })()}
                </td>
                <td className="py-4 px-2 text-center w-[250px]">
                  <div className="flex justify-center gap-1">
                    <button 
                      className="bg-[#FF9800] text-white px-3 py-1 rounded-l-full flex items-center justify-center text-sm hover:bg-[#F57C00] transition-colors duration-200"
                      onClick={() => handleUpdateClick(opportunity)}
                    >
                      Actualizar
                    </button>
                    <DeleteDialog
                      itemId={opportunity.id}
                      itemDescription={opportunity.businessName}
                      itemType="opportunity"
                      onDelete={handleDeleteOpportunity}
                      triggerClassName="bg-red-600 text-white px-3 py-1 rounded-r-full flex items-center justify-center text-sm hover:bg-red-700 transition-colors duration-200"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        previousLabel={<FaArrowLeft />}
        nextLabel={<FaArrowRight />}
        pageCount={Math.ceil(opportunities.length / resultsPerPage)}
        onPageChange={handlePageChange}
        containerClassName="pagination flex mt-4 space-x-2 overflow-auto justify-center items-center"
        pageClassName="px-3 py-1 rounded-md transition-all duration-200 ease-in-out"
        activeClassName="bg-blue-500 text-white font-semibold border border-blue-600"
        previousClassName="rounded-md px-2 py-1 text-gray-600 hover:text-blue-500 transition duration-200 ease-in-out"
        nextClassName="rounded-md px-2 py-1 text-gray-600 hover:text-blue-500 transition duration-200 ease-in-out"
      />

      {showUpdateModal && selectedOpportunity && (
        <UpdateOpportunity
          opportunity={selectedOpportunity}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={() => {
            handleOpportunityUpdate;
            setToastMessage(`Los datos de la oportunidad se han actualizado correctamente.`);
            setShowToast(true);
          }}
          
        />
      )}
                {showToast && (
            <div className="fixed mt-20 top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-all transform duration-500 ease-in-out z-50">
              {toastMessage} 🎉
            </div>
          )}

      
    </div>
  );
};

export default OpportunitiesTable;
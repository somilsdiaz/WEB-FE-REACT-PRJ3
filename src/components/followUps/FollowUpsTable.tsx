import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import UpdateFollowUp from "./UpdateFollowUp";
import DeleteDialog from "../dialogs/DeleteDialog";
import { PlusCircle } from 'lucide-react';
import { Button } from '@mui/material';
import CreateFollowUpModal from './CreateFollowUpModal';


interface ClientContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface FollowUpActivity {
  id: string;
  contactType: string;
  contactDate: string;
  clientContact: ClientContact;
  salesExecutive: string;
  description: string;
  additionalNotes?: string;
}

interface FollowUp {
  id: string;
  opportunityId: string;
  followUpActivities: FollowUpActivity[];
}

const FollowUpsTable = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const resultsPerPage = 8;

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  
  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://web-fe-react-prj3-api-lebw.onrender.com/follow");
      if (!response.ok) {
        throw new Error(`Error al obtener los seguimientos: ${response.statusText}`);
      }

      const data = await response.json();
      setFollowUps(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error al obtener los seguimientos:", err);
      setError("No se pudo cargar la información. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = (followUp: FollowUp, activityId: string) => {
    setSelectedFollowUp(followUp);
    setSelectedActivityId(activityId);
    setShowUpdateModal(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleDeleteActivity = async (followUpId: string, activityId: string) => {
    try {
      // Encontrar el followUp específico
      const followUp = followUps.find(f => f.id === followUpId);
      if (!followUp) return;

      // Crear una nueva versión del followUp sin la actividad específica
      const updatedFollowUp = {
        ...followUp,
        followUpActivities: followUp.followUpActivities.filter(
          activity => activity.id !== activityId
        )
      };

      // Enviar la actualización al servidor
      const response = await fetch(
        `https://web-fe-react-prj3-api-lebw.onrender.com/follow/${followUpId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFollowUp),
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la actividad");
      }

      // Actualizar el estado local
      setFollowUps(prevFollowUps =>
        prevFollowUps.map(f =>
          f.id === followUpId ? updatedFollowUp : f
        )
      );
    } catch (err) {
      console.error("Error al eliminar la actividad:", err);
      setError("No se pudo eliminar la actividad. Intente nuevamente.");
    }
  };

  const currentFollowUps = followUps.slice(
    currentPage * resultsPerPage,
    (currentPage + 1) * resultsPerPage
  );

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  if (loading) {
    return <div className="flex justify-center p-4">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-4 text-red-600">
        {error}
      </div>
    );
  }
  

  return (
    <div className="flex flex-col items-center p-4">
      <div className="self-start mb-4">
          <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<PlusCircle size={16} />}
              style={{ paddingLeft: '8px', fontWeight: 'bold' }}
              onClick={handleOpenModal}
          >
              Crear Seguimiento
          </Button>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="overflow-x-auto overflow-y-auto max-w-full border border-gray-100 rounded-md shadow-xl scrollbar-custom">
        <table className="table-auto bg-white w-full rounded-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm">
              <th className="py-3 px-4 text-center font-semibold">Tipo de Contacto</th>
              <th className="py-3 px-4 text-center font-semibold">Fecha de Contacto</th>
              <th className="py-3 px-4 text-center font-semibold">Datos del Cliente</th>
              <th className="py-3 px-4 text-center font-semibold">Ejecutivo</th>
              <th className="py-3 px-4 text-center font-semibold">Descripción</th>
              <th className="py-3 px-4 text-center font-semibold">Notas</th>
              <th className="py-3 px-4 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentFollowUps.map((followUp) =>
              followUp.followUpActivities.map((activity, index) => (
                <tr
                  key={activity.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } text-sm text-gray-700`}
                >
                  <td className="py-4 px-2 text-center">{activity.contactType}</td>
                  <td className="py-4 px-2 text-center">{activity.contactDate}</td>
                  <td className="py-4 px-2 text-left">
                    <ul className="list-none">
                      <li><strong>Nombre:</strong> {activity.clientContact.firstName} {activity.clientContact.lastName}</li>
                      <li><strong>Email:</strong> {activity.clientContact.email}</li>
                      <li><strong>Teléfono:</strong> {activity.clientContact.phone}</li>
                    </ul>
                  </td>
                  <td className="py-4 px-2 text-center">{activity.salesExecutive}</td>
                  <td className="py-4 px-2 text-center">{activity.description}</td>
                  <td className="py-4 px-2 text-center">{activity.additionalNotes || "N/A"}</td>
                  <td className="text-center py-4 pr-5">
                    <div className="flex justify-center gap-1">
                      <button
                        className="bg-[#FF9800] text-white px-4 py-1 rounded-l-full flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => {
                          handleUpdateClick(followUp, activity.id);
                        }}
                      >
                        Actualizar
                      </button>
                      <DeleteDialog
                        itemId={activity.id}
                        itemDescription={`${activity.contactType} - ${activity.contactDate}`}
                        itemType="activity"
                        onDelete={() => handleDeleteActivity(followUp.id, activity.id)}
                        triggerClassName="bg-red-600 text-white px-3 py-1 rounded-r-full flex items-center justify-center text-sm hover:bg-red-700 transition-colors duration-200"
                        />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        previousLabel={<FaArrowLeft />}
        nextLabel={<FaArrowRight />}
        pageCount={Math.ceil(followUps.length / resultsPerPage)}
        onPageChange={handlePageChange}
        containerClassName="pagination flex mt-4 space-x-2 overflow-auto justify-center items-center"
        pageClassName="px-3 py-1 rounded-md transition-all duration-200 ease-in-out"
        activeClassName="bg-blue-500 text-white font-semibold border border-blue-600"
        previousClassName="rounded-md px-2 py-1 text-gray-600 hover:text-blue-500 transition duration-200 ease-in-out"
        nextClassName="rounded-md px-2 py-1 text-gray-600 hover:text-blue-500 transition duration-200 ease-in-out"
      />

      {showUpdateModal && selectedFollowUp && selectedActivityId && (
        <UpdateFollowUp
          key={`${selectedFollowUp.id}-${selectedActivityId}`}
          followUp={selectedFollowUp}
          activityId={selectedActivityId}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedFollowUp(null);
            setSelectedActivityId(null);
          }}
          onUpdate={() => {
            fetchFollowUps(); 
            setToastMessage(`Los datos de seguimiento se han actualizado correctamente.`);
            setShowToast(true);
          }}
        />
      )}

      {showToast && (
        <div className="fixed mt-20 top-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg transition-all transform duration-500 ease-in-out z-50">
          {toastMessage} 🎉
        </div>
      )}
      <CreateFollowUpModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onUpdate={() => {
              fetchFollowUps(); 
              setToastMessage(`El seguimiento se ha creado correctamente.`);
              setShowToast(true);
          }} 
      />
    </div>
  );
};

export default FollowUpsTable;
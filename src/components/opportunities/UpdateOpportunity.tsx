import { useState, useRef} from 'react';

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

interface UpdateOpportunityProps {
  opportunity: Opportunity;
  onClose: () => void;
  onUpdate: (updatedOpportunity: Opportunity) => void;
}

const UpdateOpportunity: React.FC<UpdateOpportunityProps> = ({ opportunity, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Opportunity>(opportunity);
  const [error, setError] = useState<string | null>(null);

  const statusOrder = ["Apertura", "En Estudio", "Orden de Compra", "Ejecutada"] as const;

  const getStatusStyle = (status: string, isPastStatus: boolean) => {
    if (isPastStatus) {
      return 'bg-gray-100 text-gray-600';
    }

    switch (status) {
      case 'En Estudio':
        return 'bg-green-100 text-green-800';
      case 'Ejecutada':
        return 'bg-red-100 text-red-800';
      case 'Apertura':
        return 'bg-blue-100 text-blue-800';
      case 'Orden de Compra':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  const [isError, setIsError] = useState(false); // Línea 
  const triggerError = () => {
    setIsError(true); // Cambia el estado del botón a error
  
    setTimeout(() => {
      if (popupRef.current) {
        popupRef.current.scrollTo({ top: 0, behavior: "smooth" }); // el scroll del contenedor al top
      }
    }, 500); // 0.5 segundos de retraso
  
    setTimeout(() => setIsError(false), 3000); // renicio del estado después de 3 segundos
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedValue' 
        ? Number(value)
        : name === 'estimatedDate' 
          ? new Date(value) 
          : value
    }));
  };


  const validateFormData = () => {
    const requiredFields = [
      'businessName',
      'businessLine',
      'description',
      'estimatedValue',
      'estimatedDate',
      'status',
    ];
  
    for (const field of requiredFields) {
      const value = formData[field as keyof Opportunity];
  
      if (value == null || value === '') { // Verifica null, undefined o string vacía
        setError("Por favor completa todos los campos obligatorios.");
        triggerError(); // Cambia el estado de error
        return "Por favor completa todos los campos obligatorios.";
      }
    }
  
    return null; // Sin errores
  };
  
  

  const popupRef = useRef<HTMLDivElement | null>(null); // Referencia para el contenedor

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validar los datos del formulario
    const validationError = validateFormData();
    if (validationError) {
      setError(validationError);
      return; // Detener la ejecución si hay un error
    }
  
    try {
      // Formatear la fecha a "YYYY-MM-DD"
      const dateOnly = new Date(formData.estimatedDate)
        .toISOString()
        .split('T')[0];
  
      const formattedData = {
        ...formData,
        estimatedDate: dateOnly,
      };
  
      // Enviar la solicitud de actualización
      const response = await fetch(`https://web-fe-react-prj3-api-lebw.onrender.com/opportunities/${opportunity.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la oportunidad');
      }
  
      // Actualizar la oportunidad en la interfaz de usuario
      const updatedOpportunity = {
        ...formData,
        estimatedDate: new Date(dateOnly),
      };
  
      // Llamar al callback para actualizar el estado en el componente principal
      onUpdate(updatedOpportunity);
  
      // Cerrar el modal después de la actualización
      onClose();
      window.location.reload();
  
    } catch (error) {
      console.error('Error al actualizar la oportunidad:', error);
      setError('No se pudo actualizar la oportunidad. Inténtalo de nuevo.');
  
      // Desplazar al inicio del modal en caso de error
      setTimeout(() => {
        if (popupRef.current) {
          popupRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 500); // Retraso de 0.5 segundos
    }
  };
  
  
  

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div ref={popupRef} className="bg-white p-8 rounded-xl shadow-2xl w-[800px] max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out 
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-track]:rounded-lg
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:rounded-lg
        [&::-webkit-scrollbar-thumb]:hover:bg-gray-400
        [&::-webkit-scrollbar-thumb]:transition-colors
        [&::-webkit-scrollbar]:hover:w-2.5">
        
        <div className="flex items-center justify-between mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Actualizar Oportunidad
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center animate-shake">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-12 gap-6">
            {/* Información del Negocio */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  Línea de Negocio
                </label>
                <select
                  name="businessLine"
                  value={formData.businessLine}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                >
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="Outsourcing recursos">Outsourcing recursos</option>
                  <option value="Desarrollo web">Desarrollo web</option>
                  <option value="Desarrollo mobile">Desarrollo mobile</option>
                  <option value="Consultoría TI">Consultoría TI</option>
                </select>
              </div>

            </div>

            {/* Información Financiera y Fechas */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  Valor Estimado
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  Fecha Estimada
                </label>
                <input
                  type="date"
                  name="estimatedDate"
                  value={new Date(formData.estimatedDate).toISOString().split('T')[0]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                />
              </div>
            </div>

            {/* Estado - Ancho completo */}
            <div className="col-span-12 group">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Estado
              </label>
              <div className="relative flex items-center justify-between w-full">
                {/* Línea de conexión */}
                <div className="absolute h-1 bg-gray-200 left-0 right-0 top-1/2 -translate-y-1/2 z-0" />
                
                {/* Botones de estado */}
                <div className="relative z-10 flex justify-between w-full">
                  {statusOrder.map((status, index) => {
                    const isCurrentStatus = status === formData.status;
                    const currentIndex = statusOrder.indexOf(formData.status);
                    const isNextStatus = index === currentIndex + 1;
                    const isPastStatus = index < currentIndex;
                    const isDisabled = !isCurrentStatus && !isNextStatus;

                    return (
                      <button
                        key={status}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            setFormData(prev => ({ ...prev, status }));
                          }
                        }}
                        className={`
                          ${getStatusStyle(status, isPastStatus)}
                          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-offset-2 cursor-pointer'}
                          ${isCurrentStatus ? 'ring-2 ring-offset-2' : ''}
                          px-4 py-2 rounded-full font-medium transition-all duration-200
                          flex items-center gap-2
                        `}
                      >
                        {/* Indicador de estado completado */}
                        {isPastStatus && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        )}
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Descripción - Ancho completo */}
            <div className="col-span-12 group">
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg text-white ${
                isError ? "bg-red-600" : "bg-blue-600"
              }`}
            >
              {isError ? "Error" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOpportunity;

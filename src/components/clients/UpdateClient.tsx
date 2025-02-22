import { useState, useRef  } from 'react';

interface Opportunity {
  id: number;
  name: string;
}

interface ContactType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Client {
  id: number;
  nit: string;
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  active: boolean;
  opportunities?: Opportunity[];
  contacts: ContactType[];
}

interface UpdateClientProps {
  client: Client;
  onClose: () => void;
  onUpdate: (updatedClient: Client) => void;
}

const UpdateClient: React.FC<UpdateClientProps> = ({ client, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<Client>(client);
  const [error, setError] = useState<string | null>(null);
  const [selectedContactIndex, setSelectedContactIndex] = useState<number | null>(null);
  const [contactFormData, setContactFormData] = useState<ContactType | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const validationError = validateFormData();
    if (validationError) {
      setError(validationError);
      return; // Detener la ejecución si hay un error
    }
  
    try {
      // Cambiar el método a PUT para actualizar el cliente
      const response = await fetch(`https://web-fe-react-prj3-api-lebw.onrender.com/clients/${client.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el cliente');
      }
  
      // Si la actualización fue exitosa
      onUpdate(formData); // Actualiza el cliente en ClientsTable
      onClose();          // Cierra el modal
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      setError('No se pudo actualizar el cliente. Inténtalo de nuevo.');
      // Desplazarse al inicio del modal si hay error
      setTimeout(() => {
        if (popupRef.current) {
          popupRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 500); // Retraso de 0.5 segundos
    }
  };
  

  const handleContactSelect = (index: number) => {
    setSelectedContactIndex(index);
    setContactFormData(formData.contacts[index]);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleContactUpdate = () => {
    if (selectedContactIndex !== null && contactFormData) {
      const newContacts = [...formData.contacts];
      newContacts[selectedContactIndex] = contactFormData;
      setFormData(prev => ({ ...prev, contacts: newContacts }));
      setSelectedContactIndex(null);
      setContactFormData(null);
    }
  };

  const validateFormData = () => {
    const requiredFields = ['nit', 'name', 'email', 'phone', 'city', 'country', 'address'];
    for (const field of requiredFields) {
      const value = formData[field as keyof Client];
      if (typeof value !== 'string' || !value.trim()) {
        setError("Por favor completa todos los campos obligatorios.");
        triggerError(); // Cambia el estado de error
        return "Por favor completa todos los campos obligatorios."; // Retorna un mensaje explícito
      }
    }
    return null; // Sin errores
  };
  

  
  const popupRef = useRef<HTMLDivElement | null>(null); // Referencia para el contenedor
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
            Actualizar Cliente
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
            {/* Información Principal */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  NIT
                </label>
                <input
                  type="number"
                  name="nit"
                  value={formData.nit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                />
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                  País
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                />
              </div>
            </div>

            {/* Dirección - Ancho completo */}
            <div className="col-span-12 group">
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                Dirección Completa
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
              />
            </div>

            {/* Sección de Contactos */}
            <div className="col-span-12 space-y-6 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Contactos</h3>
              <div className="grid grid-cols-12 gap-6">
                {/* Selector de contactos */}
                <div className="col-span-12">
                  <select 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    onChange={(e) => handleContactSelect(parseInt(e.target.value))}
                    value={selectedContactIndex ?? ''}
                  >
                    <option value="">Seleccionar contacto</option>
                    {formData.contacts.map((contact, index) => (
                      <option key={index} value={index}>
                        {contact.firstName} {contact.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Formulario de contactos */}
                {contactFormData && (
                  <div ref={popupRef} className="col-span-12 grid grid-cols-12 gap-6">
                    {/* Nombre */}
                    <div className="col-span-12 md:col-span-6 group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={contactFormData.firstName}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                      />
                    </div>

                    {/* Apellido */}
                    <div className="col-span-12 md:col-span-6 group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={contactFormData.lastName}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                      />
                    </div>

                    {/* Email */}
                    <div className="col-span-12 md:col-span-6 group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={contactFormData.email}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="col-span-12 md:col-span-6 group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 transition-all group-focus-within:text-blue-600">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={contactFormData.phone}
                        onChange={handleContactChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out placeholder-gray-400 group-hover:border-gray-400"
                      />
                    </div>

                    {/* Botón de actualizar */}
                    <div className="col-span-12">
                      <button
                        type="button"
                        onClick={handleContactUpdate}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Actualizar Contacto
                      </button>
                    </div>
                  </div>
                )}
              </div>
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

export default UpdateClient;

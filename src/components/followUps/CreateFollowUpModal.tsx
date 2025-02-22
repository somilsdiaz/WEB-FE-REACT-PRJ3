import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
} from '@mui/material';

interface Opportunity {
    id: string;
    businessName: string;
    businessLine: string;
    description: string;
    estimatedValue: number;
    estimatedDate: string;
    status: string;
}

interface CreateFollowUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const CreateFollowUpModal: React.FC<CreateFollowUpModalProps> = ({ isOpen, onClose, onUpdate }) => {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState('');
    const [contactType, setContactType] = useState('');
    const [contactDate, setContactDate] = useState('');
    const [description, setDescription] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [clientFirstName, setClientFirstName] = useState('');
    const [clientLastName, setClientLastName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [salesExecutive, setSalesExecutive] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('https://web-fe-react-prj3-api-lebw.onrender.com/opportunities')
            .then((response) => response.json())
            .then((data: Opportunity[]) => setOpportunities(data));
    }, []);


    const handleSubmit = () => {
        // Validar que todos los campos estén llenos
        if (
            !selectedOpportunity ||
            !contactType ||
            !contactDate ||
            !clientFirstName ||
            !clientLastName ||
            !clientEmail ||
            !clientPhone ||
            !salesExecutive ||
            !description
        ) {
            setError('Por favor, completa todos los campos obligatorios.');
            return;
        }
    
        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(clientEmail)) {
            setError('El correo electrónico no es válido.');
            return;
        }
        setError(''); // Resetea el error si todos los campos están completos

        const newActivity = {
            id: Math.random().toString(36).substring(7), // Generar un ID único temporal
            contactType,
            contactDate,
            clientContact: {
                firstName: clientFirstName,
                lastName: clientLastName,
                email: clientEmail,
                phone: clientPhone,
            },
            salesExecutive,
            description,
            additionalNotes,
        };

        const followUpData = {
            id: Math.random().toString(36).substring(7), // Generar un ID único para el seguimiento
            opportunityId: selectedOpportunity,
            followUpActivities: [newActivity],
        };

        fetch('https://web-fe-react-prj3-api-lebw.onrender.com/follow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(followUpData),
        })
            .then((response) => response.json())
            .then(() => {
                onUpdate(); // Actualiza la tabla
                onClose();
            })
            .catch((error) => {
                console.error('Error al crear seguimiento:', error);
            });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Crear Seguimiento</DialogTitle>
            <DialogContent>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <TextField
                    select
                    fullWidth
                    label="Selecciona una Oportunidad"
                    required
                    value={selectedOpportunity}
                    onChange={(e) => setSelectedOpportunity(e.target.value)}
                    margin="normal"
                >
                    {opportunities.map((opportunity) => (
                        <MenuItem key={opportunity.id} value={opportunity.id}>
                            {opportunity.businessName}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    fullWidth
                    required
                    label="Tipo de Contacto"
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    margin="normal"
                >
                    {['Llamada', 'Correo', 'Reunión presencial'].map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    fullWidth
                    label="Fecha de Contacto"
                    type="date"
                    value={contactDate}
                    onChange={(e) => setContactDate(e.target.value)}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    fullWidth
                    label="Nombre del Cliente"
                    value={clientFirstName}
                    onChange={(e) => setClientFirstName(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Apellido del Cliente"
                    value={clientLastName}
                    onChange={(e) => setClientLastName(e.target.value)}
                    margin="normal"
                    required
                />
              <TextField
                fullWidth
                type="email"
                label="Correo del Cliente"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                margin="normal"
                required
                helperText="Por favor, ingresa un correo válido."
              />
                <TextField
                    fullWidth
                    label="Teléfono del Cliente"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    margin="normal"
                    required

                />
                <TextField
                    fullWidth
                    label="Ejecutivo de Ventas"
                    value={salesExecutive}
                    onChange={(e) => setSalesExecutive(e.target.value)}
                    margin="normal"
                    required

                />
                <TextField
                    fullWidth
                    label="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                    multiline
                    rows={3}
                    required

                />
                <TextField
                    fullWidth
                    label="Notas Adicionales"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    margin="normal"
                    multiline
                    rows={2}
                />
            </DialogContent>
            <DialogActions>
            <div className="flex justify-end space-x-4 py-2 mr-8">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md shadow hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py- text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Crear
                </button>
            </div>

            </DialogActions>
        </Dialog>
    );
};

export default CreateFollowUpModal;

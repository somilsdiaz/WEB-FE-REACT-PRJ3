import React, { useState } from "react";
import { TextField, Button, Grid, MenuItem } from "@mui/material";

interface CreateFollowUpFormProps {
    onClose: () => void;
}

const CreateFollowUpForm: React.FC<CreateFollowUpFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        opportunityId: "",
        contactType: "",
        contactDate: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        salesExecutive: "",
        description: "",
        additionalNotes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("https://web-fe-react-prj3-api-lebw.onrender.com/follow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Seguimiento creado con éxito.");
                onClose();
            } else {
                alert("Error al crear seguimiento.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un problema al enviar los datos.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="ID de la Oportunidad"
                        name="opportunityId"
                        value={formData.opportunityId}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        select
                        fullWidth
                        label="Tipo de Contacto"
                        name="contactType"
                        value={formData.contactType}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="Llamada">Llamada</MenuItem>
                        <MenuItem value="Correo">Correo</MenuItem>
                        <MenuItem value="Reunión presencial">Reunión presencial</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Fecha del Contacto"
                        name="contactDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.contactDate}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Nombre del Cliente"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Apellido del Cliente"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email del Cliente"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Teléfono del Cliente"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Ejecutivo de Ventas"
                        name="salesExecutive"
                        value={formData.salesExecutive}
                        onChange={handleChange}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Descripción del Contacto"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Notas Adicionales"
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        multiline
                        rows={3}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Guardar Seguimiento
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default CreateFollowUpForm;

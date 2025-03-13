

import React, { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Card,
  CardMedia,
  Grid
} from '@mui/material';
import { styled } from '@mui/system';
import { Delete } from '@mui/icons-material';
import axios from 'axios';
import Template1 from "../assets/c2.png";
import Template2 from "../assets/c1.png";
import Template3 from "../assets/c3.png";
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import CloseIcon from "@mui/icons-material/Close";


const Background = styled(Box)({
  backgroundImage: 'url(https://cdn.pixabay.com/photo/2017/11/24/10/43/ticket-2974645_1280.jpg)',
  backgroundSize: 'cover',
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const FormContainer = styled(Box)({
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: '8px',
  padding: '20px',
  maxWidth: '600px',
  width: '100%',
});

const EventForm = () => {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('eventForm');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      venue: '',
      address: '',
      desc: '',
      vipPrice: '',
      vipSize: '',
      economySize: '',
      economyPrice: '',
      currency: '',
      photo: null,
      eventDate: '',
      eventDate2: '',
      category: '',
      paymentMethod: '',
    };
  });
  const [gallery, setGallery] = useState([]);
// Save to localStorage on change
useEffect(() => {
  localStorage.setItem('eventForm', JSON.stringify(formData));
}, [formData]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGalleryAdd = () => {
    setGallery([...gallery, { id: Date.now(), file: null }]);
  };

  const handleGalleryFileChange = (e, id) => {
    const updatedGallery = gallery.map((item) =>
      item.id === id ? { ...item, file: e.target.files[0] } : item
    );
    setGallery(updatedGallery);
  };
  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };
  const handleGalleryDelete = (id) => {
    setGallery(gallery.filter((item) => item.id !== id));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowTemplates(true);
  
   
  };
  
  const handleTemplateSelection =    (template) => {
   

    // Close the modal and navigate to the seat map with selected template
    setShowTemplates(false);
    navigate('/template', { state: { template, formData, gallery } });


 
  };
  



  return (
    <Background>

   {isLoading && (
            
                          <LoadingScreen  />
                       
                      )}
      <FormContainer sx={{ marginTop: 17, marginBottom: 10 }}>
        <Typography variant="h4" align="center" sx={{ marginBottom: 3 }}>
        Crear evento

        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px',
              "& .MuiInputBase-input": {
                textTransform: "none"
              } 
            }}
            inputProps={{
              style: { textTransform: "none" },
              autoCapitalize: "none"
            }}
            InputProps={{
              style: { fontSize: '16px' },
              autoCapitalize: "none",
            }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Evento"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px',
              "& .MuiInputBase-input": {
                textTransform: "none"
              } 
            }}
            inputProps={{
              style: { textTransform: "none" },
              autoCapitalize: "none"
            }}
            InputProps={{
              style: { fontSize: '16px' },
              autoCapitalize: "none",
            }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px',
              "& .MuiInputBase-input": {
                textTransform: "none"
              } 
            }}
            inputProps={{
              style: { textTransform: "none" },
              autoCapitalize: "none"
            }}
            InputProps={{
              style: { fontSize: '16px' },
              autoCapitalize: "none",
            }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            name="desc"
            value={formData.desc}
            onChange={(e) => {
              const value = e.target.value;
              // Mantiene el valor original sin capitalización automática
              setFormData({ ...formData, desc: value });
            }}
            required
            multiline
            rows={4}
            sx={{ fontSize: '16px', 
              "& .MuiInputBase-input": {
                textTransform: "none"
              } 
            }}
            inputProps={{
              style: { textTransform: "none" },
              autoCapitalize: "none"
            }}
            InputProps={{
              style: { fontSize: '16px' },
              autoCapitalize: "none",
            }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Precio VIP"
            name="vipPrice"
            type="number"
            value={formData.vipPrice}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Asientos VIP"
            name="vipSize"
            type="number"
            value={formData.vipSize}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Asientos económicos"
            name="economySize"
            type="number"
            value={formData.economySize}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Precio económico"
            name="economyPrice"
            type="number"
            value={formData.economyPrice}
            onChange={handleChange}
            required
            sx={{ fontSize: '16px' }}
            InputLabelProps={{ style: { fontSize: '18px' } }}
          />

<FormControl fullWidth margin="normal">
  <InputLabel style={{ fontSize: '16px' }}>Divisa</InputLabel>
  <Select
    name="currency"
    value={formData.currency || ''}
    onChange={handleChange}
    style={{ fontSize: '16px' }}
    required
  >
    <MenuItem value="USD">USD</MenuItem>
    <MenuItem value="EUR">EUR</MenuItem>
    {/* <MenuItem value="PKR">PKR</MenuItem> */}
    <MenuItem value="INR">INR</MenuItem>
    <MenuItem value="GBP">GBP</MenuItem>
  </Select>
</FormControl>
          {/* <labe></labe> */}
          <Typography mt={2} sx={{ fontSize: '18px', fontWeight: 600}}>Fecha y hora del evento
          </Typography>
          {/* <TextField
            fullWidth
            margin="normal"
            // label="Event Date & Time"
            name="eventDate"
            type="datetime-local"
            value={formData.eventDate}
            onChange={handleChange}
            required
          /> */}

<Grid container spacing={2} mt={1}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Día 1"
            name="eventDate"
            type="datetime-local"
            value={formData.eventDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true,     sx: { fontSize: "13px", fontWeight: "bold"  }, // Increase font size
          }}

            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            margin="normal"
            label="Día 2 (Opcional)"
            name="eventDate2"
            type="datetime-local"
            value={formData.eventDate2}
            onChange={handleChange}
            InputLabelProps={{ shrink: true,     sx: { fontSize: "13px", fontWeight: "bold" }, // Increase font size
          }}
          />
        </Grid>
      </Grid>


          <FormControl fullWidth margin="normal">
            <Typography variant="body1" sx={{ fontSize: '18px', fontWeight: 600 }}>
            Categoría

            </Typography>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            > 
              <MenuItem value="Música">Música</MenuItem>
              <MenuItem value="Deportes">Sports</MenuItem>
              <MenuItem value="Conferencia">Conferencia
              </MenuItem>

              <MenuItem value="Taller">Tecnología</MenuItem>
              <MenuItem value="Teatro">Teatro
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl component="fieldset" margin="normal">
            <Typography variant="body1" sx={{ fontSize: '18px', marginBottom: 1 , fontWeight: 600}}>
            Método de pago de entradas

            </Typography>
            <RadioGroup
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              row
            >
              <FormControlLabel
  value="Online"
  control={<Radio sx={{ transform: 'scale(1.5)' }} />} // Scales the size of the radio button
  label={
    <Typography sx={{ fontSize: '1.25rem' }}>Pago en línea
</Typography> // Increases label size
  }
/>
<FormControlLabel
  value="Walk-in"
  control={<Radio sx={{ transform: 'scale(1.5)' }} />}
  label={
    <Typography sx={{ fontSize: '1.25rem' }}>Pago sin cita previa
</Typography>
  }
/>
            </RadioGroup>
          </FormControl>


                   <Button
            variant="contained"
            component="label"
            fullWidth
            margin="normal"
            sx={{background: 'orangered'}}
          >
           + Subir foto de banner

            <input
              type="file"
              accept="image/*" // Restricts selection to image files

              hidden
              onChange={handleFileChange}
            />
          </Button>
          {formData.photo && ( 
            <Box>
              <Typography variant="body2">
                {formData.photo.name}
                <Button onClick={() => setFormData({ ...formData, photo: null })} sx={{color: 'red', fontWeight:'bold'}}>
                Eliminar

                </Button>
              </Typography>
            </Box>
          )}
          <Box margin="normal" mt={3}>
            <Typography variant="body1" sx={{ fontSize: '18px', marginBottom: 1, fontWeight: 600 }}>
            Subir galería

            </Typography>
            {gallery.map((item) => (
              <Box key={item.id} display="flex" alignItems="center" marginBottom={1}>
                <input
                  type="file"
                  accept="image/*" // Restricts selection to image files

                  onChange={(e) => handleGalleryFileChange(e, item.id)}
                  style={{ fontSize: '20px', marginRight: '10px' }}
                />
                <IconButton onClick={() => handleGalleryDelete(item.id)} color="error">
                  <Delete sx={{fontSize: 25}}/>
                </IconButton>
              </Box>
            ))}
            <Button onClick={handleGalleryAdd} variant="contained" sx={{ marginTop: 1 }}>
              + Agregar archivos de galería

            </Button>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 3, fontSize: '16px' }}
          >
            Crear evento

          </Button>
        </form>
      </FormContainer>
      {showTemplates && (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      bgcolor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }}
  >
    <Box
      sx={{
        background: "#fff",
        padding: 4,
        borderRadius: 2,
        textAlign: "center",
        width: "500px",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: 3,
        position: "relative", // Needed for absolute positioning
        "@media (min-width: 1024px)": {
          width: 900,
        },
      }}
    >
      {/* Close (X) Icon */}
      <IconButton
        onClick={() => setShowTemplates(false)}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "#333",
          "&:hover": { color: "red" },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Seleccione una plantilla
      </Typography>

      {/* Scrollable Template Container */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center",
        }}
      >
        {/* Template Cards */}
        {[
          { image: Template1, label: "Plantilla 1", id: "template1" },
          { image: Template2, label: "Plantilla 2", id: "template2" },
          { image: Template3, label: "Plantilla 3", id: "template3" },
        ].map((template, index) => (
          <Card
            key={index}
            sx={{
              width: 450,
              height: 250,
              border: "2px solid transparent",
              borderRadius: 2,
              transition: "all 0.3s ease",
              position: "relative", // Needed for absolute positioning
              cursor: "pointer",
              "&:hover, &:focus": {
                border: "2px solid #007bff",
                transform: "scale(1.1)",
              },
            }}
            onClick={() => handleTemplateSelection(template.id)}
          >
            {/* Label on Top */}
            <Box
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "rgba(0, 0, 0, 0.6)",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "5px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              {template.label}
            </Box>

            {/* Template Image */}
            <CardMedia
              component="img"
              image={template.image}
              alt={template.label}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: 1,
              }}
            />
          </Card>
        ))}
      </Box>
    </Box>
  </Box>
)}

    </Background>
  );
};

export default EventForm;

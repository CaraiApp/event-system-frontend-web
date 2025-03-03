import React from "react";
import { Box, Typography, TextField, Button, Grid, Container } from "@mui/material";

const ContactUs = () => {
  return (
    <Container maxWidth="md" sx={{ padding: "2rem 0", marginTop: 10, padding: "20px 30px" }}>
    <Typography variant="h4" gutterBottom style={{ fontSize: 24, fontWeight: 'bold', textDecoration :'underline'}}>
    Contáctanos
    </Typography>
    <Typography variant="body1" paragraph style={{ fontSize: 20 }}>
    ¿Tienes una pregunta o necesitas ayuda para planificar tu próximo gran evento? ¡Estamos aquí para ayudarte!
    </Typography>
    <Box mt={3} mb={5}>
    <Typography variant="h6" gutterBottom style={{ fontSize: 22 }}>
    Detalles de contacto
    </Typography>
    <Typography variant="body1" style={{ fontSize: 18 }}>
    📍 Dirección: Tu dirección de oficina
    </Typography>
    <Typography variant="body1" style={{ fontSize: 18 }}>
    📞 Teléfono: Tu número de teléfono
    </Typography>
    <Typography variant="body1" style={{ fontSize: 18 }}>
      📧 Correo electrónico: Tu dirección de correo electrónico
    </Typography>
    <Typography variant="body1" style={{ fontSize: 18 }}>
      🌐 Sitio web: Tu URL del sitio web
    </Typography>
    
    </Box>
    <Typography variant="h6" gutterBottom style={{ fontSize: 22 }}>
    Envíanos un mensaje
    </Typography>
    <form>
    <Grid container spacing={2}>
    <Grid item xs={12} sm={6}>
    <TextField fullWidth label="Nombre" variant="outlined" required style={{ fontSize: 18 }} />
    </Grid>
    <Grid item xs={12} sm={6}>
    <TextField fullWidth label="Correo electrónico" variant="outlined" required style={{ fontSize: 18 }} />
    </Grid>
    <Grid item xs={12}>
    <TextField fullWidth label="Mensaje" multiline rows={4} variant="outlined" required style={{ fontSize: 18 }} />
    </Grid>
    <Grid item xs={12}>
    <Button variant="contained" color="primary" type="submit" fullWidth style={{ fontSize: 18 }}>
    Enviar
    </Button>
    </Grid>
    </Grid>
    </form>
    </Container>
  );
};

export default ContactUs;

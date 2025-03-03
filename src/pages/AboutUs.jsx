import React from "react";
import { Box, Typography, Grid, Container } from "@mui/material";

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: "2rem 0",marginTop: 10, padding: "20px 30px"}}>

    <Typography variant="h4" gutterBottom style={{ fontSize:20, fontWeight: 'bold', textDecoration: 'underline' }}>
    Acerca de nosotros
    </Typography>
    
    <Typography variant="body1" paragraph style={{ fontSize:20 }}>
    Bienvenido a <strong>Entradas Melilla</strong>, su socio de confianza para crear eventos inolvidables y experiencias sin complicaciones.
    </Typography>
    
    <Typography variant="body1" paragraph style={{ fontSize:20 }}>
    Con una pasión por la innovación y un compromiso con la excelencia, nos especializamos en planificar y gestionar todo tipo de eventos, desde conferencias corporativas y exposiciones hasta bodas, fiestas y celebraciones especiales. Nuestro equipo de profesionales dedicados trabaja incansablemente para transformar su visión en realidad.
    </Typography>
    
    <Typography variant="body1" paragraph style={{ fontSize:20 }}>
    En <strong>Entradas Melilla</strong>, nos enorgullecemos de construir relaciones duraderas con nuestros clientes y hacer que cada ocasión sea verdaderamente inolvidable.
    </Typography>
    
    <Box mt={4}>
    
    <Typography variant="h5" gutterBottom style={{ fontSize:20 }}>
      Nuestros servicios incluyen:
    </Typography>
    
    <Grid container spacing={2}>
    
      {[
        "Eventos corporativos",
        "Exposiciones y ferias comerciales",
        "Conferencias y seminarios",
        "Lanzamientos de productos",
      ].map((service, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
    
          <Typography variant="body1" style={{ fontSize:20 }}>
            • {service}
          </Typography>
    
        </Grid>
      ))}
    
    </Grid>
    
    </Box>
    
    </Container>
  );
};

export default AboutUs;

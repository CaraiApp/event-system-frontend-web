import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Event, People, LaptopMac, LocationOn, EventAvailable } from '@mui/icons-material';
import './EventCategories.css';

const ImageContentSection = () => {
  const cards = [
    {
      icon: <Event style={{ fontSize: '40px', color: '#3795d6' }} />,
      title: 'Evento en el sitio',
    },
    {
      icon: <LocationOn  style={{ fontSize: '40px', color: '#3795d6' }} />,
      title: 'Gestión del lugar',
    },
    {
      icon: <EventAvailable  style={{ fontSize: '40px', color: '#3795d6' }} />,
      title: 'Coordinación de Eventos',
    },
  ];

  return (
    <div className="image-content-section" style={{marginTop:25}}>
     
      {/* <div className="image-section">
        <img
          src={imgeType}
          alt="Event Planning"
          className="left-image"
        />
      </div> */}

      <div className="content-section">
        {/* <h2 style={{color: '#3795d6'}}>Our Event Types</h2> */}
        <div className="card-container">
          {cards.map((card, index) => (
            <Card
              key={index}
              className="event-card"
              sx={{
                cursor: 'pointer',
                // backgroundColor: '#D6375D',
                border: '2px dashed #2A2A35',
                color: '#fff',
                // '&:hover': {
                //   backgroundColor: '#ff2d5f',
                // },
              }}
            >
              <CardContent className="card-content">
                <div className="icon">{card.icon}</div>
                <Typography variant="h6" className="card-title" style={{color: '#2A2A35'}}>
                  {card.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageContentSection;

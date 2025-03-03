import React from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import './Videoslider.css';

const Slide = ({ title, description, videoSrc, active }) => {
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleNavigate = () => {
    navigate('/events'); // Programmatically navigate
  };

  return (
    <div className={`video-slider__slide ${active ? 'active' : ''}`}>
      <div className="content">
        <h3>{title}</h3>
        <p>{description}</p>
        {/* <Button
          style={{ background: '#3795d6' }}
          className="btn primary__btn"
          onClick={handleNavigate}
        >
          Más información
        </Button> */}
      </div>
      <video src={videoSrc} muted autoPlay loop></video>
    </div>
  );
};

export default Slide;

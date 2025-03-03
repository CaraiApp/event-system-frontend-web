import React from 'react'
import { BsCheckCircle } from "react-icons/bs";
import './Services.css'

import img2 from '../../assetsHome/images/ServicesImage2.jpg' 


const servicesData = [
  {title: "Equipo experto y talentoso"},
  {title: "Experiencia en Eventos Diversos"},
  {title: "Opciones económicas"},
  {title: "Amplia red de proveedores"},
  {title: "Planificación sin estrés"},
  {title: "Experiencia en Eventos Diversos"},
  {title: "Servicio personalizado"},
  {title: "Experiencias inolvidables"},
]

const Services = () => {
  return (
    <>
   
    <div className="services-section">
     
    <div className="left">
      <img className="col2 row2" src="https://cdn.pixabay.com/photo/2019/04/13/22/50/concert-4125832_1280.jpg" alt="Expert Team" />
      <img src="https://cdn.pixabay.com/photo/2019/05/17/07/43/cinema-4209087_960_720.jpg" alt="Event Expertise" />
      <img src="https://cdn.pixabay.com/photo/2016/12/28/20/30/wedding-1937022_1280.jpg" alt="Budget-Friendly" />
      <img src={img2} alt="Vendor Network" />
      <img src="https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_1280.jpg" alt="Stress-Free Planning" />
    </div>
    
    <div className="right">
      {/* <h1 style={{fontSize: 20, fontWeight: 'bold'}}>Why Choose Us</h1> */}

      {servicesData.map((item, index) => (
        <div className="right-container" key={index}>
          <i><BsCheckCircle /></i>
          <div className="right-container__point">{item.title}</div>
        </div>
      ))}
    </div>
  </div>
  </>
  
  )
}

export default Services
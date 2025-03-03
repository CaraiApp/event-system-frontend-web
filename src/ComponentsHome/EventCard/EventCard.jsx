
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EventCard.css";
import { RiStarFill, RiMapPinLine } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { Category } from "@mui/icons-material";

const EventCard = ({ event, onPublish, onFeature, onDelete, onUpdate }) => {
  const {
    _id,
    name,
    venue,
    address,
    photo,

    currency,

category,
    vipprice,
    economyprice,
    featured,
    published,
    owner,
    ticket
  } = event;

  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");
 
  return (
    <div className="card" >
      <div className="event__img">
        <img
          src={
            photo ||
            "https://cdn.pixabay.com/photo/2021/01/01/12/44/concert-5878452_960_720.jpg"
          }
          alt="event-img"
        />
        {ticket === "Walk-in" &&  <span style={{ background: "#D6375D" }}>Sin cita previa</span>}
        {featured &&  <span style={{ background: "#D6375D" }}>Presentada</span>}
        {!published && userRole !== "user" &&  ticket !== "Walk-in" && <span style={{ background: "yellow",  color: "black", fontWeight: "bold" }}>Pendiente</span>}
        
        
      </div>

      <div className="card-body" style={{ marginTop: 5 }}>
        <div className="card__top">
          <span className="event__rating">
            <i>
              <RiStarFill />
            </i>{" "}
            <i>
              <RiStarFill />
            </i>{" "}
            <i>
              <RiStarFill />
            </i>{" "}
            <i>
              <RiStarFill />
            </i>
          </span>

          <h5 className="event__title">
            <Link to={`/events/${_id}`}>{name}</Link>
          </h5>

          <span
            className="event__location"
            style={{ display: "flex", flexDirection: "column" }}
          >
           <div className="venue-category" style={{ display: "flex", alignItems: "center", gap:10 }}>
  {/* Venue */}
  <div style={{ display: "flex", alignItems: "center" }}>
    <i style={{ marginRight: "5px", color: "#555" }}>
      <RiMapPinLine />
    </i>
    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px", color: "#333", fontWeight: "500" }}>
    {venue.length > 18 ? `${venue.slice(0, 18)}...` : venue}
    </span>
  </div>
  
  {/* Category */}
  {category && (
    <div style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
    <i style={{ marginRight: "5px", color: "#555" }}>
      <Category />
    </i>
    <span style={{ color: "#333", fontWeight: "500" }}>
      {category}
    </span>
  </div>
  )}
  
</div>

            <div className="address" style={{ marginTop: "5px" }}>
              {address}
            </div>
          </span>
          <div className="event__status" style={{ marginTop: 10, display: "flex", gap: "10px", flexDirection: 'row', alignItems: 'center' }}>
          {published && userRole !== "user" && ticket !== "Walk-in" && (
            <span style={{ color: "green", fontWeight: "bold" }}>
              <FaCheckCircle style={{ marginRight: 5 }} /> Publicada
            </span>
          )}
          {userRole === "admin" && (
                     <p style={{ fontWeight: "bold", marginTop: 10 }}>Organizadora: {owner?.username}</p>

          )}
        </div>
        </div>

        {/* Event Status Labels */}
      

        <div className="card__bottom">
          <h5>
          Personaje:  {vipprice} {currency}
            <span> /por persona
            </span>
          </h5>
          <h5>
          Economía:  {economyprice} {currency}
            <span> /por persona
            </span>
          </h5>

          {/* Organizer Name */}
          

         
        </div>
         {/* Admin Action Buttons */}
         {userRole === "admin" &&  ticket !== "Walk-in" && (
            <div style={{ marginTop: 10, display: "flex", gap: "6px", flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start', padding:10 }}>
              {!published && (
                <Button  onClick={onPublish} style={{background: 'white', color: '#D6375D', textDecoration: 'underline', fontWeight: 'bold', fontSize: 12}}>
                  Publicar
                </Button>
              )}
              {published && !featured && (
                <Button  onClick={onFeature} style={{background: 'white', color: '#D6375D', textDecoration: 'underline', fontWeight: 'bold', fontSize: 12}}>
                  Característica

                </Button>
              )}
              <Button  onClick={onDelete}  style={{background: 'white', color: '#D6375D', textDecoration: 'underline', fontWeight: 'bold', fontSize: 12}}>
              Borrar
              </Button>
              <Button  onClick={onUpdate}  style={{background: 'white', color: '#D6375D', textDecoration: 'underline', fontWeight: 'bold', fontSize: 12}}>
              Editar

              </Button>
              
            </div>
          )}
 
<div className="card__bottom" style={{display:'flex', justifyContent: 'flex-end'}}>
                  
                    <button className="btn booking__btn" style={{background: '#3795d6', color: 'white'}}
                    
                    onClick={ () => {
                      navigate(`/event-detail/${_id}`);
                      
                      setTimeout(() => {
                        window.location.reload();
                      }, 0); 
                    }}>
                        {/* <Link to={`/event-detail/${_id}`}>  */}
                       {userRole === "user" ? 'Reserva ahora' : 'Ver detalle'} 
                        {/* </Link> */}

                    </button>
                </div>
      
 
  
  </div>
    </div>
  );
};

export default EventCard;
import React from 'react'
import './EventTypes.css'
import { GiLinkedRings, GiPartyFlags, GiBookCover, GiNetworkBars } from "react-icons/gi";

const iconsdata = [
    {
        icon: GiPartyFlags,
        title: "Entretenimiento",
    },
    {
        icon: GiLinkedRings,
        title: "Social",
    },
    {
        icon: GiBookCover,
        title: "Educativa",
    },
    {
        icon: GiNetworkBars,
        title: "Conferencias",
    }
]

const EventTypes = () => {
  return (
    <div className="event-types-section">
        {iconsdata.map((item, index)=>(
            <div className="event-types-section__icons" key={index}>
                <i>{<item.icon/>}</i>
                <h2>{item.title}</h2>
            </div>
        ))}
    </div>
  )
}

export default EventTypes

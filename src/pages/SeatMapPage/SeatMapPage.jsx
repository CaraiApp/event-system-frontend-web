
import { useLocation, useNavigate } from "react-router-dom";
import './SeatMapModal.css';
import Template1 from "../SeatMapFinal/Template1/Template1User";
import Template2 from "../SeatMapFinal/Template2/Template2User";
import Template3 from "../SeatMapFinal/Template3/Template1User";
import { useEffect } from "react";


const SeatMapModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { event, selectionDate } = location.state;
    useEffect(() => {
      // Scroll to the top of the page when the component mounts
      window.scrollTo(0, 0);
    }, []);
  return (
   
      <>
      {/* {event?.template === 'template1' ? 
      <Template1 event={event} /> 
      : 
      <Template2 event={event} /> 

      } */}

{event?.template === 'template1' ? (
  <Template1 event={event} selectionDate={selectionDate}/>
) : event?.template === 'template2' ? (
  <Template2  event={event} selectionDate={selectionDate}/>
) : event?.template === 'template3' ? (
  <Template3 event={event} selectionDate={selectionDate}/>
) : (
  <Template1 event={event} selectionDate={selectionDate}/> // Optional: Handle unexpected cases
)}
      </>
  );
};

export default SeatMapModal;


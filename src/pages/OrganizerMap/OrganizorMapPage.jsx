
import { useLocation, useNavigate } from "react-router-dom";
import './SeatMapModal.css';
import Template1 from "../../pages/SeatMapFinal/Template1/TemplateWithStageImageAndCurveSeat";
import Template2 from "../../pages/SeatMapFinal/Template2/Template2Org";
import Template3 from "../../pages/SeatMapFinal/Template3/TemplateWithStageImageAndCurveSeat";

import { useEffect } from "react";
import { useParams } from "react-router-dom";


const OrganizorMapPage = () => {
  const location = useLocation();
  const { template , formData , gallery} = location.state || {};

    useEffect(() => {
      // Scroll to the top of the page when the component mounts
      window.scrollTo(0, 0);
    }, []);
  return (
   
      <>
     {template === 'template1' ? (
  <Template1 formData={formData} gallery={gallery} template={template}/>
) : template === 'template2' ? (
  <Template2  formData={formData} gallery={gallery} template={template}/>
) : template === 'template3' ? (
  <Template3 formData={formData} gallery={gallery} template={template}/>
) : (
  <Template1 formData={formData} gallery={gallery} template={template}/> // Optional: Handle unexpected cases
)}

      </>
  );
};

export default OrganizorMapPage;


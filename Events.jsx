import React, {useState } from "react"
import EventsForm from "./EventsForm"
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import "./eventsform.css" 


function Events(){

const [show, setShow] = useState(false);
const [data,setData] = useState({
    title: "",
    formData: {  
        eventTypeId : "",     
        name : "",      
        summary :"",     
        shortDescription :"",                  
        venueId :"",     
        eventStatusId :"",                                      
        imageId : "",           
        externalSiteUrl:"",    
        isFree  : "",     
        dateStart  :"",               
        dateEnd  : "" 
}})

const hideModal = () =>{
    setShow(false)
}

const addFormModal = () =>{
    setData({title: ""})
    setShow(true)
}
const updateFormModal = () =>{
    setData({title: "Update",
    formData: {  
        eventTypeId : 1,     
        name : "Updated 1",      
        summary : "Summary 1",     
        shortDescription : "Short Description 1",                  
        venueId : 1,     
        eventStatusId : 1,                                      
        imageId : 1 ,           
        externalSiteUrl: "www.externalSite.com",    
        isFree  : true,     
        dateStart  : "2022-01-01",               
        dateEnd  : "2023-01-01"
    }})
    setShow(true)
}
const navigate = useNavigate();

const cancelBtn =() =>{
    navigate('/')
}

    return(
        <>
        <div className="card" id="events-card-homepage">
        <div className="card-title" id="events-header">
            <h1> Welcome to the events page </h1>
        </div>

            <button type="button" className="btn btn-primary" id="events-btns" onClick={addFormModal}> Add an event </button>
            <button type="button" className="btn btn-primary" id="events-btns" onClick={updateFormModal}> Update an event </button>
            <button type="button" className="btn btn-primary" id="events-btns" onClick={cancelBtn}>    
                        Back home           
                </button>  

        </div>
        <Modal show={show} onHide={hideModal}>
                <EventsForm data={data}/>
        </Modal>
           
        </>
    )      
}
export default Events
 
import React, {useEffect, useState } from "react"
import { Formik, Form, Field ,ErrorMessage} from "formik";
import debug from "sabio-debug";
import PropTypes from "prop-types"
import toastr from "toastr";
import lookUpService from "services/lookUpService";
import { mapLookUpItem } from "helpers/utils";
import eventsFormSchema from "./eventsSchema";
import "./eventsform.css" 
import FileUpload from "components/files/FileUpload";
import eventsService from "services/eventsService";
import venuesService from "services/venuesService";

function EventsForm(props){
        const _logger = debug.extend("EventsForm");  

        const [state, setState] =useState({     
        title: "Add"
        ,   formData: {  
            eventTypeId : "",     
            name : "",                                                             
            summary :"",    
            shortDescription :"",               
            venueId :"",        
            eventStatusId :"",                                      
            imageId : "",           
            externalSiteUrl:"",    
            isFree  :"",         
            dateStart  :"",  
            dateEnd  :"",                         
        }
    })          

    const [eventTypelookupData, setEventTypelookupData] = useState({
        eventTypeData:[],
        eventTypeMapped:[]
    });
    const [eventStatuslookupData, setEventStatuslookupData] = useState({
        eventStatsData:[],
        eventStatusMapped:[]
    });
    const [venueslookupData, setVenueslookupData] = useState({
        venuesData:[],
        venuesMapped:[]
    });

    useEffect(()=>{
        const EventTypesSuccess = (response) =>{
            _logger(response.item.eventTypes, "LookUp success")
            let eventTypeData = response.item.eventTypes;

            setEventTypelookupData((prevState)=>{
                const newState = {...prevState};
                newState.eventTypeData = eventTypeData;
                newState.eventTypeMapped = eventTypeData.map(mapLookUpItem);
                return newState;
            })
        }
        const EventStatusSuccess = (response) =>{
            _logger(response.item.eventStatus, "LookUp success")
            let eventStatusData = response.item.eventStatus;
            setEventStatuslookupData((prevState)=>{
                const newState = {...prevState}
                newState.eventStatsData = eventStatusData;
                newState.eventStatusMapped = eventStatusData.map(mapLookUpItem);
                return newState;
            })
        }

        const VenuesSuccess = (response) =>{
            let venuesData = response.item.pagedItems.map(data => ({ id: data.id, name: data.name }));
            setVenueslookupData((prevState)=>{
                const newState = {...prevState}
                newState.venuesData = venuesData;
                newState.venuesMapped = venuesData.map(mapLookUpItem);
                return newState;
            })
        }

        const VenuesError = (error) =>{
            toastr.error("Venues error")
            _logger(error, "error")
        }

        venuesService.GetAllPaginated(0,100).then(VenuesSuccess).catch(VenuesError)

        lookUpService.LookUp(["EventTypes"]).then(EventTypesSuccess).catch(EventTypesError)

        lookUpService.LookUp(["EventStatus"]).then(EventStatusSuccess).catch(EventStatusError)
    },[]
    )

    const EventTypesError = (error) =>{
        toastr.error("Event Type error", error)
        _logger(error, "LookUp Error")
    }

    const EventStatusError = (error) =>{
        toastr.error("Event Status error", error)
        _logger(error, "LookUp Error")
    }

    useEffect(()=>{
        _logger(state, "State right now")
            if(props.data.title !==""){
                setState({
            title: props.data.title
            ,   formData: {  
                eventTypeId : props.data.formData.eventTypeId,     
                name : props.data.formData.name,      
                summary :props.data.formData.summary,     
                shortDescription :props.data.formData.shortDescription,                  
                venueId :props.data.formData.venueId,     
                eventStatusId :props.data.formData.eventStatusId,                                      
                imageId : props.data.formData.imageId,           
                externalSiteUrl:props.data.formData.externalSiteUrl,    
                isFree  : props.data.formData.isFree,     
                dateStart  :props.data.formData.dateStart,               
                dateEnd  :props.data.formData.dateEnd,               
            }
            })
                _logger(state, "State right now")
            }          
    },[props.data.title])

    const handleSubmit = (values, {resetForm}) =>{
        _logger("Values:", values);
        resetForm();   
        eventsService.addEvent(values).then(onSuccessAdd).catch(onErrorAdd)
    } 

    const onSuccessAdd = (response) =>{
        toastr.success("Added!")
        _logger(response, "Event Added")
    }

    const onErrorAdd = (error) =>{
        toastr.error("Whoops!")
        _logger(error, "Something went wrong")
    }
    
    const handleFileUploadComplete = (uploadResponse) => {
        _logger("File uploaded successfully:", uploadResponse.items[0].id);
        setState(prevState => ({
            ...prevState,
            formData: {
                ...prevState.formData,
                imageId: uploadResponse.items[0].id 
            }
        }));
    };

    return(
        <>
        <div className="card" id="events-card-model">
        <div className="card-title" id="events-header">
            <h1> {state.title} an Event </h1>
        </div>
            <div className="row">
                <div className="col-md-12">               
                     <Formik 
                     enableReinitialize={true}   
                     initialValues={state.formData}         
                     onSubmit={handleSubmit}
                     validationSchema= {eventsFormSchema}>  
            <Form>  
                <div className="form-group text-center" id="events-form-group">
                    <label htmlFor="imageId"> Add an image for your event</label>
                        <FileUpload className="col-12" uploadComplete={handleFileUploadComplete} />
                </div>  
                <div className="form-group" id="events-form-group">
                    <label htmlFor="name"> Name </label>
                        <Field className="col-12" type="text" name="name"/>
                        <ErrorMessage name="name" component="div" className="has-error" id="events-error"/>
                </div>                 
                <div className="form-group" id="events-form-group">            
                    <label htmlFor="shortDescription" className="col-md-6"> Short Description </label>
                        <Field className="col-12 events-input" type="text" name="shortDescription"/>
                        <ErrorMessage name="shortDescription" component="div" className="has-error" id="events-error"/>
                </div>
                          
                <div className="form-group" id="events-form-group">
                    <label htmlFor="summary"> Summary </label>
                        <Field type="text" className="col-12" name="summary"/>
                        <ErrorMessage name="summary" component="div" className="has-error" id="events-error"/>
                </div>
                <div className="form-group" id="events-form-group">     
                    <label htmlFor="eventTypeId"> Event Type </label>
                        <Field as="select" className="col-12" name="eventTypeId" > 
                        <option value="">Select</option>     
                       { eventTypelookupData.eventTypeMapped}
                       </Field>
                        <ErrorMessage name="eventTypeId" component="div" className="has-error" id="events-error"/>                         
                </div>
                <div className="form-group" id="events-form-group">     
                    <label htmlFor="eventStatusId"> Event Status </label>
                        <Field as="select" className="col-12" name="eventStatusId" > 
                        <option value="">Select</option>     
                       { eventStatuslookupData.eventStatusMapped}
                       </Field>
                        <ErrorMessage name="eventStatusId" component="div" className="has-error" id="events-error"/>                         
                </div>
                <div className="form-group" id="events-form-group">     
                    <label htmlFor="venueId"> Venue </label>
                        <Field as="select" className="col-12" name="venueId" > 
                        <option value="">Select</option>     
                       { venueslookupData.venuesMapped}
                       </Field>
                        <ErrorMessage name="venueId" component="div" className="has-error" id="events-error"/>                         
                </div>
                <div className="form-group" id="events-form-group">
                    <label htmlFor="externalSiteUrl"> External Site Url </label>
                        <Field type="text" className="col-12" id="events-input" name="externalSiteUrl"/>
                        <ErrorMessage name="externalSiteUrl" component="div" className="has-error" id="events-error"/>
                </div>
                <div className="form-group" id="events-form-group">
                    <label htmlFor="isFree"> Free Event </label>
                        <Field type="checkbox" className="m-3" id="events-input" name="isFree"/>
                        <ErrorMessage name="isFree" component="div" className="has-error" id="events-error"/>
                </div>
                <div className="form-group" id="events-form-group">
                    <label htmlFor="dateStart"> Start Date </label>
                        <Field type="text" className="col-12" id="events-input" name="dateStart"/>
                        <ErrorMessage name="dateStart" component="div" className="has-error" id="events-error"/>
                </div>
                <div className="form-group" id="events-form-group">
                    <label htmlFor="dateEnd"> End Date </label>
                        <Field type="text" className="col-12" id="events-input" name="dateEnd"/>
                        <ErrorMessage name="dateEnd" component="div" className="has-error" id="events-error"/>
                </div>
                <div className="buttons-container" id="events-btn-container">
                    <button type="submit" className="btn" id="events-btns">
                        Submit            
                </button>             
                </div>    
            </Form>
           </Formik>
                </div>
            </div>
        </div>
             
        </>
    )    
}   

EventsForm.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string,
        formData: {  
            eventTypeId : PropTypes.number,     
            name : PropTypes.string,      
            summary : PropTypes.string,     
            shortDescription : PropTypes.string,                  
            venueId : PropTypes.number,     
            eventStatusId : PropTypes.number,                                      
            imageId : PropTypes.number ,           
            externalSiteUrl: PropTypes.string,    
            isFree  : PropTypes.bool,     
            dateStart  : PropTypes.string,               
            dateEnd  : PropTypes.string
        }
    })
}

export default EventsForm
import { Formik, Form, Field ,ErrorMessage} from "formik";
import { useNavigate } from "react-router-dom";
import React, {useState, useEffect } from "react"
import debug from "sabio-debug";
import './productsform.css'; 
import productsFormSchema from "./productsSchema";
import toastr from "toastr";
import lookUpService from "services/lookUpService";
import { mapLookUpItem } from "helpers/utils";
import productsService from "services/productsService";
import FileUpload from "components/files/FileUpload";
import venuesService from "services/venuesService";
import PropTypes from "prop-types"



function ProductsForm(){

    const _logger = debug.extend("ProductsForm");      

    const navigate = useNavigate();

    const [state, setState] =useState({
        formData: {  
            SKU: "",     
            name: "",      
            description:"",     
            productTypeId:"",               
            venueId:"",     
            isVisible:true,                                      
            isActive: true,           
            primaryImageId:"",                 
        }
    })
    const [venueslookupData, setVenueslookupData] = useState({
        venuesData:[],
        venuesMapped:[]
    });

    const handleSubmit = (values, {resetForm}) =>{
        toastr.success("Producted added!")
        _logger("Values:", values);
        resetForm();   
        productsService.addProduct(values).then(onSuccessAdd).catch(onErrorAdd)
    } 

    const onSuccessAdd = (response) =>{
        toastr.success("Added!")
        _logger(response, "Product Added")
    }

    const onErrorAdd = (error) =>{
        toastr.success("Whoops!")
        _logger(error, "Something went wrong")
    }

    const cancelBtn =() =>{
        _logger("Form Cancelled");
        toastr.error("Operation canceled")
        navigate('/')
    }
    
    const handleFileUploadComplete = (uploadResponse) => {
        _logger("File uploaded successfully:", uploadResponse.items[0].id);
        setState(prevState => ({
            formData: {
                ...prevState.formData,
                primaryImageId: uploadResponse.items[0].id 
            }
        }));
    };

    const [productTypelookupData, setProductTypelookupData] = useState({
        productTypeData:[],
        productTypeMapped:[]
    });


    useEffect(()=>{

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
            toastr.error("Venues error", error)
            _logger(error, "error")
        }
        
        const productTypeSuccess = (response) =>{
            _logger(response.item.productTypes, "LookUp success")
            let productTypeData = response.item.productTypes;

            setProductTypelookupData((prevState)=>{
                const newState = {...prevState};
                newState.productTypeData = productTypeData;
                newState.productTypeMapped = productTypeData.map(mapLookUpItem);
                return newState;
            })
        }

        lookUpService.LookUp(["ProductTypes"]).then(productTypeSuccess).catch(productTypeError)
        venuesService.GetAllPaginated(0,100).then(VenuesSuccess).catch(VenuesError)


    },[]
    )

    const productTypeError = (error) =>{
        toastr.error("Product Type error", error)
        _logger(error, "LookUp Error")
    }

    return (
   
        <>
        <div className="card" id="products-card">
        <div className="card-title" id="products-header">
            <h1> Add a Product </h1>
        </div>
            <div className="row">
                <div className="col-md-12">
                     <Formik 
                     enableReinitialize={true}   
                     initialValues={state.formData}      
                     onSubmit={handleSubmit}
                     validationSchema={productsFormSchema}>  
            <Form> 
            <div className="form-group text-center" id="events-form-group">
                    <label htmlFor="primaryImageId"> Add an image for your event</label>
                        <FileUpload className="col-12" uploadComplete={handleFileUploadComplete} />
                </div>                   
                <div className="form-group" id="products-form-group">            
                    <label htmlFor="SKU" className="col-md-6"> Stock-Keeping Unit </label>
                        <Field className="col-12 products-input" type="text" name="SKU"/>
                        <ErrorMessage name="SKU" component="div" className="has-error" id="products-error"/>
                </div>
                <div className="form-group" id="products-form-group">
                    <label htmlFor="name"> Name </label>
                        <Field className="col-12" type="text" name="name"/>
                        <ErrorMessage name="name" component="div" className="has-error" id="products-error"/>
                </div>         
                <div className="form-group" id="products-form-group">
                    <label htmlFor="description"> Description of product </label>
                        <Field type="text" className="col-12" name="description"/>
                        <ErrorMessage name="description" component="div" className="has-error" id="products-error"/>
                </div>
                <div className="form-group" id="products-form-group">     
                    <label htmlFor="productTypeId"> Product </label>
                        <Field as="select" className="col-12" name="productTypeId" > 
                        <option value="">Select</option>     
                        { productTypelookupData.productTypeMapped}
                       </Field>
                        <ErrorMessage name="productTypeId" component="div" className="has-error" id="products-error"/>                         
                </div>
                <div className="form-group" id="products-form-group">     
                    <label htmlFor="venueId"> Venue </label>
                        <Field as="select" className="col-12" name="venueId" > 
                        <option value="">Select</option>     
                       { venueslookupData.venuesMapped}
                       </Field>
                        <ErrorMessage name="venueId" component="div" className="has-error" id="events-error"/>                         
                </div>
                <div className="buttons-container" id="products-btn-container">   
                    <button type="submit" className="btn btn-primary" id="products-btns">    
                        Submit            
                </button>
                <button type="button" className="btn btn-primary" id="products-btns" onClick={cancelBtn}>    
                        Cancel           
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
ProductsForm.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string
    })
}

export default ProductsForm;
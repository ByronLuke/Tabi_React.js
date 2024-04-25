import * as Yup from "yup";

const productsFormSchema = Yup.object().shape({
        SKU: Yup.string().min(2, 'Stock-Keeping Unit must be at least 2 characters').max(50, 'Stock-Keeping Unit must be less than 50 characters').required("Stock-Keeping Unit Required"),
        name: Yup.string().min(2, 'Name must be at least 2 characters').max(255, 'Name must be less than 255 characters').required("Name Required"),
        description: Yup.string().min(4, 'Description must be at least 4 characters').max(4000, 'Description must be less than 4000 characters').required("Description Required"),
        productTypeId: Yup.number().typeError('Product Type ID must be a number').required("Please Select Product"),
        venueId: Yup.number().typeError('Venue ID must be a number').required("Venue ID  Is Required"),
        isVisible:Yup.boolean().required("Is Required"),
        isActive: Yup.boolean().required("Is Required"),
    });

export default productsFormSchema;
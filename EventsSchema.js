import * as Yup from "yup";

const eventssFormSchema = Yup.object().shape({
        eventTypeId: Yup.number().typeError('Event Type ID must be a number').required("Event Type ID  Is Required"),
        name: Yup.string().min(2, 'Name must be at least 2 characters').max(255, 'Name must be less than 255 characters').required("Name Required"),
        summary: Yup.string().min(2, 'Summary must be at least 2 characters').max(255, 'Summary must be less than 255 characters').required("Summary Required"),
        shortDescription: Yup.string().min(2, 'Description must be at least 2 characters').max(255, 'Description must be less than 4000 characters').required("Description Required"),
        venueId: Yup.number().typeError('Venue ID must be a number').required("Venue ID  Is Required"),
        eventStatusId: Yup.number().typeError('Event Status ID must be a number').required("Event Status ID  Is Required"),
        externalSiteUrl: Yup.string().url("Must be a valid URL"),
        isFree:Yup.boolean().required("Is Free is Required"),
        dateStart: Yup.date().required("Start date is Required"),
        dateEnd: Yup.date().required("End date is Required").min(Yup.ref("dateStart"), "End Date must be after start date"),
    });

export default eventssFormSchema;
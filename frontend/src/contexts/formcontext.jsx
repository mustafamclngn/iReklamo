import React, { createContext, useState, useContext } from "react";

const FormContext = createContext();

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        // Step 1 — Complainant Info
        first_name: "",
        last_name: "",
        sex: "",
        age: "",
        contact_number: "",
        email: "",
        barangay: "",
        is_anonymous: "",
        
        // Step 2 — Complaint Details
        complaint_title: "",
        case_type: "",
        description: "",
        full_address: "",
        specific_location: "",
    });

    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData }}>
            {children} 
        </FormContext.Provider>
    );
};

export const useFormData = () => useContext(FormContext);

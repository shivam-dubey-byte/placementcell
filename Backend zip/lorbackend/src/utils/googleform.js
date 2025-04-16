const axios = require('axios');

const  FORM_ID = "1FAIpQLSdjFfhMNLNYPMZyxadPs1jfGSHKJQ81gc1JnhRkrbBED1nXGg";
// Google Form URL with pre-filled data
const formUrl = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

const googleFormRequest = async (file,email,message) => {
const data = {
    "entry.2005620554": file,  // Replace with your field ID and value
    "entry.1045781291": email,  // Replace with your field ID and value
    "entry.1065046570": message,
};

// Send data to Google Form
const result =axios.post(formUrl, new URLSearchParams(data))
    .then(response => {
        console.log("Data submitted successfully!");
    })
    .catch(error => {
        console.error("Failed to submit data:", error);
    });
    return result;

}
module.exports = {googleFormRequest};
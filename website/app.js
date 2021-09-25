//Global Variables
const apiKey; //I removed my own as suggested in the review so you can put ur own key.
let zipBtn; //submit button
let zipInput; //zip input area (the element)
let feelingsInput; //feelings textarea element
let zipText; //zip-code string
let degreesContainer; //degrees text container element
let dateContainer; //date text container element
let feelingsContainer; //feelings text container element
let feelingsText; //feelings String
const date_=new Date(); //date object
let checkData; //variable to detect if there is an '404' code from the response of weather api's server
let isZipValid=true; //variable to check if the zip id is valid or not
let windAudio; //audio element that plays whenever we click at the generate button

/* Function to GET Web API Data*/
async function getWeatherData (){
    //Getting response from the server
    let response= await fetch("https://api.openweathermap.org/data/2.5/weather?zip="+zipText+",us&appid="+apiKey+"&units=metric");

    try {
        let newData= await response.json();
        checkData=newData;
        if(checkData.cod=="404")
        {
        isZipValid=false;       
        console.log("Error 404");
        }
        return newData;
    }

    catch (err) {
        console.log("Error:"+err);
    }
}

/* Function to POST data */
async function postData (url='', data={}) {

 try {
            await fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
        });
     }

    catch (err) {
        console.log(err);
    }

}

/* Function to GET Project Data */
async function getData (url='') {
    //response from the server
    let response= await fetch(url);

    try {
        let newData= await response.json();
        return newData;
    }

    catch (err) {
        console.log(err);
    }
}

//UI Update
async function updateUI(data={}) {
    degreesContainer.innerHTML= Math.floor(data.temps)+ "°C" + "&nbsp;-&nbsp;" + data.cityname;
    dateContainer.innerHTML=data.Date;
    if(!data.feels)
    data.feels="Nothing..";
    feelingsContainer.innerHTML="Feeling " + data.feels;
}


//after DOM is loaded
document.addEventListener("DOMContentLoaded",()=>{

//getting the elements
zipBtn=document.querySelector("#generate");
zipInput=document.querySelector("#zip");
degreesContainer=document.querySelector("#temp");
dateContainer=document.querySelector("#date");
feelingsInput=document.querySelector("#feelings");
feelingsContainer=document.querySelector("#content");
windAudio=document.querySelector("#wind");
windAudio.volume=0.3;

//this is an intial text value that will be replaced by date when clicking on the button
dateContainer.innerText="Please Enter A Zip ID";

// Event listener to add function to existing HTML DOM element
zipBtn.addEventListener("click", onBZipBtnClick);
/* Function called by event listener */
function onBZipBtnClick() {
 zipText=zipInput.value;
 feelingsText=feelingsInput.value;
 isZipValid=true; //with every click we assume that the zip is valid until its proven that its not true

 //Promise Chain
 getWeatherData().then(function(weatherData){
    if (isZipValid){
     //making a data object
     let data = {
         tempreture: weatherData.main.temp,
         cityName: weatherData.name,
         date:date_.getFullYear()+"/"+(date_.getMonth()+1)+"/"+date_.getDate(),
         zipStr: zipText,
         feelingsStr: feelingsText
        };
        return data;
    }
 }).then(function(pData){
    if (isZipValid)
    return postData("/all",pData);
 }).then(function(pData){
     if (isZipValid)
     return getData("/all");
 }).then(function(gData){
     if(isZipValid) {
     updateUI(gData);
     windAudio.play();
     }
     //if the zip code is not valid then we remove all the text (date, temps,feeligs)
     //and then we display an error message
     else {
     degreesContainer.innerHTML= "";
     feelingsContainer.innerHTML= "";
     dateContainer.innerHTML="Please Enter A Valid Zip ID";
     }

 });
}

});

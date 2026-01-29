function safeJSonParse(jsonString, fallback){

    try{
        return JSON.parse(jsonString);
    } catch(error){
        console.error("JSON parsing error:", error);
        return fallback;
    }

}


const validData = safeJSonParse('{"name": "Aidos"}',{})
const invalidData = safeJSonParse('{name: "Aidos}',{})


console.log("Valid Data:", validData); 
console.log("Invalid Data:", invalidData);
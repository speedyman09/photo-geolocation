import {photoGeolocation} from "./index.js";

const geolocation = new photoGeolocation("YOUR-DIR-HERE/") // MUST end with a /

geolocation.toFile() // Creates a new file called locations.json in the directory you specified when constructing photoGeolocation, and writes the data to there

 geolocation.returnData() // Returns a promise that returns an array of objects containing name, latitude and longitude if it is resolved.
 .then(data=>console.log(data)) // When it succeeds
 .catch(err=>console.log(err)) // When it fails

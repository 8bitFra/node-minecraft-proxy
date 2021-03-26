const imageToBase64 = require('image-to-base64');


function imagetob64(path)
{
    let risultato = imageToBase64(path) // Path to the image
    .then(
        (response) => {
            return response; //  return response "cGF0aC90by9maWxlLmpwZw=="
        }
    )
    .catch(
        (error) => {
            console.log(error); // Logs an error if there was one
        }
    )

    
    return risultato;        
}


module.exports = imagetob64
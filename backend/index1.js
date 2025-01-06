//    Napraviti novi file unutar backende index1.js. Kreirati vlastite GET, POST, PUT, DELETE metode za rad s objektom unutar vlastitog projekta 

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/IT oprema", (request, response) => {
    
return response.send("Popis opreme");
});

app.post("/addIToprema", (request, response) => {
    //Ime opreme, barcode, serijski broj
    const data=request.body;
    const ImeOpreme = data.ImeOpreme;
    const barcode = data.ImeOpreme;
    const serijskibroj = data.serijskibroj;

    return response.send("Dodavanje IT opreme: "+Ime_opreme+" "+Barcode+" "+Serijski_broj);
});

app.put("/updateITopreme", (request, response) => {
    const data = request.body;
    const ImeOpreme = data.ImeOpreme;
    const barcode = data.ImeOpreme;
    const serijskibroj = data.serijskibroj;

    return response.send("Ažuriranje IT opreme: "+Ime_opreme+" "+Barcode+" "+Serijski_broj);
});

app.delete("/deleteIToprema", (request, response) => {
    const data = request.body;
    const ImeOpreme = data.ImeOpreme;

    return response.send("Delete"+data.ImeOpreme);
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
    });
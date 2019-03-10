const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const parserRaw = bodyParser.urlencoded({ extended: false });


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}
app.listen(port);

app.get('/', (req,res) => {
    res.render('index');
});

app.post('/calcShipping', (req, res) => {   
    calculateShipping(req, res);
});



function calculateShipping(req, res) {
    var shippingCost = 0;
    var shippingWeight = parseInt(req.body.weight);
    var shipmentType = req.body.shipping;
    if(shipmentType == 'LTR_Stamped' && shippingWeight <= 3.5){
        if(shippingWeight <= 1){
            shippingCost = 0.55;
        }
        else {
            shippingCost = ((shippingWeight - 1) * .15)+0.5;
            console.log('Shipping weight: ' + shippingWeight );
            console.log('Shipping Cost: ' + shippingCost );
        }  
        shipmentType = 'Letter (Stamped)';      
    }
    else if(shipmentType == 'LTR_Metered' && shippingWeight <= 3.5){
        if(shippingWeight <= 1){
            shippingCost = 0.50;
        }
        else {
            shippingCost = ((shippingWeight - 1) * .15)+0.5;
            console.log('Shipping weight: ' + shippingWeight );
            console.log('Shipping Cost: ' + shippingCost );
        }      
        shipmentType = 'Letter (Metered)';   
    }
    else if(shipmentType == 'LRG_ENV_flats' && shippingWeight <= 13){
        if(shippingWeight <= 1){
            shippingCost = 1;
        }
        else {
            shippingCost = ((shippingWeight - 1) * .15)+1;
            console.log('Shipping weight: ' + shippingWeight );
            console.log('Shipping Cost: ' + shippingCost );
        } 
        shipmentType = 'Large Envelope (Flats)';
    }
    else if(shipmentType == 'First-Class' && shippingWeight <= 13){
        if(shippingWeight <= 4){
            shippingCost = 3.66;
        } 
        else if(shippingWeight <= 8){
            shippingCost = 4.39;
        }   
        else if (shippingWeight <= 13){
            shippingCost = 5.71;
        }  
        shipmentType = 'First-Class Package';  
    }
    else {
        var params = {shippingWeight: shippingWeight, shipmentType:shipmentType};
        res.render('error', {params: params});
    }
    var params = {shippingWeight: shippingWeight, shippingCost: shippingCost.toFixed(2), shipmentType:shipmentType};
    res.render('shippingCost', {params: params});
}

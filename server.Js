const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Parser } = require("json2csv");

const app = express();

const PORT = 3000;

const CSV_FILE = path.join(__dirname, "customers.csv");


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"public")));


// Create CSV file if not exists

if(!fs.existsSync(CSV_FILE)){

    fs.writeFileSync(
        CSV_FILE,
        "name,email,phone\n"
    );

}


// Read CSV

function readCustomers(){

    return new Promise((resolve)=>{

        let customers=[];


        fs.createReadStream(CSV_FILE)

        .pipe(csv())

        .on("data",(row)=>{

            customers.push(row);

        })

        .on("end",()=>{

            resolve(customers);

        });


    });

}



// Write CSV

function writeCustomers(customers){

    const parser = new Parser({

        fields:[
                "name",
    "phone",
    "area",
    "project",
    "advance",
    "total",
    "balance",
    "status",
    "date"
        ]

    });


    const csvData = parser.parse(customers);


    fs.writeFileSync(
        CSV_FILE,
        csvData
    );

}



// GET Customers

app.get("/customers",async(req,res)=>{


    const customers = await readCustomers();


    res.json(customers);


});



// ADD Customer

app.post("/customers",async(req,res)=>{


    let customers = await readCustomers();


    customers.push(req.body);


    writeCustomers(customers);


    res.json({
        message:"Customer Added"
    });


});



// UPDATE Customer

app.put("/customers/:id",async(req,res)=>{


    let customers = await readCustomers();


    let id = Number(req.params.id);


    customers[id]=req.body;


    writeCustomers(customers);


    res.json({
        message:"Customer Updated"
    });


});



// DELETE Customer

app.delete("/customers/:id",async(req,res)=>{


    let customers = await readCustomers();


    let id = Number(req.params.id);


    customers.splice(id,1);


    writeCustomers(customers);


    res.json({
        message:"Customer Deleted"
    });


});



// Start Server

app.listen(PORT,()=>{


console.log(
`NexusTechInfo CRM running:
http://localhost:${PORT}`
);


});

const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

const uri = "mongodb+srv://smartutility:Y6LBeGswifoq8rwV@cluster0.6jar5hr.mongodb.net/?appName=Cluster0";

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db=client.db("smartutility")
    const billData=db.collection('billdata')

    app.get("/recentbill",async (req,res)=>{
        const cursor = billData.find().limit(6);
        const result = await cursor.toArray();

        res.send(result);
    })

    
    app.get("/allbill",async (req,res)=>{
        const cursor = billData.find();
        const result = await cursor.toArray();

        res.send(result);
    })

    /
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{

    res.send("Hello world!!")


})
app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})
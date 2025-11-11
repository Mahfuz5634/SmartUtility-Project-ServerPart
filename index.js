const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

const uri =
  "mongodb+srv://smartutility:Y6LBeGswifoq8rwV@cluster0.6jar5hr.mongodb.net/?appName=Cluster0";

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("smartutility");
    const billData = db.collection("billdata");
    const paybill =db.collection('paybill')

    app.get("/recentbill", async (req, res) => {
      const cursor = billData.find().limit(6);
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/specificBill/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: id };
      const result = await billData.findOne(query);

      res.send(result);
    });

    app.get('/payments',async(req,res)=>{
      const email=req.query.email;
      const result= await paybill.find({email}).toArray();
      res.send(result);
    })

    app.post("/payBill",async (req,res)=>{
       const data=req.body;
       const result= await paybill.insertOne(data);
       res.send(result)
    })

    app.get("/allbill", async (req, res) => {
      const cursor = billData.find();
      const result = await cursor.toArray();

      res.send(result);
    });

    app.get("/allbilltwo", async (req, res) => {
      try {
        const category = req.query.category; 
        let query = {};

        if (category && category !== "All") {
          query = { category: category };
        }

        const result = await billData.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching bills" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world!!");
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

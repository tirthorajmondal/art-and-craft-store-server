const express = require("express");
const cors = require("cors");
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

//middlewere
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@art-and-craft-store.uh2dy.mongodb.net/?retryWrites=true&w=majority&appName=art-and-craft-store`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const productCollection = client.db("productDB").collection('productCollection')

        app.get("/products", async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })


        app.get("/my-products", async (req, res) => {
            const myProducts = productCollection.find({ subcategory_name: "myProduct" }
            ).sort({ rating: -1 })
            const result = await myProducts.toArray()
            res.send(result)
        })


        app.post("/products", async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Data is comming soon')
})

app.listen(port, () => console.log(`app is running on port ${port}`))
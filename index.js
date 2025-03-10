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


        app.get("/my-products/:email", async (req, res) => {
            const userEmail = req.params.email
            const filter = { email: userEmail }
            const options = { short: { item_name: 1 } }
            const myProducts = productCollection.find(filter)
            const result = await myProducts.toArray()
            res.send(result)
        })



        app.post("/products", async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product)
            res.send(result)
        })
        app.put("/product/:id", async (req, res) => {
            const id = req.params.id;
            const product = req.body;
            const updatedProduct = {
                $set: {
                    customization: product.customization,
                    image: product.image,
                    item_name: product.item_name,
                    price: product.price,
                    processing_time: product.processing_time,
                    rating: product.rating,
                    short_description: product.short_description,
                    stock_status: product.stock_status,
                    subcategory_name: product.subcategory_name,
                }
            }
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const result = await productCollection.updateOne(filter, updatedProduct, options)
            res.send(result)  
        })


        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result)
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
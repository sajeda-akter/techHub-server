const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nvo4nkj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
  
    const addProductCollection = client
      .db("techhubdb")
      .collection("addProduct");
    const brandCollection = client.db("techhubdb").collection("brands");
    const productCollection = client.db("techhubdb").collection("AllProducts");
    const reviewCollection = client.db("techhubdb").collection("reviews");

    // get all brand data
    app.get("/brands", async (req, res) => {
      const brandData = brandCollection.find();
      const brands = await brandData.toArray();
      res.send(brands);
    });

    // get all the products in the db
    app.get("/products", async (req, res) => {
      const brandData = productCollection.find();
      const product = await brandData.toArray();
      res.send(product);
    });

    // add to product in the database
    app.post("/addproduct",async (req, res) => {
      const add = req.body;
      const result =await addProductCollection.insertOne(add);
      res.send(result);
    });

    app.get("/addproduct", async (req, res) => {
      const brandData = addProductCollection.find();
      const product = await brandData.toArray();
      res.send(product);
    });

    // delete the data you have in the db
    app.delete("/addproduct/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await addProductCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/addproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await addProductCollection.findOne(query);
      res.send(result);
    });

    app.put("/addproduct/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateProduct = req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          brand: updateProduct.brand,
          img: updateProduct.img,
          type: updateProduct.type,
          price: updateProduct.price,
          rating: updateProduct.rating,
          description: updateProduct.description,
        },
      };
      const result = await addProductCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });
    app.get("/reviews", async (req, res) => {
      const review = reviewCollection.find();
      const result = await review.toArray();
      res.send(result);
    });
  } 
  
  finally {
    // await client.close();

  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Welcome to techHub!");
});

app.listen(port, () => {
  console.log(`TechHub listening on port ${port}`);
});

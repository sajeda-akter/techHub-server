const express = require('express')
const app = express()
const cors=require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port =process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nvo4nkj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
 try{
    await client.connect()
    const addProductCollection=client.db('techhubdb').collection('addProduct')
    const brandCollection=client.db('techhubdb').collection('brands')

    // get all brand data
    app.get('/brands',async(req,res)=>{
        const brandData=brandCollection.find()
        const brands=await brandData.toArray()
        res.send(brands)

    })
    // add to product in the database
    app.post('/addProduct',(req,res)=>{
        const add=req.body
        const result=addProductCollection.insertOne(add);
        res.send(result)
    })
 }
 finally{

 }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to techHub!')
})

app.listen(port, () => {
  console.log(`TechHub listening on port ${port}`)
})
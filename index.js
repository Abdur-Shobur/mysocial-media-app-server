require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb')
const cors = require('cors')
const color = require('colors')
const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())

const uri = process.env.URI
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

const run = async () => {
  try {
    // database create
    const database = client.db('socialmedia')
    const user = database.collection('user')
    const post = database.collection('post')

    // get user
    app.get('/user', async (req, res) => {
      const query = {}
      const products = await user.find(query).toArray()
      res.send(products)
    })

    // get single user by email
    app.get('/user-get-by-email', async (req, res) => {
      const qry = req.query
      const query = {
        email: qry.email,
      }
      const result = await user.findOne(query)
      res.send(result)
    })

    // create user
    app.post('/user', async (req, res) => {
      const body = req.body
      const products = await user.insertOne(body)
      res.send(products)
    })

    // get post
    app.get('/post', async (req, res) => {
      const query = {}
      const result = await post.find(query).toArray()
      res.send(result)
    })
    // create post
    app.post('/post', async (req, res) => {
      const body = req.body
      const result = await post.insertOne(body)
      res.send(result)
    })
  } finally {
  }
}

run().catch((err) => console.log(err))

//   start
app.get('/', (req, res) => {
  res.send('<h1>Server is Running</h1>')
})

app.listen(PORT, () => {
  console.log('Server Is Running'.bgBlue)
})

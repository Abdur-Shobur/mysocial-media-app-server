require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
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
    const comment = database.collection('comment')

    // get user
    app.get('/user', async (req, res) => {
      const limit = parseInt(req.query.limit)
      const query = {}
      const products = await user.find(query).limit(limit).toArray()
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

    // update user
    app.put('/user', async (req, res) => {
      const qur = req.query._id
      const filter = { _id: ObjectId(qur) }
      const body = req.body
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          name: body.name,
          info: {
            photoUrl: body.info.photoUrl,
            address: body.info.address,
            university: body.info.university,
            about_me: body.info.about_me,
          },
        },
      }
      const result = await user.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    // update user add friends
    app.patch('/user-add-friends', async (req, res) => {
      const id = req.query.id
      const filter = { _id: ObjectId(id) }
      const body = req.body
      console.log(id)
      console.log(body)
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          friends: {
            requested: body,
          },
        },
      }
      const result = await user.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    // get post
    app.get('/post', async (req, res) => {
      const query = {}
      const load_more = parseInt(req.query.load_more)
      const result = await post
        .find(query)
        .sort({ post_time: -1 })
        .limit(load_more)
        .toArray()
      res.send(result)
    })

    // get 3 limited post post
    app.get('/post-limited', async (req, res) => {
      const query = {}
      const result = await post
        .find(query)
        .sort({ 'post_react.like': -1 })
        .limit(3)
        .toArray()
      res.send(result)
    })

    // get post by post id
    app.get('/post-by-id', async (req, res) => {
      const id = req.query.id
      const query = { _id: ObjectId(id) }
      const result = await post.find(query).toArray()
      res.send(result)
    })
    // get post by post id
    app.get('/post-by-u_id', async (req, res) => {
      const id = req.query.id
      const load_more = parseInt(req.query.load_more)
      const query = { user_id: id }
      const result = await post
        .find(query)
        .limit(load_more)
        .sort({ post_time: -1 })
        .toArray()
      res.send(result)
    })
    // create post
    app.post('/post', async (req, res) => {
      const body = req.body
      const result = await post.insertOne(body)
      res.send(result)
    })
    // update like
    app.put('/post', async (req, res) => {
      const qur = req.query._id
      const body = req.body
      const filter = { _id: ObjectId(qur) }
      const options = { upsert: true }
      const updateDoc = {
        $set: {
          post_react: {
            like: body.like,
            comment: body.comment,
            share: body.share,
          },
        },
      }
      const result = await post.updateOne(filter, updateDoc, options)
      res.send(result)
    })
    // get comment
    app.get('/comment', async (req, res) => {
      const id = req.query._id
      const query = { post_id: id }
      const result = await comment
        .find(query)
        .sort({ create_time: -1 })
        .toArray()
      res.send(result)
    })

    // create comment
    app.post('/comment', async (req, res) => {
      const body = req.body
      const result = await comment.insertOne(body)
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

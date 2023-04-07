import * as dotenv from "dotenv"
import postgres from "postgres"
import express from "express"
import path from "node:path"
import crypto from "node:crypto"




const app = express()
const PORT = process.env.PORT || 3300
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = dotenv.config().parsed
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`


const sql = postgres(URL, { ssl: 'require'})



app.use(express.static("./server/view/"))
app.use(express.urlencoded({ extended: true }))



app.get("/", ( req, res ) => {
  res.sendFile("index.html")
  
})


app.post("/post", async ( req, res ) => {
  const { name, pass } = req.body
  
  const time = new Date()
  const uid = crypto.randomUUID()
  try {
    const result = await sql`INSERT INTO users(name, pass, verify, created_on, uid)
                        VALUES (${name}, ${pass}, false, ${time}, ${uid})`
    
    res.sendStatus(200)
  } catch ( error ) {
    console.log(error)
    res.sendStatus(400)
  }
})

app.put("/auth/:uid", async ( req, res ) => {
  const { uid } = req.params


  const result = await sql`UPDATE users SET verify = true WHERE uid=${uid}` 
})

app.get("/auth/:uid", ( req, res ) => {
  res.sendFile(path.resolve("server/view/auth.html"))
})



app.get("/authed/:uid", async ( req, res ) => {
  const { uid } = req.params

  const result = await sql`SELECT verify FROM users WHERE uid=${uid}`

  res.json(result[0])

})

app.get("/user", async ( req, res ) => {
  const { name, pass } = req.query

  if( !name || !pass ) {
    res.sendStatus(401)
    return
  }
  // SQL injection ??
  const result = await sql`SELECT * FROM users WHERE name=${name} AND pass=${pass};`
  res.json(result[0].uid)

})



app.listen(PORT, _ => console.log(`listening at http://localhost:${PORT}`))

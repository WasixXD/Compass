import * as dotenv from "dotenv"
import postgres from "postgres"
import express from "express"



const app = express()
const PORT = process.env.PORT || 3300
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = dotenv.config().parsed
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`


const sql = postgres(URL, { ssl: 'require'})



app.use(express.static("./view/"))
app.use(express.urlencoded({ extended: true }))
app.get("/", ( req, res ) => {
  res.sendFile("index.html")
  
})


app.post("/post", async ( req, res ) => {
  const { name, pass } = req.body
  

  const time = new Date()
  try {
    const result = await sql`INSERT INTO users(name, pass, verify, created_on)
                        VALUES(${name}, ${pass}, false, ${time});`
    
    res.sendStatus(200)
  } catch ( error ) {
    res.sendStatus(400)
  }


})





app.listen(PORT, _ => console.log(`listening at http://localhost:${PORT}`))

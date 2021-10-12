const express = require('express')
const path = require('path')
const {createClient} = require("redis")
const cors = require('cors')

const snPrefix = "serial-"
const idPrefix = "id-"
const currentIdKey = "currentid"

const app = express()

const port = process.env.PORT || 5000

start()

async function start(){
  const client = createClient()
  client.on('error', err => console.log(`redis client error`, err))

  await client.connect()
  app.use(cors())
  app.use(express.static(path.join(__dirname, 'build')))

  app.get("/register/:sn/:ip", async (req, res) => {
    let sn = req.params.sn
    let ip = req.params.ip
    console.log("got sn", sn, ip)
    const id = await client.get(snKey(sn))
    if(id){
      console.log(`device ${id} already registered`)
      const ip = await client.get(idKey(id))
      res.json({msg: "device already registered", id, ip})
    } else {
      let currentId = await client.get(currentIdKey)
      if(currentId){
        let id = currentId +1
        console.log(`registering new device - ${id}`)
        await client.set(snKey(sn), id)
        await client.set(idKey(id), ip)
        await client.set(currentIdKey, id)
      } else {
        console.log(`registering first device`)
        await client.set(snKey(sn), "1")
        await client.set(idKey("1"), ip)
        await client.set(currentIdKey, "1")
      }
      res.json({msg: "new device registered"})
    }
  })

  app.get('/device/:id', async (req, res) => {
    let ip = await client.get(idKey(req.params.id))
    console.log(ip)
    if(!ip) {
      res.json({ip: "n/a"})
    } else {
      res.json({ip})
    }
  })

  app.listen(port, () =>
    console.log(`Listening on port ${port}`)
  )
}

function snKey(sn){
  return snPrefix + sn
}

function idKey(id){
  return idPrefix + id
}
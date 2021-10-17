const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const {
  init,
  getDevice,
  getRegistration,
  registerDevice,
  deleteRegistration,
  updateDevice,
  getRegistrations
} = require("./aws-wrapper")

const app = express()

const port = process.env.PORT || 5000
const region = process.env.AWS_REGION || "us-west-2"
const endpoint = process.env.ENDPOINT || "http://localhost:8000"
const config = {region, endpoint}

start()

async function start(){
  try {
    await init(config)
  } catch(err){
    console.log(err)
    throw new Error(`failed to start server ${err}`)
  }
  app.use(cors())
  app.use(bodyParser.json())
  app.use(express.static(path.join(__dirname, 'build')))


  app.post("/api/register", async (req, res) => {
    console.log("got sn", req.body)
    try {
      let registration = await getRegistration(req.body.sn)
      if(registration.id){
        let msg = `device ${registration.id} already registered`
        console.log(msg)
        res.json({registration_id: registration.id})
      } else {
        let lastRegistration = await getRegistration("0")
        let newId = "1"
        if(lastRegistration) {
          newId = parseInt(lastRegistration.id) + 1
        }

        try {
          let result = await registerDevice(req.body, newId.toString())
          console.log(result)
          res.json({registration_id: newId.toString()})
        } catch(err){
          console.log(err)
          res.status(500).json({error: "failed to register device"})
          return
        }

        try {
          let updatedId = await registerDevice({sn: "0", owner: "none"}, newId.toString())
          res.json({msg: `new device registered, id (${newId}) - ${updatedId}`})
        } catch(err){
          console.log(err)
          res.status(500).json({error: "failed to update last device"})
          return
        }
      }
    } catch(err){
      console.log(err)
      res.status(500).json({error: "failed to get device"})
      return err
    }
  })

  app.delete('/api/registration/delete/:sn', async (req, res) => {
    try {
      let result = await deleteRegistration(req.params.sn)
      console.log(result)
      res.json({msg: `registration delete`})
    } catch(err){
      console.log(err)
      res.status(500).json({error: "failed to delete registration"})
    }
  })

  app.get('/api/device/:id', async (req, res) => {
    try {
      let deviceConfig = await getDevice(req.params.id)
      res.json(deviceConfig)
    } catch(err){
      console.log(err)
      res.status(500).json({error: "failed to get device"})
    }
  })

  app.get('/api/devices', async (req, res) => {
    console.log("GET DEVICES")
    try {
      let deviceIds = await getRegistrations("eco")
      console.log(deviceIds)
      res.json(deviceIds)
    } catch(err){
      console.log(err)
      res.status(500).json({error: "failed to get devices"})
    }
  })

  app.post('/api/device', async (req, res) => {
    try {
      let result = await updateDevice(req.body)
      let msg = `device updated`
      console.log(msg + "-" + JSON.stringify(result))
      res.json({msg})
    } catch(err) {
      console.log(err)
      res.status(500).json({error: "failed to update device"})
    }

  })

  app.listen(port, () =>
    console.log(`Listening on port ${port}`)
  )
}

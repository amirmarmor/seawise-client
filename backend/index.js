const logger = require('./logger')
const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const webSockerServer = require('websocket').server
const http = require('http')

const {
  init,
  getDevice,
  getRegistration,
  registerDevice,
  deleteRegistration,
  updateRegistration,
  updateDevice,
  getRegistrations, deleteDevice, getRegistrationById
} = require("./aws-wrapper")

const app = express()

const port = process.env.PORT || 5000
const wsPort = process.env.WSPORT || 8080
const region = process.env.REGION || "us-east-1"
const endpoint = process.env.ENDPOINT || ""

const config = {region, endpoint}
const defaultDeviceConfig = {
  fps: 30,
  offset: 0,
  rules: "[]",
  cleanup: true,
  record: false,
}

let wsServer

start()

async function start(){
  try {
    logger.info(`CONFIG = ${JSON.stringify(config)}`)
    await init(config)
  } catch(err){
    logger.warn(err)
    throw new Error(`failed to start server ${err}`)
  }
  app.use(cors())
  app.use(bodyParser.json())
  app.use(express.static(path.resolve(__dirname, 'build')))

  app.get("/admin/health", (req, res) => {
    res.send("OK")
  })

  app.get("/admin", (req, res) => {
    res.redirect("/")
  })

  app.post("/api/register", async (req, res) => {
    logger.debug(req.url, req.ip)
    let sn = req.body.sn
    if(sn === undefined || !sn || sn === ""){
      res.status(500).json({error: "missing serial number"})
    }

    try {
      let registration = await getRegistration(req.body.sn)
      if(registration.id){
        let msg = `device ${registration.id} already registered`
        logger.debug(msg)
        res.json({id: parseInt(registration.id)})
      }
      else {
        let lastRegistration = await getRegistration("0")
        let newId = 1
        if(lastRegistration) {
          newId = parseInt(lastRegistration.channels) + 1
        }

        try {
          await registerDevice( {...req.body, id: newId})
          await registerDevice({sn: "0", owner: "none", ip:"n/a", channels: newId, id: 9999})
          res.json({id: newId})
        } catch(err){
          logger.warn(err)
          res.status(500).json({error: "failed to register device"})
        }
      }
    } catch(err){
      logger.warn(err)
      res.status(500).json({error: "failed to get device"})
    }
  })

  app.post("/api/registration/update", async (req, res) => {
    try {
      await updateRegistration(req.body)
      res.json({msg: `registration updates`})
    } catch(err){
      logger.warn(err)
      res.status(500).json({error: "failed to update registration"})
    }
  })

  app.delete('/api/registration/delete/:sn', async (req, res) => {
    try {
      await deleteRegistration(req.params.sn)
      res.json({msg: `registration delete`})
    } catch(err){
      logger.warn(err)
      res.status(500).json({error: "failed to delete registration"})
    }
  })

  app.get('/api/device/:id', async (req, res) => {
    let now = Date.now()
    logger.debug(`[${now}] ${req.url}`)
    try {
      let id = parseInt(req.params.id)
      let deviceConfig
      try {
        deviceConfig = await getDevice(id)
      } catch(err){
        logger.warn(err)
        deviceConfig = false
      }
      if(!deviceConfig){
        deviceConfig = defaultDeviceConfig
      } else {
        deviceConfig.fps = parseInt(deviceConfig.fps)
        deviceConfig.offset = parseInt(deviceConfig.offset)
        deviceConfig.id = parseInt(deviceConfig.id)
      }
      res.status(200).json(deviceConfig)
    } catch(err){
      logger.warn(err)
      res.status(500).json({error: "failed to get device"})
    }
  })

  app.get('/api/devices', async (req, res) => {
    logger.debug(req.url)
    try {
      let devices = await getRegistrations("echo")
      res.json(devices)
    } catch(err){
      logger.warn(err)
      res.status(500).json({error: "failed to get devices"})
    }
  })

  app.post('/api/device', async (req, res) => {
    logger.debug(req.url)
    try {
      await updateDevice(req.body)
      let msg = `device updated`
      res.json({msg})
    } catch(err) {
      logger.warn(err)
      res.status(500).json({error: "failed to update device"})
    }

  })

  app.delete('/api/device/delete/:id', async (req, res) => {
    logger.debug(req.url)
    try {
      await deleteDevice(req.params.id)
      let msg = `device deleted`
      res.json({msg})
    } catch(err) {
      logger.warn(err)
      res.status(500).json({error: "failed to delete device"})
    }

  })

  app.get('/api/realtime/:id', async (req, res) => {
    logger.debug(req.url)
    try {
      const id = req.params.id
      let config = await getDevice(req.params.id)
      let info = await getRegistrationById(id)
      let resp = {r: config.record, ip: info[0].ip, channels: info[0].channels}
      res.status(200).json(resp)
    } catch (err){
      logger.warn(err)
    }
  })


  app.listen(port, () =>
   logger.log(`Listening on port ${port}`)
  )
}

function startWSserver(){
  const httpServer  = http.createServer((req, res) => {
    logger.info(`Received request for ${req.url}`)
    res.writeHead(404)
    res.end()
  })

  httpServer.listen(wsPort, ()=>{
    logger.info(`WS server is listening on ${wsPort}`)
  })

  wsServer = new webSockerServer({
    httpServer,
    autoAcceptConnections: false
  })

  wsServer.on('request', req => {
    if(!originIsAllowed()){
      req.reject()
      logger.warn(`unauthorized origin - ${req.origin}`)
      return
    }

    let connection = req.accept('echo-protocol', req.origin)
    logger.info('connection accepted')
    connection.on('message', message => {
      if(message.type === 'utf8'){
        logger.info(`Received message: ${message}`)
      } else if(message.type === 'binary'){
        logger.info(`received Binary message of `)
      }
    })
  })
}

function originIsAllowed(){
  //logic
  return true
}
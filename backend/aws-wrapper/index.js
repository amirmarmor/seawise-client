const AWS = require("aws-sdk")
const logger = require("../logger")

const deviceSchema = require("./deviceSchema")
const registrationsSchema = require("./registrationsSchema")

let client

async function put(query) {
  return new Promise((resolve, reject) => {
    client.putItem(query, (err, result) => {
      if (err) {
        logger.log("failed to put item")
        reject(err)
      }
      resolve(result)
    })
  })
}

async function deleteItem(query) {
  return new Promise((resolve, reject) => {
    client.deleteItem(query, (err, result) => {
      if (err) {
        logger.log("failed to delete item")
        reject(err)
      }
      resolve(result)
    })
  })
}

async function get(query) {
  return new Promise((resolve, reject) => {
    client.getItem(query, (err, result) => {
      if (err) {
        logger.log("failed to get item")
        reject(err)
        return
      }
      result = parseOutput(result)
      resolve(result)
    })
  })
}

async function scan(query) {
  return new Promise((resolve, reject) => {
    client.scan(query, (err, result) => {
      if (err) {
        logger.log("failed to get item")
        reject(err)
      }
      let items = result.Items.map(Item => {
        return parseOutput({Item})
      })
      logger.log(items)
      resolve(items)
    })
  })
}

async function deleteRegistration(sn) {
  let query = {
    TableName: registrationsSchema.table.TableName,
    Key: {
      [registrationsSchema.table.AttributeDefinitions[0].AttributeName]: {
        S: sn
      }
    }
  }
  try {
    await deleteItem(query)
  } catch (err) {
    logger.log(err)
  }
}

async function deleteDevice(id) {
  let query = {
    TableName: deviceSchema.table.TableName,
    Key: {
      [deviceSchema.table.AttributeDefinitions[0].AttributeName]: {
        N: id.toString()
      }
    }
  }
  return deleteItem(query)
}

function toBool(string) {
  if (typeof string === 'boolean') {
    return string
  }
  return string === "true"
}

async function addDevice(device) {
  const query = {
    Item: {
      [deviceSchema.table.AttributeDefinitions[0].AttributeName]: {
        N: device.id.toString()
      },
      "OFFSET": {
        N: device.offset.toString()
      },
      "CLEANUP": {
        BOOL: toBool(device.cleanup)
      },
      "FPS": {
        N: device.fps.toString()
      },
      "RULES": {
        S: device.rules
      },
      "RECORD": {
        BOOL: toBool(device.record)
      }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: deviceSchema.table.TableName
  }
  return put(query)
}

async function registerDevice(params) {
  const query = {
    Item: {
      [registrationsSchema.table.AttributeDefinitions[0].AttributeName]: {
        S: params.sn
      },
      "ID": {
        N: params.id.toString()
      },
      "OWNER": {
        S: params.owner
      },
      "IP": {
        S: JSON.stringify(params.ip)
      },
      "CHANNELS": {
        N: params.channels.toString()
      }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: registrationsSchema.table.TableName
  }
  try {
    return await put(query)
  } catch (err) {
    logger.log(err)
    throw err
  }
}

async function getRegistration(sn) {
  let query = {
    TableName: registrationsSchema.table.TableName,
    Key: {
      [registrationsSchema.table.AttributeDefinitions[0].AttributeName]: {
        S: sn
      }
    }
  }
  return get(query)
}

async function getRegistrations(owner) {
  let query = {
    TableName: registrationsSchema.table.TableName,
    ExpressionAttributeNames: {
      "#owner": "OWNER"
    },
    FilterExpression: "#owner = :owner",
    ExpressionAttributeValues: {
      ":owner": {
        S: owner
      }
    }
  }
  return scan(query)
}

async function getRegistrationById(id) {
  let query = {
    TableName: registrationsSchema.table.TableName,
    ExpressionAttributeNames: {
      "#id": "ID"
    },
    FilterExpression: "#id = :id",
    ExpressionAttributeValues: {
      ":id": {
        N: id
      },
    }
  }
  //TODO: fix id numerator locate not in table
  let result = await scan(query)
  let h = result.filter(reg => reg.device_serial_number !== "0")
  return h
}

async function getDevice(id) {
  let query = {
    TableName: deviceSchema.table.TableName,
    Key: {
      [deviceSchema.table.AttributeDefinitions[0].AttributeName]: {
        N: id.toString()
      }
    }
  }
  return get(query)
}

async function updateDevice(device) {
  try {
    await deleteDevice(device.id)
    return await addDevice(device)
  } catch (err) {
    logger.log(err)
    throw err
  }
}

async function updateRegistration(registration) {
  try {
    await deleteRegistration(registration.sn)
    return await registerDevice(registration)
  } catch (err) {
    logger.log(err)
    throw err
  }
}

async function init(config) {
  try {
    if(config.endpoint !== ""){
      AWS.config.update(config)
      client = new AWS.DynamoDB()
    } else {
      client = new AWS.DynamoDB({region: config.region})
    }


    let tables = await listTables()
    if (!tables || tables.length === 0) {
      await createTable(deviceSchema.table)
      await createTable(registrationsSchema.table)
    }

    logger.log("DB initiated")
  } catch (err) {
    logger.log(err)
    throw err
  }
}

async function listTables() {
  return new Promise((resolve, reject) => {
    client.listTables({}, (err, result) => {
      if (err) {
        logger.log("Failed to list tables", err)
        reject(err)
      }
      resolve(result.TableNames)
    })
  })
}

async function createTable(schema) {
  return new Promise((resolve, reject) => {
    client.createTable(schema, (err, result) => {
      if (err) {
        logger.log("Failed to create table - ", err)
        reject(err)
      }
      logger.log(`${schema.TableName} create!`)
      resolve(result)
    })
  })
}

function parseOutput(output) {
  let json = {}
  if (output.Item === undefined) {
    return false
  }
  Object.keys(output.Item).forEach(key => {
    let field = output.Item[key]
    let type = Object.keys(field)[0]
    if (key === "DEVICE_ID") {
      key = "id"
      field[type] = parseInt(field[type])
    }
    json[key.toLowerCase()] = field[type]
  })
  return json
}

module.exports = {
  init,
  getDevice,
  getRegistration,
  registerDevice,
  deleteRegistration,
  updateRegistration,
  deleteDevice,
  updateDevice,
  getRegistrations,
  getRegistrationById
}

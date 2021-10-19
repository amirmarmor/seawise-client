const AWS = require("aws-sdk")

const deviceSchema = require("./deviceSchema")
const registrationsSchema = require("./registrationsSchema")

let client

async function put(query) {
  return new Promise((resolve, reject) => {
    client.putItem(query, (err, result) => {
      if (err) {
        console.log("failed to put item")
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
        console.log("failed to delete item")
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
        console.log("failed to get item")
        reject(err)
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
        console.log("failed to get item")
        reject(err)
      }
      let items = result.Items.map(Item => {
        return parseOutput({Item})
      })
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
    let device = await getRegistration(sn)
    try {
      await deleteItem(query)
      return deleteDevice(device.id)
    } catch (err) {
      console.log(err)
    }
  } catch (err) {
    console.log(err)
    throw err
  }

}

async function deleteDevice(id) {
  let query = {
    TableName: deviceSchema.table.TableName,
    Key: {
      [deviceSchema.table.AttributeDefinitions[0].AttributeName]: {
        S: id
      }
    }
  }
  return deleteItem(query)
}

function toBool(string){
  if(typeof string === 'boolean'){
    return string
  }
  return string === "true"
}

async function addDevice(device) {

  const query = {
    Item: {
      [deviceSchema.table.AttributeDefinitions[0].AttributeName]: {
        S: device.id
      },
      "OFFSET": {
        S: device.offset
      },
      "CLEANUP": {
        BOOL: toBool(device.cleanup)
      },
      "FPS": {
        S: device.fps
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
        S: params.id
      },
      "OWNER": {
        S: params.owner
      },
      "IP": {
        S: params.ip
      },
      "CHANNELS": {
        S: params.channels
      }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: registrationsSchema.table.TableName
  }
  try {
    return await put(query)
  } catch (err) {
    console.log(err)
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

async function getRegistrationById(id){
  let query = {
    TableName: registrationsSchema.table.TableName,
    ExpressionAttributeNames: {
      "#id": "ID",
      '#sn': "DEVICE_SERIAL_NUMBER"
    },
    FilterExpression: "#id = :id and not (#sn = :zero)",
    ExpressionAttributeValues: {
      ":id": {
        S: id
      },
      ":zero": {
        S: "0"
      }
    }
  }
  return scan(query)
}

async function getDevice(id) {
  let query = {
    TableName: deviceSchema.table.TableName,
    Key: {
      [deviceSchema.table.AttributeDefinitions[0].AttributeName]: {
        S: id
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
    console.log(err)
    throw err
  }
}

async function updateRegistration(registration) {
  try {
    await deleteRegistration(registration.sn)
    return await registerDevice(registration)
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function init(config) {
  try {
    AWS.config.update(config)
    client = new AWS.DynamoDB()

    let tables = await listTables()
    if (!tables || tables.length === 0) {
      await createTable(deviceSchema.table)
      await createTable(registrationsSchema.table)
    }
    if (tables.indexOf(deviceSchema.table.TableName) === -1) {
      await createTable(deviceSchema.table)
    }
    if (tables.indexOf(registrationsSchema.table.TableName) === -1) {
      await createTable(registrationsSchema.table)
    }
    console.log("DB initiated")
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function listTables() {
  return new Promise((resolve, reject) => {
    client.listTables({}, (err, result) => {
      if (err) {
        console.log("Failed to list tables", err)
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
        console.log("Failed to create table - ", err)
        reject(err)
      }
      console.log(`${schema.TableName} create!`)
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
    if(key === "DEVICE_ID"){
      key = "id"
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

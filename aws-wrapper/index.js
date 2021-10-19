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
      console.log(`item inserted`)
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
      console.log(`item deleted`)
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
      console.log(`got item`)
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
      console.log(`got item`)
      let items = result.Items.map(Item => {
        return parseOutput({Item})
      })
      resolve(items)
    })
  })
}

async function update(query) {
  return new Promise((resolve, reject) => {
    client.updateItem(query, (err, result) => {
      if (err) {
        console.log("failed to update item")
        reject(err)
      }
      console.log(`item updated`)
      resolve(result)
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
      let result = await deleteItem(query)
      console.log(result)
      return deleteDevice(device.id)
    } catch (err) {
      console.log(err)
      throw err
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
        BOOL: device.cleanup
      },
      "FPS": {
        S: device.fps
      },
      "RULES": {
        S: device.rules
      },
      "RECORD": {
        S: device.record
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
    let result = await deleteDevice(device.id)
    console.log(`old device ${device.id} deleted - ${JSON.stringify(result)}`)
    result = await addDevice(device)
    console.log(`new device ${device.id} added - ${JSON.stringify(result)}`)
    return result
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function updateRegistration(registration) {
  try {
    let result = await deleteRegistration(registration.sn)
    console.log(`old device ${registration.id} deleted - ${JSON.stringify(result)}`)
    result = await registerDevice(registration)
    console.log(`new device ${registration.id} added - ${JSON.stringify(result)}`)
    return result
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
      let res = await createTable(deviceSchema.table)
      console.log(res)
      res = await createTable(registrationsSchema.table)
      console.log(res)
    }
    if (tables.indexOf(deviceSchema.table.TableName) === -1) {
      let res = await createTable(deviceSchema.table)
      console.log(res)
    }
    if (tables.indexOf(registrationsSchema.table.TableName) === -1) {
      let res = await createTable(registrationsSchema.table)
      console.log(res)
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
  getRegistrations
}

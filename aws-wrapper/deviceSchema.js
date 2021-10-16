const table = {
  AttributeDefinitions: [
    {
      AttributeName: "DEVICE_ID",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "DEVICE_ID",
      KeyType: "HASH"
    }
  ],
  TableName: "DEVICES",
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
}

const defaultConfig = {
  offset: "0",
  cleanup: "true",
  fps: "30",
  rules: "[]"
}

module.exports = {
  table,
  defaultConfig
}
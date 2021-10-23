const table = {
  AttributeDefinitions: [
    {
      AttributeName: "DEVICE_SERIAL_NUMBER",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "DEVICE_SERIAL_NUMBER",
      KeyType: "HASH"
    }
  ],
  TableName: "REGISTRATIONS",
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}

module.exports = {
  table
}
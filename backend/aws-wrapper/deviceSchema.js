const table = {
  AttributeDefinitions: [
    {
      AttributeName: "DEVICE_ID",
      AttributeType: "N"
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

module.exports = {
  table
}
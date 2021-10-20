const table = {
  AttributeDefinitions: [
    {
      AttributeName: "ID",
      AttributeType: "N"
    }
  ],
  KeySchema: [
    {
      AttributeName: "ID",
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
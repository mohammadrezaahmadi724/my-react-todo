import { MongoClient } from 'mongodb'

const uri = "mongodb+srv://rezaranch72_db_user:yRru78NXMBjNX3fM@cluster0.o2ybl6i.mongodb.net/?appName=Cluster0"

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!global._mongoClientPromise) {
  client = new MongoClient(uri)
  global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default clientPromise
import mongoose from 'mongoose'

const MONGO_URI: string | undefined = process.env.MONGO_URI || "mongodb://localhost:27017/qrmatrix"

if (!MONGO_URI){
    throw new Error('No connection string')
}

const ConnectDB = async () => {
    if (mongoose.connection.readyState >= 1){
        console.log('Mongo DB Already connected')
        return
    }

    try {
        const connect = await mongoose.connect(MONGO_URI)
        console.log("Connection successful")
        // return connect
    } catch (error) {
        console.error('Error occured', error)
    }
}
export default ConnectDB
const mongoose = require("mongoose")

const dbName = "dev"
const collectionName = "botv2"
const oldValue = "DEFENSIVE_RIBBON"
const newValue = "MUSCLE_BAND"

async function renameItem() {
  const genericSchema = new mongoose.Schema({}, { strict: false})
  const Model = mongoose.model('TempDoc', genericSchema, collectionName)
  try {
    await mongoose.connect(process.env.MONGO_URI, {dbName})

    const docs = await Model.find().lean()

    for (const doc of docs) {
      let modified = false
      console.log(doc._id)
      const updatedDoc = JSON.parse(JSON.stringify(doc))

      for (let step of updatedDoc.steps ?? []) {
        for (let unit of step.board ?? []) {
          const newItems = unit.items.map((item) => {
            if (item === oldValue) {
              modified = true
              return newValue
            }
            return item
          })
          unit.items = newItems
        }
      }
      if (modified) {
        await Model.updateOne({ _id: doc._id}, { $set: { steps: updatedDoc.steps } })
        console.log(`Updated document with _id: ${doc._id}`)
      }
    }
    console.log("Update complete")
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await mongoose.disconnect()
  }
}

renameItem()
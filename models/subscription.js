const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url, {family: 4})

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  billingCycle: {
    type: String,
    required: true
  },
  nextRenewalDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})

subscriptionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.nextRenewalDate = returnedObject.nextRenewalDate.toLocaleDateString()
    delete returnedObject.__v
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Subscription', subscriptionSchema)
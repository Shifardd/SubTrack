require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Subscription = require('./models/subscription')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))


app.get('/api/subscriptions', (req, res) => {
  Subscription.find({})
    .then(subscriptionsList => {
      res.json(subscriptionsList)
    })
})

app.get('/api/subscriptions/:id', (req, res, next) => {
  Subscription.findById(req.params.id)
    .then(subscription => {
      if(subscription) {
        res.json(subscription)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/subscriptions', (req, res, next) => {
  const body = req.body

  const subscriptionObject = new Subscription ({
    name: body.name,
    amount: body.amount,
    billingCycle: body.billingCycle,
    nextRenewalDate: body.nextRenewalDate,
    category: body.category
  })

  subscriptionObject
    .save()
    .then(savedSubscription => {
      res.json(savedSubscription)
    })
    .catch(error => next(error))
})

app.delete('/api/subscriptions/:id', (req, res, next) => {
  Subscription.findByIdAndDelete(req.params.id)
    .then(removedSubscription => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/subscriptions/:id', (req, res) => {
  const {name, amount, billingCycle, nextRenewalDate, category} = req.body
  if(!name || !amount || !billingCycle || !nextRenewalDate || !category) {
    return res.status(400).send({error: 'input missing'})
  }
  const id = req.params.id
  const subscription = subscriptions.find(sub => sub.id === id)

  subscription.name = name
  subscription.amount = amount
  subscription.billingCycle = billingCycle
  subscription.nextRenewalDate = nextRenewalDate
  subscription.category = category

  res.json(subscription)
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({error: 'Unknown Endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  
  if(error.name === 'CastError') {
    return res.status(400).send({error: 'malformed id'})
  } else if(error.name === 'ValidationError') {
    return res.status(400).send({error: error.message})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
const express = require('express')
const app = express()

let subscriptions = [
    {
      name: "Netflix Premium",
      amount: 549,
      billingCycle: "monthly",
      nextRenewalDate: "2026-08-01",
      category: "Entertainment",
      id: "1"
    },
    {
      name: "GitHub Copilot",
      amount: 5790,
      billingCycle: "yearly",
      nextRenewalDate: "2026-11-15",
      category: "Software",
      i: "2"
    },
    {
      name: "Adobe Creative Cloud",
      amount: 1200,
      billingCycle: "monthly",
      nextRenewalDate: "2026-07-15",
      category: "Software",
      id: "3"
    }
  ]
app.use(express.static('dist'))
app.use(express.json())

app.get('/api/subscriptions', (req, res) => {
  res.json(subscriptions)
})

app.get('/api/subscriptions/:id', (req, res) => {
  const id = req.params.id
  const subscription = subscriptions.find(sub => sub.id === id)
  if(subscription) {
    res.json(subscription)
  } else {
    res.status(404).end()
  }
})

app.post('/api/subscriptions', (req, res) => {
  const body = req.body
  if(!body.name || !body.amount || !body.billingCycle || !body.nextRenewalDate || !body.category) {
    return res.status(400).send({error: 'missing input'})
  }
  const subscriptionObject = {
    name: body.name,
    amount: body.amount,
    billingCycle: body.billingCycle,
    nextRenewalDate: body.nextRenewalDate,
    category: body.category
  }
  subscriptions = subscriptions.concat(subscriptionObject)
  res.json(subscriptionObject)
})

app.delete('/api/subscriptions/:id', (req, res) => {
  const id = req.params.id
  subscriptions = subscriptions.filter(sub => sub.id !== id)
  res.status(204).end()
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
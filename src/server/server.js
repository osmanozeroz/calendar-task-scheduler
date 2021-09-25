import express from "express"
import { nanoid } from "nanoid"
import { Client } from "./lib/redis.js"
import dotenv from "dotenv"
import moment from "moment"
import cors from "cors"

const app = express()
const key = "tasks"
const port = 5000

dotenv.config()

const redis = Client.getInstance(process.env.REDIS_URL)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/task", async function (req, res) {
  let startDate = moment(req.query.startDate)
  let endDate = moment(req.query.endDate)

  const response = await redis.lrange(key, 0, -1)
  const tasks = response.map((task) => JSON.parse(task))
  const result = tasks.filter((task) => {
    const date = moment(task.date)
    return date >= startDate && date <= endDate
  })

  res.send(result)
})

app.post("/task", async function (req, res) {
  const { text, date } = req.body
  const task = { text, date, id: nanoid(), createTime: new Date() }
  await redis.lpush(key, JSON.stringify(task))
  res.send(task)
})

app.listen(port, () => {
  console.log(`Server listening on ${port}`)
})

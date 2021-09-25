const baseApiUrl = "http://localhost:5000"

async function getTasks(startDate, endDate) {
  try {
    const response = await fetch(
      `${baseApiUrl}/task?startDate=${startDate}&endDate=${endDate}`
    )

    const data = await response.json()

    return data
  } catch (err) {
    return null
  }
}

async function addTask(text, date) {
  try {
    const response = await fetch(`${baseApiUrl}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, date }),
    })
    return true
  } catch (err) {
    return false
  }
}

export { getTasks, addTask }

import React, { useEffect, useState } from "react"
import "antd/dist/antd.css"
import {
  Calendar,
  Tag,
  Button,
  Spin,
  Typography,
  Tooltip,
  Row,
  Col,
} from "antd"
import moment from "moment"
import { FileAddOutlined } from "@ant-design/icons"
import { style } from "../styles"
import CreateTask from "./create-task"
import { getTasks } from "../lib/api"
import { crop } from "../lib/helper"

const { Text } = Typography
const maxTextLength = 25

function CalendarTaskView() {
  const [data, setData] = useState([])
  const [isShowCreateTask, setIsShowCreateTask] = useState(false)
  const [taskDate, setTaskDate] = useState(moment())
  const [taskId, setTaskId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentDates, setCurrentDates] = useState({
    startDate: moment().clone().startOf("month"),
    endDate: moment().clone().endOf("month"),
  })

  useEffect(async () => {
    await refreshTasks()
  }, [])

  function getCellData(value) {
    if (!data) {
      return null
    }

    return data.filter((item) => moment(item.date).isSame(value, "day"))
  }

  function showCreateTask(date, id) {
    setTaskDate(date)
    setTaskId(id)
    setIsShowCreateTask(true)
  }

  function dateCellRender(date) {
    const listData = getCellData(date)

    return (
      <>
        <div>
          {listData &&
            listData.map((item) => (
              <Tooltip title={`${item.text}`}>
                <Tag
                  key={`Meeting_${item.id}`}
                  color="volcano"
                  style={{ width: "90%", marginBottom: 3 }}
                  onClick={() => {
                    showCreateTask(date, item.id)
                  }}
                >
                  {crop(item.text, maxTextLength)}
                </Tag>
              </Tooltip>
            ))}
        </div>

        <div style={{ position: "absolute", left: 7, top: 2 }}>
          <Text style={{ opacity: 0.6, fontStyle: "italic" }}>
            {moment(date).format("MMMM")}
            {" - "}
            {moment(date).format("dddd")}
          </Text>
        </div>

        <div style={{ position: "absolute", right: 5, bottom: 5 }}>
          <Button
            onClick={() => {
              showCreateTask(date)
            }}
            type="primary"
            shape="circle"
            icon={<FileAddOutlined />}
          ></Button>
        </div>
      </>
    )
  }

  function onHideCreateTask() {
    setTaskId(null)
    setIsShowCreateTask(false)
  }

  async function onSaveCreateTask() {
    await refreshTasks()
  }

  async function onCalendarChange(value) {
    const date = moment(value)
    const startDate = date.clone().add(-1, "M").startOf("month")
    const endDate = date.clone().add(1, "M").endOf("month")

    if (!currentDates || !startDate.isSame(currentDates.startDate, "day")) {
      await setCurrentDates({
        startDate,
        endDate,
        date,
      })

      await refreshTasks(startDate, endDate)
    }
  }

  async function refreshTasks(startDate, endDate) {
    setLoading(true)
    const data = await getTasks(
      startDate || currentDates.startDate,
      endDate || currentDates.endDate
    )
    setData(data)
    setLoading(false)
  }

  return (
    <>
      {loading ? (
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          <Col>
            <Spin size="large" />
          </Col>
        </Row>
      ) : (
        <Calendar
          value={currentDates.date}
          onChange={onCalendarChange}
          dateCellRender={dateCellRender}
        />
      )}
      <CreateTask
        date={taskDate}
        id={taskId}
        visible={isShowCreateTask}
        onHide={onHideCreateTask}
        onSave={onSaveCreateTask}
      ></CreateTask>
    </>
  )
}

export default CalendarTaskView

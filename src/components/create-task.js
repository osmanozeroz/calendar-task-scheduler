import React, { useEffect, useState } from "react"
import { Modal, Button, Form, Select, Input, InputNumber } from "antd"
import moment from "moment"
import { addTask } from "../lib/api"
import { ExclamationCircleOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { confirm } = Modal

function CreateTask({ id, date, visible, onHide, onSave }) {
  const [form] = Form.useForm()
  const [currentMeetingProject, setCurrentMeetingProject] = useState(null)

  useEffect(async () => {
    if (!id || id <= 0) {
      /* setCurrentMeetingProject(null) */
      form.resetFields()
      return
    }

    //const data = await getMeetingProject(id)
    //setCurrentMeetingProject(data)
    /*  form.setFieldsValue({
      ...data,
      customerId,
    }) */
  }, [id])

  async function onSubmit() {
    form.validateFields().then(async (values) => {
      const result = id
        ? await addTask(values["text"], date)
        : await addTask(values["text"], date)

      if (onSave) {
        onSave()
      }

      onCancel()
    })
  }

  function onCancel() {
    form.resetFields()
    onHide()
  }

  function onDelete() {
    confirm({
      title: "Silmek istediğinizden emin misiniz?",
      icon: <ExclamationCircleOutlined />,
      content: currentMeetingProject.descriptions,
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      async onOk() {
        // delete
        // await deleteMeetingProject(currentMeetingProject.id)

        if (onSave) {
          onSave()
        }

        onCancel()
      },
    })
  }

  let buttons = [
    <Button key="btnCancel" onClick={onCancel}>
      İptal
    </Button>,
    <Button key="btnSave" type="primary" onClick={onSubmit}>
      Kaydet
    </Button>,
  ]

  if (currentMeetingProject) {
    buttons.splice(
      1,
      0,
      <Button key="btnDelete" type="primary" onClick={onDelete} danger>
        Sil
      </Button>
    )
  }

  return (
    <Modal
      title={`${moment(date).format("DD.MM.YYYY")} Tarihli Görev`}
      visible={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      footer={buttons}
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Form.Item
          name="text"
          label="Açıklama"
          rules={[{ required: true, message: "Lütfen açıklama giriniz." }]}
        >
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateTask

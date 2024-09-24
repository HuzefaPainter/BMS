import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { addTheatre, updateTheatre } from '../../apicalls/theatre';

function TheatreForm({
  isModalOpen,
  setIsModalOpen,
  selectedTheatre,
  setSelectedTheatre,
  formType,
  getData,
}) 
{
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);
  

  const onFinish = async(values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if(formType === "add"){
        const newTheatre = values;
        newTheatre.owner = user._id;
        response = await addTheatre(values);
      }
      else{
        const updatedTheatre = values;
        updatedTheatre._id = selectedTheatre._id;
        updatedTheatre.owner = selectedTheatre.owner;
        response = await updateTheatre(values);
      }
      if (response.success) {
        getData();
        message.success(response.message);
      }else{
        message.error(response.message);
      }
      handleCancel();
      dispatch(HideLoading());
    } catch (error) {
      handleCancel();
      dispatch(HideLoading());
      message.error(error.message);
    }
  }

  const handleCancel = () => {
    setSelectedTheatre(null);
    setIsModalOpen(false);
  }

  return (
    <Modal
      centered
      title={formType === "add" ? "Add Theatre" : "Edit Theatre"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={null}
    >
      <Form layout='vertical' initialValues={selectedTheatre} onFinish={onFinish} >
        <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
          <Col span={24}>
            <Form.Item
              label="Theatre Name"
              name="name"
              rules={[{ required: true, message: "Theatre name is required" }]}
            >
              <Input placeholder='Enter the Theatre name' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}
            >
              <TextArea rows={2} placeholder='Enter the theatre address' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
              <Col span={10}>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[{ required: true, message: "Theatre phone number is required" }, {type: "number", message: "Enter a valid Phone Number"}]}
                >
                  <Input placeholder='Enter the Theatre phone number' />
                </Form.Item>
              </Col>
              <Col span={14}>
                <Form.Item
                  label="Email"
                  name="email"
                  htmlFor='email'
                  rules={[{ required: true, message: "Theatre email is required" },
                  { type: "email", message: "Enter a valid email" }
                  ]}>
                  <Input type='email' placeholder='Enter theatre email' />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.Item>
          <Button
            block
            type='primary'
            htmlType='submit'
            style={{ fontSize: "1rem", fontWeight: "600" }}
          >Submit</Button>
          <Button className='mt-3' block onClick={handleCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal >
  )
}

export default TheatreForm

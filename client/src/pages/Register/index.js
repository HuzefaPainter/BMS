import React, { useEffect } from "react";
import { Form, Input, Button, message, Radio } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { RegisterUser } from "../../apicalls/user";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

const Registration = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      if (response.success) {
        message.success(response.message);
        navigate("/login");
        console.log(response.message);
      } else {
        message.error(response.message);
        console.log(response.message);
      }
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <Form name="register" onFinish={onFinish} scrollToFirstError>
        {/* Name Field */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your Name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Name" />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
        <Form.Item
        label="Register as Partner"
        htmlFor="role"
          name="role"
          initialValue={false}
          rules={[{ required: true, message: "Please select the Role!" }]}
        >
          <div>
            <Radio.Group name="radiogroup">
            <Radio value={"partner"}>Yes</Radio>
            <Radio value={"user"}>No</Radio>
            </Radio.Group>
          </div>
        </Form.Item>
      </Form>
      <div className="register-link-container">
            <p>
              Already a User? <Link to="/login">Login</Link>
            </p>
          </div>
    </div>
  );
};

export default Registration;

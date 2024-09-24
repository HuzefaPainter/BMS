import React, { useEffect } from "react";
import { LoginUser } from "../../apicalls/user";
import { Button, Form, Input, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await LoginUser(values);
      console.log(response);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem('token', response.data)
        navigate("/");
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
    if (localStorage.getItem("token")){
      navigate("/");
    }
  }, []);

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Form name="login" onFinish={onFinish} scrollToFirstError>
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

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 6,
            span: 10,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <div className="register-link-container">
        <p>
          New User?<Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

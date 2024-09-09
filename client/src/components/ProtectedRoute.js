import React, { useEffect, useState } from 'react';
import {SetUser} from "../redux/userSlice.js";
import {HideLoading, ShowLoading} from "../redux/loaderSlice";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message, Layout, Menu } from "antd";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { GetCurrentUser } from '../apicalls/user';

function ProtectedRoute({ children }) {
 const { user } = useSelector((state) => state.user);
 const navigate = useNavigate();
 const dispatch = useDispatch();

 const [navItems, setNavItems] = useState([
  {
    key: "home",
    label: "Home",
    icon: <HomeOutlined />,
    onClick: () => navigate("/"),
  },
  {
    key: "logout",
    label: "Logout",
    icon: <LogoutOutlined />,
    onClick: () => {
      console.log("clicked on logout");
      localStorage.removeItem("token");
      navigate("/login");
    },
  }
]);

const { Header, Footer} = Layout;

 const getPresentUser = async () => {
  try {
    dispatch(ShowLoading());
    const response = await GetCurrentUser();
    dispatch(HideLoading());

    if(response.success){
      dispatch(SetUser(response.data));

      const profileItem = {
        key: "user",
        label: `${response.data.name}`,
        icon: <UserOutlined />,
        onClick: () => {
          if (response.data.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/profile");
          }
        },
      };
      let updatedNavItems = [...navItems];
      updatedNavItems.splice(1, 0, profileItem);
      console.log(updatedNavItems);
      setNavItems(updatedNavItems);
    } 
    else{
      handleUserFetchError(response.message);
    }
  } catch (error) {
    handleUserFetchError(error.message);
  }
 }

 const handleUserFetchError = (errorMessage)=>{
  dispatch(HideLoading());
  dispatch(SetUser(null));
  message.error(errorMessage);
  localStorage.removeItem("token");
  navigate("/login");
 };

  useEffect(() => {
    if (localStorage.getItem("token")){
      getPresentUser();
    }
    else{
      navigate("/login")
    }
  }, []);

  return(
    user && (
      <>
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header
            className="d-flex justify-content-between"
            style={{
              background: '#001529', 
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h3 className="demo-logo text-white m-0" style={{ color: "white" }}>
              Book My Show
            </h3>
            <Menu theme="dark" mode="horizontal" items={navItems} style={{ marginLeft: "auto" }}></Menu>
          </Header>

          <div style={{ flex: 1, padding: '24px', background: "#fff" }}>
            {children}
          </div>   

          <Footer
          style={{
            textAlign: 'center',
            background: '#001529', 
            color: 'white',
            position: 'sticky',
            bottom: 0,
            width: '100%',
          }}
        >
          ©2024 Book My Show. All Rights Reserved.
        </Footer>      
        </Layout>
      </>
    )   
  )
}

export default ProtectedRoute;

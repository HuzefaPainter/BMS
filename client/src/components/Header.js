import React from "react";


<AntHeader>
      <div className="logo" style={{ float: 'left', color: 'white', fontSize: '20px' }}>
        MovieBooking
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }}>
        {menuItems.map(item => (
          <Menu.Item key={item.key}>
            <Link to={item.path}>{item.label}</Link>
          </Menu.Item>
        ))}
        {isAuthenticated && (
          <Menu.Item key="6" onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
          }}>
            Logout
          </Menu.Item>
        )}
        {!isAuthenticated && (
          <Menu.Item key="7">
            <Link to="/login">Login</Link>
          </Menu.Item>
        )}
      </Menu>
    </AntHeader>
  
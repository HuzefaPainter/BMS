import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getBookingsByUser } from "../../apicalls/booking";
import { message, Card, Tag, Row, Col, Divider } from "antd";
import moment from "moment";
import { CalendarOutlined, EnvironmentOutlined, PlayCircleOutlined } from "@ant-design/icons";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getBookingsByUser(user._id);
      if (response.success) {
        setBookings(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px" }}>

      {/* Profile Info */}
      <Card>
        <h2 style={{ marginBottom: 4 }}>{user?.name}</h2>
        <p style={{ color: "#888", margin: 0 }}>{user?.email}</p>
        <Tag color={user?.role === "admin" ? "red" : user?.role === "partner" ? "blue" : "green"}
          style={{ marginTop: 8 }}>
          {user?.role?.toUpperCase()}
        </Tag>
      </Card>

      <Divider orientation="left">My Bookings</Divider>

      {/* Bookings */}
      {loading && <p>Loading bookings...</p>}

      {!loading && bookings.length === 0 && (
        <p style={{ color: "#888" }}>No confirmed bookings yet.</p>
      )}

      {bookings.map((booking) => (
        <Card
          key={booking._id}
          style={{ marginBottom: 16 }}
          styles={{ body: { padding: "16px 24px" } }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <h3 style={{ margin: 0 }}>
                <PlayCircleOutlined style={{ marginRight: 8 }} />
                {booking.show?.movie?.title}
              </h3>
              <p style={{ color: "#888", margin: "4px 0" }}>
                <EnvironmentOutlined style={{ marginRight: 4 }} />
                {booking.show?.theatre?.name}, {booking.show?.theatre?.address}
              </p>
              <p style={{ color: "#888", margin: "4px 0" }}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                {moment(booking.show?.date).format("Do MMM YYYY")} at {moment(booking.show?.time, "HH:mm").format("hh:mm A")}
              </p>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <Tag color="green">CONFIRMED</Tag>
              <p style={{ margin: "8px 0 4px", fontWeight: 600 }}>
                Seats: {booking.seats.join(", ")}
              </p>
              <p style={{ color: "#888", fontSize: 12 }}>
                Booked on {moment(booking.createdAt).format("Do MMM YYYY")}
              </p>
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
}

export default Profile;

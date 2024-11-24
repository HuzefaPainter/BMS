import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getShow } from "../../apicalls/show";
import { bookShow, makePayment } from "../../apicalls/booking";
import { Button, message, Card, Row, Col } from "antd";
import moment from "moment";

function BookShow() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [show, setShow] = useState();
  const [selectedSeats, SetselectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getShow(params.id);
      if (response.success === true) {
        setShow(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const getSeats = () => {
    let columns = 12;
    let totalSeats = show.totalSeats;
    let rows = Math.ceil(totalSeats / columns);

    return (
      <div className="d-flex flex-column align-items-center">
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">All eyes on the screen</p>
          <div className="screen-div">
            {/* Placeholder for screen display */}
          </div>
        </div>
        <ul
          className="seat-ul justify-content-center"
          style={{ marginLeft: "25%" }}
        >
          {Array.from(Array(rows).keys()).map((rowNo) => {
            const arrOfSeats = Array.from(Array(columns).keys()).map(
              (columnNo) => {
                let seatNumber = rowNo * columns + columnNo + 1;
                let seatClass = "seat-btn";
                if (selectedSeats.includes(seatNumber)) {
                  seatClass += "selected";
                }
                if (show.bookedSeats.includes(seatNumber)) {
                  seatClass += "booked";
                }
                if (seatNumber <= totalSeats) {
                  return (
                    <li key={seatNumber}>
                      <button
                        className={seatClass}
                        onClick={() => {
                          if (selectedSeats.includes(seatNumber)) {
                            SetselectedSeats(
                              selectedSeats.filter(
                                (curSeatNumber) => curSeatNumber !== seatNumber
                              )
                            );
                          } else {
                            SetselectedSeats([...selectedSeats, seatNumber]);
                          }
                        }}
                      >
                        {seatNumber}
                      </button>
                    </li>
                  );
                }
              }
            );
            return (
              <Row>
                {arrOfSeats.map((ele)=>ele)}
              </Row>
            )
          })}
        </ul>
        <div
          className="d-flex bottom-card justify-content-between w-100 max-width-600
  mx-auto mb-25px mt-3"
        >
          <div className="flex-1">
            Selected Seats:<span>{selectedSeats.join(",")}</span>
          </div>
          <div className="flex-shrink-0 ms-3">
            Total price:{" "}
            <span>Rs. {selectedSeats.length * show.ticketPrice} </span>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePayU = async () => {
    try {
      dispatch(ShowLoading());
      const response = await makePayment({
        amount: selectedSeats.length * show.ticketPrice,
        firstname: user.name,
        email: user.email,
        bookingInfo: show.movie.title,
        txnid: `txn_${new Date().getTime()}`,
      });

      if (response.success === true) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "https://sandboxsecure.payu.in/_payment";

        Object.keys(response.data).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = response.data[key];
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const book = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await bookShow({
        show: params.id,
        transactionId,
        seats: selectedSeats,
        user: user._id,
      });

      if (response.success === true) {
        message.success(response.message);
        navigate("/profile");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (err) {
      console.log(err);
      dispatch(HideLoading());
    }
  };

  return (
    <div>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div className="movie-title-details">
                  <h1>{show.movie.title}</h1>
                  <p>
                    Theatre: {show.theatre.name}, {show.theatre.address}
                  </p>
                </div>
              }
              extra={
                <div className="show">
                  <h3>
                    <span>Show Name: </span> {show.name}
                  </h3>
                  <h3>
                    <span>
                      Date & Time: {moment(show.date).format("MM Do YYYY")} at{" "}
                      {moment(show.time, "HH:mm").format("hh:mm A")}
                    </span>
                  </h3>
                  <h3>
                    <span>Total Seats: </span> {show.totalSeats}
                    <span> &nbsp;|&nbsp; Available Seats: </span>{" "}
                    {show.totalSeats - show.bookedSeats.length}
                  </h3>
                </div>
              }
              style={{ width: "100%" }}
            >
              {getSeats()}
              {selectedSeats.length > 0 && (
                <div className="max-width-600 mx-auto">
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    block
                    onClick={async () => {
                      try {
                        await handlePayU();
                        const transactionId = `txn_${new Date().getTime()}`;
                        await book(transactionId);
                      } catch (err) {
                        message.error(
                          "Payment or booking failed. Please try again."
                        );
                      }
                    }}
                  >
                    Pay Now
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookShow;

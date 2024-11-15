import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { getShow } from '../../../../server/controllers/showController';
import { Button, message } from 'antd';

function BookShow() {
    const {user} = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const [show, setShow] = useState();
    const [selectedSeats, SetselectedSeats] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    const getData = async () => {
      try {
        dispatch(ShowLoading());
        const response = await getShow({showId: params.id});
        if (response.success === true){
          setShow(response.data);
        }else{
          message.error(response.message)
        }
        dispatch(HideLoading());
      } catch (error) {
        message.error(error.message);
        dispatch(HideLoading());       
      }
    };

    const getSeats =() => {
      let columns = 12;
      let totalSeats = show.totalSeats;
      let rows = Math.ceil(totalSeats/columns);

      return(
        <div className="d-flex flex-column align-items-center">
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">All eyes on the screen</p>
          <div className="screen-div">
            {/* Placeholder for screen display */}
          </div>
        </div>
          <ul className="seat-ul justify-content-center" style={{marginLeft: "25%" }}>
            {Array.from(Array(rows).keys()).map((rows) => Array.from(Array(columns).keys()).map(column =>{
              let seatNumber = rows * columns + column + 1;
              let seatClass = "seat-btn";
              if (selectedSeats.includes(seatNumber)){
                seatClass += "selected";
              }
              if (show.bookedSeats.includes(seatNumber)){
                seatClass += "booked";
              }
              if (seatNumber <= totalSeats){
                return(
                  <li key={seatNumber}>
                    <button className={seatClass} onClick={() => {if(selectedSeats.includes(seatNumber)){
                      SetselectedSeats(selectedSeats.filter((curSeatNumber)=> curSeatNumber !== seatNumber));
                    } else{
                      SetselectedSeats([...selectedSeats, seatNumber]);
                    }                   
                    }}>
                      {seatNumber}
                    </button>
                  </li>
                );
              }
            }))}
          </ul>
          <div className='d-flex bottom-card justify-content-between w-100 max-width-600
  mx-auto mb-25px mt-3'>
    <div className='flex-1'>
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

    const onToken = async (token) =>{
      dispatch(ShowLoading());
      const response = await makePayment(
        token,
        selectedSeats.length * show.ticketPrice
      );
      if(response.status = "success") {
        message.success(response.message);
        book(response.data)
      } else{
        message.success(response.message)
      }
      dispatch(HideLoading());
        }

    const book = async (transactionId) => {
      try {
        dispatch(ShowLoading());
        const response = await bookShow({
          show: params.id, transactionId,
          seats: selectedSeats,
          user: user._id,          
        });
        if (response.status = "success"){
          message.success(response.message);
        }
        dispatch(HideLoading());
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
          <Card title={<div className='movie-title-details'>
            <h1>{show.movie.title}</h1>
            <p>
              Theatre: {show.theatre.name}, {show.theatre.address}
            </p>
          </div>}
          extra = {
            <div className='show'>
              <h3>
                <span>Show Name: </span> {show.name}
              </h3>
              <h3>
                <span>
                  Date & Time: {moment (show.date).format("MM Do YYYY")} at {" "}
                  {moment (show.time, "HH:mm").format("hh:mm A")}
                </span>
              </h3>
              <h3>
                <span>Total Seats: </span> {show.totalSeats}
                <span> &nbsp;|&nbsp; Available Seats: </span> {" "}
                {show.totalSeats - show.bookedSeats.length}
              </h3>
            </div>
          }
          style={{ width: "100%" }}
          >
            {getSeats()}
            {/* {selectedSeats.length > 0 && (
              <StripeCheckout token={onToken} amount={selectedSeats.length * show.ticketPrice * 100}>
                <div className="max-width-600 mx-auto">
                  <Button type="primary" shape='round' size='large'block>
                    Pay Now
                  </Button>
                </div>
              </StripeCheckout>
            )} */}
            
          </Card>
          </Col>
        </Row>
      )}
      
    </div>
  )
}

export default BookShow

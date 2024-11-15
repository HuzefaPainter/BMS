import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovie } from "../../apicalls/movie";
import { getAllTheatresByMovie } from "../../apicalls/theatre";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { message, Input, Divider, Row, Col } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";

const SingleMovie = () => {
    const params = useParams();
    const [movie, setMovie] = useState();
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [theatres, setTheatres] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleDate = (e) => {
        setDate(moment(e.target.value).format("YYYY-MM-DD"));
        navigate(`/movie/${params.id}`);
    };

    const getData = async () => {
        try {
            dispatch(ShowLoading());
            const response = await getMovie(params.id);
            if (response.success === true) {
                setMovie(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(HideLoading());
        } catch (error) {
            console.log("Error while getting all movies", error);
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    const getAllTheatres = async () => {
        try {
            dispatch(ShowLoading())
            const response = await getAllTheatresByMovie(params.id);
            if (response.success === true) {
                setTheatres(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(HideLoading())
        } catch (error) {
            dispatch(HideLoading())
            message.error(error.message);
        }

    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getAllTheatres();
    },[]);

    return (
        <div>
            {movie && (
                <div>
                    <div>
                        <img src={movie.poster} width={150} alt="Movie Poster" />                 
                    </div>
                    <div>
                        <h1>{movie.title}</h1>
                        <p>
                            Language: <span>{movie.language}</span>
                        </p>
                        <p>
                            Genre: <span>{movie.genre}</span>
                        </p>
                        <p>
                            Release Date : <span>{moment(movie.date).format("DD-MM-YYYY")}</span>
                        </p>
                        <p>
                            Movie duration: <span>{movie.duration} Minutes</span>
                        </p>
                        <hr />
                        <div>
                            <label>Choose the date:</label>
                            <Input onChange={handleDate} type="date" min={moment().format("YYYY-MM-DD")} value={date} placeholder="default size" prefix={<CalendarOutlined />}></Input>
                        </div>
                    </div>
                </div>
            )}
            {theatres.length === 0 && (
                <div>
                    <h2>
                        Currently, no shows available for this movie 
                    </h2>
                </div>
            )}
            {theatres.length > 0 && (
                <div>
                    <h2>Theatres</h2>
                    {theatres.map((theatre) => {
                        return (
                            <div key={theatre._id}>
                                <Row gutter={24} key={theatre._id}>
                                    <Col xs={{span:24}} lg={{span:8}}>
                                    <h3>{theatre.name}</h3>
                                    <p>{theatre.address}</p>
                                    </Col>
                                    <Col xs={{span: 24}} lg={{span: 16}}>
                                    <ul>
                                        {theatre.shows.sort((a,b) => moment(a.time, "HH:mm") - moment(b.time, "HH:mm"))
                                        .map((singleShow) =>
                                        {
                                            return(
                                                <li key= {singleShow._id} onClick={()=> navigate(`/book-show/${singleShow._id}`)}>
                                                    {moment(singleShow.time, "HH:mm").format("hh:mm A")}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default SingleMovie

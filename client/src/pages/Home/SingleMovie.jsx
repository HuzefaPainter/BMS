import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovie } from "../../apicalls/movie";
import { getAllTheatresByMovie } from "../../apicalls/theatre";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { message, Input, Row, Col, Tag } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import moment from "moment";

const SingleMovie = () => {
  const params = useParams();
  const [movie, setMovie] = useState();
  const [date, setDate] = useState("");  // empty by default
  const [theatres, setTheatres] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDate = (e) => {
    setDate(moment(e.target.value).format("YYYY-MM-DD"));
  };

  const getAvailableDates = () => {
    const now = moment();
    const dateSet = new Set();
    theatres.forEach((theatre) => {
      theatre.shows.forEach((show) => {
        const showDateTime = moment(`${show.date} ${show.time}`, "YYYY-MM-DD HH:mm");
        if (showDateTime.isAfter(now)) {
          dateSet.add(moment(show.date).format("YYYY-MM-DD"));
        }
      });
    });
    return Array.from(dateSet).sort();
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
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getAllTheatres = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllTheatresByMovie(params.id);
      if (response.success === true) {
        setTheatres(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // filter shows for selected date, excluding past shows
  const getFilteredShows = (shows) => {
    const now = moment();
    return shows
      .filter((show) => {
        const showDateTime = moment(
          `${show.date} ${show.time}`,
          "YYYY-MM-DD HH:mm"
        );
        const isToday = moment(show.date).isSame(date, "day");
        const isFuture = showDateTime.isAfter(now);
        return isToday && isFuture;
      })
      .sort((a, b) =>
        moment(a.time, "HH:mm").diff(moment(b.time, "HH:mm"))
      );
  };

  // only show theatres that have at least one valid show for selected date
  const getFilteredTheatres = () => {
    if (!date) return [];
    return theatres
      .map((theatre) => ({
        ...theatre,
        shows: getFilteredShows(theatre.shows),
      }))
      .filter((theatre) => theatre.shows.length > 0);
  };

  useEffect(() => {
    getData();
    getAllTheatres();
  }, []);

  const filteredTheatres = getFilteredTheatres();

  return (
    <div>
      {movie && (
        <div>
          <div>
            <img src={movie.poster} width={150} alt="Movie Poster" />
          </div>
          <div>
            <h1>{movie.title}</h1>
            <p>Language: <span>{movie.language}</span></p>
            <p>Genre: <span>{movie.genre}</span></p>
            <p>Release Date: <span>{moment(movie.releaseDate).format("DD-MM-YYYY")}</span></p>
            <p>Duration: <span>{movie.duration} Minutes</span></p>
            <hr />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "16px" }}>
              {getAvailableDates().map((availableDate) => (
                <Tag
                  key={availableDate}
                  color={date === availableDate ? "blue" : "default"}
                  style={{ cursor: "pointer", fontSize: "14px", padding: "6px 12px" }}
                  onClick={() => setDate(availableDate)}
                >
                  {moment(availableDate).format("DD MMM YYYY")}
                </Tag>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* no date selected yet */}
      {!date && (
        <div>
          <h2>Select a date to see available shows</h2>
        </div>
      )}

      {!date && getAvailableDates().length === 0 && (
        <h2>No upcoming shows available for this movie</h2>
      )}

      {/* date selected and shows exist */}
      {date && filteredTheatres.length > 0 && (
        <div>
          <h2>Theatres</h2>
          {filteredTheatres.map((theatre) => (
            <div key={theatre._id}>
              <Col gutter={24}>
                <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                  <h3>{theatre.name}</h3>
                  <p>{theatre.address}</p>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {theatre.shows.map((show) => (
                      <Tag
                        key={show._id}
                        color="blue"
                        style={{ cursor: "pointer", fontSize: "14px", padding: "6px 12px" }}
                        onClick={() => navigate(`/book-show/${show._id}`)}
                      >
                        {moment(show.time, "HH:mm").format("hh:mm A")}
                      </Tag>
                    ))}
                  </div>
                </Col>
              </Col>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleMovie;

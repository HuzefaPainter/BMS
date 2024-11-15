import React from 'react';
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { useEffect, useState } from 'react';
import {message, Row, Col, Input} from "antd";
import {useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { getAllMovie } from '../../apicalls/movie';
import "./home.css";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllMovie();
      if (response.success === true){
        setMovies(response.data);
      }
      else{
        message.error(response.message)
      }
      dispatch(HideLoading())
    } catch (error) {
      console.log("Error while getting all movies", error);
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSearch = (e) =>{
    setSearchText(e.target.value);
    console.log("searchText", searchText);
  }

  return (
    <div>
      <Row className="center-search-bar">
      <Col xs={{ span: 24 }} lg={{ span: 12 }}>
        <Input
          className="search-input"
          placeholder="Search movies"
          onChange={handleSearch}
          prefix={<SearchOutlined />}
        />
        <br />
        <br />
        <br />
        </Col>
      </Row>
      <Row gutter={{xs: 8, sm:16, md: 24, lg: 32}}>
        {movies && movies.filter((movie) => movie.title.toLowerCase().includes(searchText.toLowerCase())).map((movie) => 
        <Col key={movie._id} span={{xs: 24, sm: 24, md: 12, lg: 10}}>
          <div> 
            <img onClick={() => { navigate(`/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`);}} src={movie.poster} alt="Movie Poster" width={200} height={300} style={{borderRadius: "8px"}}/>
            <h3 onClick={() => { navigate(`/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`);}}>{movie.title}</h3>
          </div>        
        </Col>
        )
        }
      </Row>
    </div>
  )
}

export default Home;

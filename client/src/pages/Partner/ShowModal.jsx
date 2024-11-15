import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { getAllMovie } from "../../apicalls/movie.js";
import {
  addShow,
  deleteShow,
  getShowsByTheatre,
  updateShow,
} from "../../apicalls/show";
import moment from "moment";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";

function ShowModal({ isShowModalOpen, setShowModalOpen, selectedTheatre }) {
  const [view, setView] = useState("table");
  const [movies, setMovies] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [shows, setShows] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Use form instance

  const handleCancel = async () => {
    setShowModalOpen(false);
  };

  const handleDelete = async (showId) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      response = await deleteShow(showId);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const getData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const movieResponse = await getAllMovie();
      if (movieResponse.success) {
        setMovies(movieResponse.data);
      } else {
        message.error(movieResponse.message);
      }
      const showResponse = await getShowsByTheatre(selectedTheatre._id);
      if (showResponse.success) {
        setShows(showResponse.data);
      } else {
        message.error(showResponse.error);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  }, [dispatch, selectedTheatre]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (view === "edit" && selectedShow) {
      form.setFieldsValue({
        movie: selectedMovie.title
      });
    } else if (view === "form") {
      form.resetFields();
    }
  }, [view, selectedShow, form, selectedMovie]);


  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (view === "form") {
        response = await addShow({ ...values, theatre: selectedTheatre._id });
      } else {
        response = await updateShow({
          ...values,
          _id: selectedShow._id,
          theatre: selectedTheatre._id,
        });
      }
      if (response.success) {
        message.success(response.message);
        getData();
        setView("table");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const showColumns = [
    {
      title: "Show name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Show date",
      dataIndex: "date",
      key: "date",
      render: (text) => {
        return moment(text).format("DD/MM/YYYY");
      },
    },
    {
      title: "Show time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render: (text, data) => {
        return data.movie.title;
      },
    },
    {
      title: "Ticket price",
      dataIndex: "ticketPrice",
      key: "ticketPrice",
    },
    {
      title: "Total seats",
      dataIndex: "totalSeats",
      key: "totalSeats",
    },
    {
      title: "Available seats",
      dataIndex: "bookedSeats",
      key: "bookedSeats",
      render: (text, data) => {
        return data.totalSeats - data.bookedSeats;
      },
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: (text, data) => {
        return (
          <div>
            <Space>
              <Button
                onClick={() => {
                  setView("edit");
                  setSelectedMovie(data.movie);
                  setSelectedShow({
                    ...data,
                    date: moment(data.date).format("YYYY-MM-DD"),
                  });
                }}
              >
                <EditOutlined />
              </Button>
              <Button onClick={() => handleDelete(data._id)}>
                <DeleteOutlined />
              </Button>
              {data.isActive && (
                <Button onClick={() => setShowModalOpen(true)}>+ Shows</Button>
              )}
            </Space>
          </div>
        );
      },
    },
  ];

  
  
  return (
    <Modal
      centered
      title={selectedTheatre.name}
      open={isShowModalOpen}
      onCancel={handleCancel}
      width={1200}
      footer={null}
    >
      <div>
        <h3>
          {view === "table"
            ? "List of shows"
            : view === "form"
              ? "Add Show"
              : "Edit Show"}
        </h3>
        {view === "table" && (
          <Space direction="vertical">
            <Button type="primary" onClick={() => setView("form")}>
              Add Show
            </Button>
            <br />
          </Space>
        )}
      </div>
      {view === "table" && <Table dataSource={shows} columns={showColumns} />}

      {(view === "form" || view === "edit") && (
        <Form
        form={form} // Attach the form instance
          layout="vertical"
          style={{ width: "100%" }}
          initialValues={view === "edit" ? selectedShow : null}
          onFinish={onFinish}
        >
          <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
            <Col span={24}>
              <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                <Col span={8}>
                  <Form.Item
                    label="Show Name"
                    htmlFor="name"
                    name="name"
                    rules={[
                      { required: true, message: "Show Name is Required" },
                    ]}
                  >
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter the show name"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <FormItem
                    label="Show Date"
                    htmlFor="date"
                    name="date"
                    rules={[
                      { required: true, message: "Show date is required" },
                    ]}
                  >
                    <Input
                      id="date"
                      type="date"
                      placeholder="Enter show date"
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    label="Show Time"
                    htmlFor="time"
                    name="time"
                    rules={[
                      { required: true, message: "Show time is required" },
                    ]}
                  >
                    <Input
                      id="time"
                      type="text"
                      placeholder="Enter show time"
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                <Col span={8}>
                  <FormItem
                    label="Select the Movie"
                    htmlFor="movie"
                    name="movie"
                    rules={[{ required: true, message: "Movie is required!" }]}
                  >
                    <Select
                      id="movie"
                      placeholder="Select Movie"
                      //initialValues={selectedMovie && selectedMovie.title}
                      style={{ width: "100%", height: "45px" }}
                      options={movies.map((movie) => ({
                        key: movie._id,
                        value: movie._id,
                        label: movie.title,
                      }))}
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    label="Ticket price"
                    htmlFor="ticketPrice"
                    name="ticketPrice"
                    rules={[
                      { required: true, message: "Ticket Price is required!" },
                    ]}
                  >
                    <Input
                      id="ticketPrice"
                      type="number"
                      placeholder="Enter the ticket price"
                    />
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    label="Total seats"
                    htmlFor="totalSeats"
                    name="totalSeats"
                    rules={[
                      { required: true, message: "Total Seats is required!" },
                    ]}
                  >
                    <Input
                      id="totalSeats"
                      type="number"
                      placeholder="Enter the total number of seats"
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Space>
              <Button
                className=""
                block
                onClick={() => {
                  setView("table");
                }}
                htmlType="button"
              >
                <ArrowLeftOutlined /> Go Back
              </Button>
              <Button
                className=""
                block
                type="primary"
                htmlType="submit"
                style={{ fontSize: "1rem", fontWeight: "600" }}
              >
                {view === "form" ? "Add Show" : "Edit Show"}
              </Button>
            </Space>
          </Row>
        </Form>
      )}
    </Modal>
  );
}

export default ShowModal;

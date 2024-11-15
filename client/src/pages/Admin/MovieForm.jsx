import React from "react";
import moment from "moment";
import { addMovie, updateMovie } from "../../apicalls/movie";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

function MovieForm({
  isModalOpen,
  setIsModalOpen,
  selectedMovie,
  setSelectedMovie,
  formType,
  getData,
}) {
  const dispatch = useDispatch();

  if (selectedMovie) {
    selectedMovie.releaseDate = moment(selectedMovie.releaseDate).format(
      'YYYY-MM-DD'
    );
  }

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;
      if (formType === "add") {
        console.log(values);
        console.log("release date value:", values.releaseDate)
        response = await addMovie(values);
      } else {
        const updatedMovie = values;
        updatedMovie._id = selectedMovie._id;
        response = await updateMovie(updatedMovie);
      }

      if (response.success) {
        getData();
        message.success(response.message);
      } else {
        message.error(response.message);
      }
      handleCancel();
      dispatch(HideLoading());
    } catch (e) {
      dispatch(HideLoading());
      handleCancel();
      message.error(e.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <Modal
      centered
      title={formType === "add" ? "Add Movie" : "Edit Movie"}
      open={isModalOpen}
      onCancel={handleCancel}
      width={800}
      footer={null}
    >
      <Form layout="vertical" initialValues={selectedMovie} onFinish={onFinish}>
        <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="title"
              rules={[{ required: true, message: "Movie name is required" }]}
            >
              <Input placeholder="Enter movie name" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is needed" }]}
            >
              <TextArea rows={4} placeholder="Enter movie description" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
              <Col span={8}>
                <Form.Item
                  label="Movie Duration (in mins)"
                  name="duration"
                  rules={[
                    { required: true, message: "Movie duration is required" },
                  ]}
                >
                  <Input type="number" placeholder="Enter the movie duration" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Movie Language" name="language" rules={[{ required: true, message: "Enter movie language" }]}>
                  <Select placeholder="Select Language" options={[{ value: "English", label: "English" }, { value: "Hindi", label: "Hindi" }, { value: "Marathi", label: "Marathi" }]} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Release Date" name="releaseDate" rules={[{ required: true, message: "Movie release date is required" }]}>
                  <Input type='date' />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }} >
              <Col span={8}>
                <Form.Item label="Select Movie Genre" name="genre" rules={[{ required: true, message: "Movie Genre is required" }]}>
                  <Select placeholder="Select Genre" options={[{ value: "Action", label: "Action" }, { value: "Sci-Fi", label: "Sci-Fi" }, { value: "Horror", label: "Horror" }, { value: "Comedy", label: "Comedy" }, { value: "Thriller", label: "Thriller" }, { value: "Drama", label: "Drama" },{value: "Biography", label: "Biography" },]} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Poster url" name="poster" rules={[{ required: true, message: "Movie poster is required" }]}>
                  <Input placeholder='Enter poster url' />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Form.Item>
          <Button
            block
            type='primary'
            htmlType='submit'
            style={{ fontSize: "1rem", fontWeight: "600" }}
          >Submit</Button>
          <Button className='mt-3' block onClick={handleCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default MovieForm;

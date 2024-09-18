import React from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice";
import { deleteMovie } from "../../apicalls/movie";
import { message, Modal } from "antd";

function DeleteMovie({
  isDeleteModalOpen,
  setDeleteModalOpen,
  getData,
  selectedMovie,
  setSelectedMovie,
}) {

  const dispatch = useDispatch();
  const handleOk = async () => {
    try {
      dispatch(ShowLoading());
      const response = await deleteMovie(selectedMovie._id);
      console.log(response);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      handleCancel();
      dispatch(HideLoading());
    } catch (e) {
      message.error(e.message);
      handleCancel();
      dispatch(HideLoading());
    }
  };
  const handleCancel = () => {
    setSelectedMovie(null);
    setDeleteModalOpen(false);
  };
  return (
    <Modal
      centered
      title="Delete Movie"
      open={isDeleteModalOpen}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      Are you sure you want to delete this movie?
    </Modal>
  );
}
export default DeleteMovie;

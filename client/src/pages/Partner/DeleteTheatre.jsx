import React from 'react'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import {deleteTheatre} from '../../apicalls/theatre';
import { message, Modal } from 'antd';

function DeleteTheatre({
    isDeleteModalOpen,
    setDeleteModalOpen,
    selectedTheatre,
    setSelectedTheatre,
    getData,
}) {
    const dispatch = useDispatch();
    const handleOk = async () =>{
        try {
            dispatch(ShowLoading());
            const response = await deleteTheatre(selectedTheatre._id);
            console.log("from deletetheatre page", response);
            if (response.success){
                message.success(response.message);
                getData()
            }
            else{
                message.error(response.message)
            }
            handleCancel();
            dispatch(HideLoading());           
        } catch (error) {
            message.error(error.message)
            handleCancel();
            dispatch(HideLoading()); 
        }
    };

    const handleCancel = () => {
        setSelectedTheatre(null);
        setDeleteModalOpen(false);
    };

  return (
    <div>
      <Modal
      centered
      title= "Delete Theatre"
      open={isDeleteModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}>
        Are you sure you want to delete this theatre?
      </Modal>
    </div>
  )
}

export default DeleteTheatre

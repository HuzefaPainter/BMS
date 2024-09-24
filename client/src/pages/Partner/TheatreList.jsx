import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { HideLoading, ShowLoading } from "../../redux/loaderSlice.js";
import TheatreForm from "./TheatreForm.jsx";
import DeleteTheatre from "./DeleteTheatre.jsx";
import {getAllTheatres, getAllTheatresByOwner, updateTheatre} from "../../apicalls/theatre.js"

function TheatreList() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [theatres, setTheatres] = useState([]);
    const [selectedTheatre, setSelectedTheatre] = useState(null);
    const [formType, setFormType] = useState("add");
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.user);
    const isAdmin = user.role === 'admin'

    const handleStatusUpdate = async(theatre) =>{
      try {
        dispatch(ShowLoading());
        theatre.isActive = !theatre.isActive;
        const response = await updateTheatre(theatre);
        if (response.success) {
          message.success(response.message);
          await getData();
        } else{
          message.error(response.message)
        }
        dispatch(HideLoading());
      } catch (error) {
        dispatch(HideLoading());
        console.log("Error while updating status:", error.message);        
      };
    }

    const adminActions = (data) =>{
      if (data.isActive){
        return(
          <div>
            <Button onClick={() => {handleStatusUpdate(data);}}>Block</Button>
          </div>
        )      
      }else{
        return(
          <div>
            <Button onClick ={() => {handleStatusUpdate(data);}}>Approve</Button>
          </div>
        );
      }
    };

    const tableHeadings =([
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "Address",
        dataIndex: "address"
      },
      {
        title: "Phone Number",
        dataIndex:"phoneNumber"
      },
      {
        title:"Email",
        dataIndex:"email"
      },
      {
        title:"status",
        dataIndex: "isActive",
        render: (bool) =>{
          return bool ? "Active" : "Pending/Blocked";
        }
      },
      {
        title: "Action",
        render: (text, data) => {
          if (isAdmin){
            return adminActions(data);
          }
          return(
            <div>
              <Button onClick={() => {setIsModalOpen(true); setSelectedTheatre(data); setFormType("edit");}}>
                <EditOutlined/>
              </Button>
              <Button onClick={() => {setDeleteModalOpen(true); setSelectedTheatre(data);}}>
                <DeleteOutlined/>
              </Button>
            </div>
          )
        }
      }
    ]);


    const getData = useCallback(async () => {
      try {
        dispatch(ShowLoading());
        let response;
        if (isAdmin) {
          response = await getAllTheatres();
        }else{
          response = await getAllTheatresByOwner(user._id);
        }
        const allTheatres = response.data;
        setTheatres(allTheatres.map((theatre)=> {
          theatre.key = `theatre${theatre._id}`;
          return theatre;
        }))
        dispatch(HideLoading());
      } catch (error) {
        dispatch(HideLoading());
        message.error(error.message);
      }
    }, [dispatch, isAdmin, user._id]);

    useEffect(() => {
      getData();
    }, [getData]);

  return (
    <div>
      <Button onClick={() => {
        setIsModalOpen(true);
        setFormType("add");}}>
          Add Theatre
        </Button>
        <div style={{marginBottom: 10}}/>
        <Table dataSource={theatres} columns={tableHeadings}/>

        {isModalOpen && (
        <TheatreForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          formType={formType}
          getData={getData}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteTheatre
          isDeleteModalOpen={isDeleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          getData={getData}
          selectedTheatre={selectedTheatre}
          setSelectedTheatre={setSelectedTheatre}
        />
      )}
    </div>
  )
}

export default TheatreList;


import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios"
function DeleteModal({index,rowData,show,handleClose,updateAllProjectList}) {

    const [loading,setLoading] = useState(false)

    const handleDelete =async()=>{
        if(loading) return
        setLoading(true)
        try{
            const res =  await axios.delete(`/api/project/${rowData._id}`)
            if(res.data.success){
              setLoading(false)
              updateAllProjectList({index})
              handleClose()
            }else{
              console.log(res.data.error)
            }
        }catch(e){
          console.log(e)
        }
        setLoading(false)
    }

  return (
   
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This project will be deleted from the database</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    
  );
}

export default DeleteModal
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import style from "../../styles/next/adminLoginModal.module.css"
import axios from "axios"

function AdminLoginModal({setLoggedIn}) {

    const [loading,setLoading] = useState(false)
    const [show,setShow] = useState(true)

    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [err,setErr] = useState("")

    const handleLogin = async ()=>{
      setErr("")
      if(loading) return
      setLoading(true)
      try{
        const res = await axios.post(`/api/admin/login`,{
          username,
          password
        })
        console.log(res)
        if(res.data.success){
          setLoggedIn(true)
        }else{
          setErr("Invalid Credentials")
        }
      }catch{
        setErr("Server Error")
      }
      setLoading(false)
    }


    return (
    
        <Modal show={show} >
          <Modal.Header closeButton>
            <Modal.Title>Admin Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className={style.main}>
              
              <div className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Username</div>
                  <input value={username} onChange={(e)=>setUsername(e.target.value)} />
                </div>
              </div>
              
              <div className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Password</div>
                  <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                </div>
              </div>
            </div>
            <div>{err}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={()=>handleLogin()}>
              Login
            </Button>
          </Modal.Footer>
        </Modal>
      
    );
}

export default AdminLoginModal
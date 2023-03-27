import { useEffect, useMemo, useState } from "react";
import {Modal,Button} from "react-bootstrap"
import axios from "axios"
import style from "../../styles/next/newsModal.module.css"
import DatePicker from "react-datepicker";
import moment from "moment"

function EditNewsModal({show,rowData,handleClose,index,updateAllNewsList}) {
  
  const [newsDataOriginal,setNewsDataOriginal] = useState({})
  const [newsDataEdited,setNewsDataEdited] = useState({})
  
  const [update,setUpdate] = useState(1)
  const [changeCoverImg,setChangeCoverImg] = useState(null)
  const [changeDisplayImg,setChangeDisplayImg] = useState(null)

  const [tagsInput,setTagsInput] = useState("")

  useEffect(()=>{
    
    setNewsDataEdited({})
    setNewsDataOriginal({})
    setChangeCoverImg(null)
    setChangeDisplayImg(null)
    const fetchData = async ()=>{
      if(!rowData._id) return
      const res = await axios.get(`/api/news/${rowData._id}`)
      if(res.data.success){
        setNewsDataOriginal(res.data.data)
        setNewsDataEdited(res.data.data)

      }else{
        console.log("failed")
      }
    }

    fetchData()

  },[show])


  const handleUpdateNews = async()=>{
    let formData = new FormData()
    formData.append("_id",newsDataEdited._id)
    formData.append("title",newsDataEdited.title)
    
    for(let i=0;i<newsDataEdited.tags.length;i++){
      formData.append("tags[]",newsDataEdited.tags[i])
    }
    formData.append("twitterLink",newsDataEdited.twitterLink)
    formData.append("discordLink",newsDataEdited.discordLink)
    formData.append("markdown",newsDataEdited.markdown)

    if(changeCoverImg)
      formData.append("coverImage",changeCoverImg)
    if(changeDisplayImg)
      formData.append("displayImage",changeDisplayImg)
    
    try{
      const response = await axios({
        method: "post",
        url: `/api/news/update`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
  
      if(response.data.success){           
          // Call the update on the main list of news
          updateAllNewsList({index,data:response.data.data})
          handleClose()
      }else{
        console.log(`Failed`)
      }
    }catch(e){
    }
    
  }

  const addTag = ()=>{
    if(tagsInput.length==0) return
    let temp = []
    temp={...newsDataEdited}
    temp.tags.push(tagsInput)
    setNewsDataEdited({...temp})
    setTagsInput("")
  }
  const removeTag = (i)=>{
      let temp = []
      temp={...newsDataEdited}
      temp.tags.splice(i,1)
      setNewsDataEdited({...temp})
  }

  const handleEditChange = (val,property,property2)=>{
    let tempEdit = {}
    tempEdit = {...newsDataEdited}
    if(property && !property2)
      tempEdit[property] = val
    
    if(property && property2)
      tempEdit[property][property2] = val

    setNewsDataEdited({...tempEdit})
    setUpdate(update+1)
  } 

  return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {newsDataOriginal._id && <Modal.Title>Edit News {newsDataOriginal.title}</Modal.Title>}
          {!newsDataOriginal._id && <Modal.Title>Loading Data...</Modal.Title>}
        </Modal.Header>


        {newsDataOriginal._id &&
          <Modal.Body>
            <div className={style.main}>
                {/* Title */}
                <div className={style.inputContainerSingle}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>News Title</div>
                    <input value={newsDataEdited.title} onChange={(e)=>handleEditChange(e.target.value,"title")} />
                  </div>
                </div>
                {/* Tags */}
                <div className={style.inputContainerSingle}>
                  <div className={style.tagContainer}>
                    <input placeholder="Add Tag" value={tagsInput} onChange={(e)=>setTagsInput(e.target.value)} />
                    <button onClick={()=>addTag()}>Add</button>
                  </div>
                </div>
                {newsDataEdited.tags && newsDataEdited.tags.map((tag,i)=>{
                  return(<div className={style.tag} key={i}>Tag #{i+1} : {tag} <span onClick={()=>removeTag(i)} style={{color:"red",cursor:"pointer"}}>x</span></div>)
                })}

                {/* Twitter */}
                <div className={style.inputContainerSingle}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>News Twitter Link</div>
                    <input value={newsDataEdited.twitterLink} onChange={(e)=>handleEditChange(e.target.value,"twitterLink")} />
                  </div>
                </div>

                {/* Dsicord */}
                <div className={style.inputContainerSingle}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>News Discord Link</div>
                    <input value={newsDataEdited.discordLink} onChange={(e)=>handleEditChange(e.target.value,"discordLink")} />
                  </div>
                </div>

                {/* IMG COVER */}
                <div className={style.inputContainerDouble}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Cover Image</div>
                    <img  src={`/assets/images/news/${newsDataEdited.coverImageName}`}  />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>New Image?</div>
                    {!changeCoverImg && <input className={style.file} type="file" onChange={(event) => {setChangeCoverImg(event.target.files[0])}} />}
                    {changeCoverImg && 
                    <div>
                      <img src={URL.createObjectURL(changeCoverImg)}  />
                      <div onClick={()=>setChangeCoverImg(null)} className={style.removeImg} >Remove</div>
                    </div>
                    }
               
                  </div>
              </div>

              {/* IMG Display */}
              <div className={style.inputContainerDouble}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Display Image</div>
                    <img  src={`/assets/images/news/${newsDataEdited.displayImageName}`}  />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>New Image?</div>
                    {!changeDisplayImg && <input className={style.file} type="file" onChange={(event) => {setChangeDisplayImg(event.target.files[0])}} />}
                    {changeDisplayImg && 
                    <div>
                      <img src={URL.createObjectURL(changeDisplayImg)}  />
                      <div onClick={()=>setChangeCoverImg(null)} className={style.removeImg} >Remove</div>
                    </div>
                    }
               
                  </div>
              </div>

              {/* Markdown */}
              <div className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>MarkDown</div>
                  <textarea value={newsDataEdited.markdown} onChange={(e)=>handleEditChange(e.target.value,"markdown")} ></textarea>
                </div>
              </div>

            </div>
          </Modal.Body>
        }
        
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateNews}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default EditNewsModal


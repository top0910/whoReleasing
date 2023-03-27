import { useEffect, useMemo, useState } from "react";
import {Modal,Button} from "react-bootstrap"
import axios from "axios"
import style from "../../styles/next/projectModal.module.css"
import {blockchainList,projectStatusList,twitterShoutoutTypeOptions,discordShoutoutTypeOptions} from "../../src/config"
import DatePicker from "react-datepicker";
import moment from "moment"
function EditProjectModal({show,rowData,handleClose,index,updateAllProjectList}) {
  
  const [projectDataOriginal,setProjectDataOriginal] = useState({})
  const [projectDataEdited,setProjectDataEdited] = useState({})
  
  const [update,setUpdate] = useState(1)
  const [changeImg,setChangeImg] = useState(null)

  useEffect(()=>{
    
    setProjectDataEdited({})
    setProjectDataOriginal({})
    setChangeImg(null)
    const fetchData = async ()=>{
      if(!rowData._id) return
      const res = await axios.get(`/api/project/${rowData._id}`)
      if(res.data.success){
        setProjectDataOriginal(res.data.data)
        setProjectDataEdited(res.data.data)

      }else{
        console.log("failed")
      }
    }
    fetchData()
  },[show])


  const handleUpdateProject = async()=>{

    let formData = new FormData()
    formData.append("_id",projectDataEdited._id)
    formData.append("name",projectDataEdited.name)
    formData.append("hasPresale",projectDataEdited.hasPresale)
    formData.append("discordUsername",projectDataEdited.discordUsername)
    formData.append("collectionCount",projectDataEdited.collectionCount)
    formData.append("blockchainType",projectDataEdited.blockchainType)
    formData.append("saleStatusType",projectDataEdited.saleStatusType)
    formData.append("description",projectDataEdited.description)
    formData.append("approved",projectDataEdited.approved)
    formData.append("paymentComplete",projectDataEdited.paymentComplete)
    formData.append("presale[price]",projectDataEdited.presale.price)
    formData.append("presale[date]",projectDataEdited.presale.date || moment())
    formData.append("presale[time]",projectDataEdited.presale.time)
    formData.append("publicsale[price]",projectDataEdited.publicsale.price)
    formData.append("publicsale[date]",projectDataEdited.publicsale.date || moment())
    formData.append("publicsale[time]",projectDataEdited.publicsale.time)
    if(changeImg)
      formData.append("image",changeImg)
    formData.append("socialInformation[twitterUrl]",projectDataEdited.socialInformation.twitterUrl)
    formData.append("socialInformation[discordUrl]",projectDataEdited.socialInformation.discordUrl)
    formData.append("socialInformation[twitterFollowerCount]",projectDataEdited.socialInformation.twitterFollowerCount)
    formData.append("socialInformation[discordFollowerCount]",projectDataEdited.socialInformation.discordFollowerCount)
    formData.append("socialInformation[email]",projectDataEdited.socialInformation.email)
    formData.append("socialInformation[website]",projectDataEdited.socialInformation.website)
    // p2
    formData.append("services[featureRequested]",projectDataEdited.services.featureRequested)
    if(projectDataEdited.services.featureRequested){
      formData.append("services[featureRequestedStartDate]",projectDataEdited.services.featureRequestedStartDate || moment())
      formData.append("services[featureRequestedEndDate]",projectDataEdited.services.featureRequestedEndDate || moment())
    }
    formData.append("services[twitterShoutout]",projectDataEdited.services.twitterShoutout)
    formData.append("services[discordShoutout]",projectDataEdited.services.discordShoutout)

    formData.append("services[frontPageRequested]",projectDataEdited.services.frontPageRequested)
    if(projectDataEdited.services.frontPageRequested){
      formData.append("services[frontPageRequestedStartDate]",projectDataEdited.services.frontPageRequestedStartDate || moment())
      formData.append("services[frontPageRequestedEndDate]",projectDataEdited.services.frontPageRequestedEndDate || moment())
    }
    formData.append("services[growthInterest]",projectDataEdited.services.growthInterest)
    formData.append("services[discordContact]",projectDataEdited.services.discordContact)




    const response = await axios({
      method: "post",
      url: `/api/project/update`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })

    if(response.data.success){           
        // Call the update on the main list of projects
        updateAllProjectList({index,data:response.data.data})
        handleClose()
    }else{
      console.log(`Failed`)
    }
  }


  const handleEditChange = (val,property,property2)=>{
    console.log(val)

    let tempEdit = {}
    tempEdit = {...projectDataEdited}
    if(property && !property2)
      tempEdit[property] = val
    
    if(property && property2)
      tempEdit[property][property2] = val

    console.log(tempEdit)
    setProjectDataEdited({...tempEdit})
    setUpdate(update+1)
  } 

  return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {projectDataOriginal._id && <Modal.Title>Edit Project {projectDataOriginal.name}</Modal.Title>}
          {!projectDataOriginal._id && <Modal.Title>Loading Data...</Modal.Title>}
        </Modal.Header>


        {projectDataOriginal._id &&
          <Modal.Body>
            <div className={style.main}>

              {/* Name */}
              <div className={style.inputContainerDouble}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Project Name</div>
                  <input value={projectDataEdited.name} onChange={(e)=>handleEditChange(e.target.value,"name")} />
                </div>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>APPROVED?</div>
                  <input type="checkbox" checked={projectDataEdited.approved} onChange={(e)=>handleEditChange(!projectDataEdited.approved,"approved")} />
                </div>
              </div>

              {/* Discord Username - Collection Size */}
              <div className={style.inputContainerDouble}>
                  {/* <div className={style.inputMain}>
                    <div className={style.inputLabel}>Discord Username</div>
                    <input value={projectDataEdited.discordUsername} onChange={(e)=>handleEditChange(e.target.value,"discordUsername")} />
                  </div> */}
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Collection Count</div>
                    <input value={projectDataEdited.collectionCount} onChange={(e)=>handleEditChange(e.target.value,"collectionCount")} />
                  </div>
              </div>

              {/* Blockchain | Status */}
              <div className={style.inputContainerDouble}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Blockchain Type</div>
                    <select  value={projectDataEdited.blockchainType} onChange={(e)=>handleEditChange(e.target.value,"blockchainType")} >
                        {blockchainList.map((chain,i)=>{
                          return(
                            <option key={i} value={chain.acronym}>{chain.name}</option>
                          )
                        })}
                    </select>
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Status Type</div>
                    <select  value={projectDataEdited.saleStatusType} onChange={(e)=>handleEditChange(e.target.value,"saleStatusType")} >
                        {projectStatusList.map((chain,i)=>{
                          return(
                            <option key={i} value={chain.acronym}>{chain.name}</option>
                          )
                        })}
                    </select>
                  </div>
              </div>

              {/* Desc */}
              <div className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Description</div>
                  <textarea value={projectDataEdited.description} onChange={(e)=>handleEditChange(e.target.value,"description")} ></textarea>
                </div>
              </div>

              {/* HAS PRESALE? */}
              <div style={{marginTop:10}} className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Has presale?</div>
                  <input type="checkbox" checked={projectDataEdited.hasPresale} onChange={(e)=>handleEditChange(!projectDataEdited.hasPresale,"hasPresale")} />
                </div>
              </div>

              {/* Presale Price | Date */}
              {projectDataEdited.hasPresale && <div className={style.inputContainerTripple}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>PreMint Price</div>
                    <input  value={projectDataEdited.presale.price} onChange={(e)=>handleEditChange(e.target.value,"presale","price")} />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>PreMint Date</div>
                    <DatePicker className="force-no-border"  selected={moment(projectDataEdited.presale.date).toDate() || moment().toDate()} onChange={(date) => handleEditChange(date,"presale","date")} />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>PreMint Time</div>
                    <input  value={projectDataEdited.presale.time} onChange={(e)=>handleEditChange(e.target.value,"presale","time")} />
                  </div>
              </div>}

               {/* Public Price | Date */}
               <div className={style.inputContainerTripple}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Public Price</div>
                    <input  value={projectDataEdited.publicsale.price} onChange={(e)=>handleEditChange(e.target.value,"publicsale","price")} />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Public Date</div>
                    <DatePicker className="force-no-border"  selected={moment(projectDataEdited.publicsale.date).toDate() || moment().toDate()} onChange={(date) => handleEditChange(date,"publicsale","date")} />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Public Mint Time</div>
                    <input  value={projectDataEdited.publicsale.time} onChange={(e)=>handleEditChange(e.target.value,"publicsale","time")} />
                  </div>
              </div>

              {/* Image */}
              <div className={style.inputContainerDouble}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Original Image</div>
                    <img  src={`/api/projectImage/${projectDataEdited.imageId}`}  />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>New Image?</div>
                    {!changeImg && <input className={style.file} type="file" onChange={(event) => {setChangeImg(event.target.files[0])}} />}
                    {changeImg && 
                    <div>
                      <img src={URL.createObjectURL(changeImg)}  />
                      <div onClick={()=>setChangeImg(null)} className={style.removeImg} >Remove</div>
                    </div>
                    }
               
                  </div>
              </div>
              {/* social */}
              {/* Twitter - Followers */}
              <div style={{marginTop:20,fontSize:25,fontWeight:"800"}}>Socials</div>
              <div className={style.inputContainerDouble}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Twitter Url</div>
                    <input value={projectDataEdited.socialInformation.twitterUrl} onChange={(e)=>handleEditChange(e.target.value,"socialInformation","twitterUrl")} />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Twitter Followers</div>
                    <input value={projectDataEdited.socialInformation.twitterFollowerCount} onChange={(e)=>handleEditChange(e.target.value,"socialInformation","twitterFollowerCount")} />
                  </div>
              </div>      

              <div className={style.inputContainerDouble}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Discord Url</div>
                    <input value={projectDataEdited.socialInformation.discordUrl} onChange={(e)=>handleEditChange(e.target.value,"socialInformation","discordUrl")} />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Discord Followers</div>
                    <input value={projectDataEdited.socialInformation.discordFollowerCount} onChange={(e)=>handleEditChange(e.target.value,"socialInformation","discordFollowerCount")} />
                  </div>
              </div>  

              <div className={style.inputContainerDouble}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Email</div>
                    <input value={projectDataEdited.socialInformation.email} onChange={(e)=>handleEditChange(e.target.value,"socialInformation","email")} />
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Website Url</div>
                    <input value={projectDataEdited.socialInformation.website} onChange={(e)=>handleEditChange(e.target.value,"socialInformation","website")} />
                  </div>
              </div>

              {/* P2 */}
              <div style={{marginTop:20,fontSize:25,fontWeight:"800"}}>Service</div>
              {/* FEATURE? */}
              <div className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Featured?</div>
                  <input type="checkbox" checked={projectDataEdited.services.featureRequested} onChange={(e)=>handleEditChange(!projectDataEdited.services.featureRequested,"services","featureRequested")} />
                </div>
              </div>
              {projectDataEdited.services.featureRequested &&  
                <div className={style.inputContainerDouble}>
                    <div className={style.inputMain}>
                      <div className={style.inputLabel}>Start Date</div>
                      <DatePicker className="force-no-border"  selected={moment(projectDataEdited.services.featureRequestedStartDate).toDate()|| moment().toDate()} onChange={(date) => handleEditChange(date,"services","featureRequestedStartDate")} />
                    </div>
                    <div className={style.inputMain}>
                      <div className={style.inputLabel}>End Date</div>
                      <DatePicker className="force-no-border"  selected={moment(projectDataEdited.services.featureRequestedEndDate).toDate()|| moment().toDate()} onChange={(date) => handleEditChange(date,"services","featureRequestedEndDate")} />
                    </div>
                </div>
              }

              {/* Twitter Shoutout | Discord Shoutout */}
              <div className={style.inputContainerDouble}>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Twitter Shoutout</div>
                    <select  value={projectDataEdited.services.twitterShoutout} onChange={(e)=>handleEditChange(e.target.value,"services","twitterShoutout")} >
                      {twitterShoutoutTypeOptions.map((type,i)=>{
                        return(
                          <option key={i} value={type.value}>{type.value}</option>
                        )
                      })}
                    </select>
                  </div>
                  <div className={style.inputMain}>
                    <div className={style.inputLabel}>Discord Shoutout</div>
                    <select  value={projectDataEdited.services.discordShoutout} onChange={(e)=>handleEditChange(e.target.value,"services","discordShoutout")} >
                      {discordShoutoutTypeOptions.map((type,i)=>{
                        return(
                          <option key={i} value={type.value}>{type.value}</option>
                        )
                      })}
                    </select>
                  </div>
              </div>

              {/*Font Page?  */}
              <div className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Cover Photo On Front Page?</div>
                  <input type="checkbox" checked={projectDataEdited.services.frontPageRequested} onChange={(e)=>handleEditChange(!projectDataEdited.services.frontPageRequested,"services","frontPageRequested")} />
                </div>
              </div>
              {projectDataEdited.services.frontPageRequested && 
                <div className={style.inputContainerDouble}>
                    <div className={style.inputMain}>
                      <div className={style.inputLabel}>Start Date</div>
                      <DatePicker className="force-no-border"  selected={moment(projectDataEdited.services.frontPageRequestedStartDate).toDate()|| moment().toDate()} onChange={(date) => handleEditChange(date,"services","frontPageRequestedStartDate")} />
                    </div>
                    <div className={style.inputMain}>
                      <div className={style.inputLabel}>End Date</div>
                      <DatePicker className="force-no-border"  selected={moment(projectDataEdited.services.frontPageRequestedEndDate).toDate()|| moment().toDate()} onChange={(date) => handleEditChange(date,"services","frontPageRequestedEndDate")} />
                    </div>
                </div>
              }

              {/*Growth?  */}
              <div className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Growth Interest?</div>
                  <input type="checkbox" checked={projectDataEdited.services.growthInterest} onChange={(e)=>handleEditChange(!projectDataEdited.services.growthInterest,"services","growthInterest")} />
                </div>
              </div>
              {/*Payment Completed?  */}
              <div className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Payment Completed?</div>
                  <input type="checkbox" checked={projectDataEdited.paymentComplete} onChange={(e)=>handleEditChange(!projectDataEdited.paymentComplete,"paymentComplete")} />
                </div>
              </div>
              {/* Discord Contact */}
              <div className={style.inputContainerSingle}>
                <div className={style.inputMain}>
                  <div className={style.inputLabel}>Discord Contact</div>
                  <input value={projectDataEdited.services.discordContact} onChange={(e)=>handleEditChange(e.target.value,"services","discordContact")} />
                </div>
              </div>

            </div>     
          </Modal.Body>
        }
        
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateProject}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default EditProjectModal


import Meta from "../component/Meta"
import Header from "../component/Header"
import SideBar from '../component/SideBar'
import {useRouter} from "next/router"
import { useEffect, useState } from 'react'
import DashboardHeader from '../component/DashboardHeader'
import DatePicker from "react-datepicker";
import { timeZones,blockchainList,twitterShoutoutTypeOptions,discordShoutoutTypeOptions ,projectStatusList,maxDaysFeature,maxDaysFrontPage,servicePrice,MathUtils} from "../src/config"
import axios from "axios"
import TimePicker from "../component/TimePicker.js"
import moment from "moment-timezone"

// import "react-datepicker/dist/react-datepicker.css";

export default function SubmitProject({dark,setDark,isMobileOpen,setIsMobileOpen}) {
  var startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const router = useRouter()
  const [completionNumber,setCompletionNumber] = useState(1)
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  // Inputs
  const [projectName,setProjectName] = useState("")
  const [discordUsername,setDiscordUsername] = useState("")
  const [collectionCount,setCollectionCount] = useState("")
  const [description,setDescription] = useState("")
  const [presalePrice,setPresalePrice] = useState("")
  const [presaleDate, setPresaleDate] = useState(startOfDay);
  const [publicsalePrice,setPublicsalePrice] = useState("")
  const [publicsaleDate, setPublicsaleDate] = useState(startOfDay);
  const [imageFile,setImageFile] = useState(null)
  const [hasPresale,setHasPresale] = useState(false)

  //Socials
  const [twitterUrl,setTwitterUrl] = useState("")
  const [discordUrl,setDiscordUrl] = useState("")
  const [email,setEmail] = useState("")
  const [twitterFollowerCount,setTwitterFollowerCount] = useState("")
  const [discordFollowerCount,setDiscordFollowerCount] = useState("")
  const [websiteUrl,setWebsiteUrl] = useState("")


  // drowdown
  const [showChainDrowdown,setShowChainDropdown] = useState(false)
  const [showSaleStatusDrowdown,setShowSaleStatusDropdown] = useState(false)
  const [showPresaleTimezoneDrowdown,setShowPresaleTimezoneDrowdown] = useState(false)
  const [showPublicsaleTimezoneDrowdown,setShowPublicsaleTimezoneDrowdown] = useState(false)

  const [blockchainSelected,setBlockchainSelected] = useState({})
  const [saleStatusSelected,setSaleStatusSelected] = useState({})
  const [presaleTimeSelected,setPresaleTimeSelected] = useState("00:30am")
  const [publicsaleTimeSelected,setPublicsaleTimeSelected] = useState("00:30am")



  // PAGE 2 
  const [isFeatured,setIsFeatured] = useState(false)
  const [featureDateStart,setFeatureDateStart] = useState(startOfDay)
  const [featureDateEnd,setFeatureDateEnd] = useState(startOfDay)
  const [featureDateAmount,setFeatureDateAmount] = useState(1)

  const [isFrontPage,setIsFrontPage] = useState(false)
  const [isFrontPageStartDate,setIsFrontPageStartDate] = useState(startOfDay)
  const [isFrontPageEndDate,setIsFrontPageEndDate] = useState(startOfDay)
  const [isFrontPageAmount,setIsFrontPageAmount] = useState(1)
  const [isFrontPageTimezone,setIsFrontPageTimezone] = useState("10:00am")


  const [twitterShoutoutType,setTwitterShoutoutType] = useState("none")
  const [discordShoutoutType,setDiscordShoutoutType] = useState("none")

  const [growthInterest,setGrowthInterest] = useState(false)
  const [discordContact,setDiscordContact] = useState("")
  const [howToContact,setHowToContact] = useState("email")

  const [updater,setUpdater] = useState(0)
  const [datePluginStates,setDatePluginStates] = useState([false,false,false,false])
  useEffect(()=>{
    
    //Prevent number tpes from scorlling
    const permitScrollCallback = ()=>{
      if(document.activeElement.type === "number"){
        document.activeElement.blur();
    }
    }
    document.addEventListener("wheel",permitScrollCallback);   
    return () => window.removeEventListener("wheel", permitScrollCallback); 

  },[updater])

  const handleDatePluginStates = (index)=>{
    let tempStates = [...datePluginStates]
    tempStates[index] = !tempStates[index]
    setDatePluginStates([...tempStates])
  }

  const uploudData = async()=>{

    let formatedPresaleDate = new Date()
    formatedPresaleDate.setHours(0,0,0,0);

    let formatedPublicsaleDate = new Date()
    formatedPublicsaleDate.setHours(0,0,0,0);

    if(loading) return
    setLoading(true)
    let formData = new FormData()
    formData.append("name",projectName)
    formData.append("discordUsername",discordUsername)
    formData.append("collectionCount",collectionCount)
    formData.append("blockchainType",blockchainSelected.acronym)
    formData.append("saleStatusType",saleStatusSelected.acronym)
    formData.append("description",description)
    formData.append("hasPresale",hasPresale)
    formData.append("presale[price]",presalePrice)
    formData.append("presale[date]",formatedPresaleDate)
    formData.append("presale[time]",presaleTimeSelected)
    formData.append("publicsale[price]",publicsalePrice)
    formData.append("publicsale[date]",formatedPublicsaleDate)
    formData.append("publicsale[time]",publicsaleTimeSelected)
    formData.append("image",imageFile)
    formData.append("socialInformation[twitterUrl]",twitterUrl)
    formData.append("socialInformation[discordUrl]",discordUrl)
    formData.append("socialInformation[twitterFollowerCount]",twitterFollowerCount)
    formData.append("socialInformation[discordFollowerCount]",discordFollowerCount)
    formData.append("socialInformation[email]",email)
    formData.append("socialInformation[website]",websiteUrl)
    // p2
    formData.append("services[featureRequested]",isFeatured)
    if(isFeatured){
      formData.append("services[featureRequestedStartDate]",featureDateStart)
      formData.append("services[featureRequestedEndDate]",moment(featureDateStart).add(featureDateAmount,"days"))
    }
    formData.append("services[twitterShoutout]",twitterShoutoutType)
    formData.append("services[discordShoutout]",discordShoutoutType)

    formData.append("services[frontPageRequested]",isFrontPage)
    if(isFrontPage){
      formData.append("services[frontPageRequestedStartDate]",isFrontPageStartDate)
      formData.append("services[frontPageRequestedEndDate]",moment(isFrontPageStartDate).add(isFrontPageAmount,"days"))
    }
    formData.append("services[growthInterest]",growthInterest)
    formData.append("services[discordContact]",discordContact)


    let response 
    try{
      response = await axios({
        method: "post",
        url: `/api/project/upload`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
  
      if(response.data.success){
        // setError("Success")
      }else{
        console.log(`Failed`)
        // setError("Failed")
      }
    }catch(e){
      setError(e.message)
    }
  
    setLoading(false)
    return response
  }


  const handlePage1Click = (e)=>{
    e.preventDefault();

    //check all input if good and then carry on to page2
    setError("")
    //Project name
    if(projectName.length<1){
      setError("Error - Project name too short")
      return
    }
    
    //Discord Username
    // if(discordUsername.length<3 || !discordUsername.includes("#")){
    //   setError("Error - Discord username needs to include -> #")
    //   return
    // }

    //Collection Count
    if(isNaN(Number(collectionCount)) || collectionCount ==""){
      setError("Error - Collection count needs to be > 1")
      return
    }

    //Blockchain dropdown 
    if(!blockchainSelected.acronym){
      setError("Error - Select a blockchain")
      return
    }

    //Sale Status 
    if(!blockchainSelected.acronym){
      setError("Error - Select a sale status")
      return
    }

    //IMAGE 
    if(imageFile==null){
      setError("Error - Select an Image")
      return
    }

    //Presale Price
    if(hasPresale){
      if(isNaN(Number(presalePrice)) || presalePrice ==""){
        setError("Error - Presale Price needs to be > 0")
        return
      }

      //clean time val
      let presaleCleanedTime = presaleTimeSelected.replace(":","").replace(/-/g,"")
      if(presaleCleanedTime.length <3){
        setError("Error - Presale Time Invalid")
        return
      }
      if(presaleCleanedTime.length == 3){
        let hourPre = Number(presaleCleanedTime[0])
        let minutePre = Number(`${presaleCleanedTime[1]}${presaleCleanedTime[2]}`)
        if(hourPre>12){
          setError("Error - Presale Time Invalid")
          return
        }
        if(minutePre>59){
          setError("Error - Presale Time Invalid")
          return
        } 
      }else{
        let hourPre = Number(`${presaleCleanedTime[0]}${presaleCleanedTime[1]}`)
        let minutePre = Number(`${presaleCleanedTime[2]}${presaleCleanedTime[3]}`)
        if(hourPre>12){
          setError("Error - Presale Time Invalid")
          return
        }
        if(minutePre>59){
          setError("Error - Presale Time Invalid")
          return
        }
      }
    } 
    

    //Public Price
    if(isNaN(Number(publicsalePrice)) || publicsalePrice ==""){
      setError("Error - Publicsale Price needs to be > 0")
      return
    }


    //clean time val
    let publicsaleCleanedTime = publicsaleTimeSelected.replace(":","").replace(/-/g,"")

    if(publicsaleCleanedTime.length <3){
      setError(`Error - Publicsale Time Invalid ${publicsaleCleanedTime}`)
      return
    }
    if(publicsaleCleanedTime.length == 3){
      let hourPub = Number(publicsaleCleanedTime[0])
      let minutePub = Number(`${publicsaleCleanedTime[1]}${publicsaleCleanedTime[2]}`)
      if(hourPub>12){
        setError(`Error - Publicsale Time Invalid ${publicsaleCleanedTime}`)
        return
      }
      if(minutePub>59){
        setError(`Error - Publicsale Time Invalid ${publicsaleCleanedTime}`)
        return
      }
    }else{
      let hourPub = Number(`${publicsaleCleanedTime[0]}${publicsaleCleanedTime[1]}`)
      let minutePub = Number(`${publicsaleCleanedTime[2]}${publicsaleCleanedTime[3]}`)
      if(hourPub>12){
        setError(`Error - Publicsale Time Invalid ${publicsaleCleanedTime}`)
        return
      }
      if(minutePub>59){
        setError(`Error - Publicsale Time Invalid ${publicsaleCleanedTime}`)
        return
      }
    }

    // desc
    if(description.length<10){
      setError("Error - Description must be > 10 characters")
      return
    }


    //socials
    if(!email || email == "" ){
      setError("Error - Email Required")
      return
    }

    setUpdater(updater+1)

    // All is good
    setCompletionNumber(2)
    window.scrollTo({ top:0, left:0,behavior: "instant"});
  }

  const handlePage2Click = async(e)=>{
    e.preventDefault();

    //check all input if good and then carry on to page2
    setError("")

    //Discord Udername

    if(growthInterest && howToContact == "discord"){
      if(!discordContact.includes("#") || discordContact.split("#")[1] == "" || !Number.isInteger(Number(discordContact.split("#")[1])) ){
        setError("Error - Discord contact required")
        return
      }
    }
    
    // All is good
    const uploadRes =await uploudData()
    if(uploadRes.data.success){
      await requestCheckout(uploadRes.data.data,uploadRes.data.finalPrice)
    }
  }

  const handleBlockchainToggle = ()=>{
    setShowSaleStatusDropdown(false)
    setShowPresaleTimezoneDrowdown(false)
    setShowPublicsaleTimezoneDrowdown(false)
    setShowChainDropdown(!showChainDrowdown)
  }
  const handleSaleStatusToggle = ()=>{
    setShowPresaleTimezoneDrowdown(false)
    setShowChainDropdown(false)
    setShowPublicsaleTimezoneDrowdown(false)
    setShowSaleStatusDropdown(!showSaleStatusDrowdown)
  }




  const handleStatusChange = (chain)=>{
    setSaleStatusSelected(chain);
    setShowSaleStatusDropdown(false);
    if(chain.acronym !== "upcoming"){
      setHasPresale(false)
      setPublicsaleDate(new Date())
      setPublicsaleTimeSelected("1:00am")
    }
  }

  const calculateFinalPrice = ()=>{
    let price = 0

    // Is featured
    if(isFeatured){
      price+= (featureDateAmount*servicePrice.featuredPerDay)
    }

    // Twitter Giveway
    if(twitterShoutoutType!=="none"){
      price+= servicePrice.twitterGiveawayPost
    }
    // Discord Giveway
    if(discordShoutoutType!=="none"){
      price+= servicePrice.discordGiveawayPost
    }

    // twitter cover
    if(isFrontPage){
      price+= (isFrontPageAmount*servicePrice.twitterCoverPhotoPerDay)
    }
    return price
  }


  const createChargeDescription = ()=>{
    let description = ""

    // Is featured
    if(isFeatured){
      description+=`Featured on website: x${featureDateAmount} days for $${(featureDateAmount*servicePrice.featuredPerDay).toFixed(1)}` 
    }

    // Twitter Giveway
    if(twitterShoutoutType!=="none"){
      description+=` - Giveaway Post On The Who’s Launching Twitter Page for $${servicePrice.twitterGiveawayPost}` 
    }
    // Discord Giveway
    if(discordShoutoutType!=="none"){
      description+=` - Giveaway Post On The Who’s Launching Discord Page for $${servicePrice.twitterGiveawayPost}` 
    }

    // twitter cover
    if(isFrontPage){
      description+=` - Featured on website: x${isFrontPageAmount} days for $${(isFrontPageAmount*servicePrice.twitterCoverPhotoPerDay).toFixed(1)}` 

    }

    return description
  }

  const handleClickBody = (e)=>{
    setIsMobileOpen(false)
    let closeAllDates = checkIfCloseDateContainers(e)
    if(closeAllDates){
      setDatePluginStates([false,false,false,false])
    }
  }

  const checkIfCloseDateContainers = (e)=>{
    const className = e.target.className
    if(className.includes("react-datepicker__day--")){
      return true
    }
    if(className.includes("usedForDate") || className.includes("icon-Calendar")||className.includes("icon-arrow-down") || className.includes("react-datepicker")){
      return false
    }
    return true
  }

  const requestCheckout = async(uploadData,finalPrice)=>{
    let price = finalPrice
    let description = createChargeDescription()
    if(price>0){
      const checkoutRes = await axios.post(`/api/coinbase/charge`,{
        price,
        description,
        projectId:uploadData._id
      })
      if(checkoutRes.data.success){
        console.log(checkoutRes.data.data.hosted_url)
        router.push(`/submitproject/verifypayment?pid=${uploadData._id}&hcode=${checkoutRes.data.data.code}`)
        window.open(checkoutRes.data.data.hosted_url, "_blank");
      }else{
        console.log(checkoutRes.data.error)
        setError(checkoutRes.data.error)
      }
    }else{
      console.log("No payment needed")
      router.push(`/submitproject/verifypayment?pid=${uploadData._id}&fp=0`)
    }
  }

  // Page 1
  if(completionNumber == 1 ) {
    return (
      <div   className={`body ${dark && "dark"} ${isMobileOpen&&"show"}`}>
  
        <Meta dark={dark} title={"Submit Project"}  content={"Submit Project"} />
  
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <SideBar dark={dark} setDark={setDark}  isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div  onClick={(e)=>handleClickBody(e)} className="dashboard__content">
          <div className="overlay"></div>
          <DashboardHeader location="submitproject1"/>
  
  
          {/* Main Data */}
          <div  className="dashboard__main">
            <section className="submit-project">
              {/* NUMBERS ON TOP */}
              <div className="top">
                <ul>
                  <li className={`${completionNumber >= 1 ? "active":""}`}>
                    <div className="numb">
                      <span>
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1.1665 6.83301L4.49984 10.1663L12.8332 1.83301" stroke="white" strokeWidth="2"strokeLinecap="round"strokeLinejoin="round"/>
                        </svg>1
                      </span>
                    </div>
                    <p>Info</p>
                  </li>
                  <li className={`${completionNumber >= 2 ? "active":""}`}>
                    <div className="numb"><span>2</span></div>
                    <p>Promo</p>
                  </li>
                  <li className={`${completionNumber >= 3 ? "active":""}`}>
                    <div className="numb"><span>3</span></div>
                    <p>Done</p>
                  </li>
                </ul>
              </div>
  
  
              {/* Inputs */}
              <div className="main">
                <form onSubmit={(e)=>handlePage1Click(e)}>
                 
                  {/* Inputs */}
                  <div className="form-group">
                    <label className="h5">Project Information</label>
                    {/* error */}
                    <div className="error-text">{error}</div>

                    <div className="row">

                      {/* <div className="col-12">
                        <input type="text" onChange={(e)=>setProjectName(e.target.value)} value={projectName} placeholder="Project name" required />
                      </div> */}
  
                      {/* Project Name */}
                      {/* pattern="[A-Za-z0-9]+#[0-9]+"  */}
                      <div className="col-md-6">
                        <input  onChange={(e)=>setProjectName(e.target.value)} value={projectName} placeholder="Project Name" required  />
                      </div>
  
                      {/* Collection Count */}
                      <div className="col-md-6">
                        <input  pattern="[0-9]+" type="number" onChange={(e)=>setCollectionCount(e.target.value.replace(/^0+/, ''))} value={collectionCount} placeholder="Collection Count" required />
                      </div>
                      
                      {/* Blockchain */}
                      <div className="col-md-6">
                        <div className="dropdown">
                          <button
                            onClick={()=>{handleBlockchainToggle()}}
                            className={`btn dropdown-toggle no-transition s1 ${!blockchainSelected.name ?"greyedOutColor":""}`}
                            type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >{!blockchainSelected.name ? "Blockchain":blockchainSelected.name}</button>
                          <div  className={`dropdown-menu s1 ${showChainDrowdown ? "show":""}`} aria-labelledby="dropdownMenuButton">

                            {blockchainList.map((chain,i)=>{
                              return(
                                <a key={i} onClick={()=>{setBlockchainSelected(chain); setShowChainDropdown(false)}} className="dropdown-item">
                                  <div className="icon">
                                    {chain.acronym =="usd" ?
                                      <span>
                                        <svg width="8"height="12"viewBox="0 0 8 12"fill="none"xmlns="http://www.w3.org/2000/svg">
                                          <path d="M0.666748 8.66667C1.33341 9.33333 2.66675 10 4.00008 10M4.00008 10C5.66675 10 7.33341 9.66667 7.33341 8C7.33341 6.33333 5.69975 6 4.00008 6M4.00008 10V6M4.00008 10V12M4.00008 6C2.33341 6 0.666748 5.66667 0.666748 4C0.666748 2.33333 2.33341 2 4.00008 2M4.00008 6V2M4.00008 2C5.33341 2 6.66675 2.66667 7.33341 3.33333M4.00008 2V0"stroke="black"/>
                                        </svg>
                                      </span>:
                                      <span className="icon-ic_eth"></span>
                                    }
                                  </div>
                                  {chain.name}
                                </a>
                              )        
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Sale Status */}
                      <div className="col-md-6">
                        <div className="dropdown">
                          <button
                            className={`btn no-transition dropdown-toggle s2 ${!saleStatusSelected.name ?"greyedOutColor":""}`}
                            type="button"
                            id="dropdownMenuButton1"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            onClick={()=>{handleSaleStatusToggle()}}
                            aria-expanded="false"
                          >
                            {!saleStatusSelected.name ? "Sale Status":saleStatusSelected.name}
                          </button>
  
                          <div  className={`dropdown-menu s1 ${showSaleStatusDrowdown ? "show":""}`} aria-labelledby="dropdownMenuButton">
                            {projectStatusList.map((chain,i)=>{
                                return(
                                  <a key={i} onClick={()=>{handleStatusChange(chain) }} className="dropdown-item">
                                    {chain.name}
                                  </a>
                                )        
                              })}
                          </div>
                        </div>
                      </div>
  
                      {/* DESCRIPTION*/}
                      <div className="col-12">
                        <textarea  style={{marginBottom:0}} value={description} maxLength={300} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" required></textarea>
                        <div style={{display:"flex",fontSize:14,marginBottom:10,justifyContent:"right"}}><div style={{flex:1,textAlign:'right'}}>{description.length}/300</div></div>
                      </div>
                      
                      {/* Has Presale?? */}
                      {saleStatusSelected.acronym =="upcoming" && <div className="col-md-6">
                        <div className="customCheckbox" style={{display:"flex"}}>
                          <div style={{flex:1}}>Do you have a Presale?</div>
                          <div onClick={()=>setHasPresale(!hasPresale)} className={`customCheckbox-container`}><div className={`customCheckbox-${hasPresale?"checked":"unchecked"}`}></div></div>
                          {/* <input value={hasPresale} onChange={()=>setHasPresale(!hasPresale)}  type="checkbox" /> */}
                        </div>                         
                      </div>}
                      
                      {/* PreSale Price */}
                      {hasPresale && <div className="col-12">
                        <input
                          value={presalePrice}
                          // onChange={(e)=>setPresalePrice(e.target.value.replace(/^0+/, ''))} 
                          onChange={(e)=>setPresalePrice(e.target.value)} 
                          className="s1"
                          placeholder="Pre-sale sale price "
                          required
                        />
                      </div>}
                      {/* PreSale Date */}
                      { hasPresale && <div className="col-md-6">
                        <div className="input-group s1">
                          <div onClick={()=>handleDatePluginStates(0)}   className="input-group-prepend">
                            <div className="input-group-text">
                              <span className="icon-Calendar"></span>
                            </div>
                          </div>
                          <span style={{width:"100%"}} onClick={(e)=>{let classes = e.target.classList; if(classes[0] == "force-no-border-left")handleDatePluginStates(0)}} ><DatePicker open={datePluginStates[0]} disabledKeyboardNavigation onFocus={e => e.target.blur()}  className="force-no-border-left"  selected={presaleDate} onChange={(date) => setPresaleDate(date)} /></span>
                          <span onClick={()=>handleDatePluginStates(0)}  className="icon-arrow-down"></span>
                        </div>
                      </div>}
  
                      {/* Presale Time */}
                      { hasPresale && <div className="col-md-6">
                        <div className="dropdown">
                          <TimePicker value={presaleTimeSelected} setValue={setPresaleTimeSelected}   />
                          
                        </div>
                      </div>}
  
                      {/* Public Price */}
                      <div className="col-12">
                        <input
                          value={publicsalePrice}
                          
                          // onChange={(e)=>setPublicsalePrice(e.target.value.replace(/^0+/, ''))} 
                          onChange={(e)=>setPublicsalePrice(e.target.value)} 
                          className="s1"
                          placeholder="Public sale price "
                          required
                        />
                      </div>
                      {/* Public Date */}
                      {saleStatusSelected.acronym =="upcoming" && <div className="col-md-6">
                        <div className="input-group s1">
                          <div onClick={()=>handleDatePluginStates(1)}  className="input-group-prepend">
                            <div className="input-group-text">
                              <span className="icon-Calendar"></span>
                            </div>
                          </div>
                          <span style={{width:"100%"}} onClick={(e)=>{let classes = e.target.classList; if(classes[0] == "force-no-border-left")handleDatePluginStates(1)}}><DatePicker open={datePluginStates[1]} disabledKeyboardNavigation onFocus={e => e.target.blur()}  className="force-no-border-left" selected={publicsaleDate} onChange={(date) => {console.log(date);setPublicsaleDate(date);}} /></span>
                          <span onClick={()=>handleDatePluginStates(1)}  className="icon-arrow-down"></span>
                        </div>
                      </div>}
  
                      {/* Public TIMEZONE */}
                      {saleStatusSelected.acronym =="upcoming" &&<div className="col-md-6">
                        <div className="dropdown">
                            <TimePicker value={publicsaleTimeSelected} setValue={setPublicsaleTimeSelected}  />    
                        </div>
                      </div>}
  
                      
  
                    </div>
                  </div>
  
                  {/* Image Upload */}
                  <div className="form-group up-image">
                    <label className="h5">Project Image Upload</label>
                    <p>Image size is maximum 500x500</p>
                    <div>
                      <input
                        type="file"
                        className={`custom-file-input ${imageFile ?"afterImagUploaded":""}`}
                        id="imgInp"
                        onChange={(event) => {
                          console.log(event.target.files[0]);
                          setImageFile(event.target.files[0]);
                        }}
                        title=" "
                        required
                      />
                      <img
                        id="imageUploaded"
                        src={imageFile ? URL.createObjectURL(imageFile) : "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="}
                      />
                      {!imageFile && <span className="img-dark-cover"></span>}
                    </div>
                  </div>
  
                  {/* Socials */}
                  <div className="form-group social">
                    <label className="h5">Social Information</label>
                    <div className="row">
                      <div className="col-md-6 twiter">
                        <input type="text" onChange={(e)=>setTwitterUrl(e.target.value)} value={twitterUrl} placeholder="Twitter URL"  />
                      </div>
                      <div className="col-md-6 t-follow">
                        <input
                          // title="Twitter Link: twitter.com/example" pattern="[A-Za-z0-9]/[A-Za-z0-9]+" 
                          type="number"
                          onChange={(e)=>setTwitterFollowerCount(e.target.value.replace(/^0+/, ''))} value={twitterFollowerCount}
                          placeholder="Twitter Followers Count" 
                        />
                      </div>
                      <div className="col-md-6 discord">
                        <input type="text" onChange={(e)=>setDiscordUrl(e.target.value)} value={discordUrl}  placeholder="Discord URL"  />
                      </div>
                      <div className="col-md-6 d-follow">
                        <input
                          // title="Discord Link: discord.com/example" pattern="[A-Za-z0-9]/[A-Za-z0-9]+" 
                          onChange={(e)=>setDiscordFollowerCount(e.target.value.replace(/^0+/, ''))} value={discordFollowerCount} 
                          type="number"
                          placeholder="Discord Followers Count"
                          
                        />
                      </div>
                      <div className="col-md-6 email">
                        <input type="email" placeholder="E-mail" onChange={(e)=>setEmail(e.target.value)} value={email}  required />
                      </div>
                      <div className="col-md-6 web">
                        <input type="text" placeholder="Website URL" onChange={(e)=>setWebsiteUrl(e.target.value)} value={websiteUrl}   />
                      </div>
                    </div>
                  </div>   
                  <button  type="submit">Next</button>

                   {/* error */}
                   <div className="error-text">{error}</div>
                </form>
              </div>
            </section>  
          </div>
        </div>
  
      </div>
    )
  }

  //Page2
  if(completionNumber == 2  ){
    return(
      <div className={`body ${dark && "dark"}`}>
        
        <Meta dark={dark} title={"Submit Project"}  content={"Submit Project"} />
        <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <SideBar dark={dark} setDark={setDark}  isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <div className="dashboard__content">
          <div className="overlay"></div>
          <DashboardHeader location="submitproject2" submitProjectBack={()=>setCompletionNumber(1)}/>
  
  
          {/* Main Data P2 */}
          <div className="dashboard__main">
            <section className="submit-project s2">
              {/* Numbers on top  P2*/}
              <div className="top">
                <ul>
                  <li className="done">
                    <div className="numb">
                      <svg
                        width="14"
                        height="12"
                        viewBox="0 0 14 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.1665 6.83301L4.49984 10.1663L12.8332 1.83301"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>1</span>
                    </div>
                    <p>Info</p>
                  </li>
                  <li className="active">
                    <div className="numb"><span>2</span></div>
                    <p>Promo</p>
                  </li>
                  <li>
                    <div className="numb"><span>3</span></div>
                    <p>Done</p>
                  </li>
                </ul>
              </div>
              <div className="main">
                <form onSubmit={(e)=>handlePage2Click(e)}>
                  {/* error */}
                  <div className="error-text">{error}</div>

                  {/* FEATURED */}
                  <div className="form-group">           
                    <label className="h5">Have Your Project Featured on The Front Page of Who’s Launching</label>
                    <p>
                      <input type="radio" id="test1" name="radio-group" onChange={()=>setIsFeatured(false)} checked={!isFeatured} />
                      <label htmlFor="test1">{`We don’t want to be featured on the front page`}</label>
                      <span className="color-m">Free</span>
                    </p>
                    <p>
                      <input type="radio" id="test2" name="radio-group" onChange={()=>setIsFeatured(true)} checked={isFeatured}/>
                      <label htmlFor="test2">Feature our project on the front page for millions to see</label>
                      <span>{servicePrice.featuredPerDay} ETH per day</span>
                    </p>

                    { isFeatured && 
                    <>
                    {/* Dates to feature between */}
                      <div className="row">
                        <div className="col-md-6ss">
                          
                          <div className="new-amount-container" >
                            <div  className="input-group">
                              <div onClick={()=>handleDatePluginStates(2)} className="input-group-prepend">
                                <div className="input-group-text">
                                  <span className="icon-Calendar"></span>
                                </div>
                              </div>
                              <span style={{width:"100%"}} onClick={(e)=>{let classes = e.target.classList; if(classes[0] == "force-no-border-left")handleDatePluginStates(2)}}><DatePicker open={datePluginStates[2]} disabledKeyboardNavigation onFocus={e => e.target.blur()}  className="force-no-border-left" selected={featureDateStart} onChange={(date) => setFeatureDateStart(date)} /></span>
                              <span onClick={()=>handleDatePluginStates(2)} className="icon-arrow-down"></span>
                            </div>

                            {/* Amount container */}
                            <div style={{justifyContent:"flex-end"}}  className="input-group">
                                <div className="select-wrapper"> 
                                  <select  value={featureDateAmount} onChange={(e)=>setFeatureDateAmount(e.target.value)} >
                                    {maxDaysFeature.map((dayNum,i)=>{
                                      return(<option key={i} value={dayNum}>{dayNum} {dayNum==1?"Day":"Days"}</option>)
                                    })}
                                  </select>
                                  <span className="icon-arrow-down"></span>
                                </div>
                            </div>
                          </div>

                        </div>
                        
                        {/* <div className="col-md-6">
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <div className="input-group-text">
                                <span className="icon-Calendar"></span>
                              </div>
                            </div>
                            <DatePicker className="force-no-border-left" selected={featureDateEnd} onChange={(date) => setFeatureDateEnd(date)} />
                            <span className="icon-arrow-down"></span>
                          </div>
                        </div> */}
                      </div>
                      <small className="pl-0 mt-special-12">Please select the start date you want and the amount of days you want to be featured</small>
                    </>
                    }
                  </div>

                  {/* TWITTER Shoutout on relase */}
                  <div className="form-group mt-51">
                    <label className="h5">Giveaway Post on the Who’s Launching Twitter Page (50k+ NFT Followers)</label>
                    {twitterShoutoutTypeOptions.map((type,i)=>{
                        return(
                          <p key={i}>
                            <input type="radio" id={`test${i+3}`} name="radio-group-1"  onChange={()=>setTwitterShoutoutType(type.value)} checked={twitterShoutoutType==type.value} />
                            <label htmlFor={`test${i+3}`}>{type.name}</label>
                            {i > 0 &&<span className={i==0 ? `color-m`:""}>{servicePrice.twitterGiveawayPost} ETH</span>}
                            {i == 0 &&<span className={i==0 ? `color-m`:""}>Free</span>}
                          </p>
                        )
                      })}
                    
                    <small className="pl-0 mt--6">We will get in contact with you regarding the information needed</small>
                  </div>

                  {/* DISCORD SHOUTOUT */}
                  <div className="form-group mt-50">
                    <label className="h5">{`Giveaway Post on the Who’s Launching Discord Server (50k+ NFT Members)`}</label>
                    {discordShoutoutTypeOptions.map((type,i)=>{
                        return(
                          <p key={i}>
                            <input type="radio" id={`test${i+6}`} name="radio-group-2"  onChange={()=>setDiscordShoutoutType(type.value)} checked={discordShoutoutType==type.value} />
                            <label htmlFor={`test${i+6}`}>{type.name}</label>
                            {i>0 && <span className={i==0 && `color-m`}>{servicePrice.discordGiveawayPost} ETH</span>}
                            {i==0 && <span className={i==0 && `color-m`}>Free</span>}
                          </p>
                        )
                      })}
                    <small className="pl-0 mt--6">We will get in contact with you regarding the information needed</small>
                  </div>

                  {/* Front Page Shoutout */}
                  <div className="form-group mt-51">
                    <label className="h5">{`Have your project displayed on the Who’s Launching Twitter Cover Photo`}</label>
                    <p>
                      <input type="radio" id="test9" name="radio-group-3" onChange={()=>setIsFrontPage(false)} checked={!isFrontPage ?true:false} />
                      <label htmlFor="test9">No Cover Photo</label>
                      <span className="color-m">Free</span>
                    </p>
                    <p>
                      <input type="radio" id="test10" name="radio-group-3" onChange={()=>setIsFrontPage(true)} checked={isFrontPage ?true:false}/>
                      <label htmlFor="test10">Please book a timeframe</label>
                      <span>{servicePrice.twitterCoverPhotoPerDay} ETH per day</span>
                    </p>

                    {isFrontPage &&
                      <>
                        <div className="row mt-21">
                          <div className="col-md-6ss">

                            <div  className="new-amount-container" >
                              <div   className="input-group">
                                <div  onClick={()=>handleDatePluginStates(3)} className="input-group-prepend">
                                  <div className="input-group-text">
                                    <span className="icon-Calendar"></span>
                                  </div>
                                </div>                   
                                <span style={{width:"100%"}} onClick={(e)=>{let classes = e.target.classList; if(classes[0] == "force-no-border-left")handleDatePluginStates(3)}}><DatePicker open={datePluginStates[3]} disabledKeyboardNavigation onFocus={e => e.target.blur()}  className="force-no-border-left " selected={isFrontPageStartDate} onChange={(date) => setIsFrontPageStartDate(date)} /></span>

                                <span onClick={()=>handleDatePluginStates(3)} className="icon-arrow-down"></span>
                              </div>

                              {/* Amount container */}
                              <div style={{justifyContent:"flex-end"}} className="input-group">
                                  <div className="select-wrapper"> 
                                    <select  value={isFrontPageAmount} onChange={(e)=>setIsFrontPageAmount(e.target.value)} >
                                      {maxDaysFrontPage.map((dayNum,i)=>{
                                        return(<option key={i} value={dayNum}>{dayNum} {dayNum==1?"Day":"Days"}</option>)
                                      })}
                                    </select>
                                    <span className="icon-arrow-down"></span>
                                  </div>
                              </div>
                            </div>
                          </div>
                          {/* <div className="col-md-6">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <div className="input-group-text">
                                  <span className="icon-Calendar"></span>
                                </div>
                              </div>                   
                              <DatePicker className="force-no-border-left " selected={isFrontPageEndDate} onChange={(date) => setIsFrontPageEndDate(date)} />

                              <span className="icon-arrow-down"></span>
                            </div>
                          </div> */}
                        </div>
                        <small className={`pl-0 mt-special-12 ${!isFrontPage?"mt--6":""}`}>Please select the start date you want and the amount of days you want to be displayed</small>
                      </>
                    }
                  </div>

                  {/* GROWTH INTEREST */}
                  <div className="form-group mt-51">
                    <label className="h5">Are you interested in Growth Services For your project?</label>
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <input type="radio" id="test12" name="radio-group-4"  onChange={()=>setGrowthInterest(true)} checked={growthInterest}/>
                          <label htmlFor="test12">Yes</label>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <input type="radio" id="test11" name="radio-group-4" onChange={()=>setGrowthInterest(false)} checked={!growthInterest}/>
                          <label htmlFor="test11">No</label>
                        </p>
                      </div>
                    </div>
                  </div>

                  {growthInterest && <div>
                    <div className="form-group ">
                      <p>
                        <input type="radio" id="test13" name="radio-group-5" onChange={()=>setHowToContact("email")} checked={howToContact=="email"} />
                        <label htmlFor="test13">Email</label>
                        <span className="color-m">{email}</span>
                      </p>

                      <div className="row">
                        <div className="col-md-6">
                          <p>
                            <input type="radio" id="test14" name="radio-group-5" onChange={()=>setHowToContact("discord")} checked={howToContact=="discord"}/>
                            <label htmlFor="test14">Discord</label>
                          </p>
                        </div>
                        <div className="col-md-6">
                          <input style={{height:56}} type="text" value={discordContact} onChange={(e)=>setDiscordContact(e.target.value)} placeholder="Name#0000"  />
                        </div>
                      </div>

                    </div>
                  </div>}

                 

                  <button type="submit">{calculateFinalPrice() > 0 ?`Proceed To Payment: ${ calculateFinalPrice().toFixed(1)} ETH` :"Submit Project" }</button>
                  {/* error */}
                  <div className="error-text">{error}</div>
                </form>
              </div>
            </section>
          </div>
        </div>


      </div>
    )
    
  }
  
 
  
}


// let objData = {
    //   name:projectName,
    //   discordUsername,
    //   collectionCount,
    //   blockchainType:blockchainSelected,
    //   saleStatusType:saleStatusSelected,
    //   description,
    //   presale:{
    //     price:presalePrice,
    //     date:presaleDate,
    //     timezone:presaleTimezoneSelected
    //   },
    //   publicsale:{
    //     price:publicsalePrice,
    //     date:publicsaleDate,
    //     timezone:publicsaleTimezoneSelected
    //   }
    // }
    // for(let key  in objData){
    //   if(typeof objData[key]){
    //     for(let key2 in objData[key]){
    //       console.log(objData[key][key2])
    //       formData.append(`${key}[${key2}]`, objData[key][key2]);
    //     }
    //     formData.append(key, objData[key]);
    //   }else{

    //   }
    // }
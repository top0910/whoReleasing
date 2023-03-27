import Meta from "../component/Meta"
import Header from "../component/Header"
import SideBar from '../component/SideBar'
import DashboardHeader from '../component/DashboardHeader'
import {useRouter } from "next/router"
import  ProjectContainer  from '../component/ProjectContainer'
import { useEffect,useState,useRef, useCallback } from 'react'
import useIntersection from "../lib/useIntersection"
import moment from "moment"
import DatePicker from "react-datepicker";
import axios from "axios"
import styles from "../styles/next/Home.module.css"
//Mongo
// import dbConnect from "../lib/dbConnect"
// import ProjectModel from "../models/project"
export default function Home({
    dark,setDark,isMobileOpen,setIsMobileOpen,
    allProjectDates,setAllProjectDates,currentDateShowingIndex,setCurrentDateShowingIndex,featuredProjects,setFeaturedProjects,allPossibleDates,setAllPossibleDates,
    currentScrollState,setCurrentScrollState,
  }) {
  // _featuredProjects,_calenderProjects,_allProjectDates,_allPossibleDates,_currentDateShowingIndex

  const router = useRouter()

  const [updater,setUpdater] = useState(0)
  const [loading,setLoading] = useState(false)
  const [reAlignedScroll,setReAlignedScroll] = useState(false)
  const [currentMenuSection,setCurrentMenuSection] = useState("feature")
  const [datePluginStates,setDatePluginStates] = useState([false])
  const [alreadyFetchedProjects,setAlreadyFetchedProjects] = useState(false)
  const [alreadyFetchedFeatured,setAlreadyFetchedFeatured] = useState(false)
  //PROPS FROM SERVER

  const [datesFinished,setDatesFinished] = useState(false)

  let utcTime = moment.utc()


  //Check if we have dates already || If not set to today, otherwise set to the first date in the array 
  const [calendarDate,setCalenderDate] = useState(allPossibleDates[0]?new Date(allPossibleDates[0]) : new Date(utcTime.format(`MMMM D, YYYY 00:00:00`)))


  const allDatesContainerElementRef = useRef()
  const bodyREF = useRef()
  const featuredHeaderRef = useRef()
  const calenderHeaderRef = useRef()

  

  useEffect(()=>{ 
    //Sve last searched date in db

    const fetchInitialProjects = async(newDate) =>{
      let params = `?startDate=${moment(newDate).format("MMMM D, YYYY 00:00:00")}&maxAmount=4`
      setLoading(true)
      try{
        const res = await axios.get(`/api/project/getDates/${params}`)
        if(res.data.success){
            setAllPossibleDates(res.data.allPossibleDates)
            setAllProjectDates(res.data.allProjectDates)
            setCurrentDateShowingIndex(res.data.currentDateShowingIndex)
            setDatesFinished(false)
        }else{
          console.log("Failed to filter by date")
        }
        
      }catch(e){
        console.log(e)
      }
      setLoading(false)
    }

    const getchFeaturedProjects = async(newDate) =>{
      setLoading(true)
      try{
        const res = await axios.get(`/api/project/featured`)
        if(res.data.success){
            setFeaturedProjects(res.data.data)
        }else{
          console.log("Failed to filter by date")
        }
        
      }catch(e){
        console.log(e)
      }
      setLoading(false)
    }


    if(router.query.scrollTo){
      if(router.query.scrollTo == "calender"){
        const calenderLocation = calenderHeaderRef.current.getBoundingClientRect().top
        window.scrollBy({ top:calenderLocation-80, left:0,behavior: "instant"});
      }else if(router.query.scrollTo == "featured"){
        window.scrollTo({ top:0, left:0,behavior: "instant"});
      }
    }else{
      if(!reAlignedScroll){
        window.scrollTo({ top:currentScrollState.home, left:0, behavior: "instant"});
        setReAlignedScroll(true)
      }
    }

    

    if(!alreadyFetchedProjects && allProjectDates.length == 0){
      //Fetch them
      let utcTime= moment.utc()
      var startOfDay = new Date(utcTime.format(`MMMM D, YYYY 00:00:00`));
      startOfDay.setHours(0,0,0,0);

      fetchInitialProjects(startOfDay)
      console.log(`Initial Fetch Date:`,startOfDay)
      setAlreadyFetchedProjects(true)
    }
    
    if(!alreadyFetchedFeatured && featuredProjects.length == 0){
      getchFeaturedProjects()
      setAlreadyFetchedFeatured(true)
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  },[allProjectDates,router])


  const handleDatePluginStates = (index)=>{
    let tempStates = [...datePluginStates]
    tempStates[index] = !tempStates[index]
    setDatePluginStates([...tempStates])
  }

  const fetchExtraDates =  async()=>{
    setLoading(true)
    if(!allPossibleDates[currentDateShowingIndex+1]){ //If there isnt another another possible date return
      setDatesFinished(true)
      return
    } 
    try{
      let params = `?date=${moment(allPossibleDates[currentDateShowingIndex+1]).format(`MMMM D, YYYY 00:00:00`)}`
      const res = await axios.get(`/api/project${params}`)
      if(res.data.success){
        let tempAllProjectDates = [...allProjectDates]
        tempAllProjectDates.push({date:moment(allPossibleDates[currentDateShowingIndex+1]),data:res.data.data})
        setAllProjectDates(tempAllProjectDates)
        setCurrentDateShowingIndex(currentDateShowingIndex+1)
      }else{
        console.log("Failed to filter by date")
      }
    }catch{

    }
    
    setLoading(false)
  }
  
  const highlightHeader = ()=>{
    if(featuredHeaderRef.current.getBoundingClientRect().bottom > 200){
      setCurrentMenuSection("feature")
    }else{
      setCurrentMenuSection("calendar")
    }
  }

  const handleScroll = async(e)=>{
    //set scroll state
    let tempScrollState = currentScrollState
    tempScrollState.home =  window.pageYOffset
    setCurrentScrollState(tempScrollState)

    //Highlighting the proper menu label
    highlightHeader()

    //If loading more DATES
    if(datesFinished) return

    if(isBottom(allDatesContainerElementRef.current,400)){
      if(loading) return
      await fetchExtraDates()
    }
  }

  const isBottom=(el,offset) => {
    try{
      return (el.getBoundingClientRect().bottom-offset) <= window.innerHeight;
    }catch{}
  }

  // const handleChangeCalender = async(newDate) =>{
  //   let params = `?date=${moment(newDate).toISOString()}`
  //   setLoading(true)
  //   try{
  //     const res = await axios.get(`/api/project${params}`)
  //     if(res.data.success){
  //         setCalenderProjects(res.data.data)
  //     }else{
  //       console.log("Failed to filter by date")
  //     }
      
  //   }catch(e){
  //     console.log(e)
  //   }
  //   setLoading(false)
  // }

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

  const handleClickBody = (e)=>{
    setIsMobileOpen(false)

    let closeAllDates = checkIfCloseDateContainers(e)
    if(closeAllDates){
      setDatePluginStates([false])
    }
    

  }
  const checkIfStillFeatured = ()=>{
    if(!projectData) return
    if(projectData.services.featureRequested){
        if(moment(projectData.services.featureRequestedStartDate).isSameOrBefore(moment().startOf("day"))){

            if(moment(projectData.services.featureRequestedEndDate).isSameOrAfter(moment().startOf("day"))){
                setIsStillFeatured(true)
            }
        }
        
    }
  }

  const sortDateRow = (dateRow)=>{
    const featuredProjectIds = featuredProjects.map(proj=>proj._id)
    const sortedRow = dateRow.sort((projectInfo1,projectInfo2)=>{
      if(featuredProjectIds.includes(projectInfo1._id)){
        if(!featuredProjectIds.includes(projectInfo2._id)){
          return -1
        }else{
          return 0
        }
      }else{
        return 1
      }
    })
    return sortedRow
  }

  const handleChangeCalender = async(newDate) =>{
    newDate.setHours(0,0,0,0);
    let params = `?startDate=${moment(newDate).format(`MMMM D, YYYY 00:00:00`)}&maxAmount=4`
    console.log(`Calender Fetch Date:`,newDate)
    setLoading(true)
    try{
      const res = await axios.get(`/api/project/getDates/${params}`)
      if(res.data.success){
          setAllPossibleDates(res.data.allPossibleDates)
          setAllProjectDates(res.data.allProjectDates)
          setCurrentDateShowingIndex(res.data.currentDateShowingIndex)
          setDatesFinished(false)
      }else{
        console.log("Failed to filter by date")
      }
      
    }catch(e){
      console.log(e)
    }
    setLoading(false)
  }

  return (
    // onScroll={handleScroll}
    <div ref={bodyREF}  className={`body ${dark && "dark"}  ${isMobileOpen&&"show"}`}>
      
      <Meta dark={dark} title={"Home"}  content={"Homepage"} />
      <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
      <SideBar currentMenuSection={currentMenuSection} dark={dark} setDark={setDark} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      
      <div onClick={(e)=>handleClickBody(e)}  className="dashboard__content">
        <div className="overlay"></div>
        <DashboardHeader/>

        {/* Main Data */}
        <div className="dashboard__main">

          {/* Feature Section */}
          <section ref={featuredHeaderRef} id="featured" className="featured">
            <h4 className="heading">Featured Projects</h4>
            <div className="featured__main">
              {featuredProjects &&  featuredProjects.map((projectData,i)=>{
                return(
                  <ProjectContainer dark={dark} showFeatured={true} projectData={projectData}  key={i} />
                )
              })} 
            </div>
          </section>

          {/* Calender Section */}
          <section ref={calenderHeaderRef} className="featured calendar" id="calendar">
            <div className={styles.calenderDateHeader}>
              <h4 className={`${styles.calenderDateheadingText} heading`}>NFT Calendar</h4>
              {/* DATE SELECTOR 1 */}
              <div  className={`${styles.dateGroupContainer} form-group`}>
                <div  style={{flexWrap:"nowrap",position:"relative"}} className="input-group">
                  <div onClick={()=>handleDatePluginStates(0)} className="input-group-prepend usedForDate">
                    <div className="input-group-text">
                      <span onClick={()=>handleDatePluginStates(0)} style={{marginBottom:3}} className="icon-Calendar"></span>
                    </div>
                  </div>
                  <span onClick={(e)=>{let classes = e.target.classList; if(classes[0] == "force-no-border")handleDatePluginStates(0)}} ><DatePicker open={datePluginStates[0]}  disabledKeyboardNavigation onFocus={e => e.target.blur()}  className="force-no-border form-control fc-datepicker usedForDate"   selected={calendarDate} onChange={(date) => {setCalenderDate(date); handleChangeCalender(date)}} /></span>
                  <span onClick={()=>handleDatePluginStates(0)} className="icon-arrow-down"></span>
                </div>
              </div>  
            </div>
            {allPossibleDates.length==0 && <div className={styles.dateMeta}> 
              <div className={styles.dateMetaMonth}>{moment(calendarDate).format("MMMM D")}</div>
              <div className={styles.dateMetaDay}>(0 Drops)</div>
            </div>}

            {allPossibleDates.length>0 && moment(allPossibleDates[0]).format("MM/DD/YYYY") != moment(calendarDate).format("MM/DD/YYYY")  && <div className={styles.dateMeta}> 
              <div className={styles.dateMetaMonth}>{moment(calendarDate).format("MMMM D")}</div>
              <div className={styles.dateMetaDay}>(0 Drops)</div>
            </div>}

            
          </section>

          <section  ref={allDatesContainerElementRef} className={`${styles.allProjectDatesContainer} featured` }>
            {allProjectDates && allProjectDates.map((allproject,i)=>{
              if(allproject.data.length == 0){return}
             
              return(
                <div key={i} className={styles.ProjectDateContainer}>
                  <div  className={styles.dateMeta}>
                    <div className={styles.dateMetaMonth}>{moment(allproject.date).format("MMMM D")}</div>
                    <div className={styles.dateMetaDay}>({allproject.data.length} Drops)</div>
                  </div>
                  
                  <div className="featured__main">
                    {sortDateRow(allproject.data).map((project,i)=>{
                      return(
                        <ProjectContainer showFeatured={true} dark={dark} key={i} projectData={project}  />
                      )
                    })}
                  </div>
                </div>
              )
            })}
            
          </section>

        </div>
      </div>
    </div>
  )
}

// export async function getServerSideProps(context) {
//   await dbConnect()
//   //Calender
//   let calenderProjects=[]
//   let calenderFilteredDate =moment()
//   //Feature
//   let featuredProjects=[]

//   //All Days Scroll
//   let allProjectDates = []
//   let allPossibleDates = []
//   let currentDateShowingIndex = 4

//   //get featured
//   try{
//     let today = moment()

//     featuredProjects = await ProjectModel.find({
//       "services.featureRequested":true,
//       "services.featureRequestedStartDate":{$lte:today},
//       "services.featureRequestedEndDate":{$gte:today},
//       approved:true
//     })
//   }catch(e){
//     console.log(e)
//   }
//   //get calender
//   try{
//     calenderProjects = await ProjectModel.find({"presale.date":{
//       $gte: moment(calenderFilteredDate).startOf("day").toISOString(),
//       $lte: moment(calenderFilteredDate).endOf('day').toISOString()
//     },
//     approved:true
//   },{description:0})
//   }catch(e){
//     console.log(e)
//   }

//   //Get all dates from startdate to amount of extra dates
//   try{
//     //Get all possible Dates
//     allPossibleDates= await ProjectModel.distinct("publicsale.date",{
//       "publicsale.date":{$gte: moment().startOf("day").toISOString()},
//       approved:true
//     })
//     for(let i=0;i<currentDateShowingIndex;i++){
//       try{
//         if(!allPossibleDates[i]) break
//         let dayProjects =  await ProjectModel.find({
//           "publicsale.date":{
//             $gte: allPossibleDates[i],
//             $lte: moment(allPossibleDates[i]).endOf('day').toISOString()
//           },
//           approved:true
//         },{description:0})
//         allProjectDates.push({date:allPossibleDates[i],data:dayProjects})
//       }catch(e){
//         console.log(e)
//       }  
//     }

//   }catch(e){
//     console.log(e)
//   }

//   console.log(allPossibleDates)
//   return {
//     props: {
//       _featuredProjects:JSON.parse(JSON.stringify(featuredProjects)),
//       _calenderProjects:JSON.parse(JSON.stringify(calenderProjects)),
//       _allProjectDates:JSON.parse(JSON.stringify(allProjectDates)),
//       _currentDateShowingIndex:currentDateShowingIndex-1,
//       _allPossibleDates:JSON.parse(JSON.stringify(allPossibleDates))
//     }, // will be passed to the page component as props
//   }
// }



/*
  OLD DATE SELECTOR
 DATE SELECTOR 1 
  <div onClick={()=>handleDatePluginStates(0)}  className={`${styles.dateGroupContainer} form-group`}>
  <div  style={{flexWrap:"nowrap",position:"relative"}} className="input-group">
    <div className="input-group-prepend">
      <div className="input-group-text">
        <span style={{marginBottom:3}} className="icon-Calendar"></span>
      </div>
    </div>
    <DatePicker open={datePluginStates[0]}   disabledKeyboardNavigation onFocus={e => e.target.blur()}  className="force-no-border form-control fc-datepicker"   selected={calendarDate} onChange={(date) => {setCalenderDate(date); handleChangeCalender(date)}} />
    {dark && <span className="arrowDownDark "><img className='white-filter ' src={`/assets/images/icon/arrow-down.svg`} /></span>}
    {!dark && <span className="arrowDownLight " ><img className='dark-filter ' src={`/assets/images/icon/arrow-down.svg`} /></span>}
  </div>
</div>  

*/
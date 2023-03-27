import AOS from "aos";
import '../styles/globals.css'

import "../public/assets/style.css"
import '../styles/aos.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/app.css'
import '../styles/datepicker.css'


// Component styles
import '../styles/component/_item-box.scss'
import "../styles/react-datepicker.css";

//Clock
import "../styles/clock/Clock.css"
import "../styles/clock/TimePicker.css"

import Layout from "../component/Layout"
import {useEffect,useState,useMemo} from "react"

function MyApp({ Component, pageProps }) {

  const [dark,setDark] = useState(true)

  const [isMobileOpen,setIsMobileOpen] = useState(false)

  const [featuredProjects,setFeaturedProjects] = useState([])
  const [allProjectDates,setAllProjectDates] = useState([])
  const [currentDateShowingIndex,setCurrentDateShowingIndex] = useState(0)
  const [allPossibleDates,setAllPossibleDates] = useState([])

  const [currentScrollState,setCurrentScrollState] = useState({home:0})



  const handleSetDark = (val)=>{
    //set dark session
    sessionStorage.setItem("dark",val)
    setDark(val)
  }

//useEffect
  useEffect(() => {
    AOS.init();
    AOS.refresh();  
    
    let darkVal = JSON.parse(sessionStorage.getItem("dark"))
    setDark(darkVal==null ? true:darkVal )

  }, []);

  //Stop mainclass scross when sidebar open
  useMemo(() => {
    try{
      if(isMobileOpen){
        document.querySelector("body").classList.add("preventScroll")
      }else{
        document.querySelector("body").classList.remove("preventScroll")
      }
    }catch{}
    
  }, [isMobileOpen])


  const handleScrollPage = (e)=>{
    console.log(window.pageYOffset)
  }
  return (
    <Layout >
      <Component 
        setCurrentScrollState={setCurrentScrollState}
        currentScrollState={currentScrollState}
        currentDateShowingIndex={currentDateShowingIndex}
        setCurrentDateShowingIndex={setCurrentDateShowingIndex}
        allProjectDates={allProjectDates} 
        setAllProjectDates={setAllProjectDates} 
        setFeaturedProjects={setFeaturedProjects}
        featuredProjects={featuredProjects}
        allPossibleDates={allPossibleDates}
        isMobileOpen={isMobileOpen} 
        setAllPossibleDates={setAllPossibleDates}
        setIsMobileOpen={setIsMobileOpen} 
        dark={dark} 
        setDark={handleSetDark} {...pageProps} />
    </Layout >
  )
}

export default MyApp

import React, { useEffect, useMemo } from 'react'
import Link from "next/link"
import { useRouter } from 'next/router'
import {useState} from "react"
import axios from "axios"
import { Link as ScrollLink } from 'react-scroll'

//IMAGES SRC
import FavIconImage from "../public/assets/images/icon/favicon.png"

import styles from "../styles/next/SideBar.module.css"

const SideBar = ({dark,setDark,isMobileOpen,setIsMobileOpen,currentMenuSection=""}) => {
  const router = useRouter()

  //Inputrs
  const [search,setSearch] = useState("")
  const [signupEmail,setSignupEmail] = useState("")

  const [suggested,setSuggested] = useState([])

  //meta input
  const [emailSent,setEmailSent] = useState(false)
  const [searchIsActive,setSearchIsActive] = useState(false)

  //If no search found for a text , if we add onto it dont search
  const [lastFailedSuggestion,setLastFailedSuggestion] = useState("")

  useEffect(()=>{
    setIsMobileOpen(false)
  },[router.pathname,currentMenuSection])

  const handleSearchChange = async(val)=>{
    setSearch(val)
    if(!val || val=="" ){
      setSuggested([])
      return
    }
    //If last failed seach is included in the current searchm dont execute
    if(lastFailedSuggestion!== "" && val.includes(lastFailedSuggestion)){
      return
    }

    try{
      //Do a query for all names 
      const res = await axios.get(`/api/suggest?text=${val}`)
      if(res.data.success){
        let sortedData = res.data.data.sort((a,b)=>{
          if(a.name.toLowerCase().startsWith(val.toLowerCase())){
            return -1
          }else{
            return 1
          }
        })
        setSuggested(sortedData)
        if(res.data.data.length == 0){
          setLastFailedSuggestion(val)
        }
      }else{
        setSuggested([])
      }


    }catch(e){
      console.log(e)
    }
    
  }

  const handleSuggestClick = ()=>{
    setSearch("")
    setSuggested([])
  }

  const handleTimeoutBlur = ()=>{
    setTimeout(()=>{
      setSearchIsActive(false)
    },10000)
    
  }

  const saveEmail = async(e)=>{
    e.preventDefault()
    if(signupEmail == "" || !signupEmail.includes("@")){
      return
    }
    
    const res = await axios.post('/api/email',{
      email:signupEmail
    })
    if(res.data.success){
      setEmailSent(true)
      console.log("Successfully Sent Email")
    }else{
      console.log("Failed to send Email")
    }

  }

  return (
    <nav className={`dashboard__sidebar ${isMobileOpen?"show":""}`}>
      <div style={{paddingLeft:20,paddingRight:20,marginRight:10}} className="sidebar__logo">
        <Link href="/">
          <a >
            <img className="logo" src="/assets/images/logo/logo.png" height={55} alt="ICOLand"  />
            <img
              className="favicon"
              // src="/assets/images/icon/favicon.png"
              style={{marginTop:5}}
              src="/assets/images/icon/favicon.png"
              alt="ICOLand"
              height={50}
            />
          </a>
        </Link>
        <div style={{marginRight:0}} onClick={()=>setIsMobileOpen(false)} className="mobile-button"><span></span></div>
      </div>
      <ul className="sidebar__menu">
        <li onClick={()=>setIsMobileOpen(false)}>
          <Link href="/?scrollTo=featured" as="/">
            <a className={`${currentMenuSection=="feature" && "active"}`}>
              <span className="icon-star"></span>FEATURED PROJECTS
            </a>
          </Link>
        </li>
        <li onClick={()=>setIsMobileOpen(false)}>
          <Link href="/?scrollTo=calender" as="/" >
            <a  className={`${currentMenuSection=="calendar" && "active"}`} >
              <span className="icon-Calendar"></span>NFT CALENDAR</a>
          </Link>
        </li>
        <li onClick={()=>setIsMobileOpen(false)}>
          <Link href="/news">
            <a  className={`${currentMenuSection=="news" && "active"}`}><span className="icon-paperplus"></span>NFT NEWS</a>
          </Link>
        </li>

        <Link  href="/submitproject">
          <a onClick={()=>setIsMobileOpen(false)} id="sidebarSubmit"  className="btn-action">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.16699 10.0003V7.70253C4.16699 6.26419 4.16699 5.54503 4.51972 5.03276C4.65802 4.8319 4.8319 4.65802 5.03276 4.51972C5.54503 4.16699 6.26419 4.16699 7.70253 4.16699V4.16699C8.32909 4.16699 8.64237 4.16699 8.93247 4.25721C9.04867 4.29334 9.16132 4.34 9.26903 4.39661C9.53796 4.53796 9.75948 4.75948 10.2025 5.20253L10.4954 5.49542C11.0735 6.07348 11.3625 6.36251 11.7301 6.51475C12.0976 6.66699 12.5063 6.66699 13.3238 6.66699H13.5003C15.3859 6.66699 16.3288 6.66699 16.9145 7.25278C17.5003 7.83857 17.5003 8.78137 17.5003 10.667V11.8337C17.5003 13.7193 17.5003 14.6621 16.9145 15.2479C16.3288 15.8337 15.3859 15.8337 13.5003 15.8337H13.3337"
                stroke="#10BC9D"
                strokeWidth="2"
              />
              <path
                d="M3.33301 13.7497H10.833M10.833 13.7497L7.91634 10.833M10.833 13.7497L7.91634 16.6663"
                stroke="#10BC9D"
                strokeWidth="2"
              />
            </svg>
            Submit Project
          </a>
        </Link>
      </ul>

      <div onBlur={()=>handleTimeoutBlur()} onFocus={()=>setSearchIsActive(true)}  className="search">
        <form className={styles.relativeForm} action="#">
          <input  value={search} onChange={(e)=>handleSearchChange(e.target.value)} type="text" placeholder="Search Collections" required="" />
          <button>
            <span className="icon-search"></span>
          </button>
          {searchIsActive && suggested && suggested.length >0 && 
            <div className={styles.searchSuggestionContainer}>
              {suggested.map((suggest,i)=>{

                let showLine = suggested.length !== (i+1)
                return(
                  <Link key={i} href="/projectdetails/[id]" as={`/projectdetails/${suggest._id}`}>
                    <div>
                      <div onClick={()=>handleSuggestClick()}  className={styles.searchSuggestion} >
                        <img  src={`/assets/images/projects/${suggest.imageName}`} />
                        <div>{suggest.name}</div>
                      </div>
                      {showLine && <div className={styles.line}></div>}
                    </div>
                    
                  </Link>
                )
              })}
          </div>
          }
        </form>
      </div>

      <div className="social">
        <h6 className="title">JOIN OUR SOCIALS</h6>
        <a rel="noopener noreferrer" target="_blank"  href='https://twitter.com/WhosLaunching' className="button">
          <p className="fisrt twiter"><span className="icon-Twitter"></span>Twitter</p>
          <p>51K Followers</p>
        </a>
        <a rel="noopener noreferrer" target="_blank"  href='https://discord.gg/whoslaunching' className="button">
          <p className="fisrt discord"><span className="icon-Discord"></span>Discord</p>
          <p>52K Members</p>
        </a>
      </div>

      <div className="bottom">
        <h6 className="title">ENTER OUR FREE NFT GIVEAWAY</h6>

       {!emailSent ? 
          <form onSubmit={saveEmail}>
            <input type="email" placeholder="Email" value={signupEmail} onChange={(e)=>setSignupEmail(e.target.value)} required="" />
            <button  type="submit">Submit</button>
          </form> :
          <form>
            <div className={styles.submitedEmail}>Submitted</div> 
          </form>
        }
        <div className="mode_switcher">
          <span className="icon-moon"></span>
          <h6>Dark Mode</h6>
          <span className="darkmode-switch" onClick={()=>setDark(!dark)}></span>
        </div>

        <div className="contact">
          <Link href="/conditions"><a >{`Terms & Conditions`}</a></Link>
        </div>
      </div>
    </nav>
  )
}

export default SideBar
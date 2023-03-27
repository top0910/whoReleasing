import React from 'react'
import Link from "next/link"
const DashboardHeader = ({location="",submitProjectBack}) => {
  return (
    <div className="dashboard__header">
        {/* Breadcrumb Button Optional */}
        {location == "submitproject1"&&
            <div className="breadcrumb">
                <Link href="/">
                    <a  className="back btn-action">
                        <img src="/assets/images/icon/back.png" alt="" />
                        Back
                    </a>
                </Link>
            </div>
        }

        {location == "submitproject2"&&
            <div onClick={()=>submitProjectBack()} className="breadcrumb">
                <a  className="back btn-action">
                    <img src="/assets/images/icon/back.png" alt="" />
                    Back
                </a>
            </div>
        }

        {location == "conditions"&&
            
            <div className="breadcrumb">
                <ul className="list">
                    <Link href="/"><li><a href="index.html">Home</a></li></Link>
                    <li><h6>{`Term & Conditions`}</h6></li>
                </ul>
            </div>
        }
        
        {location == "news"&&           
            <div  className="breadcrumb">
                <ul className="list">
                    <Link href="/"><li><a href="index.html">Home</a></li></Link>
                    <li><h6>{`NFT News`}</h6></li>
                </ul>
            </div>
        }

        {location == "projectDetails" &&
            <div   className="breadcrumb">
                <Link href="/">
                    <a  className="back btn-action">
                        <img src="/assets/images/icon/back.png" alt="" />
                        Back
                    </a>
                </Link>
            </div>
        }
        {location == "newsDetails" &&
            <div  className="breadcrumb">
                <Link href="/news">
                    <a  className="back btn-action">
                        <img src="/assets/images/icon/back.png" alt="" />
                        Back
                    </a>
                </Link>
            </div>
        }

        {location!== "news" &&location!=="projectDetails"&& location!=="newsDetails" && location!=="submitproject1" &&  location!=="submitproject2" && <section style={{marginTop:50}} className="banner" >
            <div className="banner__content">
            <h3 className="title">The Most Viewed NFT Calendar</h3>
            <p className="desc">
                {`We receive over 2 million visitors per month making us the largest NFT calendar. Click the button 
                    below to get featured.
                    `}
            </p>
            <Link href="/submitproject">
                <a className="btn-action">
                    <svg
                    className="folder"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M4.16699 10.0003V7.70253C4.16699 6.26419 4.16699 5.54503 4.51972 5.03276C4.65802 4.8319 4.8319 4.65802 5.03276 4.51972C5.54503 4.16699 6.26419 4.16699 7.70253 4.16699V4.16699C8.32909 4.16699 8.64237 4.16699 8.93247 4.25721C9.04867 4.29334 9.16132 4.34 9.26903 4.39661C9.53796 4.53796 9.75948 4.75948 10.2025 5.20253L10.4954 5.49542C11.0735 6.07348 11.3625 6.36251 11.7301 6.51475C12.0976 6.66699 12.5063 6.66699 13.3238 6.66699H13.5003C15.3859 6.66699 16.3288 6.66699 16.9145 7.25278C17.5003 7.83857 17.5003 8.78137 17.5003 10.667V11.8337C17.5003 13.7193 17.5003 14.6621 16.9145 15.2479C16.3288 15.8337 15.3859 15.8337 13.5003 15.8337H13.3337"
                        stroke="white"
                        strokeWidth="2"
                    />
                    <path
                        d="M3.33301 13.7497H10.833M10.833 13.7497L7.91634 10.833M10.833 13.7497L7.91634 16.6663"
                        stroke="white"
                        strokeWidth="2"
                    />
                    </svg>

                    Get featured
                </a>
            </Link>
            </div>
            <div className="banner__image">
                <img src="/assets/images/layout/img-banner.png" alt="" />
            </div>
        </section>}
    </div>
  )
}

export default DashboardHeader
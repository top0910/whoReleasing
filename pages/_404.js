import React from 'react'
import Link from "next/link"
import Meta from "../component/Meta"

const FourOhFour = ({dark=false,isMobileOpen}) => {
    
  return (
    <div className={`body ${dark && "dark"} ${isMobileOpen&&"show"}`}>
        <Meta dark={dark} title={"404"}  content={"404"} />
        <section className="page-404">
        <div className="main">
            <img src="/assets/images/layout/404.png" alt="" />
            <h4>Oops! This NFT is Not Found.</h4>
            <p>{`The page you are looking for doesn't exist`}</p>
            <Link href="/"><a  className="btn-action">Back To Home</a></Link>
        </div>
        </section>
  </div>
  )
}

export default FourOhFour
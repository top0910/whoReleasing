import React from 'react'
import Image from 'next/image'
import Link from "next/link"
//Images Source
// import FavIconImage from "../public/assets/images/icon/favicon.png"

const Header = ({setIsMobileOpen,isMobileOpen}) => {
  return (
    <div className="header">
      <div className="logo">
        <Link href="/">
          <a >
              <img 
                height={48}
                src={"/assets/images/logo/logo.png"}
                alt="ICOLand"
              />
          </a>
        </Link>
      </div>

      {!isMobileOpen && <div onClick={()=>setIsMobileOpen(true)} className="mobile-button"><span></span></div>}
    </div>
  )
}

export default Header
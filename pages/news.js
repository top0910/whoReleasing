import React, { useState } from 'react'
import Meta from "../component/Meta"
import Header from "../component/Header"
import SideBar from '../component/SideBar'
import DashboardHeader from '../component/DashboardHeader'
import { Navigation, Pagination, Scrollbar, A11y,Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import dbConnect from '../lib/dbConnect'
import NewsModel from "../models/news"
import Link from "next/link"
// Import Swiper styles
import 'swiper/css';
import "swiper/css/autoplay"
import "swiper/css/pagination"
import moment from 'moment'
      
const News = ({dark,setDark,_allNews,_randomNews,isMobileOpen,setIsMobileOpen}) => {
    const [allNews,setAllNews] = useState(_allNews)
    
    const handleClickBody = ()=>{
        setIsMobileOpen(false)
    }
    
    return (
        <div  className={`body ${dark && "dark"} ${isMobileOpen&&"show"}`}>
            <Meta dark={dark} title={"Home"}  content={"Homepage"} />
            <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            <SideBar currentMenuSection="news" dark={dark} setDark={setDark} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

            <div onClick={handleClickBody} className="dashboard__content">
                <div className="overlay"></div>
                <DashboardHeader location="news"/>
                <div className="dashboard__main">
                    <section className="news__main">
                        {/* Swiper */}
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y,Autoplay]}
                            autoplay={true}
                            pagination={{ clickable: true }}
                            spaceBetween={10}
                            
                            slidesPerView={1}
                            className="news-swiper news__box-slide"
                            // onSlideChange={() => console.log('slide change')}
                            // onSwiper={(swiper) => console.log(swiper)}
                        >
                            {_randomNews.map((news,i)=>{
                                if(i>5) return
                                return(
                                    <SwiperSlide key={i} >
                                        <Link href="/news/[id]" as={`/news/${news._id}`} >
                                            <div className="news-box-slide">
                                                <div className="image">
                                                    <a>
                                                        <img src={`/api/projectImage/${news.displayImageId}`} alt="DisplayNewsImage"/>
                                                    </a>
                                                </div>
                                                <div className="content">
                                                    <a  className="h5 title">{news.title}</a>
                                                    <p className="user">Written by <span>{news.author}</span></p>
                                                </div>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                )
                            })}
                            
                        </Swiper>
                        
                        {/* Single News */}
                        {allNews.map((news,i)=>{

                            return(
                                <Link key={i} href="/news/[id]" as={`/news/${news._id}`} >
                                    <a className="news-box">
                                        <div className="image">
                                        <img src={`/api/projectImage/${news.displayImageId}`} alt={`displayImage`} />
                                        </div>
                                        <div className="content">
                                        <p className="time"><span className="icon-date"></span>{moment(news.dateCreated).fromNow()}</p>
                                        <h5 className="title">{news.title}</h5>
                                        </div>
                                    </a>
                                </Link>
                            )
                        })}
                    </section>
                </div>
            </div>
        </div>
    )
}

export default News

export async function getServerSideProps(context) {
    await dbConnect()
    
    const allNews = await NewsModel.find().sort({title:1})
    const randomNews = [...allNews].sort(() => Math.random() - 0.5)
    return {
      props: {
        _allNews:JSON.parse(JSON.stringify(allNews)),
        _randomNews:JSON.parse(JSON.stringify(randomNews))
      }, // will be passed to the page component as props
    }
}
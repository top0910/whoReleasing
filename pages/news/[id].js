import React from 'react'
import dynamic from "next/dynamic";
import Meta from "../../component/Meta"
import Header from "../../component/Header"
import SideBar from '../../component/SideBar'
import DashboardHeader from '../../component/DashboardHeader'
import NewsModel from "../../models/news"
import dbConnect from '../../lib/dbConnect'
import {useState} from "react"
import moment from 'moment'
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MarkdownPreview = dynamic(
    () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
    { ssr: false }
);


export const IndividualNews = ({dark,setDark,isMobileOpen,setIsMobileOpen,_newsData}) => {
    const [newsData,setNewsData] = useState(_newsData)
    const handleClickBody = ()=>{
        setIsMobileOpen(false)
      }
    return (
            <div  className={`body ${dark && "dark"} ${isMobileOpen&&"show"}`}>
                <Meta  dark={dark} title={"News"}  content={"News Content"} />
                <Header isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>
                <SideBar currentMenuSection="news" dark={dark} setDark={setDark} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
                <div  onClick={handleClickBody}  className="dashboard__content">
                    <div className="overlay"></div>
                    <DashboardHeader location="newsDetails" />
                    {newsData && <div className="dashboard__main">
                        <div className='single__main'>
                            <div className='image'><img src={`/api/projectImage/${newsData.coverImageId}`} /></div>
                            <div className='content'>
                                <p className='time'>
                                    <span className='icon-date'></span>
                                    {moment(newsData.dateCreated).fromNow()}
                                </p>
                                <h4 className='title'>{newsData.title}</h4>
                                <MarkdownPreview className="news-markdown" source={newsData.markdown} />
                                <div className='bottom'>
                                    {newsData.tags.length>0 && <div className='tags'>
                                        <h6>Tags:</h6>
                                        <ul className='list-tag'>
                                            {newsData.tags.map((tag,i)=>{
                                                return(<li key={i}>{tag}{i!=newsData.tags.length-1 ?",":''}</li>)
                                            })}
                                        </ul>
                                    </div>}
                                    {newsData.tags.length<1 &&<div className='tags'></div> }
                                        {(newsData.discordLink || newsData.twitterLink) &&
                                            <div className='share'>
                                                <h6>Share: </h6>
                                                <ul className='list-share'>
                                                    {newsData.discordLink && <li >
                                                        <a rel={"noreferrer"} target={"_blank"} href={newsData.discordLink}>
                                                            <span className='icon-Discord'></span>
                                                        </a>
                                                    </li>}
                                                    {newsData.twitterLink && <li >
                                                        <a rel={"noreferrer"} target={"_blank"} href={newsData.twitterLink}>
                                                            <span className='icon-Twitter'></span>
                                                        </a>
                                                    </li>}
                                                </ul>
                                            </div>
                                        }
                                </div>
                            </div>

                        </div>
                        <div className='post-recent'></div>
                    </div>}
                </div>
            </div>
        )
}

export default IndividualNews 


export async function getServerSideProps(context) {
    let id = context.params.id
    await dbConnect()
    
    const newsDetails = await NewsModel.findOne({_id:id}).sort({title:1})
    
    return {
      props: {
        _newsData:JSON.parse(JSON.stringify(newsDetails)),
      }, // will be passed to the page component as props
    }
}
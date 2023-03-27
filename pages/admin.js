import React from 'react'
import style from "../styles/next/Admin.module.css"
import dbConnect from '../lib/dbConnect'
import ProjectModel from "../models/project"
import NewsModel from "../models/news"

import AdminLoginModal from "../component/modals/AdminLoginModal"

import ProjectTable from "../component/ProjectTable"
import NewsTable from "../component/NewsTable"
import {useState} from "react"
import { useEffect } from 'react'
import {useRouter} from 'next/router'
const admin = ({dark,isMobileOpen,_allProjects,_allNews}) => {
    

    return (
        <div className={`body  ${isMobileOpen&&"show"}`}>
            <div className={style.adminContainer}>
                <div className={style.adminMain}>
                    <div className={style.header}>Admin Section</div>
                    <ProjectTable _allProjects={_allProjects}/>
                    <NewsTable _allNews={_allNews}/>
                </div>
            </div>          
        </div>
    )
}

export default admin

export async function getServerSideProps(context) {
    await dbConnect()
    
    const filteredProjects = await ProjectModel.find({},{_id:1,name:1,"publicsale.date":1,imageId:1,approved:1,saleStatusType:1}).sort({name:1})
    const filteredNews = await NewsModel.find({},{_id:1,title:1,displayImageName:1}).sort({name:1})

    return {
      props: {
        _allProjects:JSON.parse(JSON.stringify(filteredProjects)),
        _allNews:JSON.parse(JSON.stringify(filteredNews)),

      }, // will be passed to the page component as props
    }
}
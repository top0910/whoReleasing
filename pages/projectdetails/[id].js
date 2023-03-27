import React from 'react'
import { useRouter } from 'next/router'
import Meta from "../../component/Meta"
import Header from "../../component/Header"
import SideBar from '../../component/SideBar'
import ProjectContainer  from '../../component/ProjectContainer'
import DashboardHeader from '../../component/DashboardHeader'
import moment from "moment"
import Image from 'next/image'
//db
import dbConnect from '../../lib/dbConnect'
import ProjectModel from "../../models/project"
import style from "../../styles/next/projectDetail.module.css"
import { useEffect } from 'react'
import { useState } from 'react'

import eth_svg from "../../public/assets/images/icon/ic_eth.svg"
import sol_svg from "../../public/assets/images/icon/ic_sol.svg"

const ProjectDetails = ({dark, setDark,projectData,featuredProjects,isMobileOpen,setIsMobileOpen}) => {
    const router =useRouter()
    const [isStillFeatured,setIsStillFeatured] = useState(false)

    useEffect(()=>{
        checkIfStillFeatured()
    },[router])

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

    const handleClickBody = ()=>{
        setIsMobileOpen(false)
    }

    const fixLinks = (link)=>{
        let finalLink = ""

        if(link=="" || link.length < 5){
            //Just refresh
            finalLink = router.asPath
            return
        }

        if(!link.includes("http") && !link.includes("https")){
            finalLink+="http://"
        }
        finalLink+=link
        return finalLink
    }

    return (
        <div className={`body ${dark && "dark"} ${isMobileOpen&&"show"}`}>
            <Meta dark={dark} title={"Project Info"}  content={"Project Info"} />
            <Header setIsMobileOpen={setIsMobileOpen} isMobileOpen={isMobileOpen} />
            <SideBar dark={dark} setDark={setDark} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}  />
            <div  onClick={handleClickBody}  className="dashboard__content">
                <div className="overlay"></div>
                <DashboardHeader location='projectDetails'/>
                <div className='dashboard__main'>
                    <section className="details__main">
                            {/* <div className="image">
                                <img src={`/assets/images/projects/${projectData.imageName}`} alt="Project Image" />
                                <a href="index.html" className="category">Featured</a>
                            </div> */}

                        {/* <div className={style.divFlex}> */}
                            <div className={style.imageContainer}>
                                <img className={style.image} src={`/api/projectImage/${projectData.imageId}`} alt="Project Image" />
                                <div className="price ">
                                    <Image 
                                        className='white-filter ' 
                                        height={20} 
                                        width={20} 
                                        src={projectData.blockchainType=="eth" ? eth_svg : projectData.blockchainType=="sol"? sol_svg:null}                                     />{projectData.blockchainType}</div>
                                {isStillFeatured && <a className="category">Featured</a>}
                            </div>
                        {/* </div> */}
                        

                        <div className="content">
                            <div className="top">
                                <h4 className="title">{projectData.name}</h4>
                                <p className="collection">Collection Count: <span>{projectData.collectionCount}</span></p>

                       
                                <ul style={{display:"block"}} className="time">
                                    {projectData.hasPresale && <li style={{marginBottom:10}}>
                                        <div >
                                            <p>Pre Sale Date</p>
                                            { projectData.saleStatusType !== "soldout"  && projectData.saleStatusType !== "minting" && <h6>{moment(projectData.presale.date).format("DD/MM/YY")}</h6>}
                                            { projectData.saleStatusType == "soldout" && <h6>Sold Out</h6>}
                                            {projectData.saleStatusType == "minting" && <h6 >Minting Now</h6>}
                                        </div>     
                                        {projectData.saleStatusType !== "soldout"  && projectData.saleStatusType !== "minting" && 
                                        <div >
                                            <p>{`Pre Mint (UTC)`}</p>
                                            <h6>{projectData.presale.time}</h6>
                                        </div>}
                                        <div>
                                            <p style={{marginBottom:5}}>Pre Mint Price</p>
                                            <h5 style={{marginBottom:0,marginLeft:-5}} className="price"><span className={`icon-ic_${projectData.blockchainType}`}></span>{projectData.presale.price} {projectData.blockchainType.toUpperCase()}</h5>
                                        </div>
                                    </li>}
                                    <li style={{}}>
                                        <div >
                                            <p>Mint Date</p>
                                            {projectData.saleStatusType !== "soldout"  && projectData.saleStatusType !== "minting" && <h6>{moment(projectData.publicsale.date).format("DD/MM/YY")}</h6>}
                                            {projectData.saleStatusType == "soldout" && <h6>Sold Out</h6>}
                                            {projectData.saleStatusType == "minting" && <h6 >Minting Now</h6>}
                                        </div>

                                        {projectData.saleStatusType !== "soldout"  && projectData.saleStatusType !== "minting" && 
                                        <div style={{marginRight:40}}>
                                            <p>{`Public Mint (UTC)`}</p>
                                            {<h6>{projectData.publicsale.time}</h6>}
                                        </div>}

                                        <div style={{marginRight:40}}>
                                            <p style={{marginBottom:5}}>Public Mint Price</p>
                                            <h5 style={{marginBottom:0,marginLeft:-5}} className="price"><span className={`icon-ic_${projectData.blockchainType}`}></span>{projectData.publicsale.price} {projectData.blockchainType.toUpperCase()}</h5>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="bottom">
                                <h6 className="title">Description</h6>
                                <p className="desc">
                                    {projectData.description}
                                </p>
                                <ul className="social">
                                    {/* Website */}
                                    
                                    <li>
                                        <a rel="noopener noreferrer" className="website" target="_blank" href={fixLinks(projectData.socialInformation.website)}>
                                            <span className="icon-mdi_web"></span>Website
                                        </a>
                                    </li>
                                    

                                    {/* Discord */}
                                    
                                    <li>
                                        <a rel="noopener noreferrer" className="discord" target="_blank" href={fixLinks(projectData.socialInformation.discordUrl)}>
                                            <span className="icon-Discord"></span>{projectData.socialInformation.discordUrl ? `${projectData.socialInformation.discordFollowerCount}  Members`:"Not Linked"}
                                        </a>
                                    </li>
                                    
                                    {/* Twitter */}
                                    
                                    <li>
                                        <a rel="noopener noreferrer" className="twiter" target="_blank" href={fixLinks(projectData.socialInformation.twitterUrl)}>
                                            <span className="icon-Twitter"></span>{projectData.socialInformation.twitterUrl ? `${projectData.socialInformation.twitterFollowerCount} Followers` :"Not Linked"}
                                        </a>
                                    </li>
                                    
                                </ul>
                            </div>
                        </div>
                    </section>
                    <section className="featured">
                        <h4 className="heading">Featured Projects</h4>
                        <div className="featured__main">
                        {featuredProjects &&  featuredProjects.map((projectData,i)=>{
                            return(
                            <ProjectContainer dark={dark} showFeatured={true} projectData={projectData}  key={i} />
                            )
                        })} 
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}


export async function getServerSideProps(context) {
    let id = context.params.id
    await dbConnect()
    let featuredProjects = []
    let projectData =[]

    try{
        projectData = await ProjectModel.findOne({_id:id,approved:true}) 
    }catch{}

    try{
        let today = moment()

        featuredProjects = await ProjectModel.find({
            "service.featureRequested":true,
            "services.featureRequestedStartDate":{$lte:today},
            "services.featureRequestedEndDate":{$gte:today},
            approved:true
        }).limit(20)
        console.log(featuredProjects)
    }catch{}
  

    
    return {
      props: {
        projectData:JSON.parse(JSON.stringify(projectData)),
        featuredProjects:JSON.parse(JSON.stringify(featuredProjects))
      }, // will be passed to the page component as props
    }
}
export default ProjectDetails
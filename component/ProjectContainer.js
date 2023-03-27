import React,{useEffect,useState} from 'react'
import Link from "next/link"
import Image from 'next/image'
import moment from "moment"
import style from "../styles/next/projectContainer.module.css"
import { useRouter } from 'next/router'

import eth_svg from "../public/assets/images/icon/ic_eth.svg"
import sol_svg from "../public/assets/images/icon/ic_sol.svg"

const ProjectContainer = ({projectData,dark,showFeatured=false}) => {
    if(!projectData) return
    const router = useRouter()
    const [isStillFeatured,setIsStillFeatured] = useState(false)

    useEffect(()=>{
        checkIfStillFeatured()
    },[])

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

    const fixLinks = (link,sender)=>{
        let finalLink = ""
        
        if(link=="" || link.length < 5){
            //If link bad
            if(sender=="next"){
                finalLink = `/projectdetails/${projectData._id}`
                return {as:finalLink,href:"/projectdetails/[id]"}
            }
        }else{
            //if link good enough
            if(sender=="next"){
                return {href:""}
            }else{
                if(!link.includes("http") && !link.includes("https")){
                    finalLink+="http://"
                }
                finalLink+=link
                return {rel:"noopener noreferrer",target:"_blank",href:finalLink}
            }           
        }
    
    }

  return (
    <div className="item-box">
        <Link as={`/projectdetails/${projectData._id}`} href="/projectdetails/[id]">
            <a >
                <div className="box-image">
                    <div className="image">
                        <img src={`/api/projectImage/${projectData.imageId}`} alt="project image" />
                    </div>
                    {showFeatured && isStillFeatured && <div className="category">Featured</div>}
                    <div className="price hoverGreenFilter">
                        <Image 
                            width={14} 
                            className='white-filter ' 
                            height={14} 
                            src={projectData.blockchainType=="eth" ? eth_svg : projectData.blockchainType=="sol"? sol_svg:null} 
                        />{projectData.blockchainType}</div>
                </div>

                <div className="box-content">
                    <div style={{display:"block"}} className="info">
                        <div className={`${style.leftRight} left right`}>
                            <h6 className="title">{projectData.name}</h6>
                            <div className="price">
                                {dark && <Image className='white-filter' width={18} height={18} src={projectData.blockchainType=="eth" ? eth_svg : projectData.blockchainType=="sol"? sol_svg:null}  />}
                                {!dark && <Image className='dark-filter' width={18} height={18} src={projectData.blockchainType=="eth" ? eth_svg : projectData.blockchainType=="sol"? sol_svg:null} />}
                                <div style={{marginTop:2}}>{projectData.publicsale.price}</div>
                            </div>
                        </div>
                        <div className={`${style.leftRight} left right`}>
                            <p>Date</p>
                            <p>Collection</p>
                        </div>
                        <div className={`${style.leftRight} left right`}>
                            {projectData.saleStatusType !== "soldout"  && projectData.saleStatusType !== "minting" && <h6>{moment(projectData.publicsale.date).format("MMMM D")}</h6> /* Show date if not soldout*/}  
                            {projectData.saleStatusType == "soldout" && <h6 >Sold Out</h6>}
                            {projectData.saleStatusType == "minting" && <h6 >Minting Now</h6>}
                            <h6 className="number">{projectData.collectionCount}</h6>
                        </div>

                        
                    </div>
                </div>
            </a>
        </Link>
        <div className="contact">
            <Link  {...fixLinks(projectData.socialInformation.twitterUrl,"next")}><a {...fixLinks(projectData.socialInformation.twitterUrl,"")} className="twiter" ><span className="icon-Twitter" ></span>Twitter</a></Link>
            <Link {...fixLinks(projectData.socialInformation.discordUrl,"next")}><a {...fixLinks(projectData.socialInformation.twitterUrl,"")} className="discord" ><span className="icon-Discord" ></span>Discord</a></Link>
        </div>
    </div>
  )
}

export default ProjectContainer
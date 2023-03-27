import Meta from "../../component/Meta"
import Header from "../../component/Header"
import SideBar from '../../component/SideBar'
import { useEffect, useState } from 'react'
import {useRouter} from "next/router"
import axios from "axios"
import dbConnect from "../../lib/dbConnect"
import ProjectModel from "../../models/project"
export default function SubmitProject({dark,setDark,isMobileOpen,setIsMobileOpen,_projectData}) {
    const router = useRouter()
    const [projectData,setProjectData] = useState(_projectData)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")

    useEffect(()=>{
      const interval = setInterval(async() => {
        //Fetch payment complete info for project id
        if(loading)return
        if(!router.query.pid) return
        if(projectData.paymentComplete) return
        setLoading(true)
        
        try{
          const res = await axios.get(`/api/project/${router.query.pid}`)
          if(res.data.success){
            setProjectData(res.data.data)
          }else{
            setError(res.data.error)
            setPaymentComplete(false)
          }
        }catch(e){
          setError(e)
        }

        setLoading(false)
      }, 3000);
      return () => clearInterval(interval);
        
    },[router])

    return(
      <div className={`body ${dark && "dark"}`}>
        
        <Meta dark={dark} title={"Submit Project"}  content={"Submit Project"} />
        <Header />
        <SideBar  isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}  dark={dark} setDark={setDark} />
        <div className="dashboard__content">
          <div className="overlay"></div>
          <div className="dashboard__main">
            <div className="payment_waiting">
              <div className="payment_waiting_head">
                  {!projectData.paymentComplete &&<img height={50} src={"/assets/images/icon/loaderCustom.gif"} alt="loading..." />}
                  {!projectData.paymentComplete && <div>Awaiting Payment to be Complete</div>}
                
                  {projectData.paymentComplete  && <div>
                    <div>Thank You</div>
                    {router.query.fp && router.query.fp =="0" && <div className="payment_waiting_complete">Project Submited</div>}
                    {!router.query.fp && <div className="payment_waiting_complete">Payment Complete</div>}
                    <div className="payment_waiting_complete_footer" >{`Your project will be manually reviewed`}</div>
                  </div>}
                  
              
              </div>
              <div className="payment_waiting_mid">
                {router.query.hcode && <a target="_blank" href={`https://commerce.coinbase.com/charges/${router.query.hcode}`} rel="noopener noreferrer" className='link-item'>Open Coinbase Payment Link</a>}
              </div>
              <div className="payment_waiting_foot">
                <div>{error}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  
 
  
}

export async function getServerSideProps(context) {
  let projectData = {}
  let {pid} = context.query

  if(pid && pid!=""){
    
    try{
      await dbConnect()
      let foundProject = await ProjectModel.findOne({_id:pid},{paymentComplete:1,name:1})
      if(foundProject){
        projectData = foundProject
      }
    }catch(e){
      console.log(e)
    }
  }

  return {
    props: {
      _projectData:JSON.parse(JSON.stringify(projectData))
    }, // will be passed to the page component as props
  }
}
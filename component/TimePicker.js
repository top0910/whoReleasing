import React,{useState} from 'react'
import { useEffect,useRef } from 'react'
import style from "../styles/next/Home.module.css"

const possibleTimeOptions =[
    "00:30","01:00",
    "01:30","02:00",
    "02:30","03:00",
    "03:30","04:00",
    "04:30","05:00",
    "05:30","06:00",
    "06:30","07:00",
    "07:30","08:00",
    "08:30","09:00",
    "09:30","10:00",
    "10:30","11:00",
    "11:30","12:00",

]

const TimePicker = ({value,setValue}) => {

    const [timeVal,setTimeVal] = useState(value.replace("am","").replace("pm",""))
    const [isDropDown,setIsDropDown] = useState(false)
    const [dropDownVal,setDropDownVal] = useState(value.includes("am") ? "am":"pm")
    const [inputStartIndex,setInputStartIndex] = useState(0)
    const [updater,setUpdater] = useState(0)

    const inputRef = useRef(); 

    useEffect(()=>{
        setValue(`${timeVal}${dropDownVal}`)
        // if(inputRef && inputRef.current)
        //     inputRef.current.setSelectionRange(inputStartIndex, inputStartIndex)
            

    },[dropDownVal,updater,timeVal])

    const handleTimeChange = (val)=>{
        setUpdater(updater+1)
        let changedIndex = inputRef.current.selectionStart-1 //convert to index
        console.log(changedIndex)
        let stringVersion = val.replace(":","").replace(/-/g,"")
        let compareTimeVal = timeVal.replace(/-/g,"").replace(":","")
        
        if(stringVersion.length>compareTimeVal.length){
            setInputStartIndex(changedIndex)
        }else{
            setInputStartIndex(changedIndex+2)
        }

        let cleanupVal = Number(stringVersion)
        //if not a number, invalid time

        if(!Number.isInteger(cleanupVal))
            return

        if(stringVersion.length==0){
            setTimeVal(`--:--`)
        }
        
        // 1 val
        if(stringVersion.length==1){       
            setTimeVal(`--:-${stringVersion}`)
        }
        // 2 val
        if(stringVersion.length==2){
            setTimeVal(`--:${stringVersion}`)
        }
        // 3 val
        if(stringVersion.length==3){
            setTimeVal(`-${stringVersion[0]}:${stringVersion[1]}${stringVersion[2]}`)
        }

        // 4 val
        if(stringVersion.length==4){
           
            setTimeVal(`${stringVersion[0]}${stringVersion[1]}:${stringVersion[2]}${stringVersion[3]}`)
        }
        // 5 val
        if(stringVersion.length==5){
            //selectionStart
            

            //build new string
            let newString =""
            
            if(changedIndex==0){
                newString=`${stringVersion[0]}${compareTimeVal[1]}:${compareTimeVal[2]}${compareTimeVal[3]}`
            }
            if(changedIndex==1){
                newString=`${compareTimeVal[0]}${stringVersion[1]}:${compareTimeVal[2]}${compareTimeVal[3]}`
            }
            if(changedIndex==2){
                newString=`${compareTimeVal[0]}${compareTimeVal[1]}:${stringVersion[2]}${compareTimeVal[3]}`
            }
            if(changedIndex==3){
                newString=`${compareTimeVal[0]}${compareTimeVal[1]}:${stringVersion[2]}${compareTimeVal[3]}`
            }
            if(changedIndex==4){
                newString=`${compareTimeVal[0]}${compareTimeVal[1]}:${compareTimeVal[2]}${stringVersion[3]}`
            }
            if(changedIndex==5){
                newString=`${stringVersion[1]}${stringVersion[2]}:${stringVersion[3]}${stringVersion[4]}`
            }
            console.log(changedIndex)
            setTimeVal(newString)

            // setTimeVal(`${stringVersion[0]}${stringVersion[1]}:${stringVersion[2]}${stringVersion[3]}`)
        }
    }

    return (
        <div style={{marginBottom:10}} className='customTimer'>
            <div style={{display:"flex",height:56}}>
                {/* <input  ref={inputRef} style={{width:"40%",height:"fit-content",marginRight:10,paddingLeft:20,paddingRight:20}}  onChange={(e)=>{handleTimeChange(e.target.value)}} value={timeVal}/> */}
                <select onChange={(e)=>setTimeVal(e.target.value)}  value={timeVal}  ref={inputRef} style={{width:"40%",height:"100%",marginRight:10,paddingLeft:20,paddingRight:20}} >
                    {possibleTimeOptions.map((timeValOption,i)=>{
                        return(<option key={i} value={timeValOption}>{timeValOption}</option>)
                    })}
                </select>
                <div
                    className={`btn no-transition dropdown-toggle s3 timeCustomContainer ${style.customTimerDropdown}`}
                    onClick={(e)=>{e.preventDefault();setIsDropDown(!isDropDown)}}
                    style={{width:"28%",marginRight:10,position:"relative",overflow:"inherit",padding:0,height:"100%"}}
                >
                    <span style={{width:"100%"}}>{dropDownVal.toUpperCase()}</span>
                    {!isDropDown && <img style={{marginLeft:10,right:20}} height={7} className="grey-filter absolute-top-center" src='/assets/images/icon/arrow-down.svg'/>}
                    {isDropDown &&
                        <div className={`   show timerDropDown `}>
                            <div style={{cursor:"pointer"}} className="item" onClick={()=>{setDropDownVal("am");setIsDropDown(false)}}>AM</div>
                            <div style={{cursor:"pointer"}} className="item" onClick={()=>{setDropDownVal("pm");setIsDropDown(false)}}>PM</div>
                        </div>
                    }
                </div>
                
                {/* <select style={{width:200,marginRight:10,paddingLeft:20,paddingRight:20}}  onChange={(e)=>setDropDownVal(e.target.value)}>
                
                </select> */}
                <div onClick={(e)=>{setIsDropDown(false)}} className='submitProjectCustomButton' style={{display:"flex",height:"100%",width:"26%",textAlign:"center",justifyContent:"center",marginBottom:17,alignItems:"center",borderRadius:10}}>UTC</div>
            </div>
           
        </div>
    )
}

export default TimePicker
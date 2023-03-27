import React,{useState} from 'react'
import dynamic from "next/dynamic";
import style from "../../styles/next/createnews.module.css"
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import Link from "next/link"
import axios from 'axios';

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  { ssr: false }
);


export const Createnews = () => {

    const [title,setTitle] = useState("")
    const [discordLink,setDiscordLink] = useState("")
    const [twitterLink,setTwitterLink] = useState("")
    const [tags,setTags] = useState([])
    const [tagsInput,setTagsInput] = useState("")
    const [markDownText,setMarkDownText] = useState("")
    const [author,setAuthor] = useState("")

    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")
    const [coverImage,setCoverImage] = useState(null)
    const [displayImage,setDisplayImage] = useState(null)
    const [success,setSuccess] = useState(false)
    const addTag = ()=>{
        if(tagsInput.length==0) return
        let temp = []
        temp=[...tags]
        temp.push(tagsInput)
        setTags([...temp])
        setTagsInput("")
    }
    const removeTag = (i)=>{
        let temp = []
        temp=[...tags]
        temp.splice(i,1)
        setTags([...temp])
    }

    const validateForm = ()=>{
        if(title.length<1) {
            setError("Invalid Title")
            return false
        }
        if(author.length<1) {
            setError("Invalid Author")
            return false
        }
        if(!coverImage) {
            setError("No Cover Image")
            return false
        }
        if(!displayImage) {
            setError("No display image")
            return false
        }
        if(markDownText == "") {
            setError("No Markdown text")
            return false
        }
        return true

    }
    const upload = async()=>{
        setError("")
        if(loading) return
        if(success) return
        let validate = validateForm()
        setLoading(true)
        if(validate){
            try{              
                let formData = new FormData()
                formData.append("title",title)
                formData.append("markdown",markDownText)
                formData.append("author",author)

                for(let i=0;i<tags.length;i++){
                    formData.append("tags[]",tags[i])
                }
                if(twitterLink && twitterLink!=""){
                    formData.append("twitterLink",twitterLink)
                }
                if(discordLink && discordLink!=""){
                    formData.append("discordLink",discordLink)
                }
                formData.append("displayImage",displayImage)
                formData.append("coverImage",coverImage)

                const res = await axios({
                    method: "post",
                    url: `/api/news/upload`,
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                })
                if(res.data.success){   
                    setSuccess(true)
                }else{
                    setError(res.data.err)
                }
            }catch(e){
                console.log(e)
            }
        }

        
        setLoading(false)
    }
  return (
    <div className={`body ${style.container}`}>

        <div className={style.main}>
            <div className={style.headerContainer}>
                <Link href="/admin">
                    <div className={style.backButton}>Back to Admin</div>
                </Link>
            </div>
            <div className={style.header}>News Mark Down</div>
        
            <MarkdownEditor onChange={(editor, data, value) => {setMarkDownText(editor)}} value={markDownText} />
                <div className={style.header}>Meta Data</div>
                <div className={style.titleContainer}>
                    <div>Title : </div>
                    <input value={title} onChange={(e)=>setTitle(e.target.value)}/>
                </div>
                <div className={style.titleContainer}>
                    <div>Author : </div>
                    <input value={author} onChange={(e)=>setAuthor(e.target.value)}/>
                </div>

                <div className={style.tagsContainer}>
                    <div className={style.top}>
                        <div>Add Tags </div>
                        <input value={tagsInput} onChange={(e)=>setTagsInput(e.target.value)} />
                        <button onClick={()=>addTag()}>Add</button> 
                    </div>
                    <div>
                        {tags.map((tag,i)=>{
                            return(<div key={i} className={style.tag}>{tag} <span onClick={()=>removeTag(i)} style={{color:"red",cursor:"pointer"}}>x</span></div>)
                        })}
                    </div>
                </div>

                <div className={style.titleContainer}>
                    <div>Twitter Link (optional) : </div>
                    <input value={twitterLink} onChange={(e)=>setTwitterLink(e.target.value)}/>
                </div>
                <div className={style.titleContainer}>
                    <div>Discord Link (optional) : </div>
                    <input value={discordLink} onChange={(e)=>setDiscordLink(e.target.value)}/>
                </div>

                <div className={style.imageContainer}>
                    <div>Cover Image (required) : </div>
                    <input type="file"  onChange={(event) => {setCoverImage(event.target.files[0])}}/>
                    {coverImage && <div>
                      <img alt="coverImg" src={URL.createObjectURL(coverImage)}  />
                      <div onClick={()=>setCoverImage(null)} className={style.removeImg} >Remove</div>
                    </div>
                    }
                </div>
                <div className={style.imageContainer}>
                    <div>Display Image (required) : </div>
                    <input type="file"  onChange={(event) => {setDisplayImage(event.target.files[0])}}/>
                    {displayImage && <div>
                      <img alt="displayImg" src={URL.createObjectURL(displayImage)}  />
                      <div onClick={()=>setCoverImage(null)} className={style.removeImg} >Remove</div>
                    </div>
                    }
                </div>
                <div className={style.imageContainer}>
                    {!success && <div onClick={()=>upload()} className={style.upload}>{loading? "Loading":"Upload"}</div>}
                    {success && <div  className={style.success}>Uploaded Successfully</div>}
                    <div className={style.error}>{error}</div>
                </div>
        </div>
    </div>
  )
}

export default Createnews
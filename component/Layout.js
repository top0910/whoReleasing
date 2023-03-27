import styles from "../styles/Layout.module.css"
import { useRouter } from "next/router"
import { useEffect,useState } from "react"
import AdminLoginModal from "./modals/AdminLoginModal"
const Layout = ({children,pageProps}) => {
    const router = useRouter()
    const [loggedIn,setLoggedIn] = useState(true)

    useEffect(()=>{
        if(router.route == "/admin" ||router.route == "/admin/createnews" ){
            setLoggedIn(false)
        }
    },[router.route])

    return (
        <div className={styles.container}>
            {loggedIn && 
                <>
                    {children}
                    <div className="cover-absolute"></div>
                </>
            }
            {!loggedIn && <AdminLoginModal setLoggedIn={setLoggedIn}/>}

        </div>
    )
}

export default Layout
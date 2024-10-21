import { Button } from "@mui/material"
//import { Link, useNavigate} from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectLogin } from "../../store/userSlice";

const LoginButton: React.FC = () => {
    //const nav = useNavigate();
    console.log("This is a debug statement - Tradd");
    const loginStatus = useAppSelector(selectLogin)
    console.log(useAppSelector(selectLogin));
    let buttonMessage = "Login"

    if (loginStatus) {
        buttonMessage = "Logout"
    } else {
        buttonMessage = "Login"
    }

    return(
        <>
            <Button
                variant="contained"
                onClick={/*Navigate to login page*/()=>{
                    if (loginStatus) {
                        //Log Out User
                    } else {
                        window.location.href="https://team08-domain.auth.us-east-1.amazoncognito.com/login?client_id=ff8qau87sidn42svsuj51v4l4&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fdev.d3ggpwrnl4m4is.amplifyapp.com%2F"
                    }
                }}
            >
                {buttonMessage}
            </Button>
        </>
    )
}

export default LoginButton;
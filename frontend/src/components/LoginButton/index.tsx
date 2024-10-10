import { Button } from "@mui/material"
import { useNavigate} from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectLogin } from "../../store/userSlice";

const LoginButton: React.FC = () => {
    const nav = useNavigate();
    const loginStatus = useAppSelector(selectLogin)
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
                onClick={/*Navigate to login page*/()=>{nav("https://team08-domain.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=ff8qau87sidn42svsuj51v4l4&response_type=code&scope=email+openid+phone&redirect_uri=https%3A%2F%2FTeam08-Callback")}}
            >
                {buttonMessage}
            </Button>
        </>
    )
}

export default LoginButton;
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
                onClick={/*Navigate to login page*/()=>{nav("/")}}
            >
                {buttonMessage}
            </Button>
        </>
    )
}

export default LoginButton;
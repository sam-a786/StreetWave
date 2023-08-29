import {Button, Container} from "react-bootstrap";
import checkmark from ".././checkmark.png";
import {useNavigate} from "react-router-dom";

export default function PasswordResetSuccess() {
    const navigate = useNavigate();
    const handleBackToLogin = () => {
        navigate("/");
    }

    return (
        <Container id="passwordContainer" className="mt-5">
            <img src={checkmark} style={{ display: "block", margin: "0 auto", width: "100px", height: "100px"}} /> <br/>
            <div style={{fontSize: "25px"}}>
             <div style={{textAlign: "center"}}>
                 <h2 className="textwhite">Success!</h2>
                 <h4 className="textwhite">Your password has been reset successfully.</h4> <br/>
                 <div className="btnContainer" style={{flexGrow: 1}}>
                     <Button variant="primary" size="lg" onClick={handleBackToLogin} style={{width: "50%"}}>
                         Back to login
                     </Button>
                 </div>
             </div>
            </div>
        </Container>
    )
}

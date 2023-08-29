import {Button, Container} from "react-bootstrap";
import checkmark from ".././checkmark.png";
import {useNavigate} from "react-router-dom";

export default function AccountCreatedConfirmPage() {
    const navigate = useNavigate();
    const handleBackToLogin = () => {
        navigate("/");
    }
    const handleResendEmail = () => {
        navigate("/resend-email")
    }

    return (
        <Container id="passwordContainer" className="mt-5">
            <img src={checkmark} style={{ display: "block", margin: "0 auto", width: "100px", height: "100px"}} /> <br/>
            <div style={{fontSize: "25px"}}>
             <div style={{textAlign: "center"}}>
                 <h2 className="textwhite">Success!</h2>
                 <h4 className="textwhite">Your account has been created. Please check your email to activate your account.</h4> <br/>
                 <h4 className="textwhite">Didn't receive an email? <br/> <Button variant="primary" size="lg" onClick={handleResendEmail} style={{width: "50%"}}> Click here to resend </Button> </h4> <br/>
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
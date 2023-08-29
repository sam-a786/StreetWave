import React, {useEffect} from "react";
import {Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import "./VerificationConfirmation.css";
import * as timers from "timers";

export default function VerificationConfirmation() {
    const navigate = useNavigate();
    const handleBackToLogin = () => {
        navigate("/");
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 3000);

        return () => clearTimeout(timer);
        }, [navigate]);

    return (
        <Container id="passwordContainer" className="mt-5">
            <div className="fontSize">
             <div className="textAlign">
                 <h2 className="textwhite">Your email has been successfully verified!</h2>
                 <h4 className="textwhite">Redirecting...</h4> <br/>
                 <h6 className="textwhite">Didn't work?</h6> <br/>
                 <div id="flexGrow" className="btnContainer">
                     <Button variant="primary" size="lg" onClick={handleBackToLogin} className="width">
                         Click here.
                     </Button>
                 </div>
             </div>
            </div>
        </Container>
    )
}

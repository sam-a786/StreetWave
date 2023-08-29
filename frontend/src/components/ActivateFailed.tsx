import React from "react";
import {Button, Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import "./ActivateFailed.css";

export default function ActivateFailed() {
    const navigate = useNavigate();
    const handleBackToLogin = () => {
        navigate("/");
    }

    return (
        <Container id="passwordContainer" className="mt-5">
            <div className="fontSize">
             <div className="textAlign">
                 <h2 className="textwhite">Something went wrong :(</h2>
                 <h4 className="textwhite">You link seems to be broken or expired.</h4> <br/>
                 <div id="flexGrow" className="btnContainer">
                     <Button variant="primary" size="lg" onClick={handleBackToLogin} className="width">
                         Back to login
                     </Button>
                 </div>
             </div>
            </div>
        </Container>
    )
}

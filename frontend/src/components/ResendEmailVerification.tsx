import {Button, Col, Container, Form, Row} from "react-bootstrap";
import "./ResendEmailVerification.css";
import padlock from ".././padlock.png"
import {SyntheticEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

export default function ResendEmailVerification() {
    const [email, setEmail] = useState("");
    const [navigatee, setNavigate] = useState(false);
    const navigate = useNavigate();

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8000/api/request-email-verification", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email,
            })
        });
        navigate("/check-email/")
        setNavigate(true)
        const user = await response.json();
        console.log(user, "response");
    };

    return (
        <Container id="passwordContainer" className="mt-5">
            <Row>
                <Col>
                    <Form onSubmit={submit}>
                        <img src={padlock} style={{ display: "block", margin: "0 auto", width: "100px", height: "100px"}} /> <br/>
                        <div style={{textAlign: "center"}}>
                        <h3 className="trouble-logging-text textwhite" style={{fontSize: "25px"}}>Resend email link:</h3>
                        <p className="desc textwhite">Enter your email and we'll send you a link to verify your account.</p>
                        </div>
                        <Form.Group className="mb-4" controlId="emailAddress">
                            <Form.Label className="textwhite">
                                Email address
                            </Form.Label>
                            <Form.Control type="email" placeholder="Enter email address" required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" onChange={(e) => setEmail(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="btnContainer" style={{flexGrow: 1}}>
                            <Button variant="primary" size="lg" type="submit" style={{width: "100%"}}>
                                Resend email
                            </Button>
                        </div>
                    </Form>
                    <div className="text-center mt-4">
                        <a href="/" className="back-to-login-link">Back to login</a>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
import "./SignIn.css";
import {Container, Form, Button, Col, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, {SyntheticEvent, useEffect, useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {Link} from "react-router-dom";
import BootstrapAlert from "./BootstrapAlert";
// Video tutorial for linking backend Signin/Signup/Logout to frontend
// https://www.youtube.com/watch?v=OUP-urBy1k4&list=PLlameCF3cMEtfyO6H7WXUAqoIJO21bDNp&index=4

export default function SignIn(props: any) {

    // Set web page title - Should be on every page
    useEffect(() => {
        document.title = 'Sign In';
    }, []);

    // Setting 2 variables that can later be used to take input from the user
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Built in react hooks, navigate to help directing user to a different page
    const navigate = useNavigate();

    // Here we set the states for incorrect credentials so if we get a response that not 200 or a bad request then we know that the
    // credentials inputted are incorrect, so then we tell the user wrong credentials/unverified email, so below we are setting the state
    // of the error, so it appears at the correct time
    const [incorrectPasswordError, setIncorrectPasswordError] = useState(false);
    const incorrectPasswordState = (state: boolean) => {
        setIncorrectPasswordError(state);
    }

    // Below is the function to send through the user input on the sign-in form,
    // so we will have the email and password to check with the backend
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            // validation if the response is not 200 then we tell the error to appear which is within the form below under the password
            // field because that is where we want the alert this is similar to edit profile and sign up
            if (response.status !== 200) {
                incorrectPasswordState(true);
                return;
            }

            // If the credentials provided match an email and a password within the database
            const user = await response.json();
            localStorage.setItem("access_token", JSON.stringify(user.jwt));


            localStorage.setItem("isLoggedIn", "true");
            navigate("/compare");
            navigate(0)

        } catch (error) {
            console.log(error, "error");
        }
    };

    // Below is the signin form
    return (
        <Container id="signincontainer" className="mt-5">
            <ToastContainer/>
            <Row>
                <Col>
                    <Form onSubmit={submit}>
                        <Form.Group className="mb-3" controlId="emailAddress">
                            <Form.Label className="textwhite">Email address</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className="textwhite">Password</Form.Label>
                            <Form.Control
                                type="password"
                                required
                                placeholder="Enter Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {incorrectPasswordError === true && (
                                <div><BootstrapAlert
                                    message='Invalid login details or unverified email'></BootstrapAlert>
                                    <Link to="/resend-email">Resend verification email</Link>
                                </div>)}


                        </Form.Group>

                        <div className="btnContainer">
                            <Button variant="outline-light" className="mb-3" type="submit">
                                Sign In
                            </Button>
                        </div>
                    </Form>
                    <p className="forgot-password text-right mt-2 textwhite">
                        Forgot <Link to="/forgottenpassword">password?</Link>
                    </p>

                    <p className="forgot-password text-right mt-2 textwhite">
                        Don't have an account? <Link to="/signup">Sign Up Here</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

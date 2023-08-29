import "./SignUp.css";
import {Container, Form, Button, Col, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, {SyntheticEvent, useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Link} from "react-router-dom";
import BootstrapAlert from "./BootstrapAlert";

// Below we have different variables that will be used to get user input and store it to the database
export default function SignUp() {
    // Set web page title - Should be on every page
    useEffect(() => {
        document.title = 'Sign Up';
    }, []);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // Using react hooks, similarly like signin
    const [navigatee, setNavigate] = useState(false);
    const navigate = useNavigate();

    // The consts below are for validation on the form if the validation fails then the errors will appear
    // the error messages are within the form itself, the error is under the input box it is referring to
    // 3 different types of validation first for the length of the password 2 to have matching passwords 3 to have a unique email everytime
    const [passwordLenError, setPasswordLenError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    // Below we have the state for the password length (making sure it's longer than 8 characters)
    const passwordLenState = (state: boolean) => {
        setPasswordLenError(state);
    }
    // Below we have the state for confirm password (to make sure that the passwords match)
    const passwordMatchState = (state: boolean) => {
        setPasswordMatchError(state);
    }

    // Below we have the state for Email (to make sure that the email is unique)
    const emailState = (state: boolean) => {
        setEmailError(state);
    }
    // Function below to send the data into the database by sending a post request to the backend
    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        // validation to make sure the password is 8 characters or more otherwise they will have an error
        if (password && password.length < 8) {
            passwordLenState(true);
        } else {
            passwordLenState(false);
        }

        // if the passwords don't match shows a message
        if (password !== confirmPassword) {
            passwordMatchState(true);
        } else {
            passwordMatchState(false);
        }
        // here the 2 if statements are repeated because otherwise the corresponding errors stay even when the requirements are satisfied for a field
        if (password && password.length < 8) {
            passwordLenState(true);
            return;
        }
        if (password !== confirmPassword) {
            passwordMatchState(true);
            return;
        }
        // if the input passes the validation then post request sent to save the data into the database
        const response = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: `${firstName} ${lastName}`,
                email,
                password: password,
            })
        });

        // if any fields return empty data then returns a validation failed message
        if (response.status !== 200) {
            const user = await response.json();
            if ((user.email?.[0]) != (user.email?.[0])) {
                emailState(false);
                return;
            } else {
                emailState(true);
                return;
            }
            return;
        }
        // if the data is saved then shows a success message
        navigate("/account-created")
        setNavigate(true)
        const user = await response.json();
        console.log(user, "response");
        toast.success("Sign up successful, please verify your email");
    };

    // Below is the signup form
    return (
        <Container id="signupcontainer" className="mt-5">
            <ToastContainer/>
            <Row>
                <Col>
                    <Form onSubmit={submit}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label className="textwhite">First Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="First Name"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label className="textwhite">Last Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Last Name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="emailAddress">
                            <Form.Label className="textwhite">Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError === true && (
                                <BootstrapAlert message='Email already in use'></BootstrapAlert>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className="textwhite">Password</Form.Label>
                            <Form.Control
                                type="password"
                                required
                                placeholder="Enter Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordLenError === true && (
                                <BootstrapAlert message='Passwords must be at least 8 characters'></BootstrapAlert>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label className="textwhite">Password</Form.Label>
                            <Form.Control
                                type="password"
                                required
                                placeholder="Enter Confirm Password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {passwordMatchError === true && (
                                <BootstrapAlert message="The passwords entered don't match"></BootstrapAlert>
                            )}
                        </Form.Group>

                        <div className="btnContainer">
                            <Button variant="outline-light" className="mb-3" type="submit">
                                Sign Up
                            </Button>
                        </div>
                    </Form>

                    <p className="forgot-password text-right mt-2 textwhite">
                        Want to Sign In instead? <Link to="/">Sign In</Link>
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

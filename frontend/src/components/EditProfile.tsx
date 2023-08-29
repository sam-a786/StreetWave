import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Container, Form, Alert} from "react-bootstrap";
import {toast, ToastContainer} from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

// Declaring variables for the edit profile page
function EditProfile(props: { userInfo: any }) {

    // Set web page title - Should be on every page
    useEffect(() => {
        document.title = 'Edit Profile';
    }, []);

    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userPassword, setUserPassword] = useState(props.userInfo.password);
    const [email, setEmail] = useState(props.userInfo.email);
    // The consts below are for validation on the form if the validation fails then the errors will appear
    // the error messages are within the form itself, the error is under the input box it is referring to
    const [passwordLenError, setPasswordLenError] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<any>({});



    // Below we have the state for the password length (making sure it's longer than 8 characters)
    const passwordLenState = (state: boolean) => {
        setPasswordLenError(state);
    }
    // converting "javascript token" into json
    const accessToken =
        localStorage.getItem("access_token") !== null &&
        JSON.parse(localStorage.getItem("access_token") as string);

    // getting the users information linked with the backend serializer
    useEffect(() => {
        getUserInfo()
    }, []);

    // trying to get the information of the user that is currently logged in, so it can be displayed
    // when on the edit profile page, using the backend view getuserinfo
    const getUserInfo = async () => {
        axios.defaults.headers.common['Authorization'] = accessToken
        const response = await axios.get("http://localhost:8000/api/user", {
            withCredentials: true
        });
        const content = await response.data;
        console.log(content.id + " content id in edit profile")
        const nameParts = content.name.split(" ")
        setFirstName(nameParts[0])
        setLastName(nameParts[1])
        setEmail(content.email)
    };

    // function for updating user (getting the updates from the form below)
    const updateProfile = async (e: any) => {
        e.preventDefault(); //so default action is not taken for the form

        // Returning if Old Password is not matching
        if (errors.password){
            return;
        }

        // validation to make sure the password is 8 characters or more otherwise they will have an error
        if (userPassword && userPassword.length < 8) {
            passwordLenState(true);
            return;
        } else {
            passwordLenState(false);
        }
        // sending the right access token to the endpoint
        axios.defaults.headers.common['Authorization'] = accessToken
        const response = await axios.put("http://localhost:8000/api/user",
            {name: `${firstName} ${lastName}`, email, password: newPassword,});
        const content = response.data;
        // if the correct access token is sent we get this message below
        toast.success("Successfully updated");
    };

      const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const value = e.target.value;
        setConfirmPassword(value);
        validateConfirmPassword(value);
      };

      const validateConfirmPassword = (value: string) => {
        const errors: any = {};
        if (value !== newPassword) {
          errors.confirmPassword = "Passwords do not match.";
        }
        setErrors(errors);
      };

      const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e?.target?.value;
        setNewPassword(value);
        validatePassword(value);
      };

      const validatePassword = (value: string) => {
        const errors: any = {};
        if (!value) {
          errors.newPassword = "Please enter a password.";
        } else if (value?.length < 8) {
          errors.newPassword = "Password must be at least 8 characters long.";
        }
        setErrors(errors);
      };

    //   Checking Old password on input onchange event
      const handleOldPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        const mail = email
        const value = e.target.value;

        validateOldPassword(mail, value);
      };

    //   Old password validation
      const validateOldPassword = async(email: string, password: string)=>{
        const errors: any = {};
        const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
        if (response.status !== 200) {
            errors.password = "Old password doesn't match.";
        }
        setErrors(errors);
      }
    // Below we have the form for edit profile
    return (
        <div>
            <ToastContainer/>
            <Container className="mt-3">
                <Form onSubmit={(e) => updateProfile(e)}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label className="">First Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label className="">Last Name</Form.Label>
                        <Form.Control
                            type="name"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label className="">Email</Form.Label>
                        <Form.Control
                            type="email"
                            required
                            value={email}
                            placeholder="Enter Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label className="">Old Password</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            value={userPassword}
                            placeholder="Enter Password"
                            onChange={handleOldPasswordChange}
                            isInvalid={!!errors?.password}
                        />
                        {!!errors?.password && (
                        <Alert
                            id="alert"
                            variant="danger"
                            style={{ width: "295px", fontSize: 12 }}
                        >
                            <p>{errors?.password}</p>
                        </Alert>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="newPassword">
                        <Form.Label className="">New password</Form.Label>
                        <Form.Control
                        type={showPassword ? "text" : "password"}
                        onChange={handlePasswordChange}
                        isInvalid={!!errors?.newPassword}
                        placeholder="Enter new password"
                        />
                        {!!errors?.newPassword && (
                        <Alert
                            id="alert"
                            variant="danger"
                            style={{ width: "295px", fontSize: 12 }}
                        >
                            <p>{errors?.newPassword}</p>
                        </Alert>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="confirmPassword">
                        <Form.Label className="">Confirm password</Form.Label>
                        <Form.Control
                        type={showPassword ? "text" : "password"}
                        onChange={handleConfirmPasswordChange}
                        isInvalid={!!errors?.confirmPassword}
                        placeholder="Confirm new password"
                        />
                        {!!errors?.confirmPassword && (
                        <Alert
                            id="alert"
                            variant="danger"
                            style={{ width: "295px", fontSize: 12 }}
                        >
                            <p>{errors?.confirmPassword}</p>
                        </Alert>
                        )}
                    </Form.Group>

                    <div className="btnContainer">
                        <Button variant="primary" className="mb-3" type="submit">
                            Update Profile
                        </Button>
                    </div>
                </Form>
            </Container>
        </div>
    );
}

export default EditProfile;
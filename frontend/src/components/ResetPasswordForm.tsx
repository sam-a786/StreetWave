import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location?.search);
  const token = searchParams.get("token");
  const udidb64 = searchParams.get("udidb64");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: any) => {
    e?.preventDefault();
    if (validateForm()) {
      submitForm(confirmPassword);
    }
  };

  const submitForm = async (confirmPassword: string) => {
    const response: any = await fetch(
      "http://localhost:8000/api/password-reset-complete",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: confirmPassword,
          token: token,
          uidb64: udidb64,
        }),
      }
    );
    if (response?.status === 200) {
      toast.success(
        "Password Reset successfully! You will automatic route to login"
      );
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      toast.error("Please check your password Re-submit or token expire");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors: any = {};

    if (!newPassword) {
      errors.newPassword = "Please enter a password.";
      isValid = false;
    } else if (newPassword?.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long.";
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
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

  return (
    <Container id="passwordContainer" className="mt-5">
      <ToastContainer />
      <Row>
        <Col>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <div style={{ fontSize: "25px" }}>
              <div style={{ textAlign: "center" }}>
                <h3 className="textwhite">Reset Password</h3>
                <p className="textwhite">Please enter your new password</p>
              </div>
              <Form.Group className="mb-4" controlId="newPassword">
                <Form.Label className="textwhite">New password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  onChange={handlePasswordChange}
                  isInvalid={!!errors?.newPassword}
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
                <Form.Label className="textwhite">Confirm password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  onChange={handleConfirmPasswordChange}
                  isInvalid={!!errors?.confirmPassword}
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
              <Form.Check
                type="checkbox"
                id="showPasswordToggle"
                label="Show password"
                className="textwhite"
                onChange={togglePassword}
              />{" "}
              <br />
              <div className="btnContainer" style={{ flexGrow: 1 }}>
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  style={{ width: "100%" }}
                >
                  Reset password
                </Button>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

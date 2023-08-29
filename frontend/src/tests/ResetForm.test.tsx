import { render, screen, fireEvent } from "@testing-library/react";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { BrowserRouter } from 'react-router-dom';
import React from "react";

describe("ResetPasswordForm", () => {
  it("should render the form with all fields", () => {
    render(<BrowserRouter> <ResetPasswordForm /> </BrowserRouter>);
    const newPasswordField = screen.getByLabelText("New password");
    const confirmPasswordField = screen.getByLabelText("Confirm password");
    const showPasswordToggle = screen.getByLabelText("Show password");

    expect(newPasswordField).toBeInTheDocument();
    expect(confirmPasswordField).toBeInTheDocument();
    expect(showPasswordToggle).toBeInTheDocument();
  });

  it("should show the password when 'Show password' checkbox is checked", () => {
    render(<BrowserRouter> <ResetPasswordForm /> </BrowserRouter>);
    const showPasswordToggle = screen.getByLabelText("Show password");
    const newPasswordField = screen.getByLabelText("New password");
    const confirmPasswordField = screen.getByLabelText("Confirm password");

    fireEvent.click(showPasswordToggle);
    expect(newPasswordField).toHaveAttribute("type", "text");
    expect(confirmPasswordField).toHaveAttribute("type", "text");
  });

  test("renders the form with input fields and a submit button", () => {
    render(<BrowserRouter> <ResetPasswordForm /> </BrowserRouter>);
    expect(screen.getByLabelText("New password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset password" })
    ).toBeInTheDocument();
  });

  test("displays an error message when the new password is too short", () => {
    render(<BrowserRouter> <ResetPasswordForm /> </BrowserRouter>);
    const newPasswordInput = screen.getByLabelText("New password");
    fireEvent.change(newPasswordInput, { target: { value: "short" } });
    const submitButton = screen.getByRole("button", { name: "Reset password" });
    fireEvent.click(submitButton);
    expect(
      screen.getByText("Password must be at least 8 characters long.")
    ).toBeInTheDocument();
  });

  it("should show an error message when new password field is empty", () => {
    render(<BrowserRouter> <ResetPasswordForm /> </BrowserRouter>);
    const newPasswordField = screen.getByLabelText("New password");
    const confirmPasswordField = screen.getByLabelText("Confirm password");
    const resetPasswordButton = screen.getByText("Reset password");

    fireEvent.change(confirmPasswordField, {
      target: { value: "password123" },
    });
    fireEvent.click(resetPasswordButton);

    const errorText = screen.getByText("Please enter a password.");
    expect(errorText).toBeInTheDocument();
    expect(newPasswordField).toHaveClass("is-invalid");
  });

  it("should show an error message when passwords do not match", () => {
    render(<BrowserRouter> <ResetPasswordForm /> </BrowserRouter>);
    const newPasswordField = screen.getByLabelText("New password");
    const confirmPasswordField = screen.getByLabelText("Confirm password");
    const resetPasswordButton = screen.getByText("Reset password");

    fireEvent.change(newPasswordField, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordField, {
      target: { value: "password1234" },
    });
    fireEvent.click(resetPasswordButton);

    const errorText = screen.getByText("Passwords do not match.");
    expect(errorText).toBeInTheDocument();
    expect(confirmPasswordField).toHaveClass("is-invalid");
  });

  test("displays an error message when the passwords do not match", () => {
    render(<BrowserRouter> <ResetPasswordForm /> </BrowserRouter>);
    const newPasswordInput = screen.getByLabelText("New password");
    fireEvent.change(newPasswordInput, { target: { value: "password123" } });
    const confirmPasswordInput = screen.getByLabelText("Confirm password");
    fireEvent.change(confirmPasswordInput, {
      target: { value: "notmatching" },
    });
    const submitButton = screen.getByRole("button", { name: "Reset password" });
    fireEvent.click(submitButton);
    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });
});
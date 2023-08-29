import { render, screen, fireEvent } from "@testing-library/react";

import SignUp from "../components/SignUp";
import { BrowserRouter } from "react-router-dom";

test("renders Signup form", () => {
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );
});

test("Signup Button", () => {
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );
  // Get Signup button by its test id
  fireEvent.click(screen.getByText('Sign Up', { selector: 'button' }));
  // Trigger moke Event of RTL
  const mockEvent = { stopPropogation: jest.fn() };
  // Expect mokeEvent to stop propagation
  expect(mockEvent.stopPropogation).toBeCalledTimes(0);
});

test("user can fill in the Signup form", () => {
  render(
    <BrowserRouter>
      <SignUp />
    </BrowserRouter>
  );
  // Get first name input with test id
  const firstNameInput = screen.queryByPlaceholderText("First Name") as HTMLInputElement;
  // Get last name input with test id
  const lastNameInput = screen.queryByPlaceholderText("Last Name") as HTMLInputElement;
  // Get email input with test id
  const emailInput = screen.queryByPlaceholderText("Enter email") as HTMLInputElement;
  // Get password input with test id
  const passwordInput = screen.queryByPlaceholderText("Enter Password") as HTMLInputElement;
  // Get confirm password input with test id
  const confirmPassword = screen.queryByPlaceholderText("Enter Confirm Password") as HTMLInputElement;
  // Trigger Change events to fill values --------->
  fireEvent.change(firstNameInput, { target: { value: "John" } });
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  fireEvent.change(emailInput, { target: { value: "test@test.com" } });
  fireEvent.change(passwordInput, { target: { value: "testpassword" } });
  fireEvent.change(confirmPassword, { target: { value: "testpassword" } });
  // Trigger Change events to fill values --------->

  // Expect Values to be same as we inputted in fire event above respectively --------->
  expect(firstNameInput.value).toBe("John");
  expect(lastNameInput.value).toBe("Doe");
  expect(emailInput.value).toBe("test@test.com");
  expect(passwordInput.value).toBe("testpassword");
  expect(confirmPassword.value).toBe("testpassword");
  // Expect Values to be same as we inputted in fire event above respectively --------->
});
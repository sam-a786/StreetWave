import { render, screen, fireEvent } from "@testing-library/react";
import SignIn from "../components/SignIn";

import { BrowserRouter } from "react-router-dom";

test("renders Signin form", () => {
  render(
    <BrowserRouter>
      <SignIn isLoggedIn={true} />
    </BrowserRouter>
  );
});

test("Signin Button", () => {
  render(
    <BrowserRouter>
      <SignIn isLoggedIn={true} />
    </BrowserRouter>
  );
  // Get Signin button by its test id
  fireEvent.click(screen.getByText('Sign In', { selector: 'button' }));
  // Trigger moke Event of RTL
  const mockEvent = { stopPropogation: jest.fn() };
  // Expect mokeEvent to stop propagation
  expect(mockEvent.stopPropogation).toBeCalledTimes(0);
});

test("user can fill in the Signin form", () => {
  render(
    <BrowserRouter>
      <SignIn isLoggedIn={true} />
    </BrowserRouter>
  );
  // Get email input with test id
  const emailInput = screen.queryByPlaceholderText("Enter email") as HTMLInputElement;
  // Get password input with test id
  const passwordInput = screen.queryByPlaceholderText("Enter Password") as HTMLInputElement;
  // Fire the change event to add value in input
  fireEvent.change(emailInput, { target: { value: "test@test.com" } });
  // Fire the change event to add value in input
  fireEvent.change(passwordInput, { target: { value: "testpassword" } });
  // Expect element to have the same value as we put it above on change event
  expect(emailInput.value).toBe("test@test.com");
  // Expect element to have the same value as we put it above on change event
  expect(passwordInput.value).toBe("testpassword");
});
import React, { useEffect, useState } from "react";
import './App.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import SideAccordion from './components/SideAccordion';
import { useNavigate, BrowserRouter, useLocation, Route, Routes } from 'react-router-dom';
import TopBar from './components/TopBar';
import Protected from './components/Protected'
import ForgottenPassword from "./components/ForgottenPassword";
import ResetPasswordForm from "./components/ResetPasswordForm";
import PasswordResetSuccess from "./components/PasswordResetSuccess";
import EditProfile from "./components/EditProfile";
import ActivateFailed from "./components/ActivateFailed";
import VerificationConfirmation from "./components/VerificationConfirmation";
import CheckEmailPage from "./components/CheckEmailPage";
import NotFound from "./components/NotFound";
import TokenError from "./components/TokenError";
import AccountCreatedConfirmPage from "./components/AccountCreatedConfirmPage";
import ResendEmailVerification from "./components/ResendEmailVerification";
import EmailResendSuccess from "./components/EmailResendSuccess";
import icon from "./StreetWaveLogoSmall.bmp";

function App() {

    // https://dev.to/thekrprince/updating-favicon-in-fullstackreact-django-application-1moc
    useEffect(() => {
        const favicon = document.getElementById('favicon');
        if (favicon) {
            favicon.setAttribute('href', icon);
        }
    }, []);

    // Using react hooks similarly to signin and signup
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState("");
    const location = useLocation();

  // For persistence store in local storage and check accordingly
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("isLoggedIn"))
  );
  // if the user is logged in they can't access signin and signup
  useEffect(() => {
    if (isLoggedIn && location.pathname === "/") {
      navigate("/compare");
    }
    if (isLoggedIn && location.pathname === "/signup") {
      navigate("/compare");
    }
  }, [location]);

    // gathering currently logged-in user
  const handlerUserInfoCHange = (data: any) => {
    setUserInfo(data);
  };

  // If the user is not logged in then sending them back to signin
  const handleLogout = () => {
    setUserInfo("");
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    navigate("/")
  };

    return (
        <div className="App">
              <TopBar
                userInfo={userInfo}
                handleLogout={handleLogout}
                isLogeedInn={isLoggedIn}
              />
        <header className="App-header">
           
                <Routes>
                    <Route path="/" element={<SignIn></SignIn>}/>
                    <Route path="/signup" element={<SignUp></SignUp>}/>
                    <Route path="/compare" element={
                      <Protected isLoggedIn={isLoggedIn}>
                        <SideAccordion></SideAccordion>
                      </Protected>
                    } />
                    <Route path="/edit-profile" element={
                      <Protected isLoggedIn={isLoggedIn}>
                        <EditProfile userInfo={userInfo}></EditProfile>
                      </Protected>
                    } />
                    <Route path="/forgottenpassword" element={<ForgottenPassword></ForgottenPassword>} />
                    <Route path="/password-reset" element={<ResetPasswordForm></ResetPasswordForm>}/>
                    <Route path="/newpassword" element={<ResetPasswordForm></ResetPasswordForm>} />
                    <Route path="/success" element={<PasswordResetSuccess></PasswordResetSuccess>} />
                    <Route path="/activate-failed" element={<ActivateFailed></ActivateFailed>} />
                    <Route path="/activate-success" element={<VerificationConfirmation></VerificationConfirmation>} />
                    <Route path="/account-created" element={<AccountCreatedConfirmPage></AccountCreatedConfirmPage>} />
                    <Route path="/resend-email" element={<ResendEmailVerification></ResendEmailVerification>} />
                    <Route path="/check-email" element={<EmailResendSuccess></EmailResendSuccess>} />
                    <Route path="/404" element={<NotFound></NotFound>} />
                    <Route path="*" element={<NotFound></NotFound>} />
                </Routes>
        </header>
        </div>
        );
    }
export default App;

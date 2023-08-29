import { Navigate } from "react-router-dom";
// If there is no user logged in then the user is redirected to the sign in/landing page so basically we
// are protecting the routes here
const Protected = ({ isLoggedIn, children }:any) => {
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default Protected;
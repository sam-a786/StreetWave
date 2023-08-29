import Alert from "react-bootstrap/Alert";
import "./BootstrapAlert.css";

interface alertProps {
  message: string;
}

function BootstrapAlert({ message }: alertProps) {
  return (
    <Alert id="alert" variant="danger">
      <p>{message}</p>
    </Alert>
  );
}

export default BootstrapAlert;

import { WarningOutline } from "react-ionicons";

export default function Error({ text }) {
  return (
    <div className="error">
      <h2>Error</h2>
      <div className="error-box">
        <h3>
          <WarningOutline />
          &ensp;
          {text}
        </h3>
      </div>
    </div>
  );
}

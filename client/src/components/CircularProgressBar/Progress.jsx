import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "./styles.css"
const Progress = () => {
  return (
    <CircularProgressbar
      value={75}
      text="75%"
      styles={buildStyles({
        textColor: "#000",
        pathColor: "#007bff",
        trailColor: "#d6d6d6"
      })}
    />
  );
};

export default Progress;

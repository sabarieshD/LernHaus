import React from "react";
import Spending from "../Spending/Spending";
import TimeOnSite from "../TimeOnSite/TimeOnSite";
import "./StatsCard.css";

const StatsCard = () => {
  return (
    <div className="stats-card">
      <Spending />
      <TimeOnSite />
    </div>
  );
};

export default StatsCard;

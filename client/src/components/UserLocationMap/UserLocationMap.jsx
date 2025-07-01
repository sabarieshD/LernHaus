import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import React from "react";
import { colorScale, countries, missingCountries } from "./Countries";
import "./Styles.css"; // Import the CSS file

function UserLocationMap() {
  return (
    <div className="user-location-map-container">
      <div className="user-location-map">
        <VectorMap
          map={worldMill}
          containerStyle={{
            width: "100%",
            height: "100%",
          }}
          backgroundColor="#282c34"
          // markers={missingCountries}
          // markerStyle={{
          //   initial: {
          //     fill: "red",
          //   },
          // }}
          series={{
            regions: [
              {
                scale: colorScale,
                values: countries,
                min: 0,
                max: 100,
              },
            ],
          }}
          onRegionTipShow={function reginalTip(event, label, code) {
            return label.html(`
                    <div style="background-color: black; border-radius: 6px; min-height: 50px; width: 125px; color: white; padding: 5px;">
                      <p>
                      <b>
                      ${label.html()}
                      </b>
                      </p>
                      <p>
                      ${countries[code] || "No data"}
                      </p>
                    </div>`);
          }}
          onMarkerTipShow={function markerTip(event, label, code) {
            return label.html(`
                    <div style="background-color: white; border-radius: 6px; min-height: 50px; width: 125px; color: black; padding: 5px;">
                      <p style="color: black;">
                      <b>
                      ${label.html()}
                      </b>
                      </p>
                    </div>`);
          }}
        />
      </div>
    </div>
  );
}

export default UserLocationMap;

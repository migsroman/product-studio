import React from "react";
import ReactDOM from "react-dom/client";

// Switch between prototypes by commenting/uncommenting:
// import App from "./ProductStudio.jsx";    // V1: Original full prototype
 import App from "./ProductDefinitionV2.jsx"; // V2: Unified Product Definition flow
//import App from "./EligibilityGLHab.jsx";    // V3: GL Habitational Eligibility prototype

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

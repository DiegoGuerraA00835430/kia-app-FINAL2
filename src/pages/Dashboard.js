import React, { useRef, useEffect } from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const iframeRef = useRef(null);
  const tokenSent = useRef(false); // track if token was already sent

  // Listen for Unity's confirmation
  useEffect(() => {
    function handleMessage(event) {
      if (event.data && event.data.type === "TOKEN_CONFIRM") {
        tokenSent.current = true;
        console.log("✅ Unity confirmó recepción del token");
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleUnityLoaded = () => {
    const token = localStorage.getItem("token");
    const unityFrame = iframeRef.current;
    if (token && !tokenSent.current) {
      unityFrame.contentWindow.postMessage({ type: "SET_TOKEN", token }, "*");
      console.log("✅ Token enviado vía postMessage:", token);
    }
  };

  return (
    <>

      <div style={{ textAlign: "center", paddingTop: "2rem" }}>
        <iframe
          ref={iframeRef}
          id="unity-frame"
          title="UnityWebGL"
          src="/buildWEBGL/index.html"
          width="960"
          height="600"
          frameBorder="0"
          allowFullScreen
          onLoad={handleUnityLoaded}
        />
      </div>
    </>
  );
};
export default Dashboard;

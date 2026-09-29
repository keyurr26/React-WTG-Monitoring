// WindTurbines.jsx
import React from 'react';
// turbine Component logo
const WindTurbines = () => {
    return ( <
        >
        <
        style > {
            `
          body {
            margin: 0;
            height: 100vh;
            background: linear-gradient(to top, #fff 10%, #fff 90%);
            overflow: hidden;
            position: relative;
          }

          .ground {
            position: absolute;
            bottom: 0;
            width: 120%;
            height: 170px;
            background: radial-gradient(circle at 50% 120%, #a0d4a0 0%, #f7f7f7 80%);
            border-top: 1px solid #555;
            clip-path: ellipse(60% 40% at 50% 100%);
            z-index: 1;
          }

          .turbine-container {
            position: absolute;
            bottom: 0;
            left: 0;
            display: flex;
            flex-direction: row;
            gap: 40px;
            padding: 20px 40px;
            padding-left: 80px;
            align-items: flex-end;
          }

          .turbine {
            position: relative;
            width: 10px;
            background: linear-gradient(to right, #333 0%, #ffffff 100%, #333 50%);
            border-radius: 2px;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
            animation: sway 4s ease-in-out infinite;
          }

          .turbine .hub {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            border: 4px solid #ff8400;
            border-radius: 50%;
            background: #fff;
            z-index: 3;
          }

          .rotor {
            position: absolute;
            left: 56%;
            width: 0;
            height: 0;
            transform: translateX(-50%);
            animation: spin 3s linear infinite;
          }

          .blade {
            position: absolute;
            height: 10px;
            background: linear-gradient(to right, #cbcbcb 80%, orange 80%);
            transform-origin: left center;
            border-radius: 30px;
          }

          .blade:nth-child(1) {
            transform: rotate(0deg);
          }

          .blade:nth-child(2) {
            transform: rotate(120deg);
          }

          .blade:nth-child(3) {
            transform: rotate(240deg);
          }

          @keyframes spin {
            from {
              transform: translateX(-50%) rotate(0deg);
            }
            to {
              transform: translateX(-50%) rotate(360deg);
            }
          }

          @keyframes sway {
            0%, 100% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(0.5deg);
            }
          }

          .turbine.small {
            height: 160px;
          }

          .turbine.small .hub {
            top: -16px;
            width: 12px;
            height: 12px;
          }

          .turbine.small .rotor {
            top: -8px;
          }

          .turbine.small .blade {
            width: 70px;
          }

          .turbine.medium {
            height: 220px;
          }

          .turbine.medium .hub {
            top: -18px;
            width: 14px;
            height: 14px;
          }

          .turbine.medium .rotor {
            top: -9px;
          }

          .turbine.medium .blade {
            width: 100px;
          }

          .turbine.large {
            height: 280px;
          }

          .turbine.large .hub {
            top: -20px;
            width: 16px;
            height: 16px;
          }

          .turbine.large .rotor {
            top: -10px;
          }

          .turbine.large .blade {
            width: 130px;
          }
        `
        } <
        /style>

        <
        div className = "ground" > < /div>

        <
        div className = "turbine-container" > { /* Small Turbine */ } <
        div className = "turbine small" >
        <
        div className = "hub" > < /div> <
        div className = "rotor" >
        <
        div className = "blade" > < /div> <
        div className = "blade" > < /div> <
        div className = "blade" > < /div> <
        /div> <
        /div>

        { /* Medium Turbine */ } <
        div className = "turbine medium" >
        <
        div className = "hub" > < /div> <
        div className = "rotor" >
        <
        div className = "blade" > < /div> <
        div className = "blade" > < /div> <
        div className = "blade" > < /div> <
        /div> <
        /div>

        { /* Large Turbine */ } <
        div className = "turbine large" >
        <
        div className = "hub" > < /div> <
        div className = "rotor" >
        <
        div className = "blade" > < /div> <
        div className = "blade" > < /div> <
        div className = "blade" > < /div> <
        /div> <
        /div> <
        /div> <
        />
    );
};

export default WindTurbines;



// turbine Component
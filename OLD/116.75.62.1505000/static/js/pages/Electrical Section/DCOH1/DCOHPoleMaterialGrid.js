     import React from "react";
     import {
         Grid,
         Card,
         CardMedia,
         CardContent,
         Typography
     } from "@mui/material";

     import VCrossIMG from "../../../assets/Vcrossarm.png";
     import FClamp from "../../../assets/F-Clamp.jpg";
     import CchannelIMG from "../../../assets/C_channel.png";
     import HFrameIMG from "../../../assets/HFrame.png";
     import StayIMG from "../../../assets/stay.png";
     import PinInsulatorIMG from "../../../assets/pin_insulator.png";
     import DiscInsulatorIMG from "../../../assets/disc-insulator.jpg";
     import SuspensionInsulatorIMG from "../../../assets/suspension_insulator.png";

     // ✅ Image List
     const imageList = [{
             name: "V Cross Arm",
             img: VCrossIMG
         },
         {
             name: "F Clamp",
             img: FClamp
         },
         {
             name: "C Channel",
             img: CchannelIMG
         },
         {
             name: "H Frame",
             img: HFrameIMG
         },
         {
             name: "Stay",
             img: StayIMG
         },
         {
             name: "Pin Insulator",
             img: PinInsulatorIMG
         },
         {
             name: "Disc Insulator",
             img: DiscInsulatorIMG
         },
         {
             name: "Suspension Insulator",
             img: SuspensionInsulatorIMG
         },
     ];

     const PoleMaterialGrid = () => {
         return ( <
             Grid container spacing = {
                 2
             } > {
                 imageList.map((item, index) => ( <
                     Grid item xs = {
                         12
                     }
                     sm = {
                         6
                     }
                     md = {
                         3
                     }
                     key = {
                         index
                     } >
                     <
                     Card sx = {
                         {
                             borderRadius: 3,
                             boxShadow: 3,
                             textAlign: "center",
                         }
                     } >
                     <
                     CardMedia component = "img"
                     height = "120"
                     image = {
                         item.img
                     }
                     alt = {
                         item.name
                     }
                     sx = {
                         {
                             objectFit: "contain",
                             p: 1
                         }
                     }
                     /> <
                     CardContent sx = {
                         {
                             p: 1
                         }
                     } >
                     <
                     Typography variant = "body2"
                     fontWeight = {
                         500
                     } > {
                         item.name
                     } <
                     /Typography> <
                     /CardContent> <
                     /Card> <
                     /Grid>
                 ))
             } <
             /Grid>
         );
     };

     export default PoleMaterialGrid;
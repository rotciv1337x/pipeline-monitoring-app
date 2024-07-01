import * as React from 'react';
import { CameraAlt, KeyboardBackspace, Star, StarBorder } from "@mui/icons-material";
import { Typography, Box, IconButton, Avatar, Divider, CircularProgress, Grid } from "@mui/material";
import {
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Display } from "../../utils/device";

const iconSVG = () => {
  return (
    <svg
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.04053 31.1796C2.47961 28.2202 3.79365 25.6264 5.97961 23.4C8.74053 20.6 12.0732 19.2 15.9796 19.2C19.886 19.2 23.2204 20.6 25.9796 23.4C28.1796 25.6266 29.5062 28.2204 29.9593 31.1796M24.1405 10.0204C24.1405 12.247 23.3468 14.1532 21.7593 15.7408C20.1734 17.3408 18.253 18.1408 16.0001 18.1408C13.7594 18.1408 11.8409 17.3408 10.2409 15.7408C8.65337 14.1533 7.85965 12.247 7.85965 10.0204C7.85965 7.76727 8.65341 5.84679 10.2409 4.25959C11.8409 2.67367 13.7596 1.87991 16.0001 1.87991C18.2532 1.87991 20.1737 2.67367 21.7593 4.25959C23.3468 5.84711 24.1405 7.76739 24.1405 10.0204Z"
        stroke="#213F7D"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};


export const DroneFeed = (props: { width: any }) => {
  const [live, setLive] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [sections, setSections] = React.useState([]);
  const [showControlButtons, setShowControlButtons] = React.useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  //create a function that when called, will show the control buttons for a few seconds and then hide them
  const showControls = () => {
    setShowControlButtons(true);
    setTimeout(() => {
      setShowControlButtons(false);
    }, 5000);
  };

  return (
    <Grid container id="drone-feed" sx={{ width: "100vw", height: "100vh", }}>
      <Grid item
        xs={12}
        md={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          padding: 4,
        }}
        >
          <Typography variant="h3" component="h1" fontWeight="bold">
            Drone Feed: {id}
          </Typography>
          {/* // create a box for the drone feed. it should have button to play/pause, zoom in and out, and to take a snapshot. all of the buttons will be on top of the video feed and fades out after a few seconds */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              padding: 4,
            }}
            position={"relative"}
            // every time the mouse is moved over the video feed, show the control buttons
            onMouseMove={showControls}
          >
            <video
              autoPlay
              loop
              muted
              width={"100%"}
              height={"auto"}
              style={{ borderRadius: 2, }}
            >
              <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
          </Box>
        </Grid>
        <Grid item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            padding: 4,
          }}
          ></Grid>
    </Grid>
  )
};

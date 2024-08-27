import * as React from "react";
import {
  ArrowBack,
  ArrowForward,
  CameraAlt,
  ChevronLeftRounded,
  ChevronRightRounded,
  FastForward,
  FastRewind,
  Fullscreen,
  FullscreenExit,
  KeyboardBackspace,
  PauseCircleFilledRounded,
  PlayArrowRounded,
  Star,
  StarBorder,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import {
  Typography,
  Box,
  IconButton,
  Avatar,
  Divider,
  CircularProgress,
  Grid,
  Skeleton,
  Drawer,
} from "@mui/material";
import {
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
  useState,
  useEffect,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Display } from "../utils/device";
import { BlobServiceClient } from '@azure/storage-blob';


const storageAccount = 'leaksandpipeskeyframes';
const containerName = 'key-frames';
const sasToken = 'sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-11-29T16:37:49Z&st=2024-08-13T08:37:49Z&sip=0.0.0.0-255.255.255.255&spr=https';
const blobServiceUrl = `https://${storageAccount}.blob.core.windows.net`;

const Slideshow = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const blobServiceClient = new BlobServiceClient(`${blobServiceUrl}?${sasToken}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get the current date
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are zero-based
    const day = currentDate.getDate();

    // Construct the path dynamically
    const path = `key-frames/${year}/${month}/${day}/`;

    const imageUrls: string[] = [];
    const fetchImages = async () => {

      for await (const blob of containerClient.listBlobsFlat({ prefix: path })) {
        const imageUrl = `${blobServiceUrl}/${containerName}/${blob.name}?${sasToken}`;
        imageUrls.push(imageUrl);
      }

      // Preload images
      preloadImages(imageUrls);

      // Cache images in localStorage
      localStorage.setItem('cachedImages', JSON.stringify(imageUrls));

      setImages(imageUrls);
    };

    // Check if images are cached in localStorage
    const cachedImages = localStorage.getItem('cachedImages');
    if (cachedImages) {
      setImages(JSON.parse(cachedImages));
    } else {
      fetchImages();
    }

    // also, reload the list of images every 10 sec
    const reloadImageTimer = setInterval(() => {
      console.log('reloading image list')
      fetchImages()
    }, 10000);
    return clearInterval(reloadImageTimer)
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images]);

  const preloadImages = (imageUrls: string[]) => {
    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  };

  if (images.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img src={images[currentIndex]} alt="Slideshow" style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};
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
  const { isMobile, isDesktop, isTablet } = Display();
  const [live, setLive] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [sections, setSections] = React.useState([]);
  const [showControlButtons, setShowControlButtons] = React.useState(false);
  const [zoomRatio, setZoomRatio] = React.useState(1);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
  const [showSnapshot, setShowSnapshot] = React.useState(false);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [play, setPlay] = React.useState(true);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Play/Pause the video based on the play state
  React.useEffect(() => {
    if (play) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [play]);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);
  // Function to zoom in
  const zoomIn = () => {
    setZoomRatio((prevZoom) => prevZoom * 1.1);
  };

  // Function to zoom out
  const zoomOut = () => {
    if (zoomRatio! <= 1) return;
    setZoomRatio((prevZoom) => prevZoom / 1.1);
  };

  // create a function for increasing the speed of the video
  const increaseSpeed = () => {
    if (live) return console.log("Cannot increase speed in live mode");
    setPlaybackSpeed((prevSpeed) => prevSpeed + 0.5);
  };

  // create a function for decreasing the speed of the video
  const decreaseSpeed = () => {
    if (live) return console.log("Cannot decrease speed in live mode");
    if (playbackSpeed <= 0.1) return;
    setPlaybackSpeed((prevSpeed) => prevSpeed - 0.5);
  };

  // Function to take a screenshot
  const takeScreenshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "screenshot.png";
      link.click();
    }
  };

  // Function to toggle fullscreen
  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (fullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
      // if device is mobile, request fullscreen on the video element
      if ((isMobile || isTablet) && videoRef.current) {
        videoRef.current.requestFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  };
  const { id } = useParams();
  const navigate = useNavigate();

  //create a function that when called, will show the control buttons for a few seconds and then hide them
  const showControls = () => {
    setShowControlButtons(true);
    setTimeout(() => {
      setShowControlButtons(false);
    }, 20000);
  };

  return (
    <>
    <Grid container id="drone-feed" sx={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Grid
        item
        xs={12}
        md={9}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        {/* // create a box for the drone feed. it should have button to play/pause, zoom in and out, and to take a snapshot. all of the buttons will be on top of the video feed and fades out after a few seconds */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            overflow: "hidden",
          }}
          position={"relative"}
          // every time the mouse is moved over the video feed, show the control buttons
          onMouseMove={showControls}
          onClick={(e)=> {
            e.preventDefault();
            showControls();
          }}
        >
          {/* <video
            ref={videoRef}
            autoPlay
            loop
            muted
            width={"100%"}
            height={"auto"}
            style={{
              borderRadius: 2,
              transform: `scale(${zoomRatio})`,
              transition: "transform 0.5s",
              overflow: "hidden",
            }}
            controls={false}
          >
            <source src="/demo-vid.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video> */}
          <Slideshow />
          <IconButton
            sx={{
              top: 0,
              right: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              // if isDesktop, we don't want it to show
              display: (!isDesktop && !showControlButtons )? "none" : "flex",
              position: "absolute",
            }}
            onClick={() => isDesktop ? null : setOpenDrawer(!openDrawer)}
          >
            {openDrawer ? <ChevronRightRounded /> : <ChevronLeftRounded />}
          </IconButton>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              display: 'none', //showControlButtons ? "flex" : "none",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              gap: "auto",
              backgroundColor: "rgba(0,0,0,0.5)",
              width: "100%",
              flexDirection: "row",
              color: "red",
            }}
            onMouseMove={showControls}
            // on mobile, show the control buttons on tap
            onClick={showControls}
          >
            <IconButton onClick={(e) => setPlay(!play) } size="large" color="primary">
              {play ? <PauseCircleFilledRounded /> : <PlayArrowRounded />}
            </IconButton>
            <IconButton onClick={zoomIn } size="large" color="primary">
              <ZoomIn />
            </IconButton>
            <IconButton onClick={zoomOut } size="large" color="primary">
              <ZoomOut />
            </IconButton>
            <IconButton onClick={takeScreenshot } size="large" color="primary">
              <CameraAlt />
            </IconButton>
            <IconButton onClick={toggleFullscreen } size="large" color="primary">
              {fullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
            <IconButton onClick={decreaseSpeed } size="large" color="primary">
              <FastRewind />
            </IconButton>
            <IconButton onClick={increaseSpeed } size="large" color="primary">
              <FastForward />
            </IconButton>
          </Box>
        </Box>
      </Grid>
      {/* <Grid
        item
        xs={12}
        md={3}
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          gap: 4,
          padding: 4,
          overflowY: "auto",
          overflowX: "hidden",
          // if not isDesktop, we don't want it to show
          display: isDesktop ? "flex" : "none",
        }}
      >
       <Typography variant="h4" fontWeight="bold">
        Previous Feeds
      </Typography>
      {
        Array.from({ length: 4 }).map((_, index) => (
          <Skeleton variant="rectangular" width="100%" height={150} key={index} />
        ))
      }
      </Grid> */}
    </Grid>
    <Drawer anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
      <Box sx={{ width: 300, height: "100vh", overflowY: "auto", padding: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Previous Feeds
        </Typography>
        {
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton variant="rectangular" width="100%" height={!isDesktop ? 50 : 150} key={index} />
          ))
        }
      </Box>
    </Drawer>
    </>
  );
};

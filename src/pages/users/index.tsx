import * as React from 'react';
import { KeyboardBackspace, Star, StarBorder } from "@mui/icons-material";
import { Typography, Box, Button, Avatar, Divider, CircularProgress } from "@mui/material";
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

const DetailSection = (props: { sections: any }) => {
  const { isDesktop } = Display();
  const { sections } = props;
  return sections.map((section: any, index1: any) => (
    <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "flex-start",
        gap: 4,
        // if contents are too long, wrap them
        flexWrap: "wrap",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        {section.title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "flex-start",
          gap: isDesktop ? 6 : 2,
          flex: 1,
          flexWrap: "wrap",
          opacity: 0.6,
        }}
      >
        {section.content.map(
          (
            item: {
              title:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
              value:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined;
            },
            index: any
          ) => {
            // if there is no title or value, skip
            if (!item.title || !item.value) return null;
            return (
              <Box>
                <Typography variant="h6" component="h2" marginBottom={2}>
                  {item.title}
                </Typography>
                <Typography variant="h5" component="h3" >
                  {item.value}
                </Typography>
              </Box>
            );
          }
        )}
      </Box>
    </Box>
    {index1 !== sections.length - 1 && <Divider sx={{ width: "100%", fontWeight: 'bold' }} />}
    </>
  ));
};

export const User = (props: { width: any }) => {
  const [ user, setUser ] = React.useState<any>(null);
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [ error, setError ] = React.useState<any>(null);
  const [ rawUserDetail, setRawUserDetail ] = React.useState<any>(null);
  // get the user id from the url
  const { id } = useParams();
};

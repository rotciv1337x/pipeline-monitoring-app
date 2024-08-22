import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/authContext";
import { API_URL } from "../../config";

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
// create a regex for password. it must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W|_)[A-Za-z\d\W_]{8,}$/
const Login = (props: { setShowLoading: any }) => {
  const navigate = useNavigate();
  const { setShowLoading } = props;
  const [values, setValues] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [inputType, setInputType] = React.useState("password");
  const from = useLocation().state?.from || "/home";
  const [formType, setFormType] = useState("login");
  const [formError, setFormError] = useState("");

  const handleSubmit = async () => {
    setErrors({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
    setShowLoading && setShowLoading(true);
    let validEmail = emailRegex.test(values.email.trim());
    let validPassword = values.password?.length >= 8
    let validConfirmPassword = true,
      validName = true;
    if (formType === "register") {
      validConfirmPassword = values.password === values.confirmPassword;
      validName = values.name.length > 2;
    }
    if (validEmail && validPassword && validConfirmPassword && validName) {
      try {
        let response: any = await fetch(`${API_URL}/user/${formType}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
            ...(formType === "register" && {
              repeatPassword: values.confirmPassword,
              name: values.name,
            }),
          }),
        });
        response = await response.json();
        if (response.success) {
          signin(response.data);
          setShowLoading && setShowLoading(true);
          setTimeout(() => {
            
              navigate(from);
            setShowLoading && setShowLoading(false);
          }, 1000);
        } else {
          setFormError(response.message);
        }
      } catch (error) {
        console.log(error);
        setFormError("An error occurred. Please try again later");
      }
    } else {
      setErrors({
        email: validEmail ? "" : "Invalid email",
        password: validPassword ? "" : "Password can not be less than 8 characters",
        confirmPassword: validConfirmPassword ? "" : "Passwords do not match",
        name: validName ? "" : "Name must be at least 3 characters",
      });
    }
    setShowLoading && setShowLoading(false);
  };

  // on every for type change, reset the form
  React.useEffect(() => {
    setValues({ email: "", password: "", confirmPassword: "", name: "" });
    setErrors({ email: "", password: "", confirmPassword: "", name: "" });
  }, [formType]);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  // @ts-ignore
  const { signin, user } = useAuth();
  const handleChange = (element: string, value: string) => {
    setValues({ ...values, [element]: value });
  };
  return (
    <Box
      component="form"
      fontWeight={600}
      sx={{
        width: "100%",
        px: 3,
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Typography
        variant={formType === "login" ? "h4" : "h5"}
        sx={{
          textAlign: "left",
          fontWeight: 600,
          position: "absolute",
          top: 15,
          left: 5,
          color: "primary.main",
          opacity: 0.7,
        }}
      >
        Pipeline Fault Detection System
      </Typography>
      <Typography
        variant="h5"
        sx={{
          mt: 5,
          mb: formType === "login" ? 5 : 2,
          textAlign: "left",
          opacity: 0.6,
        }}
      >
        <Box component="span">Enter details to continue</Box>
      </Typography>
      {formType === "register" && (
        <TextField
          id="name-input"
          label="Name"
          variant="outlined"
          aria-label="name"
          name="name"
          helperText={errors.name}
          error={errors.name !== ""}
          sx={{ width: "100%", mb: 2 }}
          onChange={(e) => handleChange("name", e.currentTarget.value)}
        />
      )}
      <TextField
        id="email-input"
        label="Email"
        variant="outlined"
        aria-label="email"
        name="email"
        helperText={errors.email}
        error={errors.email !== ""}
        sx={{ width: "100%", mb: 2 }}
        onChange={(e) => handleChange("email", e.currentTarget.value)}
      />
      <TextField
        id="password-input"
        label="Password"
        variant="outlined"
        type={inputType}
        name="password"
        helperText={errors.password}
        error={errors.password !== ""}
        fullWidth
        sx={{ mb: 2 }}
        onChange={(e) => handleChange("password", e.currentTarget.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{ visibility: values.password.length ? "visible" : "hidden" }}
            >
              <Box
                component={"span"}
                onClick={(e) => {
                  e.preventDefault();
                  setInputType(inputType === "password" ? "text" : "password");
                }}
              >
                {inputType === "password" ? "SHOW" : "HIDE"}
              </Box>
            </InputAdornment>
          ),
        }}
      />

      {formType === "register" && (
        <TextField
          id="confirm-password-input"
          label="Confirm Password"
          variant="outlined"
          type={inputType}
          name="confirm-password"
          helperText={errors.confirmPassword}
          error={errors.confirmPassword !== ""}
          fullWidth
          sx={{ mb: 2 }}
          onChange={(e) =>
            handleChange("confirmPassword", e.currentTarget.value)
          }
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  visibility: values.password.length ? "visible" : "hidden",
                }}
              >
                <Box
                  component={"span"}
                  onClick={(e) => {
                    e.preventDefault();
                    setInputType(
                      inputType === "password" ? "text" : "password"
                    );
                  }}
                >
                  {inputType === "password" ? "SHOW" : "HIDE"}
                </Box>
              </InputAdornment>
            ),
          }}
        />
      )}
      <Typography
        variant="body2"
        sx={{ color: "red", mb: 2, textAlign: "left", opacity: 0.6 }}
      >
        {formError}
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{}}
        type="submit"
        role="submit"
        name="submit"
        onClick={(e) => {
          handleSubmit();
        }}
      >
        {formType.toLocaleUpperCase()}
      </Button>
      <Button
        variant="text"
        size="large"
        sx={{ width: "100%", mt: 3 }}
        onClick={(e) => {
          // e.preventDefault();
          setFormType(formType === "login" ? "register" : "login");
        }}
      >
        Create an account
      </Button>
    </Box>
  );
};

export default Login;

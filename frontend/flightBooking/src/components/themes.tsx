// themeApple.ts
import { createTheme } from "@mui/material/styles";

export const appleTheme = createTheme({
  palette: {
    background: {
      default: "#F5F5F7",
    },
    text: {
      primary: "#1C1C1E",
      secondary: "#2C2C2E",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"SF Pro Text"',
      '"SF Pro Icons"',
      '"Helvetica Neue"',
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.9rem",
      color: "#3A3A3C",
    },
    
  },
  components: {
    MuiPaper: {
        defaultProps: {
          elevation: 5,
        },
  
        styleOverrides: {
          root: {
            width: "90%",
            maxWidth: "1500px",
            padding: 20,
            borderRadius: 16,
            margin: "10px 0px 0px 0px",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: "rgba(28, 28, 30, 0.05)", 
            "& fieldset": { border: "none" }, 
          },
          
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: "rgba(28, 28, 30, 0.05)",
            "& fieldset": { border: "none" }, 
          },
        },
      },
      MuiButton:{
        styleOverrides:{
            root:{
                backgroundColor: "rgba(72, 72, 74)",
            }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            padding: 16,
           
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
          },
        },
      },

  }

});

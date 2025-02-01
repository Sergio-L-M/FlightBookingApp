// themeApple.ts
import { createTheme } from "@mui/material/styles";

// Basado en la guía de colores de Apple (ejemplo simplificado):
// https://developer.apple.com/design/human-interface-guidelines/foundations/color/

export const appleTheme = createTheme({
  palette: {
    background: {
      // Color de fondo principal
      default: "#F5F5F7",
      // Color de "Paper" o contenedores
      
    },
    text: {
      // Texto principal
      primary: "#1C1C1E",
      // Texto secundario
      secondary: "#2C2C2E",
    },
    // Puedes agregar más colores si lo requieres
  },
  shape: {
    // Bordes redondeados más pronunciados
    borderRadius: 16,
  },
  typography: {
    // Uso de tipografías similares a las de Apple
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
    // Puedes personalizar distintos niveles tipográficos
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
            // Bordes redondeados para TextField
          },
          
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            borderRadius: 16, // Bordes redondeados para Select
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
      }
  }

});

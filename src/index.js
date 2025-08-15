import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import reportWebVitals from './reportWebVitals.js';
import store from './redux/store.js';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

const PRIMARY = '#669bbc';    
const BACKGROUND = '#003049'; 
const SECONDARY = '#fffcf2ff';  

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY // Celestial Blue
    },
    secondary: {
      main: SECONDARY
    },
    background: BACKGROUND
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: BACKGROUND,
          border:2,
          borderColor: SECONDARY
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          color: SECONDARY,
          fontSize: 12,
          "& .MuiSvgIcon-root": {
              color: SECONDARY,
          },
          border: 4,
          borderColor: SECONDARY
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          color: SECONDARY,
          background: `${BACKGROUND} !important`,
          borderColor: SECONDARY,
          fontSize: 12,
          '&:hover': {
           backgroundColor: `${PRIMARY} !important`,
          },
          selected: {
            // Works (must use !important):
            background: `${PRIMARY} !important`,
          }
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: SECONDARY,
          '& .MuiFormControlLabel-label': {
            fontSize: 12
          }
        }
      }
    }
  },
  typography: {
    h1: {
      fontWeight: 1000,
      color: PRIMARY 
    },
    h3: {
      color: PRIMARY
    },
    h6: {
      color: PRIMARY
    },
    stat_info: {
      fontWeight: 1000,
      color: SECONDARY
    },
    body1: {
      color: SECONDARY
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

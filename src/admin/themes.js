import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7447FF',
    },
    background: {
      default: '#f8f9fa',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7447FF',
    },
    background: {
      default: '#303030',
    },
  },
});

import { createTheme } from '@mui/material';
import { blue, yellow, lightBlue } from '@mui/material/colors';

// allow configuration using `createTheme`
interface ThemeOptions {
  palette?: {
    primary?: string;
  };
}

export const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
    },
    warning: {
      main: yellow[700],
    },
    info: {
      main: lightBlue[400],
      contrastText: '#fff',
    },
    success: {
      main: '#00b51d',
      contrastText: '#fff',
    },
  },
});

import { createTheme } from '@mui/material';
import { blue, yellow } from '@mui/material/colors';

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
    },
});

import { createTheme } from '@mui/material/styles';

export const LightTheme = createTheme({
  palette: {
    primary: { main: 'rgb(250, 40, 60)' },
  },
  typography: {
  },
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 390,
  //     md: 900,
  //     lg: 1200,
  //     xl: 1536,
  //   },
  // },
  components: {
    MuiDrawer: {
      styleOverrides: {
      },
    },
  },
});

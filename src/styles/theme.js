import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontSize: 16,
    // Quita la capitalización automática en todos los componentes de texto
    allVariants: {
      textTransform: 'none',
    },
    h1: {
      textTransform: 'none',
    },
    h2: {
      textTransform: 'none',
    },
    h3: {
      textTransform: 'none',
    },
    h4: {
      textTransform: 'none',
    },
    h5: {
      textTransform: 'none',
    },
    h6: {
      textTransform: 'none',
    },
    subtitle1: {
      textTransform: 'none',
    },
    subtitle2: {
      textTransform: 'none',
    },
    body1: {
      textTransform: 'none',
    },
    body2: {
      textTransform: 'none',
    },
    button: {
      textTransform: 'none', // Esto es importante para los botones que suelen tener capitalización
    },
    caption: {
      textTransform: 'none',
    },
    overline: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        input: {
          textTransform: 'none',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
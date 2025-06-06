import { CSSProperties } from 'react';
import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module 'notistack' {
  interface OptionsObject {
    isSimple?: boolean;
    header?: string;
  }
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true; // removes the `xs` breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }

  interface Palette {
    border: TypeBorder;
    boxShadow: TypeBoxShadow;
  }

  interface PaletteOptions {
    border?: TypeBorder;
    boxShadow?: TypeBoxShadow;
  }

  interface PaletteColor {
    darker?: string;
    darkest?: string;
    lighter?: string;
    lightest?: string;
    hover?: string;
    background?: string;
    contrastHover?: string;
    contrastBackground?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
    darkest?: string;
    lighter?: string;
    lightest?: string;
    hover?: string;
    background?: string;
    contrastHover?: string;
    contrastBackground?: string;
  }

  interface TypeText {
    primary: string;
    secondary: string;
    hover: string;
    disabled: string;
    white: string;
  }

  interface TypeBorder {
    normal: string;
    hover: string;
    focus: string;
    disabled: string;
  }

  interface TypeAction {
    loading: string;
    active: string;
    hover: string;
    selected: string;
    disabled: string;
    disabled_background: string;
  }

  interface TypeBackground {
    white: string;
    homepage: string;
    footer: string;
    main: string;
  }

  interface TypeBoxShadow {
    card_shadow: string;
    dropdown_shadow: string;
  }

  interface TypographyVariants {
    body3: CSSProperties;
    subtitle3: CSSProperties;
    h7: CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: CSSProperties;
    subtitle3?: CSSProperties;
    h7?: CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    body3: true;
    subtitle3: true;
    h7: true;
  }
}

const customBreakpoints = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 431,
      md: 768,
      lg: 1367,
      xl: 1680,
      xxl: 1920,
    },
  },
});

const defaultOptions: ThemeOptions = {
  ...customBreakpoints,
  palette: {
    primary: {
      main: '#5B76BC',
      hover: '#4B6BB6',
      background: '#EFF1F8',
      light: '#EDF1FF',
      lighter: '#FBFCFD',
      dark: '#7D9DE8',
      darker: '#3A5290',
      contrastText: '#FFFFFF',
      contrastHover: '#2B52B6',
      contrastBackground: '#365EC6',
    },
    secondary: {
      main: '#FFFFFF',
      hover: '#F4F6FA',
      background: 'rgba(255,255,255,.1)',
      contrastText: '#5B76BC',
    },
    info: {
      main: '#9095A3',
      hover: '#81889B',
      background: '#F4F4F6',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#69C0A5',
      hover: '#43A788',
      background: '#F0F9F6',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#EEB94D',
      hover: '#E39F15',
      background: '#FFF7E6',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DE6449',
      hover: '#CD5135',
      background: '#FFEEEA',
      contrastText: '#FFFFFF',
    },

    action: {
      active: '#636A7C',
      hover: '#F4F6FA',
      selected: '#EDF1FF',
      disabled: '#BABCBE',
      disabled_background: '#EDEDED',
      loading: '#E3E3EE',
    },
    text: {
      primary: '#202939',
      secondary: '#9095A3',
      hover: '#636A7C',
      disabled: '#BABCBE',
      white: '#FFFFFF',
    },
    background: {
      white: '#FFFFFF',
      homepage: '#F4F6FA',
      footer: '#121214',
      main: '#5B76BC',
    },

    border: {
      normal: '#D2D6E1',
      hover: '#9095A3',
      focus: '#202939',
      disabled: '#BABCBE',
    },
    boxShadow: {
      card_shadow: '0px 0px 10px 0px rgba(17, 52, 227, 0.20)',
      dropdown_shadow:
        'box-shadow: 0px 10px 10px 0px rgba(17, 52, 227, 0.10), 0px 0px 2px 0px rgba(17, 52, 227, 0.10)',
    },
  },
  typography: {
    fontFamily: 'Inter, "pingfang sc", sans-serif',
    h1: {
      fontSize: 56,
      fontWeight: 600,
    },
    h2: {
      fontSize: 48,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h3: {
      fontSize: 36,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h4: {
      fontSize: 30,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h5: {
      fontSize: 24,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h6: {
      fontSize: 20,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    h7: {
      fontSize: 18,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle2: {
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    subtitle3: {
      fontSize: 12,
      lineHeight: 1.5,
      fontWeight: 600,
    },
    body1: {
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: 14,
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body3: {
      fontSize: 12,
      lineHeight: 1.5,
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        disableInteractive: true,
      },
    },
  },
};

// Create a theme instance.
const lightTheme = createTheme(defaultOptions);

const darkTheme = createTheme({
  ...defaultOptions,
  palette: {
    ...defaultOptions.palette,
  },
});

export { lightTheme, darkTheme };

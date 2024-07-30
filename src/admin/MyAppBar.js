import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import { Box } from '@mui/material';

import { AppBarToolbar } from './AppBarToolbar';
import Logo from '../télécharger.png'
import { useThemeContext } from './ThemeContext';
import { Hidden } from '@material-ui/core';

const MyAppBar = () => {
  const { theme } = useThemeContext();
    return (
  
        
                <AppBar elevation={3} color="inherit" 
                style={{ color:'#7447FF', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)' }} 
                toolbar={<AppBarToolbar />}>
                
        
        <TitlePortal />
        <Box flex="0.5" />
        <Hidden xsDown>
        <img src={Logo} width={'150px'} alt='logo' />
        <Box flex="1" />

      </Hidden>
                </AppBar>

    );
};

export default MyAppBar;

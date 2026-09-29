  import React from 'react';
  import {
      Snackbar,
      Alert
  } from '@mui/material';

  const CustomSnackbar = ({
      open,
      onClose,
      message,
      severity = 'success',
      duration = 4000,
      position = {
          vertical: 'bottom',
          horizontal: 'center'
      },
  }) => {
      return ( <
          Snackbar open = {
              open
          }
          autoHideDuration = {
              duration
          }
          onClose = {
              onClose
          }
          anchorOrigin = {
              position
          }
          sx = {
              {
                  '& .MuiPaper-root': {
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
              }
          } >
          <
          Alert onClose = {
              onClose
          }
          severity = {
              severity
          }
          variant = "outlined"
          sx = {
              {
                  width: '100%',
                  borderRadius: 3,
                  fontWeight: 500,
                  bgcolor: severity === 'success' ?
                      'rgba(200, 255, 200, 0.7)' :
                      severity === 'error' ?
                      'rgba(255, 200, 200, 0.7)' :
                      severity === 'warning' ?
                      'rgba(255, 245, 200, 0.7)' :
                      'rgba(200, 230, 255, 0.7)', // info
                  color: severity === 'success' ?
                      '#2e7d32' :
                      severity === 'error' ?
                      '#d32f2f' :
                      severity === 'warning' ?
                      '#f57c00' :
                      '#0277bd',
                  border: '1px solid',
                  borderColor: severity === 'success' ?
                      '#81c784' :
                      severity === 'error' ?
                      '#e57373' :
                      severity === 'warning' ?
                      '#ffb74d' :
                      '#64b5f6',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(6px)',
              }
          } >
          {
              message
          } <
          /Alert> <
          /Snackbar>
      );
  };

  export default CustomSnackbar;
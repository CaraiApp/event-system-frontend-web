import React from 'react';
import { Box, Typography, Button, Paper, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';

const PageHeader = ({ 
  title, 
  subtitle, 
  button, 
  breadcrumbs = [], 
  children,
  paddingBottom = 4,
  marginBottom = 4
}) => {
  // Si hay breadcrumbs, generar una lista de ellos
  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null;

    return (
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 1 }}
      >
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/admin"
        >
          Dashboard
        </Link>
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return isLast ? (
            <Typography key={index} color="text.primary">
              {breadcrumb.label}
            </Typography>
          ) : (
            <Link
              key={index}
              component={RouterLink}
              underline="hover"
              color="inherit"
              to={breadcrumb.path}
            >
              {breadcrumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  return (
    <Box 
      component={Paper} 
      elevation={0} 
      sx={{ 
        p: 4, 
        pb: paddingBottom,
        mb: marginBottom, 
        borderRadius: 2,
        backgroundColor: 'white' 
      }}
    >
      {renderBreadcrumbs()}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {button && (
          <Button
            variant={button.variant || "contained"}
            color={button.color || "primary"}
            size="medium"
            startIcon={button.icon}
            onClick={button.onClick}
          >
            {button.label}
          </Button>
        )}
      </Box>
      
      {children}
    </Box>
  );
};

export default PageHeader;
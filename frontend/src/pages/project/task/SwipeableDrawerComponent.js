// SwipeableDrawerComponent.js
import React from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

const SwipeableDrawerComponent = ({ isOpen, onClose }) => {
  return (
    <SwipeableDrawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      onOpen={() => {}}
    >
      {/* Drawer content */}
    </SwipeableDrawer>
  );
};

export default SwipeableDrawerComponent;

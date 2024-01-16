import React from "react";
import { NavigationContainerRef } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}


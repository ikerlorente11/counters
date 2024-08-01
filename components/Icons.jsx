/* eslint-disable react/display-name */
import React, { forwardRef } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export const Add = forwardRef((props, ref) => (
  <FontAwesome6
    name="circle-plus"
    size={35}
    color="black"
    ref={ref}
    {...props}
  />
));

export const Edit = forwardRef((props, ref) => (
  <FontAwesome6
    name="edit"
    size={35}
    color="black"
    ref={ref}
    {...props}
  />
));

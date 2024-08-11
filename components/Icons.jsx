/* eslint-disable react/display-name */
import React, { forwardRef } from "react";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
  <FontAwesome6 name="edit" size={35} color="black" ref={ref} {...props} />
));

export const Plus = forwardRef((props, ref) => (
  <FontAwesome6 name="plus" size={24} color="black" {...props} />
));

export const Minus = forwardRef((props, ref) => (
  <FontAwesome6 name="minus" size={24} color="black" {...props} />
));

export const Light = forwardRef((props, ref) => (
  <MaterialCommunityIcons
    name="lightbulb-variant"
    size={24}
    color="black"
    {...props}
  />
));

export const Dark = forwardRef((props, ref) => (
  <MaterialCommunityIcons
    name="lightbulb-variant-outline"
    size={24}
    color="black"
    {...props}
  />
));

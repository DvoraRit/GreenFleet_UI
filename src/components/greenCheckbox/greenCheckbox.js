import React from "react";
import { withStyles } from "@material-ui/styles";
import Checkbox from "@material-ui/core/Checkbox";

export const GreenBackgroundCheckbox = withStyles(theme => ({
  root: {
    color: "#00ffcc",
    "& .MuiIconButton-label": {
      position: "relative",
      zIndex: 0
    },
    "&:not($checked) .MuiIconButton-label:after": {
      content: '""',
      left: 4,
      top: 4,
      height: 15,
      width: 15,
      position: "absolute",
      backgroundColor: "white",
      zIndex: -1
    }
  },
  checked: {}
}))(Checkbox);
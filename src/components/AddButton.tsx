import React, { useState } from "react";
import { Fab, Tooltip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import CustomModal from "./CustomModal";

export const AddButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip
        title="Create Post"
        onClick={() => setOpen(true)}
        sx={{ position: "fixed", bottom: 20, left: { md: 30 } }}
      >
        <Fab color="primary">
          <AddIcon />
        </Fab>
      </Tooltip>
      <CustomModal open={open} setOpen={setOpen} />
    </>
  );
};

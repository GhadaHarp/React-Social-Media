import { Snackbar, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/useTypedSelector";
import { hideToast } from "../features/toast/toast.slice";

const Toast = () => {
  const { open, message, severity } = useAppSelector((state) => state.toast);
  const dispatch = useAppDispatch();

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={() => dispatch(hideToast())}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => dispatch(hideToast())}
        severity={severity}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;

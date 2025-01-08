import { useMediaContext } from "react-declarative";
import { makeStyles } from "../styles";
import { AutoAwesome } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";

const useStyles = makeStyles()({
    root: {
        position: 'fixed',
        bottom: '17px',
        right: '66px',
        opacity: 0.33,
        transition: 'opacity 500ms',
        '&:hover': {
            opacity: 1,
        }
    },
  button: {
    minHeight: "35px !important",
    maxHeight: "35px !important",
    paddingLeft: "15px !important",
    paddingRight: "15px !important",
    order: -1,
    zIndex: 99,
  },
  fab: {
    order: -1,
    zIndex: 99,
  },

});

interface ICommercialFabProps {
    onClick: () => void;
}

export const CommercialFab = ({
    onClick,
}: ICommercialFabProps) => {
  const { classes, cx } = useStyles();

  const { isWide } = useMediaContext();

  if (isWide) {
    return (
      <Button
        className={cx(classes.button, classes.root)}
        variant="contained"
        size="small"
        startIcon={<AutoAwesome color="inherit" />}
        onClick={onClick}
      >
        Move faster
      </Button>
    );
  }

  return (
    <Fab
      className={cx(classes.fab, classes.root)}
      size="small"
      color="primary"
      onClick={onClick}
    >
      <AutoAwesome color="inherit" />
    </Fab>
  );
};

export default CommercialFab;

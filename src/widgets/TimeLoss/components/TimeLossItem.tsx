import { makeStyles } from '../../../styles';

import Box from "@mui/material/Box";
import { Avatar, ListItemText } from "@mui/material";

import ColorProgressBar from "./ColorProgressBar";
import IItem from '../model/IItem';

const useStyles = makeStyles()(
  {
    root: {
      display: 'flex',
    },
    work: {
      display: 'flex',
      alignItems: 'center',

    },
    row: {
      flex: 1,
      paddingLeft: 5,
      paddingRight: 5,
      paddingBottom: 15,
    }
  }
)

interface ITimeLossItemProps extends IItem {
}

export const TimeLossItem = ({
  title,
  description,
  avatar,
  done,
  inprogress,
  waiting,
  archive
}: ITimeLossItemProps) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.root}>
      <Box className={classes.row}>
        <Box className={classes.work}>
          <Avatar alt={title} src={avatar || undefined} />
          <ListItemText
            primary={title}
            secondary={description}
            sx={{ flex: 'none', marginLeft: '0.5em' }}
          />
        </Box>
        <Box flex="1">
          <ColorProgressBar
            data={{
              done: { color: '#7FB537', title: 'Done', value: done },
              inprogress: { color: '#4FC0E8', title: 'In Progress', value: inprogress },
              waiting: { color: '#FE9B31', title: 'Waiting', value: waiting },
              archive: { color: '#FA5F5A', title: 'Archive', value: archive }
            }}
          />
        </Box>
      </Box>
    </Box>
  )
};

export default TimeLossItem;

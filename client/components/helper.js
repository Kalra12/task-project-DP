import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const ColorButton = styled(Button)(({ theme }) => ({
    textAlign: 'center',
    color: theme.palette.getContrastText(grey[50]),
    backgroundColor: grey[50],
    '&:hover': {
      backgroundColor: grey[50],
    },
  }));

export {
    ColorButton
}
import { createTheme, ThemeProvider, Typography } from "@mui/material"

// must be extract in an other file
const theme = createTheme({
  palette: {
    primary: {
      main: '#005ADF',
    },
    secondary: {
      main: '#FF4141',
    },
  },
})

function App() {
  
  return (
    <ThemeProvider theme={theme}>
      <Typography variant="h1">
        Hello World!
      </Typography>
    </ThemeProvider>
  )
}

export default App

import '@mantine/core/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';

import Planning from './screens/Planning'

import "./App.css"

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <>
      <MantineProvider theme={theme}>
        <Planning />
      </MantineProvider>
    </>
  )
}

export default App

import '@mantine/core/styles.css';

import store from './redux/store';
import { Provider } from 'react-redux';

import { createTheme, MantineProvider } from '@mantine/core';

import Planning from './screens/Planning'

import "./App.css"

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <>
      <Provider store={store}>
        <MantineProvider theme={theme}>
          <Planning />
        </MantineProvider>
      </Provider>
    </>
  )
}

export default App

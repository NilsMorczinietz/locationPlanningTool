import '@mantine/core/styles.css';

import { store, persistor } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";

import { createTheme, MantineProvider } from '@mantine/core';

import Planning from './screens/Planning.tsx'

import "./App.css"

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <>
      <Provider store={store}>
        <MantineProvider theme={theme}>
          <PersistGate loading={null} persistor={persistor}>
            <Planning />
          </PersistGate>
        </MantineProvider>
      </Provider>
    </>
  )
}

export default App

import React from 'react';
import { DatabaseProvider } from './context/DatabaseContext';
import MainApp from './components/MainApp';

function App() {
  return (
    <DatabaseProvider>
      <MainApp />
    </DatabaseProvider>
  );
}

export default App;

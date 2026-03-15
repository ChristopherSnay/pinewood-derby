import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Heats from './Heats';
import HeatDetails from './HeatDetails';
import Overall from './Overall';

function App() {

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          Pinewood Derby
        </Toolbar>
   
        </AppBar>
        <main className="container d-flex flex-wrap gap-5 mt-4">
          <Overall/>
          <Heats/>
          <HeatDetails/>

        </main>
    </>
  )
}

export default App

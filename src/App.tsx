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
          Pinewood Derby 2026
        </Toolbar>
      </AppBar>
      
      <main className="container d-flex flex-wrap gap-5 mt-4">
        <Overall />
        <Heats />
        <HeatDetails />
      </main>

      <footer>
        <div className="container text-center py-3">
          <small>
            Made by <a href="https://christophersnay.com" target="_blank" rel="noopener noreferrer">Christopher Snay</a>. Source code on <a href="https://github.com/christophersnay/pinewood-derby" target="_blank" rel="noopener noreferrer">GitHub</a>.
          </small>
        </div>
      </footer>
    </>
  )
}

export default App

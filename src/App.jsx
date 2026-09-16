import Allroutes from '../Allroutes'
import { ThemeProvider } from './context/ThemeContext'
import './styles/modern-overrides.css'

const App = () => {
  return (
    <ThemeProvider>
      <Allroutes />
    </ThemeProvider>
  )
}

export default App

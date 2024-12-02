import styles from './App.module.css'
import Header from '../../components/Header/Header.jsx'
import Menu from '../../components/Menu/Menu.jsx'
import {Outlet} from 'react-router-dom'

const App = () => {
  return (
    <>
      <Header/>
      <div className={styles.container}>
        <Menu/>
        <div className={styles.content}>
          <div className={styles.contentBox}>
            <Outlet/>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

import styles from './Header.module.css'
import Logo from '../SVGs/Logo/Logo.jsx'
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import useAuth from '../../hooks/useAuth.js'
import Search from '../SVGs/Search/Search.jsx'
import usePersistedState from '../../hooks/usePersistedState.js'
import Avatar from '../Avatar/Avatar.jsx'
import {useEffect} from 'react'

const searchLinks = [
  'users',
  'posts',
  'categories',
]

const searchParamName = {
  'users': 'login',
  'posts': 'title',
  'categories': 'title',
}

const Header = () => {
  const {user} = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const pathName1 = location.pathname.split('/')[1]
  const searchDefaultValue = searchParams.get(searchParamName[pathName1]) || ''
  const [search, setSearch] = usePersistedState(
    'search',
    searchDefaultValue
  )

  useEffect(() => {
      setSearch(searchDefaultValue)
  }, [location])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    if (searchLinks.includes(pathName1)) {
      if (search.length < 3) {
        searchParams.delete(searchParamName[pathName1])
      } else {
        searchParams.set(searchParamName[pathName1], search)
      }
      setSearchParams(searchParams)
    } else {
      navigate(`/posts?title=${search}`)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.box}>
        <Link to='/'>
          <Logo className={styles.logo}/>
        </Link>
        <form
          className={styles.search}
          onSubmit={handleSearchSubmit}
        >
          <Search className={styles.searchSVG} />
          <input
            className={styles.input}
            type="text"
            name='search'
            value={search}
            onChange={handleSearchChange}
            placeholder='Search...'
          />
        </form>
        {
          user
            ?
            <div className={styles.userBox}>
              <span className={styles.role}>{user.role}</span>
              <div className={styles.userInfo}>
                <span className={styles.login}>{user.login}</span>
                <Link className={styles.avatarBox} to={`/profile/${user.id}`}>
                  <Avatar name={user.profilePicture} />
                </Link>
              </div>
            </div>
            :
            <div className={styles.signLinks}>
              <Link className={styles.signLink} to='/signup'>
                <span className={styles.signLinkText}>Sign Up</span>
              </Link>
              <Link className={styles.signLink} to='/signin'>
                <span className={styles.signLinkText}>Sign In</span>
              </Link>
            </div>
        }
      </div>
    </header>
  )
}

export default Header

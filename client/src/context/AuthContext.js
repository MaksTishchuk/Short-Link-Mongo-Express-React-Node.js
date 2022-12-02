import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
  token: null,
  login: noop,
  logout: noop,
  userId: null,
  isAuthenticated: false
})

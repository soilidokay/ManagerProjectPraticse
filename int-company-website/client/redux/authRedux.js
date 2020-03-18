import { createActions, createReducer } from 'reduxsauce'

const INITIAL_STATE = { user: null }

const { Types, Creators } = createActions({
  updateUser: ['user']
})

Creators.getLoginUser = () => async (dispatch, getState, { authService }) => {
  const user = await authService.getLoginUser()
  dispatch(Creators.updateUser(user))
  return user
}

Creators.loginWithEmail = ({ email, password }) => async (
  dispatch,
  getState,
  { authService }
) => {
  try {
    const user = await authService.loginWithEmail({ email, password })
    dispatch(Creators.updateUser(user))
    return user
  } catch (e) {
    throw e
  }
}

Creators.signupWithEmail = ({ name, email, password }) => async (
  dispatch,
  getState,
  { authService }
) => {
  const user = await authService.signupWithEmail({ name, email, password })
  dispatch(Creators.updateUser(user))
  return user
}

Creators.logout = () => async (dispatch, getState, { authService }) => {
  await authService.logout()
  dispatch(Creators.updateUser(null))
}

Creators.updateAccountInfo = ({ name, email, preferredLanguage }) => async (
  dispatch,
  getState,
  { authService }
) => {
  await authService.updateAccountInfo({ name, email, preferredLanguage })
  dispatch(
    Creators.updateUser({
      ...getState().auth.user,
      name,
      email,
      preferredLanguage
    })
  )
}

Creators.updateAvatar = file => async (dispatch, getState, { authService }) => {
  const avatar = await authService.uploadAvatar(file)
  await authService.updateAvatar(avatar)
  dispatch(
    Creators.updateUser({
      ...getState().auth.user,
      avatar
    })
  )
}

function updateUser (state, action) {
  return { ...state, user: action.user }
}

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_USER]: updateUser
})

export default Creators

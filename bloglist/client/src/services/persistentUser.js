export const getUser = () => { 
  return JSON.parse(window.localStorage.getItem('loggedBlogappUser'));
}
export const saveUser = (user) => {
  return window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
}
export const removeUser = () => {
  return window.localStorage.removeItem('loggedBlogappUser')
}
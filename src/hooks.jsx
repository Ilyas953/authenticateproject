import { useState, useEffect } from "react"

 export function useUser(initial = []) {
  const [tabuser, setTabuser] = useState(initial)
  const [actualuser, setActualuser] = useState(null)

  useEffect(() =>{
    if (actualuser === null) return
    if (!actualuser) return 
    setTabuser(prev =>
  prev.map(user =>
    user.key === actualuser.key ? actualuser : user
  )
)
  },

  [actualuser])

    

  function createUser(user) {
    const newuser = {...user, key: Date.now()}
    setTabuser(prev => [...prev, newuser])
  }

  
  function connexion(type, name, pass) {

    if (type === 'deconnexion') {
      setActualuser(null)
    }
    if (type === 'connexion') {
      const user = tabuser.find(u=> {
     return u.password === pass && u.name === name

    })
    user ? setActualuser(user) : false

      
    }
    
    
  }
  function authenticate(pass, name) {
      const user = tabuser.find(u=> {
     return u.password === pass && u.name === name

    })
     return Boolean(user)
  }

  function editUser(prop, newValue) {
    setActualuser(prev => ({...prev, [prop]: newValue}))
  }

  function deleteUser() {
    setTabuser(prev => prev.filter(u => u.key !== actualuser.key))
    setActualuser(null)
    
  }

  return {
    tabuser,
    setTabuser,
    actualuser,
    setActualuser,
    connexion,
    authenticate,
    createUser,
    editUser,
    deleteUser
  }
}
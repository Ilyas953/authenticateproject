import { useState, useEffect } from "react"
import { supabase } from './supabaseclient' 

export function useUser(initial = []) {
  const [tabuser, setTabuser] = useState(initial)
  const [actualuser, setActualuser] = useState(null)

  // Charger les utilisateurs depuis Supabase au démarrage
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')

      if (error) {
        console.error('Erreur chargement utilisateurs', error)
      } else {
        setTabuser(data)
      }
    }

    fetchUsers()
  }, [])

  
  useEffect(() => {
    if (!actualuser) return

    setTabuser(prev =>
      prev.map(user =>
        user.key === actualuser.key ? actualuser : user
      )
    )

    const updateUser = async () => {
      const { error } = await supabase
        .from('users')
        .update(actualuser)
        .eq('key', actualuser.key)

      if (error) console.error('Erreur mise à jour utilisateur', error)
    }

    updateUser()
  }, [actualuser])

  // Ajouter un utilisateur
  async function createUser(user) {
  const newuser = { ...user, key: Date.now() }
  console.log("Nouvel utilisateur :", newuser)

  const { data, error } = await supabase.from('users').insert([newuser])

  if (error) {
    console.error('Erreur création utilisateur', error.message, error.details, error)
    return false
  } else {
    setTabuser(prev => [...prev, newuser])
    return true
  }
}
  // Connexion / déconnexion
  function connexion(type, name, pass) {
    if (type === 'deconnexion') {
      setActualuser(null)
    }
    if (type === 'connexion') {
      const user = tabuser.find(u => u.password === pass && u.name === name)
      if (user) setActualuser(user)
    }
  }

  // Authentification
  function authenticate(pass, name) {
    return Boolean(tabuser.find(u => u.password === pass && u.name === name))
  }

  // Modifier un utilisateur
  function editUser(prop, newValue) {
    setActualuser(prev => ({ ...prev, [prop]: newValue }))
  }

  // Supprimer un utilisateur
  function deleteUser() {
    if (!actualuser) return

    setTabuser(prev => prev.filter(u => u.key !== actualuser.key))
    supabase.from('users').delete().eq('key', actualuser.key).catch(err =>
      console.error('Erreur suppression utilisateur', err)
    )
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
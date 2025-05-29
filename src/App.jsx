import { useState, useContext, useEffect } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import './App.css'

import zoro from './assets/images.jpg'
import sanji from './assets/sanji-one-piece-manga.png'
import luffy from './assets/87fa286dcc4a40d418b25eb56266ea5e.jpg'

import { usercontext } from './usercontext'
import { rendercontext } from './usercontext'
import { useUser } from './hooks'
import { naruto, onePiece, bleach, dragonballz, attaqueDesTitans } from './donnees'
import ReCAPTCHA from 'react-google-recaptcha'

const imagetab = [zoro, sanji, luffy]

function Blocpassword({ creation, setCreation, tab, name, passwordgiver, setSuite }) {
  return (
    <button
      type='button'
      onClick={() => {
        setCreation(prev => ({ ...prev, password: passwordgiver(tab) }))
        setSuite(prev => prev + 1)
      }}
      className='px-4 py-2 m-2 bg-gray-800 text-white rounded shadow hover:bg-gray-700'
    >
      {name}
    </button>
  )
}

function Creation({ suite, setSuite }) {
  const [creation, setCreation] = useState({})
  const { tabuser, createUser } = useContext(usercontext)
  const [counter, setCounter] = useState(0)
  const [ready, setReady] = useState(false)
  const [captchaValid, setCaptchaValid] = useState(false)
  const {rendercond, setRendercond} = useContext(rendercontext)
  

  useEffect(()=> {
    setSuite(0)
    setCreation({})
    setSuite(0)
    setCounter(0)
    setReady(false)
    setCaptchaValid(false)
  },[rendercond])


  

  function passwordgiver(tableau) {
    const copy = [...tableau]
    const shuffled = copy.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 9)
    return selected.join(' ')
  }

  function handlesubmit(e) {

    if (!ready) {
      return
    }
    else {
    e.preventDefault()
    createUser(creation)
    setSuite(prev => prev + 1)
    setRendercond([])
    }
  }

  function resetall() {
    setCreation({})
    setSuite(0)
  }

  function renderstep() {
    switch (suite) {
      case 0:
        return (
          <div className='space-y-4'>
            <input
              type='text'
              onChange={e => setCreation(prev => ({ ...prev, name: e.target.value }))}
              value={creation.name || ''}
              placeholder='Entrez votre identifiant'
              className='p-2 border rounded text-white w-full'
            />
            <button type='button' onClick={() => setSuite(prev => prev + 1)} className='bg-blue-600 px-4 py-2 rounded text-white'>Valider</button>
          </div>
        )
      case 1:
        return (
          <div className='space-y-4'>
            <p className='font-semibold'>Choisissez votre manga préféré pour générer votre code secret</p>
            <div className='flex flex-wrap justify-center'>
              <Blocpassword {...{ creation, setCreation, passwordgiver, setSuite }} tab={onePiece} name='One Piece' />
              <Blocpassword {...{ creation, setCreation, passwordgiver, setSuite }} tab={naruto} name='Naruto' />
              <Blocpassword {...{ creation, setCreation, passwordgiver, setSuite }} tab={bleach} name='Bleach' />
              <Blocpassword {...{ creation, setCreation, passwordgiver, setSuite }} tab={attaqueDesTitans} name='Shingeki no Kyojin' />
              <Blocpassword {...{ creation, setCreation, passwordgiver, setSuite }} tab={dragonballz} name='Dragon Ball Z' />
            </div>
          </div>
        )
      case 2:
        return (
          <div className='space-y-4'>
            <button type='button' className='size-20 bg-green-500 ' onClick={() => navigator.clipboard.writeText(creation.password)}>copier</button>
            <p className='font-semibold'>Voici tes 9 personnages secrets :</p>
            <p className='italic'>{creation.password}</p>
            <p>Choisis ta photo de profil :</p>

            <div className='flex items-center gap-4'>
              <button onClick={() => setCounter(prev => prev === 0 ? 2 : prev - 1)} className='text-xl' type='button'><FaArrowLeft /></button>
              <img src={imagetab[counter]} className='w-20 h-20 rounded-full border-2 border-white' alt='profil possible' />
              <button onClick={() => setCounter(prev => prev === 2 ? 0 : prev + 1)} className='text-xl' type='button'><FaArrowRight /></button>
              <ReCAPTCHA 
                sitekey='6LcKXk4rAAAAAEgicpS2T8kDL0h25a_eoNdJnfPk'
                onChange={() => setCaptchaValid(true)}
                theme='dark'
                
            />
            </div>
            
            <button
              type='button'
              onClick={() => {setCreation(prev => ({ ...prev, picture: imagetab[counter] })); setReady(true)}}
              className='bg-green-600 px-4 py-2 rounded text-white'
            >
              Choisir cette image
            </button>
          <button type='submit' className={`px-4 py-2 rounded text-white ${ready && captchaValid ? 'bg-blue-500' : 'bg-blue-950 opacity-35'}`}>Tout valider</button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='space-y-4'>
      <form onSubmit={handlesubmit}>{renderstep()}</form>

      {suite === 3 && tabuser.map((u, index) => (
        <div key={index} className='my-4 bg-gray-700 p-4 rounded'>
          {Object.entries(u).map(([key, value]) => (
            <p key={key}>Votre {key} : {value}</p>
          ))}
        </div>
      ))}

      {suite === 3 && <button onClick={resetall} className='bg-red-600 px-4 py-2 rounded text-white'>Tout reset</button>}
    </div>
  )
}

function Login() {
  const { authenticate, connexion } = useContext(usercontext)
  const [name, setName] = useState('')
  const [pass, setPass] = useState('')
  const [phrase, setPhrase] = useState(undefined)

  function test(name, pass) {
    if (authenticate(pass, name)) {
      connexion('connexion', name, pass)
      setPhrase('Connexion réussie avec succès')
    } else {
      setPhrase('Identifiants incorrects')
    }
  }

  return (
    <div className='space-y-4'>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder='Identifiant' className='p-2 border rounded text-white w-full' />
      <input type="text" value={pass} onChange={e => setPass(e.target.value)} placeholder='Code secret' className='p-2 border rounded text-white w-full' />
      <button onClick={() => test(name, pass)} className='bg-blue-500 px-4 py-2 rounded text-white'>Se connecter</button>
      {phrase && <p>{phrase}</p>}
    </div>
  )
}

function Userinfo() {
  const { actualuser, connexion } = useContext(usercontext)

  return (
    <>
      {actualuser && (
        <div className='text-center space-y-2'>
          <p className='text-xl font-bold'>{actualuser.name}</p>
          <img src={actualuser.picture} alt='photo de profil' className='w-24 h-24 rounded-full mx-auto' />
          <button onClick={() => connexion('deconnexion')} className='bg-red-600 px-4 py-2 rounded text-white'>Se déconnecter</button>
        </div>
      )}
    </>
  )
}

function Blocshow({name, id, picture}) {
  const {deleteUser, tabuser} = useContext(usercontext)
  

  function handleclick() {
    deleteUser(id)
  }
  return(
    <>
    <div className='border-white shadow-xs bg-slate-800'>
      
      <h2>{name}</h2>
      <img src={picture} className='w-20 h-20 rounded-full' />
      <p>la key personnel du compte est {id}</p>
      <button onClick={handleclick}>supprimer</button>


    </div>
    </>
  )
}

function Show() {
  const {tabuser} = useContext(usercontext)

  return (
    <>
    {tabuser.map(u => (
      <Blocshow key={u.key} name={u.name} id={u.key} picture={u.picture} />
    ))}
    </>
  )
}

function App() {
  const user = useUser()
  const [rendercond, setRendercond] = useState([])
  const [suite, setSuite] = useState(0)

  function isrendering(toggle) {
    return rendercond.includes(toggle)
  }

 

  return (
    <usercontext.Provider value={user}>
      <rendercontext.Provider value={{ rendercond, setRendercond, isrendering }}>
        <div className='bg-gray-800 min-h-screen w-full text-white p-10'>
          <div className='max-w-3xl mx-auto space-y-6'>
            <Userinfo />
            <div className='flex gap-4 justify-center'>
              <button onClick={() => setRendercond(['creation'])} className='bg-yellow-600 px-4 py-2 rounded text-white'>S'inscrire</button>
              <button onClick={() => setRendercond(['login'])} className='bg-teal-600 px-4 py-2 rounded text-white'>Se connecter</button>
              <button onClick={() => setRendercond(['show'])} className='bg-red-800 px-4 py-2 rounded text-white'>voir les comptes crees</button>

            </div>
            {isrendering('creation') && <Creation suite={suite} setSuite={setSuite} />}
            {isrendering('login') && <Login />}
            {isrendering('show') && <Show />}
          </div>
        </div>
      </rendercontext.Provider>
    </usercontext.Provider>
  )
}

export default App

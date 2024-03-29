import { useState } from 'react'
import { supabase } from 'lib/Store'

const Home = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (type, username, password) => {
    try {
      const { error, user } =
        type === 'LOGIN'
          ? await supabase.auth.signIn({ email: username, password })
          : await supabase.auth.signUp({ email: username, password })
      // If the user doesn't exist here and an error hasn't been raised yet,
      // that must mean that a confirmation email has been sent.
      // NOTE: Confirming your email address is required by default.
      if (error) {
        alert('Error with auth: ' + error.message)
      } else if (!user) alert('Signup successful, confirmation mail should be sent soon!')
    } catch (error) {
      console.log('error', error)
      alert(error.error_description || error)
    }
  }

  return (
    <div className="w-full h-full flex justify-center items-center p-4">
      <title>koyu.space Chat</title>
      <link rel="shortcut icon" href="https://koyu.space/favicon.ico" />
      <img src="https://koyu.space/img/pb-icon.svg" height="128" alt="Logo" /><span className="logo">Chat</span>
      <div className="w-full sm:w-1/2 xl:w-1/3">
        <div className="border-teal p-8 border-t-12 mb-6">
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">Email</label>
            <input
              type="text"
              className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Your e-mail"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">Password</label>
            <input
              type="password"
              className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <a
              onClick={(e) => {
                e.preventDefault()
                handleLogin('SIGNUP', username, password)
              }}
              href={'/channels'}
              className="btn"
            >
              Sign up
            </a>
            <a
              onClick={(e) => {
                e.preventDefault()
                handleLogin('LOGIN', username, password)
              }}
              href={'/channels'}
              className="btn"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

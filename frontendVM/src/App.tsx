import {  StrictMode, useContext, useEffect, useState } from "react"
import Homepage from "./Homepage";
import { LoginContext, PopupContext } from "./context";
import type { Website } from "./vite-env";


export default function BaseApplication() { 
  const [login, setLogin] = useState<string | null>(null);
  const [website, setWebsite] = useState<Website | null>(null);


  return ( 
    <StrictMode>
      <LoginContext.Provider value={{login, setLogin}}>
        <PopupContext value={{website, setWebsite}}>
          <App/>
        </PopupContext>
      </LoginContext.Provider>
      

    </StrictMode>
  )
}


function App() { 
  const {login, setLogin} = useContext(LoginContext);
  const {website} = useContext(PopupContext);
  const getAuth = async (token: string) => { 
    const request = await fetch(`http://${import.meta.env.VITE_API_VM_IP}:3000/decodeJWT`, { 
      method: "POST", body: JSON.stringify({token}), headers: { 'Content-Type': 'application/json'}
    })
    const {username} = await request.json();
    setLogin(username);
  }
  useEffect(() => { 
    const token = localStorage.getItem("token");
    if (token) { 
      getAuth(token)
    } else { 
      setLogin("");
    }
  },[])

  return ( 
    <div className="h-full absolute top-0 left-0 w-full flex  justify-center items-center ">
      {login == null && <h1>Loading.....</h1>}
      {login == "" && <LoginForm />}
      {login != null && login != "" && <Homepage/>}
      <svg preserveAspectRatio="none" className="absolute w-full h-full top-0 left-0 -z-10" viewBox="0 0 200 200">
          <path fill="blue" d="M 200 0 l 0 200 l -200 0 "/>
      </svg>
      {website && <Popup/>}
    </div>
  )
}

const LoginForm = () => { 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUp, setSignUp] = useState(false);
  const {setLogin} = useContext(LoginContext);
  const loginRequest =  async () => { 
    if (!username || !password) return 

    const request = await fetch(`http://${import.meta.env.VITE_API_VM_IP}:3000/signIn`, { 
      method: "POST", headers: { "Content-Type": 'application/json'},
      body: JSON.stringify({username, password})
    })
    if (request.status == 202) {
      const {token} = await request.json();
      localStorage.setItem('token', token)
      setLogin(username)
    }
  }
  const signUpFunction =  async () => { 
    if (!username || !password || !confirmPassword) return
    const request = await fetch(`http://${import.meta.env.VITE_API_VM_IP}:3000/signUp`, { 
      method: "POST", headers: { 'Content-Type': "application/json"},
      body: JSON.stringify({username, password})
    })
    if (request.status == 202) { 
      const {token} = await request.json();
      localStorage.setItem('token', token);
      setLogin(username)
    }
  }
  return ( 
    <div className="border-white border-2 backdrop-blur-2xl flex flex-col items-center justify-center h-1/2 w-1/4 -translate-y-1/6  p-4 text-2xl rounded-xl">
      <h1 className="text-white">Welcome</h1>
      <input placeholder="Username" className="outline-0 border-transparent p-2 rounded-xl border-2 focus:border-white" onChange={(e) => setUsername(e.target.value)} value={username}/>
      <input type='password' placeholder="Password" className="outline-0 border-transparent p-2 rounded-xl border-2 focus:border-white" onChange={(e) => setPassword(e.target.value)} value={password}/> 
      {signUp && <input type="password" placeholder="Confirm Password" className="outline-0 border-transparent p-2 rounded-xl border-2 focus:border-white" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/> }
      <button onClick={() => signUp ? signUpFunction() : loginRequest()} type="button" className={`border-2 px-2 py-4 bg-blue-600 rounded-xl mt-6
          ${(username && password && (signUp ? confirmPassword == password : true)) ? "cursor-pointer opacity-100 hover:scale-[1.1] transition-all duration-100" : "opacity-40 pointer-events-none"}
        `}>{signUp ? "Sign up" : "Login here"}</button>
      {!signUp && <button onClick={() => setSignUp(true)} className="text-sm mt-5 cursor-pointer">Don't have an account? Sign up here</button>}
      {signUp && <button onClick={() => setSignUp(false)} className="text-sm mt-5 cursor-pointer">Back to login</button>}
    </div>
  )
}

const Popup = () => { 
  const {website, setWebsite} = useContext(PopupContext);
  useEffect(() => { 
    document.addEventListener("keydown", ({code}) => { 
      if (code == "Escape") setWebsite(null)
    })
  },[])
  return ( 
    <div className="w-full h-full flex justify-center items-center top-0 left-0 absolute z-50 backdrop-blur-2xl">
      <div id="popupContent" className="w-2/3 bg-gray-500 px-12 py-6 rounded-xl border-white border-2 ">
        <div className="flex mx-auto justify-around w-1/4 items-center">
          <img src={website?.favicon}/>
          <h2>{website?.name}</h2>
        </div>
        <p>{website?.summary}</p>
      </div>
    </div>
  )
}
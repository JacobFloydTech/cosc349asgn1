import {  StrictMode, useContext, useEffect, useState } from "react"
import Homepage from "./Homepage";
import { LoginContext } from "./context";


export default function BaseApplication() { 
  const [login, setLogin] = useState<string | null>(null);


  return ( 
    <StrictMode>
      <LoginContext.Provider value={{login, setLogin}}>
        <App/>
      </LoginContext.Provider>

    </StrictMode>
  )
}
function App() { 
  const {login, setLogin} = useContext(LoginContext);
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
    </div>
  )
}

const LoginForm = () => { 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
  return ( 
    <div className="border-white border-2 flex flex-col items-center justify-center h-1/3 -translate-y-1/3 p-4 text-2xl rounded-xl">
      <h1 className="text-white">Welcome</h1>
      <input placeholder="Username" className="outline-0 border-transparent p-2 rounded-xl border-2 focus:border-white" onChange={(e) => setUsername(e.target.value)} value={username}/>
      <input placeholder="Password" className="outline-0 border-transparent p-2 rounded-xl border-2 focus:border-white" onChange={(e) => setPassword(e.target.value)} value={password}/> 
      <button onClick={loginRequest} type="button" className="hover:cursor-pointer">Login here</button>
    </div>
  )
}
import { useEffect, useState } from "react"

export default function App() { 
  const [login, setLogin] = useState<string | null>(null);
  useEffect(() => { 
    const login = localStorage.getItem("login") || "";
    setLogin(login)
  },[])
  return ( 
    <div className="h-full absolute top-0 left-0 w-full flex  justify-center items-center ">
      {login == null && <h1>Loading.....</h1>}
      {login == "" && <LoginForm login={login}/>}
    </div>
  )
}

const LoginForm = ({login}: {login: string | null}) => { 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginRequest =  async () => { 
    
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
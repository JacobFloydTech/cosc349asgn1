import { useContext, useEffect, useState } from "react"
import { LoginContext } from "./context"
import type { Website } from "./vite-env";

export default function Homepage() { 
    return ( 
        <div className="relative h-full grid grid-cols-[20%_80%]  w-full">
            <Sidebar/>
            <Search/>
        </div>
    )
}

function Sidebar() { 
    const {login, setLogin} = useContext(LoginContext);
    const [websites, setWebsites] = useState<Website[]>([]);
    const [add, setAdd] = useState<boolean>(true);
    const getWebsites = async () => { 
        if (!login) return
        const request = await fetch("http://localhost:3000/getUserWebsites", { 
            headers: { username: login}
        })
        const {results} = await request.json()
        setWebsites(results)
    }
    const logout = () => { 
        localStorage.removeItem("token");
        setLogin("")
    }
    useEffect(() => { 
        getWebsites();
        document.addEventListener("keydown", ({code}) => { 
            if (code == "Escape") { 
                setAdd(false)
            }
        })  
    },[])
    return ( 
        <div className="border-2 flex flex-col justify-between text-white border-white">
            <div>
                <div className="flex justify-around items-center">
                    <p className="text-xl">Logged in as: {login}</p>
                    <button onClick={logout} className="h-32 w-32 cursor-pointer">
                        <LogoutSVG/>
                    </button>
                </div>
                {websites.map(e => { 
                    return ( 
                        <div>
                            <p>{e.name}</p>
                            <p className="text-sm text-gray-500">{e.link}</p>
                        </div>
                    )
                })}

            </div>
            <button onClick={() => setAdd(true)} className="flex p-4 border-2 cursor-pointer justify-center">
                <AddSVG/>
                {add && <AddWebsite/>} 
            </button>
        </div>
    )
}

function AddWebsite() {
    const [link, setLink] = useState("");
    const uploadWebsite = async () => { 
        const token = localStorage.getItem("token");
        if (link == "" || !token) return
        const request = await fetch("http://localhost:3000/generateWebsiteSummary", { 
            method: "POST",
            body: JSON.stringify({link, token}),
            headers: { 'Content-Type': 'application/json'}
        })
        console.log(request.status);
    }
    return ( 
        <div className="absolute flex justify-center items-center cursor-auto z-50 w-full h-full top-0 left-0 bg-transparent backdrop-blur-md">
            <div className="bg-gray-400 flex space-y-2 p-12 border-2 text-xl border-white rounded-xl flex-col text-white">
                <h1>Enter the link to upload</h1>
                <input className="outline-none border-b-black border-b-2" value={link} onChange={(e) => setLink(e.target.value)} type="text"/>
                <button className="mt-4 cursor-pointer border-2 border-black bg-blue-500 p-4 rounded-xl" onClick={uploadWebsite}>Generate Entry</button>
            </div>
        </div>
    )
}

function Search() { 
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Website[]>([]);
    useEffect(() => { 
        if (query == "") {
            setSearchResults([]);
        } else { 
            searchDatabase()
        }
        
    },[setQuery, query])
    const searchDatabase =async () => { 
        const request = await fetch("http://localhost:3000/query", { headers: { query}})
        const {results} = await request.json();

        setSearchResults(results)
    }

    return ( 
        <div className="border-2 w-full h-full flex-col flex items-center relative border-white">
            <div className="flex flex-col w-1/3 h-2/3 mt-10 border-2 border-red-300 ">
                <input className="outline-white h-14 p-2 rounded-md text-4xl text-white border-2" onChange={(e) => setQuery(e.target.value)} value={query} placeholder="Search here"/>
                <div>
                    {searchResults.map(e => { 
                        return ( 
                            <Link website={e}/>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

function Link({website}: { website: Website}) { 
    return ( 
        <div>
            {website.name}
        </div>
    )
}

function AddSVG() { 
    return ( 
        <svg width="75" height="75" viewBox="0 0 200 200" >
            <line stroke="black" stroke-width="20" stroke-linecap="round" x1="100" x2="100" y1="25" y2="175" />
            <line stroke="black" stroke-width="20" stroke-linecap="round" x1="25" x2="175" y1="100" y2="100"/>
        </svg>
    )
}



//Source: https://www.svgrepo.com/svg/425436/logout, License: https://www.svgrepo.com/page/licensing/
function LogoutSVG () { 
    return ( 
        <svg fill="#000000" className="w-full h-full" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 -50 500 500" enable-background="new 0 0 500 500"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g  stroke="white" fill="white" id="SVGRepo_iconCarrier"> <g> <path  d="M250,224c-4.4,0-8,3.6-8,8v24c0,4.4-3.6,8-8,8h-40c-4.4,0-8-3.6-8-8V144c0-4.4,3.6-8,8-8h40c4.4,0,8,3.6,8,8v24 c0,4.4,3.6,8,8,8s8-3.6,8-8v-24c0-13.2-10.8-24-24-24h-40c-13.2,0-24,10.8-24,24v112c0,13.2,10.8,24,24,24h40c13.2,0,24-10.8,24-24 v-24C258,227.6,254.4,224,250,224z"></path> <path d="M328.4,204.8c0.1-0.1,0.2-0.2,0.3-0.3c0,0,0,0,0-0.1c0.1-0.2,0.2-0.4,0.3-0.6c0.1-0.3,0.3-0.5,0.4-0.8 c0.1-0.3,0.2-0.5,0.3-0.8c0.1-0.2,0.2-0.4,0.2-0.7c0.2-1,0.2-2.1,0-3.1c0,0,0,0,0,0c0-0.2-0.1-0.4-0.2-0.7 c-0.1-0.3-0.1-0.5-0.2-0.8c0,0,0,0,0,0c-0.1-0.3-0.3-0.5-0.4-0.8c-0.1-0.2-0.2-0.4-0.3-0.6c-0.3-0.4-0.6-0.9-1-1.2l-32-32 c-3.1-3.1-8.2-3.1-11.3,0c-3.1,3.1-3.1,8.2,0,11.3l18.3,18.3H210c-4.4,0-8,3.6-8,8s3.6,8,8,8h92.7l-18.3,18.3 c-3.1,3.1-3.1,8.2,0,11.3c1.6,1.6,3.6,2.3,5.7,2.3s4.1-0.8,5.7-2.3l32-32c0,0,0,0,0,0C327.9,205.4,328.1,205.1,328.4,204.8z"></path> </g> </g></svg>
    )
}
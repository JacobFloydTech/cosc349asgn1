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
    const {login} = useContext(LoginContext);
    const [websites, setWebsites] = useState<Website[]>([]);
    const getWebsites = async () => { 
        if (!login) return
        const request = await fetch("http://localhost:3000/getUserWebsites", { 
            headers: { username: login}
        })
        const {results} = await request.json()
        setWebsites(results)
    }
    useEffect(() => { 
        getWebsites();
    },[])
    return ( 
        <div className="border-2 border-white">
            {websites.map(e => { 
                return ( 
                    <div>
                        <p>{e.name}</p>
                        <p className="text-sm text-gray-500">{e.link}</p>
                    </div>
                )
            })}
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
        <div className="border-2 border-white">
            <input className="outline-white text-4xl text-gray-100 border-2" onChange={(e) => setQuery(e.target.value)} value={query} placeholder="Search here"/>
            {searchResults.map(e => { 
                return ( 
                    <div>{e.name}</div>
                )
            })}
        </div>
    )
}
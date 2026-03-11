import { useEffect, useState } from "react"

export default function InstallApp(){

  const [prompt,setPrompt] = useState(null)

  useEffect(()=>{

    window.addEventListener("beforeinstallprompt",(e)=>{
      e.preventDefault()
      setPrompt(e)
    })

  },[])

  const install = ()=>{

    prompt.prompt()

  }

  if(!prompt) return null

  return(

    <button
    onClick={install}
    className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded"
    >
      Install App
    </button>

  )

}
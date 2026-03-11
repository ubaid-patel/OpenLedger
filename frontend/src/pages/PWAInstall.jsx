import { useEffect, useState } from "react"

export default function PWAInstall(){

  const [prompt,setPrompt] = useState(null)
  const [visible,setVisible] = useState(false)

  useEffect(()=>{

    const handler = (e)=>{

      e.preventDefault()

      setPrompt(e)
      setVisible(true)

    }

    window.addEventListener("beforeinstallprompt",handler)

    return ()=>window.removeEventListener("beforeinstallprompt",handler)

  },[])

  const install = async()=>{

    if(!prompt) return

    prompt.prompt()

    const result = await prompt.userChoice

    if(result.outcome==="accepted"){
      console.log("PWA installed")
    }

    setVisible(false)
  }

  if(!visible) return null

  return(

    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg border rounded-xl px-4 py-3 flex items-center gap-3 z-50">

      <span className="text-sm">
        Install this app for a better experience
      </span>

      <button
        onClick={install}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
      >
        Install
      </button>

    </div>

  )

}
import { useEffect, useState } from "react"

export default function PWAInstall() {

  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {

    // don't show if user disabled earlier
    const dismissed = localStorage.getItem("pwa-install-dismissed")

    if (dismissed === "true") return

    const handler = (e) => {

      e.preventDefault()

      setPrompt(e)
      setVisible(true)

    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }

  }, [])


  const install = async () => {

    if (!prompt) return

    prompt.prompt()

    const result = await prompt.userChoice

    if (result.outcome === "accepted") {
      console.log("PWA installed")
    }

    setVisible(false)

  }


  const close = () => {
    setVisible(false)
  }


  const dontAskAgain = () => {

    localStorage.setItem("pwa-install-dismissed", "true")

    setVisible(false)

  }


  if (!visible) return null


  return (

    <div
      className="
        fixed bottom-24 left-1/2 -translate-x-1/2
        bg-white/95 backdrop-blur-xl
        border border-gray-200
        shadow-lg
        rounded-xl
        px-4 py-3
        flex items-center gap-3
        z-50
        max-w-[92%]
      "
    >

      {/* message */}

      <span className="text-sm text-gray-700 whitespace-nowrap">
        Install this app for a better experience
      </span>


      {/* install button */}

      <button
        onClick={install}
        className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-3 py-1
          rounded-md
          text-sm
          font-medium
          transition
        "
      >
        Install
      </button>


      {/* close button */}

      <button
        onClick={close}
        className="
          text-gray-400
          hover:text-gray-700
          text-lg
          leading-none
          transition
        "
      >
        ×
      </button>


      {/* don't ask again */}

      <button
        onClick={dontAskAgain}
        className="
          text-xs
          text-gray-500
          hover:text-gray-700
          underline
          ml-1
        "
      >
        Don't ask again
      </button>

    </div>

  )

}
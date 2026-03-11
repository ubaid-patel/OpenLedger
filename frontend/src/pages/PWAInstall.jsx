import { useEffect, useState } from "react"

export default function PWAInstall() {

  const [prompt, setPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {

    // hide if user disabled
    if (localStorage.getItem("pwa-install-dismissed") === "true") return

    // hide if already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true

    if (isStandalone) return

    const handler = (e) => {

      e.preventDefault()

      setPrompt(e)

      // slight delay feels more natural
      setTimeout(() => {
        setVisible(true)
      }, 3000)

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
        shadow-xl
        rounded-xl
        px-4 py-3
        z-50
        w-[92%]
        max-w-sm
      "
    >

      {/* message */}

      <p className="text-sm text-gray-700 text-center">
        Install this app for a better experience
      </p>


      {/* buttons */}

      <div className="flex justify-center gap-2 mt-3 flex-wrap">

        <button
          onClick={install}
          className="
            bg-blue-600 hover:bg-blue-700
            text-white text-sm
            px-3 py-1.5
            rounded-md
            font-medium
          "
        >
          Install
        </button>

        <button
          onClick={close}
          className="
            text-gray-500 hover:text-gray-700
            text-sm px-3 py-1.5
            border rounded-md
          "
        >
          Close
        </button>

        <button
          onClick={dontAskAgain}
          className="
            text-xs text-gray-500
            underline
            px-2 py-1
          "
        >
          Don't ask again
        </button>

      </div>

    </div>

  )

}
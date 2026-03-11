import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

export default function Layout({ children }) {

  const location = useLocation()
  const [open, setOpen] = useState(false)

  const nav = [
    { name: "Dashboard", path: "/", icon: "🏠" },
    { name: "Expenses", path: "/expenses", icon: "💸" },
    { name: "Collections", path: "/collections", icon: "📥" },
    { name: "Admin", path: "/admin", icon: "🛠" },
    { name: "Forms", path: "/forms", icon: "📝" }
  ]

  return (

    <div className="min-h-screen bg-gray-100 flex">

      {/* Desktop Sidebar */}

      <aside className="hidden md:block w-64 bg-white shadow-lg">

        <div className="p-6 border-b font-bold text-lg">
          OpenLedger
        </div>

        <nav className="p-4 space-y-2">

          {nav.map((n) => (

            <Link
              key={n.path}
              to={n.path}
              className={`block px-4 py-2 rounded-lg transition
              ${location.pathname === n.path
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              {n.name}
            </Link>

          ))}

        </nav>

      </aside>


      {/* Main Area */}

      <div className="flex-1 flex flex-col">

        {/* Mobile Topbar */}

        <header className="md:hidden sticky top-0 bg-white shadow flex items-center justify-between p-4 z-50">

          <button
            onClick={() => setOpen(!open)}
            className="text-xl active:scale-90 transition"
          >
            ☰
          </button>

          <h1 className="font-bold">
            OpenLedger
          </h1>

          <div></div>

        </header>


        {/* Mobile Drawer */}

        {open && (

          <div className="md:hidden bg-white shadow-lg border-b">

            {nav.map((n) => (

              <Link
                key={n.path}
                to={n.path}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 border-b transition
                ${location.pathname === n.path
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                  }`}
              >
                {n.name}
              </Link>

            ))}

          </div>

        )}


        {/* Content */}

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>


        {/* Footer */}

        <footer className="flex justify-center my-10 md:my-12">

          <a
            href="https://github.com/ubaid-patel"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-xs text-gray-500 
               bg-white/70 backdrop-blur-md border border-gray-200 
               px-4 py-2 rounded-full shadow-sm
               hover:shadow-md hover:border-gray-300
               transition-all duration-300"
          >

            <span className="text-yellow-500">⚡</span>

            <span>
              Built with <span className="text-red-500">❤️</span> by
            </span>

            <span className="font-semibold text-gray-700 group-hover:text-black transition">
              ubaid-patel
            </span>

          </a>

        </footer>


        {/* Native Style Bottom Navigation */}

        {/* Native Style Bottom Navigation */}

        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50">

          <div className="bg-white/90 backdrop-blur-xl border-t shadow-lg flex justify-between items-center px-1 pb-[env(safe-area-inset-bottom)]">

            {nav.map((n) => {

              const active = location.pathname === n.path

              return (

                <Link
                  key={n.path}
                  to={n.path}
                  className={`relative flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200
          ${active ? "text-blue-600" : "text-gray-500"}
          `}
                >

                  {/* Active indicator */}

                  <span
                    className={`absolute top-0 h-[3px] w-6 rounded-full bg-blue-600 transition-all duration-300
            ${active ? "opacity-100 scale-100" : "opacity-0 scale-50"}
            `}
                  />

                  {/* Icon */}

                  <span className={`text-xl transition-transform ${active ? "scale-110" : ""}`}>
                    {n.icon}
                  </span>

                  {/* Small Label */}

                  <span className="text-[10px] leading-none mt-1">
                    {n.name}
                  </span>

                </Link>

              )

            })}

          </div>

        </nav>
      </div>

    </div>

  )

}
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

export default function Layout({ children }) {

  const location = useLocation()
  const [open, setOpen] = useState(false)

  const nav = [
    { name: "Dashboard", path: "/" },
    { name: "Expenses", path: "/expenses" },
    { name: "Collections", path: "/collections" },
    { name: "Admin", path: "/admin" }
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


        {/* Mobile Drawer Menu */}

        {open && (

          <div className="md:hidden bg-white shadow-lg border-b animate-[fadein_.25s_ease]">

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

        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>


        {/* Footer Credit */}

        <footer className="flex justify-center my-10 md:my-12 pb-16 md:pb-6">

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


        {/* Floating Bottom Nav */}

        <nav className="md:hidden fixed bottom-[env(safe-area-inset-bottom)] left-1/2 -translate-x-1/2 mb-3 z-50">

          <div className="bg-white/80 backdrop-blur-lg shadow-xl border border-gray-200 rounded-full px-5 py-2 flex gap-6 transition-all duration-300 ease-out animate-[navin_.4s_ease]">

            {nav.map((n) => {

              const active = location.pathname === n.path

              return (

                <Link
                  key={n.path}
                  to={n.path}
                  className={`relative text-sm px-2 py-1 transition-all duration-200 active:scale-90
                  ${active
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >

                  {n.name}

                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
                  )}

                </Link>

              )

            })}

          </div>

        </nav>

      </div>

    </div>

  )

}
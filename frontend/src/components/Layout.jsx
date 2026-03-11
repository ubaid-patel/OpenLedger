import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import {
  LayoutDashboard,
  Receipt,
  HandCoins,
  ShieldCheck,
  FileText
} from "lucide-react"

export default function Layout({ children }) {

  const location = useLocation()
  const [open, setOpen] = useState(false)

  const nav = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: Receipt,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      name: "Collections",
      path: "/collections",
      icon: HandCoins,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      name: "Admin",
      path: "/admin",
      icon: ShieldCheck,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      name: "Forms",
      path: "/forms",
      icon: FileText,
      color: "text-violet-600",
      bg: "bg-violet-50"
    }
  ]

  return (

    <div className="min-h-screen bg-gray-100 flex">

      {/* Desktop Sidebar */}

      <aside className="hidden md:block w-64 bg-white shadow-lg">

        <div className="p-6 border-b font-bold text-lg">
          OpenLedger
        </div>

        <nav className="p-4 space-y-2">

          {nav.map((n) => {

            const Icon = n.icon

            return (

              <Link
                key={n.path}
                to={n.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${location.pathname === n.path
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                  }`}
              >

                <Icon size={18} />

                {n.name}

              </Link>

            )

          })}

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

            {nav.map((n) => {

              const Icon = n.icon

              return (

                <Link
                  key={n.path}
                  to={n.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-b transition
                  ${location.pathname === n.path
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100"
                    }`}
                >

                  <Icon size={18} />

                  {n.name}

                </Link>

              )

            })}

          </div>

        )}


        {/* Content */}

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>


        {/* Footer */}

        <footer className="flex justify-center my-10 md:my-12 mb-20">

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


        {/* Mobile Bottom Navigation */}

        <nav className="md:hidden fixed bottom-0 left-0 w-full z-50">

          <div className="
            bg-white/90 backdrop-blur-xl
            border-t border-gray-200
            flex justify-between items-center
            px-2
            pb-[env(safe-area-inset-bottom)]
          ">

            {nav.map((n) => {

              const active = location.pathname === n.path
              const Icon = n.icon

              return (

                <Link
                  key={n.path}
                  to={n.path}
                  className="relative flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200"
                >

                  {active && (
                    <span className={`absolute inset-x-2 top-1 bottom-1 rounded-xl ${n.bg} -z-10`} />
                  )}

                  <Icon
                    size={20}
                    strokeWidth={2}
                    className={`${active ? n.color : "text-gray-500"} transition`}
                  />

                  <span
                    className={`text-[11px] mt-1 font-medium tracking-tight ${active ? n.color : "text-gray-500"
                      }`}
                  >
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
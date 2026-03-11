import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function AdminDashboard(){

  const navigate = useNavigate()

  const [password,setPassword] = useState("")
  const [authorized,setAuthorized] = useState(false)
  const [error,setError] = useState("")

  useEffect(()=>{

    const saved = localStorage.getItem("admin_auth")

    if(saved==="true"){
      setAuthorized(true)
    }

  },[])

  const login = ()=>{

    if(password === "595"){

      localStorage.setItem("admin_auth","true")
      setAuthorized(true)

    }else{

      setError("Wrong password")

      setTimeout(()=>setError(""),2000)

    }

  }

  const logout = ()=>{

    localStorage.removeItem("admin_auth")
    setAuthorized(false)

  }

  /* ---------- LOGIN SCREEN ---------- */

  if(!authorized){

    return(

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

        <motion.div
          initial={{ opacity:0, scale:0.95 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.35 }}
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm space-y-4"
        >

          <h2 className="text-xl font-bold text-center">
            Admin Login
          </h2>

          <p className="text-sm text-gray-500 text-center">
            Enter password to access dashboard
          </p>

          <input
            type="password"
            placeholder="Admin password"
            className="border rounded-lg w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          {error && (

            <motion.p
              initial={{ x:-10 }}
              animate={{ x:[-10,10,-10,0] }}
              className="text-red-500 text-sm"
            >
              {error}
            </motion.p>

          )}

          <motion.button
            whileTap={{ scale:0.96 }}
            whileHover={{ scale:1.02 }}
            onClick={login}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition"
          >
            Login
          </motion.button>

        </motion.div>

      </div>

    )

  }

  /* ---------- DASHBOARD ---------- */

  return(

    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <motion.div
        initial={{ y:-30, opacity:0 }}
        animate={{ y:0, opacity:1 }}
        transition={{ duration:0.4 }}
        className="bg-white shadow-sm sticky top-0 z-10"
      >

        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">

          <h1 className="text-lg md:text-xl font-bold">
            Admin Dashboard
          </h1>

          <motion.button
            whileTap={{ scale:0.9 }}
            whileHover={{ scale:1.05 }}
            onClick={logout}
            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg"
          >
            Logout
          </motion.button>

        </div>

      </motion.div>

      {/* CONTENT */}

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden:{opacity:0},
          visible:{
            opacity:1,
            transition:{ staggerChildren:0.08 }
          }
        }}
        className="max-w-5xl mx-auto px-4 py-6"
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* CARD */}

          <DashboardCard
            title="Manage Forms"
            desc="View and manage public forms"
            onClick={()=>navigate("/admin/forms")}
          />

          <DashboardCard
            title="Create Form"
            desc="Generate a new collection form"
            onClick={()=>navigate("/admin/forms/create")}
          />

          <DashboardCard
            title="Add Expense"
            desc="Record a new expense entry"
            onClick={()=>navigate("/admin/expenses/new")}
          />

          <DashboardCard
            title="View Dashboard"
            desc="Open finance dashboard"
            onClick={()=>navigate("/")}
          />

        </div>

      </motion.div>

    </div>

  )

}

/* ---------- DASHBOARD CARD ---------- */

function DashboardCard({title,desc,onClick}){

  return(

    <motion.div
      onClick={onClick}
      whileHover={{ y:-4 }}
      whileTap={{ scale:0.97 }}
      initial={{ opacity:0, y:20 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.35 }}
      className="bg-white border shadow-sm rounded-xl p-5 cursor-pointer hover:shadow-lg transition"
    >

      <div className="text-lg font-semibold mb-1">
        {title}
      </div>

      <div className="text-sm text-gray-500">
        {desc}
      </div>

    </motion.div>

  )

}
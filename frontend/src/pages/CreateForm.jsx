import { useState,useEffect } from "react"
import { motion } from "framer-motion"
import API from "../api/api"

import CreateStaticForm from "../components/CreateStaticForm"
import CreateDynamicForm from "../components/CreateDynamicForm"

export default function CreateForm(){

  const [mode,setMode] = useState("static")
  const [forms,setForms] = useState([])

  useEffect(()=>{
    loadForms()
  },[])

  const loadForms = async()=>{
    const res = await API.get("/forms")
    setForms(res.data || [])
  }

  const remove = async(id)=>{
    await API.delete("/forms/"+id)
    loadForms()
  }

  const copyLink = (id)=>{
    const url = window.location.origin+"/form/"+id
    navigator.clipboard.writeText(url)
    alert("Link copied")
  }

  return(

    <div className="w-full min-h-screen px-4 py-6 overflow-x-hidden">

      <div className="max-w-3xl mx-auto space-y-6">

        <motion.h1
          initial={{opacity:0,y:-20}}
          animate={{opacity:1,y:0}}
          className="text-xl font-bold"
        >
          Create Collection Form
        </motion.h1>

        {/* MODE TOGGLE */}

        <div className="flex gap-2">

          <button
            onClick={()=>setMode("static")}
            className={`px-3 py-1 rounded ${mode==="static"?"bg-blue-500 text-white":"bg-gray-200"}`}
          >
            Static
          </button>

          <button
            onClick={()=>setMode("dynamic")}
            className={`px-3 py-1 rounded ${mode==="dynamic"?"bg-blue-500 text-white":"bg-gray-200"}`}
          >
            Dynamic
          </button>

        </div>

        {mode==="static" && (
          <CreateStaticForm onCreated={loadForms}/>
        )}

        {mode==="dynamic" && (
          <CreateDynamicForm onCreated={loadForms}/>
        )}

        {/* FORMS LIST */}

        <div className="space-y-3">

          {forms.map((f)=>{

            const share = window.location.origin + "/form/" + f._id

            return(

              <motion.div
                key={f._id}
                initial={{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
                className="bg-white border rounded-xl p-4 shadow-sm"
              >

                <p className="font-semibold break-words">
                  {f.title}
                </p>

                <p className="text-xs text-gray-500 break-all mt-1">
                  {share}
                </p>

                <div className="flex gap-2 mt-3 flex-wrap">

                  <button
                    onClick={()=>copyLink(f._id)}
                    className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
                  >
                    Copy
                  </button>

                  <button
                    onClick={()=>remove(f._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>

                </div>

              </motion.div>

            )

          })}

        </div>

      </div>

    </div>

  )

}
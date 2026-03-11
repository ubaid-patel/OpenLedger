import { useState } from "react"
import { motion } from "framer-motion"
import API from "../api/api"

export default function CreateDynamicForm({ onCreated }) {

  const [form,setForm] = useState({
    title:"",
    description:"",
    purpose:"",
    fields:[],
    receipts:[]
  })

  const update=(k,v)=>{
    setForm(prev=>({
      ...prev,
      [k]:v ?? ""
    }))
  }

  /* ---------------- FIELD OPS ---------------- */

  const addField=(type="text")=>{

    const field={
      name:"field_"+Date.now(),
      label:"Untitled Question",
      type,
      required:false
    }

    setForm(prev=>({
      ...prev,
      fields:[...prev.fields,field]
    }))

  }

  const updateField=(i,key,value)=>{

    setForm(prev=>{

      const copy=[...prev.fields]

      copy[i]={
        ...copy[i],
        [key]:value
      }

      return {...prev,fields:copy}

    })

  }

  const removeField=(i)=>{

    setForm(prev=>{

      const copy=[...prev.fields]
      copy.splice(i,1)

      return {...prev,fields:copy}

    })

  }

  const move=(i,dir)=>{

    setForm(prev=>{

      const copy=[...prev.fields]

      const target=i+dir

      if(target<0 || target>=copy.length) return prev

      const temp=copy[i]
      copy[i]=copy[target]
      copy[target]=temp

      return {...prev,fields:copy}

    })

  }

  /* ---------------- CREATE ---------------- */

  const create = async()=>{

    if(!form.title.trim()){
      alert("Title required")
      return
    }

    const payload={
      title:form.title,
      description:form.description || "",
      purpose:form.purpose || "",
      fields:form.fields || [],
      receipts:form.receipts || []
    }

    await API.post("/forms",payload,{
      headers:{
        "Content-Type":"application/json"
      }
    })

    setForm({
      title:"",
      description:"",
      purpose:"",
      fields:[],
      receipts:[]
    })

    onCreated && onCreated()

  }

  return(

    <div className="flex gap-4">

      {/* MAIN BUILDER */}

      <div className="flex-1 space-y-4">

        {/* FORM HEADER */}

        <div className="bg-white p-4 rounded-xl shadow space-y-2">

          <input
            placeholder="Form title"
            className="w-full border rounded px-3 py-2 text-lg font-semibold"
            value={form.title}
            onChange={e=>update("title",e.target.value)}
          />

          <input
            placeholder="Form description"
            className="w-full border rounded px-3 py-2"
            value={form.description}
            onChange={e=>update("description",e.target.value)}
          />

          <input
            placeholder="Purpose"
            className="w-full border rounded px-3 py-2"
            value={form.purpose}
            onChange={e=>update("purpose",e.target.value)}
          />

        </div>

        {/* QUESTIONS */}

        {form.fields.map((f,i)=>(

          <motion.div
            key={f.name}
            layout
            className="bg-white rounded-xl shadow p-4 space-y-3"
          >

            <input
              className="border rounded px-2 py-1 w-full font-medium"
              value={f.label}
              onChange={e=>updateField(i,"label",e.target.value)}
            />

            {f.type==="text" && (
              <input disabled className="border px-2 py-1 rounded w-full"/>
            )}

            {f.type==="number" && (
              <input disabled type="number" className="border px-2 py-1 rounded w-full"/>
            )}

            {f.type==="textarea" && (
              <textarea disabled className="border px-2 py-1 rounded w-full"/>
            )}

            {f.type==="label" && (
              <p className="text-gray-600 text-sm">
                Label block
              </p>
            )}

            <div className="flex gap-2 flex-wrap items-center">

              <select
                value={f.type}
                onChange={e=>updateField(i,"type",e.target.value)}
                className="border rounded px-2 py-1"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="textarea">Textarea</option>
                <option value="label">Label</option>
              </select>

              <label className="flex items-center gap-1 text-sm">

                <input
                  type="checkbox"
                  checked={f.required}
                  onChange={e=>updateField(i,"required",e.target.checked)}
                />

                Required

              </label>

              <button
                onClick={()=>move(i,-1)}
                className="px-2 bg-gray-200 rounded"
              >
                ↑
              </button>

              <button
                onClick={()=>move(i,1)}
                className="px-2 bg-gray-200 rounded"
              >
                ↓
              </button>

              <button
                onClick={()=>removeField(i)}
                className="px-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>

            </div>

          </motion.div>

        ))}

        <button
          onClick={create}
          className="bg-green-500 text-white w-full py-2 rounded-lg"
        >
          Create Dynamic Form
        </button>

      </div>

      {/* TOOLBAR */}

      <div className="flex flex-col gap-2">

        <button
          onClick={()=>addField("text")}
          className="bg-white shadow rounded p-2"
        >
          Text
        </button>

        <button
          onClick={()=>addField("number")}
          className="bg-white shadow rounded p-2"
        >
          Number
        </button>

        <button
          onClick={()=>addField("textarea")}
          className="bg-white shadow rounded p-2"
        >
          Paragraph
        </button>

        <button
          onClick={()=>addField("label")}
          className="bg-white shadow rounded p-2"
        >
          Label
        </button>

      </div>

    </div>

  )

}
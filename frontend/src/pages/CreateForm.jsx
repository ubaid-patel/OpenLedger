import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import API from "../api/api"

export default function CreateForm(){

  const [form,setForm] = useState({
    title:"",
    description:"",
    upi_id:"",
    qr_image:"",
    purpose:"",
    fields:[
      {name:"name",label:"Your Name",type:"text"},
      {name:"amount",label:"Amount",type:"number"},
      {name:"notes",label:"Message",type:"text"}
    ]
  })

  const [forms,setForms] = useState([])
  const [editing,setEditing] = useState(null)
  const [preview,setPreview] = useState(null)
  const [uploading,setUploading] = useState(false)

  useEffect(()=>{
    loadForms()
  },[])

  const loadForms = async()=>{
    try{
      const res = await API.get("/forms")
      setForms(res.data || [])
    }catch(e){
      console.error(e)
    }
  }

  const updateField=(key,value)=>{
    setForm(prev=>({...prev,[key]:value}))
  }

  /* ---------- QR Upload ---------- */

const uploadQR = async(file)=>{

  if(!file) return

  try{

    setUploading(true)

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    const fd = new FormData()
    fd.append("file",file)

    const res = await API.post("/upload",fd,{
      headers:{ "Content-Type":"multipart/form-data" }
    })

    setForm(prev=>({
      ...prev,
      qr_image:res.data.url
    }))

  }catch(err){

    console.error(err)
    alert("Upload failed")

  }finally{

    setUploading(false)

  }

}
  /* ---------- CREATE ---------- */

  const create = async () => {

    if(!form.title || !form.purpose){
      alert("Title and purpose required")
      return
    }

    if(!form.qr_image){
      alert("Upload QR first")
      return
    }

    try{

      await API.post("/forms",form)

      setForm({
        title:"",
        description:"",
        upi_id:"",
        qr_image:"",
        purpose:"",
        fields:[
          {name:"name",label:"Your Name",type:"text"},
          {name:"amount",label:"Amount",type:"number"},
          {name:"notes",label:"Message",type:"text"}
        ]
      })

      setPreview(null)
      setEditing(null)

      loadForms()

    }catch(err){

      console.error(err)
      alert("Create failed")

    }

  }

  const remove = async(id)=>{
    await API.delete("/forms/"+id)
    loadForms()
  }

  const update = async(id)=>{
    await API.put("/forms/"+id,form)
    setEditing(null)
    loadForms()
  }

  const copyLink = (id)=>{
    const url = window.location.origin + "/form/" + id
    navigator.clipboard.writeText(url)
    alert("Link copied")
  }

  return(

    <div className="w-full min-h-screen px-4 py-6 overflow-x-hidden">

      <div className="max-w-3xl mx-auto space-y-6">

        {/* TITLE */}

        <motion.h1
          initial={{opacity:0,y:-20}}
          animate={{opacity:1,y:0}}
          className="text-xl font-bold"
        >
          Create Collection Form
        </motion.h1>

        {/* FORM CARD */}

        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          className="bg-white shadow rounded-xl p-4 space-y-3 w-full min-w-0"
        >

          <input
            placeholder="Title"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.title}
            onChange={(e)=>updateField("title",e.target.value)}
          />

          <input
            placeholder="Description"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.description}
            onChange={(e)=>updateField("description",e.target.value)}
          />

          <input
            placeholder="UPI ID"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.upi_id}
            onChange={(e)=>updateField("upi_id",e.target.value)}
          />

          <input
            placeholder="Purpose"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.purpose}
            onChange={(e)=>updateField("purpose",e.target.value)}
          />

          {/* QR UPLOAD */}

          <div className="border rounded-lg p-3 bg-gray-50 w-full">

            <p className="font-semibold text-sm mb-2">
              Upload QR Code
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={(e)=>uploadQR(e.target.files[0])}
              className="w-full"
            />

            {uploading && (
              <p className="text-xs text-gray-500 mt-2">
                Uploading...
              </p>
            )}

            {(preview || form.qr_image) && (

              <div className="mt-3 flex flex-wrap gap-3 items-center">

                <img
                  src={preview || form.qr_image}
                  className="w-24 h-24 object-contain border rounded"
                />

                <span className="text-sm text-green-600">
                  QR uploaded
                </span>

              </div>

            )}

          </div>

          {editing ? (

            <motion.button
              whileTap={{scale:0.95}}
              onClick={()=>update(editing)}
              className="bg-blue-500 text-white w-full py-2 rounded-lg"
            >
              Update Form
            </motion.button>

          ) : (

            <motion.button
              whileTap={{scale:0.95}}
              onClick={create}
              className="bg-green-500 text-white w-full py-2 rounded-lg"
            >
              Create Form
            </motion.button>

          )}

        </motion.div>

        {/* FORMS LIST */}

        <div className="space-y-3">

          {forms.map((f)=>{

            const share = window.location.origin + "/form/" + f._id

            return(

              <motion.div
                key={f._id}
                initial={{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
                className="bg-white border rounded-xl p-4 shadow-sm w-full min-w-0"
              >

                <p className="font-semibold break-words">
                  {f.title}
                </p>

                <p className="text-xs text-gray-500 break-all mt-1">
                  {share}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  <button
                    onClick={()=>copyLink(f._id)}
                    className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
                  >
                    Copy
                  </button>

                  <button
                    onClick={()=>{
                      setForm(f)
                      setPreview(f.qr_image)
                      setEditing(f._id)
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
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
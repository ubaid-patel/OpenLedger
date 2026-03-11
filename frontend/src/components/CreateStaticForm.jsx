import { useState } from "react"
import { motion } from "framer-motion"
import API from "../api/api"

export default function CreateStaticForm({onCreated}){

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

  const [preview,setPreview] = useState(null)
  const [uploading,setUploading] = useState(false)

  const updateField=(key,value)=>{
    setForm(prev=>({...prev,[key]:value}))
  }

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

  const create = async () => {

    if(!form.title || !form.purpose){
      alert("Title and purpose required")
      return
    }

    if(!form.qr_image){
      alert("Upload QR first")
      return
    }

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

    onCreated()

  }

  return(

    <motion.div
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      className="bg-white shadow rounded-xl p-4 space-y-3"
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

      <div className="border rounded-lg p-3 bg-gray-50">

        <p className="font-semibold text-sm mb-2">
          Upload QR Code
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={(e)=>uploadQR(e.target.files[0])}
        />

        {uploading && (
          <p className="text-xs text-gray-500 mt-2">
            Uploading...
          </p>
        )}

        {(preview || form.qr_image) && (

          <div className="mt-3 flex gap-3 items-center">

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

      <motion.button
        whileTap={{scale:0.95}}
        onClick={create}
        className="bg-green-500 text-white w-full py-2 rounded-lg"
      >
        Create Form
      </motion.button>

    </motion.div>

  )

}
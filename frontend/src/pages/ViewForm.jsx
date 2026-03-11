import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api/api"

export default function ViewForm(){

  const { id } = useParams()

  const [form,setForm] = useState(null)
  const [answers,setAnswers] = useState({})
  const [receipt,setReceipt] = useState("")
  const [preview,setPreview] = useState(null)
  const [uploading,setUploading] = useState(false)

  const [submitted,setSubmitted] = useState(false)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    loadForm()
  },[])

  const loadForm = async()=>{

    try{

      const res = await API.get("/forms/"+id)
      setForm(res.data)

    }catch(err){
      console.error(err)
    }

    setLoading(false)

  }

  const handleChange=(name,value)=>{

    setAnswers(prev=>({
      ...prev,
      [name]:value
    }))

  }

  /* -------- Upload Receipt -------- */

  const upload = async(file)=>{

    if(!file) return

    try{

      setUploading(true)

      const previewURL = URL.createObjectURL(file)
      setPreview(previewURL)

      const fd = new FormData()
      fd.append("file",file)

      const res = await API.post("/upload",fd,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      })

      setReceipt(res.data.url)

    }catch(err){

      console.error(err)
      alert("Upload failed")

    }

    setUploading(false)

  }

  /* -------- Submit -------- */

  const submit = async()=>{

    try{

      const payload={
        ...answers,
        receipt
      }

      await API.post(`/forms/${id}/submit`,payload)

      setSubmitted(true)

    }catch(err){

      console.error(err)
      alert("Submission failed")

    }

  }

  if(loading) return <div className="p-6 text-center">Loading...</div>

  if(!form) return <div className="p-6 text-center">Form not found</div>

  if(submitted){

    return(

      <div className="min-h-screen flex items-center justify-center p-6">

        <div className="text-center max-w-md">

          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Submission Successful 🎉
          </h1>

          <p className="text-gray-600">
            Thank you for your contribution.
          </p>

        </div>

      </div>

    )

  }

  return(

    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

      {/* HEADER */}

      <div className="bg-white shadow rounded-xl p-6">

        <h1 className="text-2xl font-bold mb-2">
          {form.title}
        </h1>

        <p className="text-gray-600">
          {form.description}
        </p>

      </div>

      {/* PAYMENT */}

      {(form.qr_image || form.upi_id) && (

        <div className="bg-white shadow rounded-xl p-6 text-center">

          {form.qr_image && (

            <img
              src={form.qr_image}
              className="mx-auto w-48 border rounded mb-4"
            />

          )}

          {form.upi_id && (

            <p className="text-gray-600">
              Pay using UPI: <b>{form.upi_id}</b>
            </p>

          )}

        </div>

      )}

      {/* FORM */}

      <div className="bg-white shadow rounded-xl p-6 space-y-4">

        {form.fields?.map((field)=>{

          return(

            <input
              key={field.name}
              type={field.type}
              placeholder={field.label}
              className="w-full h-12 px-4 border rounded-lg"
              onChange={(e)=>handleChange(field.name,e.target.value)}
            />

          )

        })}

        {/* RECEIPT */}

        <div className="pt-4">

          <p className="text-sm text-gray-500 mb-2">
            Upload payment receipt
          </p>

          {!preview && (

            <label className="flex items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">

              <span className="text-gray-500 text-sm">
                Upload receipt
              </span>

              <input
                type="file"
                hidden
                onChange={(e)=>upload(e.target.files[0])}
              />

            </label>

          )}

          {preview && (

            <div className="relative">

              <img
                src={preview}
                className="rounded-lg border max-h-60 object-contain w-full"
              />

              {uploading && (

                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  Uploading...
                </div>

              )}

            </div>

          )}

        </div>

        {/* SUBMIT */}

        <button
          onClick={submit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
        >
          Submit Response
        </button>

      </div>

    </div>

  )

}
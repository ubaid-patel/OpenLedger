import { useState } from "react"
import API from "../api/api"
import { useNavigate } from "react-router-dom"

export default function ExpenseForm(){

  const navigate = useNavigate()

  const today = new Date().toISOString().slice(0,16)

  const [uploading,setUploading] = useState(false)
  const [preview,setPreview] = useState(null)

  const [form,setForm] = useState({
    date: today,
    paidBy:"",
    mode:"",
    purpose:"",
    amount:"",
    notes:"",
    receipts:""
  })

  const update=(k,v)=>setForm(prev=>({...prev,[k]:v}))

  const upload = async(file)=>{

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

      update("receipts",res.data.url)

    }catch(err){

      console.error(err)
      alert("Upload failed")

    }finally{

      setUploading(false)

    }

  }

  const submit = async()=>{

    try{

      const payload={
        date:new Date(form.date).toISOString(),
        paidBy:form.paidBy,
        mode:form.mode,
        purpose:form.purpose,
        amount:Number(form.amount),
        notes:form.notes
      }

      if(form.receipts){
        payload.receipts=form.receipts
      }

      await API.post("/expenses/",payload)

      navigate("/expenses")

    }catch(err){

      console.error(err)
      alert("Failed to save expense")

    }

  }

  return(

    <div className="max-w-xl mx-auto px-4 py-6">

      <div className="bg-white rounded-xl border p-5 space-y-4">

        {/* AMOUNT */}

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e)=>update("amount",e.target.value)}
          className="w-full h-16 text-2xl font-semibold px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* PURPOSE */}

        <input
          placeholder="Purpose (Fuel, Dinner...)"
          value={form.purpose}
          onChange={(e)=>update("purpose",e.target.value)}
          className="w-full h-14 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* PAID BY */}

        <input
          placeholder="Paid by"
          value={form.paidBy}
          onChange={(e)=>update("paidBy",e.target.value)}
          className="w-full h-14 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* MODE */}

        <select
          value={form.mode}
          onChange={(e)=>update("mode",e.target.value)}
          className="w-full h-14 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >

          <option value="">Payment mode</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Bank">Bank</option>

        </select>

        {/* DATE */}

        <input
          type="datetime-local"
          value={form.date}
          onChange={(e)=>update("date",e.target.value)}
          className="w-full h-14 px-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* RECEIPT */}

        {!preview && (

          <label className="flex items-center justify-center h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition">

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
              className="rounded-xl border max-h-60 object-contain w-full"
            />

            {uploading && (

              <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm">
                Uploading...
              </div>

            )}

          </div>

        )}

        {/* NOTES */}

        <textarea
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e)=>update("notes",e.target.value)}
          className="w-full min-h-[90px] p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* SAVE */}

        <button
          onClick={submit}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg"
        >
          Save Expense
        </button>

      </div>

    </div>

  )

}
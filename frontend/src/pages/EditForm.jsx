import { useEffect,useState } from "react"
import { useParams } from "react-router-dom"
import API from "../api/api"

export default function EditForm(){

  const {id} = useParams()

  const [form,setForm] = useState(null)

  useEffect(()=>{

    fetch()

  },[])

  const fetch = async()=>{

    const res = await API.get("/forms/"+id)

    setForm(res.data)

  }

  const update = async()=>{

    await API.put("/forms/"+id,form)

    alert("Updated")

  }

  if(!form) return null

  return(

    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-xl font-bold mb-4">
        Edit Form
      </h1>

      <input
      value={form.title}
      onChange={(e)=>setForm({...form,title:e.target.value})}
      className="border p-2 w-full mb-3"
      />

      <button
      onClick={update}
      className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Update
      </button>

    </div>

  )

}
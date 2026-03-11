import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import API from "../api/api"

export default function FormsList(){

  const navigate = useNavigate()

  const [forms,setForms] = useState([])
  const [loading,setLoading] = useState(true)

  const fetchForms = async()=>{

    try{

      const res = await API.get("/forms")

      setForms(res.data || [])

    }catch(e){

      console.error(e)

    }

    setLoading(false)

  }

  const deleteForm = async(id)=>{

    if(!confirm("Delete this form?")) return

    try{

      await API.delete("/forms/"+id)

      setForms(prev => prev.filter(f => f._id !== id))

    }catch(e){

      console.error(e)
      alert("Delete failed")

    }

  }

  useEffect(()=>{
    fetchForms()
  },[])

  return(

    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <h1 className="text-xl md:text-2xl font-bold">
          Forms Dashboard
        </h1>

        <motion.button
          whileTap={{ scale:0.95 }}
          whileHover={{ scale:1.05 }}
          onClick={()=>navigate("/admin/forms/create")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Create Form
        </motion.button>

      </div>

      {/* LOADING */}

      {loading && (
        <p className="text-gray-500">
          Loading forms...
        </p>
      )}

      {/* EMPTY */}

      {!loading && forms.length === 0 && (
        <p className="text-gray-500">
          No forms created yet
        </p>
      )}

      {/* ---------- MOBILE CARDS ---------- */}

      <div className="md:hidden space-y-3">

        {forms.map(form=>(

          <motion.div
            key={form._id}
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            className="bg-white border rounded-xl shadow-sm p-4 space-y-3"
          >

            <div className="font-semibold text-lg">
              {form.title}
            </div>

            <div className="text-sm text-gray-600">
              {form.purpose}
            </div>

            <div className="text-xs text-gray-400">
              UPI: {form.upi_id}
            </div>

            {/* ACTIONS */}

            <div className="flex gap-2 pt-2">

              <button
                onClick={()=>navigate("/admin/forms/"+form._id)}
                className="flex-1 bg-blue-500 text-white py-1.5 rounded text-sm"
              >
                View
              </button>

              <button
                onClick={()=>navigate("/admin/forms/edit/"+form._id)}
                className="flex-1 bg-yellow-500 text-white py-1.5 rounded text-sm"
              >
                Edit
              </button>

              <button
                onClick={()=>deleteForm(form._id)}
                className="flex-1 bg-red-500 text-white py-1.5 rounded text-sm"
              >
                Delete
              </button>

            </div>

          </motion.div>

        ))}

      </div>

      {/* ---------- DESKTOP TABLE ---------- */}

      <div className="hidden md:block bg-white shadow rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-left text-sm">

            <tr>

              <th className="p-3">Title</th>
              <th className="p-3">Purpose</th>
              <th className="p-3">UPI</th>
              <th className="p-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {forms.map(form=>(

              <tr
                key={form._id}
                className="border-t hover:bg-gray-50 transition"
              >

                <td className="p-3 font-medium">
                  {form.title}
                </td>

                <td className="p-3 text-gray-600">
                  {form.purpose}
                </td>

                <td className="p-3 text-gray-600">
                  {form.upi_id}
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={()=>navigate("/admin/forms/"+form._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    View
                  </button>

                  <button
                    onClick={()=>navigate("/admin/forms/edit/"+form._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>deleteForm(form._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}
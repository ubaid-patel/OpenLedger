import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import API from "../api/api"

export default function PublicFormList(){

  const navigate = useNavigate()

  const [collections,setCollections] = useState([])
  const [loading,setLoading] = useState(true)

  const fetchCollections = async()=>{

    try{

      const res = await API.get("/forms")

      setCollections(res.data || [])

    }catch(e){

      console.error(e)

    }

    setLoading(false)

  }

  useEffect(()=>{
    fetchCollections()
  },[])


  const container = {
    hidden:{},
    show:{
      transition:{
        staggerChildren:0.08
      }
    }
  }

  const card = {
    hidden:{opacity:0,y:30},
    show:{opacity:1,y:0}
  }


  return(

    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-6 shadow">

        <h1 className="text-xl font-bold">
          Community Collections
        </h1>

        <p className="text-sm opacity-90">
          Support ongoing drives and contribute easily
        </p>

      </div>


      <div className="max-w-4xl mx-auto px-4 py-6">


        {/* LOADING */}

        {loading && (

          <div className="space-y-3">

            {[1,2,3].map(i=>(
              <div key={i} className="bg-white p-4 rounded-xl shadow animate-pulse h-24"/>
            ))}

          </div>

        )}


        {/* EMPTY */}

        {!loading && collections.length === 0 &&(

          <div className="text-center text-gray-500 py-20">
            No collection drives available
          </div>

        )}


        {/* COLLECTION CARDS */}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >

          {collections.map(col=>(

            <motion.div
              key={col._id}
              variants={card}
              whileHover={{scale:1.02}}
              whileTap={{scale:0.97}}
              onClick={()=>navigate("/form/"+col._id)}
              className="bg-white rounded-2xl shadow-sm border p-4 cursor-pointer transition hover:shadow-md"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="font-semibold text-lg">
                    {col.title}
                  </h2>

                  <p className="text-gray-600 text-sm mt-1">
                    {col.purpose}
                  </p>

                </div>

                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Active
                </div>

              </div>


              {/* FOOTER */}

              <div className="flex justify-between items-center mt-4 text-sm">

                <span className="text-gray-500">
                  UPI: {col.upi_id}
                </span>

                <motion.button
                  whileTap={{scale:0.9}}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs"
                >
                  Contribute
                </motion.button>

              </div>

            </motion.div>

          ))}

        </motion.div>

      </div>

    </div>

  )

}
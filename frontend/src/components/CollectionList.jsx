import { useEffect, useState, useMemo, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import API from "../api/api"

export default function CollectionList(){

  const [data,setData] = useState([])
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)

  const parentRef = useRef(null)

  useEffect(()=>{
    load()
  },[])

  const load = async()=>{

    const res = await API.get("/collections/")
    setData(res.data || [])
    setLoading(false)

  }

  /* ---------- FILTER ---------- */

  const filtered = useMemo(()=>{

    return data.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    )

  },[data,search])

  /* ---------- GROUP ---------- */

  const grouped = useMemo(()=>{

    return filtered.reduce((acc,c)=>{

      const key = c.name || "Unknown"

      if(!acc[key]) acc[key] = []

      acc[key].push(c)

      return acc

    },{})

  },[filtered])

  const names = Object.keys(grouped)

  /* ---------- VIRTUALIZER ---------- */

  const rowVirtualizer = useVirtualizer({
    count:names.length,
    getScrollElement:()=>parentRef.current,
    estimateSize:()=>240,
    overscan:5
  })

  if(loading){

    return(
      <div className="p-6 text-center text-gray-500 text-sm">
        Loading collections...
      </div>
    )

  }

  return(

    <div className="space-y-4 px-3 md:px-6 max-w-full overflow-x-hidden">

      {/* HEADER */}

      <div className="space-y-2 md:flex md:items-center md:justify-between md:space-y-0">

        <h2 className="text-lg md:text-xl font-bold">
          Collections
        </h2>

        <input
          placeholder="Search contributor..."
          className="w-full md:w-72 border rounded-lg px-3 py-2 text-sm"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

      {/* MOBILE VIEW */}

      <div className="space-y-3 md:hidden">

        {names.map(name=>{

          const list = grouped[name]

          const total = list.reduce(
            (sum,c)=>sum+Number(c.amount||0),
            0
          )

          return(

            <div
              key={name}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >

              {/* HEADER */}

              <div className="flex justify-between items-start bg-gray-50 px-3 py-2 text-sm font-semibold">

                <span className="truncate min-w-0 max-w-[65%]">
                  {name}
                </span>

                <span className="text-green-600 whitespace-nowrap">
                  ₹ {total.toLocaleString()}
                </span>

              </div>

              {/* ITEMS */}

              <div className="divide-y">

                {list.map((c,i)=>(

                  <div key={i} className="p-3 text-sm">

                    <div className="flex justify-between gap-2">

                      <span className="text-gray-500 text-xs break-words">
                        {new Date(c.date).toLocaleDateString()}
                      </span>

                      <span className="font-semibold text-green-700 whitespace-nowrap">
                        ₹ {Number(c.amount).toLocaleString()}
                      </span>

                    </div>

                    <div className="text-xs text-gray-400 mt-1 break-words">
                      {c.mode}
                    </div>

                  </div>

                ))}

              </div>

            </div>

          )

        })}

      </div>

      {/* DESKTOP VIEW */}

      <div className="hidden md:block bg-white rounded-xl shadow border">

        <div
          ref={parentRef}
          className="h-[600px] overflow-auto"
        >

          <div
            style={{
              height:rowVirtualizer.getTotalSize(),
              position:"relative"
            }}
          >

            {rowVirtualizer.getVirtualItems().map(vRow=>{

              const name = names[vRow.index]
              const list = grouped[name]

              const total = list.reduce(
                (sum,c)=>sum+Number(c.amount||0),
                0
              )

              return(

                <div
                  key={vRow.key}
                  style={{
                    position:"absolute",
                    top:0,
                    left:0,
                    width:"100%",
                    transform:`translateY(${vRow.start}px)`
                  }}
                  className="border-b"
                >

                  <div className="bg-gray-50 px-5 py-3 flex justify-between font-semibold">

                    <span className="truncate">
                      {name}
                    </span>

                    <span className="text-green-600">
                      ₹ {total.toLocaleString()}
                    </span>

                  </div>

                  <div className="grid grid-cols-3 px-5 py-2 text-sm font-semibold border-b bg-gray-100">

                    <div>Date</div>
                    <div>Amount</div>
                    <div>Mode</div>

                  </div>

                  {list.map((c,i)=>(

                    <div
                      key={i}
                      className="grid grid-cols-3 px-5 py-2 text-sm border-b hover:bg-gray-50"
                    >

                      <div>
                        {new Date(c.date).toLocaleDateString()}
                      </div>

                      <div className="font-semibold text-green-700">
                        ₹ {Number(c.amount).toLocaleString()}
                      </div>

                      <div className="truncate">
                        {c.mode}
                      </div>

                    </div>

                  ))}

                </div>

              )

            })}

          </div>

        </div>

      </div>

    </div>

  )

}
import { useEffect, useState, useMemo, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import API from "../api/api"
import ReceiptPreview from "./ReceiptPreview"

export default function ExpenseTable(){

  const [data,setData] = useState([])
  const [search,setSearch] = useState("")
  const [loading,setLoading] = useState(true)

  const parentRef = useRef()

  useEffect(()=>{
    load()
  },[])

  const load = async()=>{

    const res = await API.get("/expenses/")

    const normalized = (res.data || []).map(e => ({
      ...e,
      receipts: e.receipts || e.reciepts || null
    }))

    normalized.sort((a,b)=> new Date(b.date) - new Date(a.date))

    setData(normalized)
    setLoading(false)

  }

  /* ---------- FILTER ---------- */

  const filtered = useMemo(()=>{

    return data.filter(e =>
      e.purpose?.toLowerCase().includes(search.toLowerCase()) ||
      e.paidBy?.toLowerCase().includes(search.toLowerCase())
    )

  },[data,search])

  const total = useMemo(()=>{

    return filtered.reduce(
      (sum,e)=>sum+Number(e.amount||0),
      0
    )

  },[filtered])

  /* ---------- VIRTUALIZER ---------- */

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: ()=>parentRef.current,
    estimateSize: ()=>64,
    overscan:10
  })

  if(loading){

    return(
      <div className="p-10 text-center text-gray-500">
        Loading expenses...
      </div>
    )

  }

  return(

    <div className="space-y-4 relative">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

        <input
          placeholder="Search purpose or name..."
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-64"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

      {/* TOTAL */}

      <div className="text-sm text-gray-600">

        Total:

        <span className="font-semibold text-green-600 ml-1">
          ₹ {total.toLocaleString()}
        </span>

      </div>

      {/* ---------- MOBILE CARDS ---------- */}

      <div className="md:hidden space-y-3">

        {filtered.map(e=>(

          <div
            key={e._id}
            className="bg-white rounded-xl shadow p-4"
          >

            <div className="flex justify-between">

              <div className="font-semibold">
                {e.purpose || "-"}
              </div>

              <div className="text-green-700 font-bold">
                ₹ {Number(e.amount).toLocaleString()}
              </div>

            </div>

            <div className="text-sm text-gray-500 mt-1">
              {e.paidBy || "-"} • {e.mode || "-"}
            </div>

            {/* NOTES FIELD ADDED */}
            {e.notes && (
              <div className="text-sm text-gray-600 mt-2">
                {e.notes}
              </div>
            )}

            <div className="flex justify-between items-center mt-3">

              <div className="text-xs text-gray-400">
                {e.date ? new Date(e.date).toLocaleDateString() : "-"}
              </div>

              {e.receipts
                ? <ReceiptPreview url={e.receipts}/>
                : <span className="text-gray-400 text-xs">No receipt</span>
              }

            </div>

          </div>

        ))}

      </div>

      {/* ---------- DESKTOP TABLE ---------- */}

      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">

        {/* HEADER */}

        <div className="grid grid-cols-[120px_1fr_150px_120px_140px_100px] bg-gray-100 text-sm font-semibold px-4 py-3 sticky top-0 z-10">

          <div>Date</div>
          <div>Purpose</div>
          <div>Paid By</div>
          <div>Mode</div>
          <div>Amount</div>
          <div>Receipt</div>

        </div>

        {/* VIRTUAL SCROLL */}

        <div
          ref={parentRef}
          className="h-[600px] overflow-auto"
        >

          <div
            style={{
              height: rowVirtualizer.getTotalSize(),
              position:"relative"
            }}
          >

            {rowVirtualizer.getVirtualItems().map(vRow=>{

              const e = filtered[vRow.index]

              return(

                <div
                  key={vRow.key}
                  className="grid grid-cols-[120px_1fr_150px_120px_140px_100px] px-4 py-3 border-b text-sm hover:bg-gray-50"
                  style={{
                    position:"absolute",
                    top:0,
                    left:0,
                    width:"100%",
                    transform:`translateY(${vRow.start}px)`
                  }}
                >

                  <div>
                    {e.date ? new Date(e.date).toLocaleDateString() : "-"}
                  </div>

                  <div>
                    {e.purpose || "-"}
                  </div>

                  <div>
                    {e.paidBy || "-"}
                  </div>

                  <div>
                    {e.mode || "-"}
                  </div>

                  <div className="font-semibold text-green-700">
                    ₹ {Number(e.amount).toLocaleString()}
                  </div>

                  <div>

                    {e.receipts
                      ? <ReceiptPreview url={e.receipts}/>
                      : <span className="text-gray-400 text-sm">—</span>
                    }

                  </div>

                </div>

              )

            })}

          </div>

        </div>

      </div>

    </div>

  )

}
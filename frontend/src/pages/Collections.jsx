import { useEffect, useState, useMemo, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import API from "../api/api"
import ReceiptPreview from "../components/ReceiptPreview"

export default function Collections(){

  const [data,setData] = useState([])
  const [search,setSearch] = useState("")
  const [purpose,setPurpose] = useState("")
  const [fromDate,setFromDate] = useState("")
  const [toDate,setToDate] = useState("")
  const [loading,setLoading] = useState(true)

  const parentRef = useRef()

  useEffect(()=>{
    load()
  },[])

  const load = async()=>{

    try{

      const res = await API.get("/collections/")

      const normalized = (res.data || []).sort(
        (a,b)=> new Date(b.date) - new Date(a.date)
      )

      setData(normalized)

    }catch(err){

      console.error("Failed loading collections",err)

    }

    setLoading(false)

  }

  /* ---------- PURPOSE OPTIONS ---------- */

  const purposes = useMemo(()=>{

    const set = new Set()

    data.forEach(d=>{
      if(d.purpose) set.add(d.purpose)
    })

    return Array.from(set)

  },[data])

  /* ---------- FILTER ---------- */

  const filtered = useMemo(()=>{

    return data.filter(c=>{

      const matchesSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.purpose?.toLowerCase().includes(search.toLowerCase())

      const matchesPurpose =
        !purpose || c.purpose === purpose

      const date = new Date(c.date)

      const matchesFrom =
        !fromDate || date >= new Date(fromDate)

      const matchesTo =
        !toDate || date <= new Date(toDate)

      return matchesSearch && matchesPurpose && matchesFrom && matchesTo

    })

  },[data,search,purpose,fromDate,toDate])

  /* ---------- TOTAL ---------- */

  const total = useMemo(()=>{

    return filtered.reduce(
      (sum,c)=> sum + Number(c.amount || 0),
      0
    )

  },[filtered])

  /* ---------- PURPOSE TOTALS ---------- */

  const purposeTotals = useMemo(()=>{

    const map = {}

    filtered.forEach(c=>{
      const key = c.purpose || "Other"

      if(!map[key]) map[key] = 0

      map[key] += Number(c.amount || 0)
    })

    return map

  },[filtered])

  /* ---------- RECEIPT NORMALIZER ---------- */

  const getReceipt = (r)=>{

    if(!r) return null

    let url = Array.isArray(r) ? r[0] : r

    return url.split("?")[0]

  }

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
        Loading collections...
      </div>
    )

  }

  return(

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <h2 className="text-xl font-bold">
          Collections
        </h2>

        <input
          placeholder="Search contributor or purpose..."
          className="border rounded-lg px-3 py-2 text-sm w-full md:w-64"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3">

        <select
          value={purpose}
          onChange={(e)=>setPurpose(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Purposes</option>

          {purposes.map(p=>(
            <option key={p} value={p}>
              {p}
            </option>
          ))}

        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e)=>setFromDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e)=>setToDate(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

      </div>

      {/* TOTAL */}

      <div className="text-sm text-gray-600">

        Total Collected:

        <span className="font-semibold text-green-600 ml-1">
          ₹ {total.toLocaleString()}
        </span>

      </div>

      {/* PURPOSE TOTALS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

        {Object.entries(purposeTotals).map(([key,val])=>(

          <div
            key={key}
            className="bg-white shadow rounded-lg p-3 text-sm"
          >

            <div className="text-gray-500">
              {key}
            </div>

            <div className="font-semibold text-green-600">
              ₹ {val.toLocaleString()}
            </div>

          </div>

        ))}

      </div>

      {/* MOBILE CARDS */}

      <div className="md:hidden space-y-3">

        {filtered.map(c=>{

          const receipt = getReceipt(c.receipts)

          return(

            <div
              key={c._id}
              className="bg-white rounded-xl shadow p-4"
            >

              <div className="flex justify-between">

                <div>

                  <div className="font-semibold">
                    {c.name || "-"}
                  </div>

                  <div className="text-sm text-gray-500">
                    {c.purpose || "-"}
                  </div>

                  {c.collectedBy && (
                    <div className="text-xs text-gray-400">
                      Collected By: {c.collectedBy}
                    </div>
                  )}

                </div>

                <div className="text-green-700 font-bold">
                  ₹ {Number(c.amount).toLocaleString()}
                </div>

              </div>

              <div className="flex justify-between mt-2 text-xs text-gray-400">

                <div>
                  {c.mode || "-"}
                </div>

                <div>
                  {c.date ? new Date(c.date).toLocaleDateString() : "-"}
                </div>

              </div>

              {receipt && (
                <div className="mt-3">
                  <ReceiptPreview url={receipt} />
                </div>
              )}

            </div>

          )

        })}

      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">

        <div className="grid grid-cols-[120px_1fr_1fr_120px_120px_140px] bg-gray-100 text-sm font-semibold px-4 py-3">

          <div>Date</div>
          <div>Name</div>
          <div>Purpose</div>
          <div>Mode</div>
          <div>Receipt</div>
          <div>Amount</div>

        </div>

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

              const c = filtered[vRow.index]

              const receipt = getReceipt(c.receipts)

              return(

                <div
                  key={vRow.key}
                  className="grid grid-cols-[120px_1fr_1fr_120px_120px_140px] px-4 py-3 border-b text-sm hover:bg-gray-50"
                  style={{
                    position:"absolute",
                    top:0,
                    left:0,
                    width:"100%",
                    transform:`translateY(${vRow.start}px)`
                  }}
                >

                  <div>
                    {c.date ? new Date(c.date).toLocaleDateString() : "-"}
                  </div>

                  <div>
                    {c.name || "-"}
                  </div>

                  <div>
                    {c.purpose || "-"}
                  </div>

                  <div>
                    {c.mode || "-"}
                  </div>

                  <div>
                    {receipt ? (
                      <ReceiptPreview url={receipt} />
                    ) : "-"}
                  </div>

                  <div className="font-semibold text-green-700">
                    ₹ {Number(c.amount).toLocaleString()}
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
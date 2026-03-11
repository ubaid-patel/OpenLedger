import { useEffect, useState } from "react"
import API from "../api/api"

export default function Dashboard(){

  const [expenses,setExpenses] = useState([])
  const [collections,setCollections] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    load()
  },[])

  const load = async()=>{

    try{

      const [expRes,colRes] = await Promise.all([
        API.get("/expenses/"),
        API.get("/collections/")
      ])

      setExpenses(expRes.data || [])
      setCollections(colRes.data || [])

    }catch(e){
      console.error("Dashboard API error",e)
    }

    setLoading(false)

  }

  function normalizePurpose(purpose){

    if(!purpose) return "Other"

    const p = purpose.toLowerCase()

    if(
      p.includes("hafiz") ||
      p.includes("haafiz") ||
      p.includes("rapido") ||
      p.includes("travel")
    ){
      return "Hafiz saab expenses"
    }

    if(
      p.includes("iftar") ||
      p.includes("iftaar") ||
      p.includes("iftari")
    ){
      return "Iftaar"
    }

    return purpose

  }

  const totalExpenses =
    expenses.reduce((a,b)=>a+(Number(b.amount)||0),0)

  const totalCollections =
    collections.reduce((a,b)=>a+(Number(b.amount)||0),0)

  const balance =
    totalCollections-totalExpenses

  const contributors =
    new Set(
      collections.map(c=>c.name).filter(Boolean)
    ).size

  const expenseEntries =
    expenses.length

  const uniqueDays = [...new Set(

    expenses
      .filter(e=>e.date)
      .map(e=> new Date(e.date).toDateString())

  )]

  const avgExpense =
    uniqueDays.length ? totalExpenses/uniqueDays.length : 0

  const cashRunway =
    avgExpense ? balance/avgExpense : 0

  const collectionsByPurpose =
    collections.reduce((acc,c)=>{

      const key = normalizePurpose(c.purpose)

      if(!acc[key]) acc[key]=0

      acc[key]+=Number(c.amount)||0

      return acc

    },{})

  const expensesByPurpose =
    expenses.reduce((acc,e)=>{

      const key = normalizePurpose(e.purpose)

      if(!acc[key]) acc[key]=0

      acc[key]+=Number(e.amount)||0

      return acc

    },{})

  if(loading){

    return(

      <div className="p-6 space-y-4 animate-pulse">

        <div className="h-8 w-40 bg-gray-200 rounded"></div>

        <div className="grid grid-cols-2 gap-3">

          {[...Array(6)].map((_,i)=>(
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}

        </div>

        <div className="h-40 bg-gray-200 rounded"></div>

        <div className="h-40 bg-gray-200 rounded"></div>

      </div>

    )

  }

  return(

    <div className="max-w-6xl mx-auto animate-[fadein_.4s_ease]">

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">

        <Card title="Total Donations" value={totalCollections}/>
        <Card title="Total Expenses" value={totalExpenses}/>
        <Card title="Balance" value={balance}/>
        <Card title="Contributors" value={contributors} currency={false}/>

        <Card title="Expense Entries" value={expenseEntries} currency={false}/>
        <Card title="Avg Expense / Day" value={avgExpense}/>
        <Card title="Cash Runway (Days)" value={cashRunway} currency={false}/>
        <Card title="Expense Days" value={uniqueDays.length} currency={false}/>

      </div>

      {/* COLLECTION PURPOSES */}

      <div className="bg-white shadow-md rounded-xl p-4 md:p-6 mb-6 transition hover:shadow-lg">

        <h2 className="font-semibold text-lg mb-4">
          Funds Received by Purpose
        </h2>

        <table className="w-full text-sm md:text-base">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-2 text-left">Purpose</th>
              <th className="p-2 text-right">Amount</th>
            </tr>

          </thead>

          <tbody>

            {Object.entries(collectionsByPurpose).map(([p,a])=>(

              <tr key={p} className="border-t hover:bg-gray-50 transition">

                <td className="p-2">{p}</td>

                <td className="p-2 text-right font-semibold">
                  ₹ {a.toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* EXPENSE PURPOSES */}

      <div className="bg-white shadow-md rounded-xl p-4 md:p-6 transition hover:shadow-lg">

        <h2 className="font-semibold text-lg mb-4">
          Expenses by Purpose
        </h2>

        <table className="w-full text-sm md:text-base">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-2 text-left">Purpose</th>
              <th className="p-2 text-right">Amount</th>
            </tr>

          </thead>

          <tbody>

            {Object.entries(expensesByPurpose).map(([p,a])=>(

              <tr key={p} className="border-t hover:bg-gray-50 transition">

                <td className="p-2">{p}</td>

                <td className="p-2 text-right font-semibold">
                  ₹ {a.toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}

/* ---------- CARD COMPONENT ---------- */

function Card({title,value,currency=true}){

  return(

    <div className="bg-white shadow-md rounded-xl p-4 transition transform hover:-translate-y-1 hover:shadow-lg active:scale-95">

      <p className="text-xs md:text-sm text-gray-500">
        {title}
      </p>

      <p className="text-lg md:text-xl font-bold">

        {currency ? "₹ " : ""}
        {Math.round(value).toLocaleString()}

      </p>

    </div>

  )

}
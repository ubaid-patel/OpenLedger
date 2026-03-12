import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/api"

export default function Dashboard() {

  const navigate = useNavigate()

  const [expenses, setExpenses] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {

    try {

      const [expRes, colRes] = await Promise.all([
        API.get("/expenses/"),
        API.get("/collections/")
      ])

      setExpenses(expRes.data || [])
      setCollections(colRes.data || [])

    } catch (e) {
      console.error("Dashboard API error", e)
    }

    setLoading(false)

  }

  /* ---------- NORMALIZE PURPOSE ---------- */
  function normalizePurpose(purpose) {

    if (!purpose) return "Iftaar"

    const p = purpose.toLowerCase()

    /* Hafiz expenses */

    if (
      p.includes("hafiz") ||
      p.includes("haafiz") ||
      p.includes("rapido") ||
      p.includes("travel")
    ) return "Hafiz saab expenses"


    /* Hadiya */

    if (p.includes("hadiya"))
      return "Hadiya"


    /* Donations */

    if (
      p.includes("donation") ||
      p.includes("chanda")
    )
      return "Donation"


    /* Everything else → Iftaar */

    return "Iftaar"
  }

  /* ---------- TOTALS ---------- */

  const totalExpenses =
    expenses.reduce((a, b) => a + (Number(b.amount) || 0), 0)

  const totalCollections =
    collections.reduce((a, b) => a + (Number(b.amount) || 0), 0)

  /* ---------- HADIYA ---------- */

  const hadiyaCollections =
    collections.filter(c =>
      (c.purpose || "").toLowerCase().includes("hadiya")
    )

  const totalHadiya =
    hadiyaCollections.reduce((a, b) => a + (Number(b.amount) || 0), 0)

  const hadiyaGivenToImam = 12000

  const hadiyaBalance =
    totalHadiya - hadiyaGivenToImam

  /* ---------- DONATIONS ---------- */

  const donationCollections =
    collections.filter(c =>
      !(c.purpose || "").toLowerCase().includes("hadiya")
    )

  const totalDonations =
    donationCollections.reduce((a, b) => a + (Number(b.amount) || 0), 0)

  const donationBalance =
    totalDonations - totalExpenses

  /* ---------- EXPENSE STATS ---------- */

  const uniqueDays = [...new Set(
    expenses
      .filter(e => e.date)
      .map(e => new Date(e.date).toDateString())
  )]

  const avgExpense =
    uniqueDays.length ? totalExpenses / uniqueDays.length : 0

  const cashRunway =
    avgExpense ? donationBalance / avgExpense : 0

  /* ---------- PURPOSE GROUPING ---------- */

  const collectionsByPurpose =
    collections.reduce((acc, c) => {

      const key = normalizePurpose(c.purpose)

      if (!acc[key]) acc[key] = 0

      acc[key] += Number(c.amount) || 0

      return acc

    }, {})

const expensesByPurpose =
  expenses.reduce((acc, e) => {

    const key = normalizePurpose(e.purpose)

    if (!acc[key]) acc[key] = 0

    acc[key] += Number(e.amount) || 0

    return acc

  }, {})

/* add hardcoded hadiya given to imam */

expensesByPurpose["Hadiya given to Imam"] =
  (expensesByPurpose["Hadiya given to Imam"] || 0) + hadiyaGivenToImam

  if (loading) {

    return (

      <div className="p-6 space-y-4 animate-pulse">

        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-32 bg-gray-200 rounded-xl"></div>
        <div className="h-40 bg-gray-200 rounded-xl"></div>
        <div className="h-40 bg-gray-200 rounded-xl"></div>

      </div>

    )

  }

  return (

    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 animate-[fadeIn_.35s_ease]">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-xl md:text-2xl font-bold">
          Finance Dashboard
        </h1>

        <button
          onClick={() => navigate("/forms")}
          className="bg-green-500 hover:bg-green-600 active:scale-95 transition text-white px-4 py-2 rounded-lg shadow-sm"
        >
          Forms
        </button>

      </div>


      {/* EXPENSE SUMMARY CARD */}

      <div className="bg-white rounded-xl shadow-sm border p-5 transition hover:-translate-y-0.5 hover:shadow-md">

        <h2 className="font-semibold text-lg mb-4">
          Expense Overview
        </h2>

        <div className="grid grid-cols-3 gap-4 text-center">

          <div className="transition hover:scale-[1.03]">

            <p className="text-xs text-gray-500">
              Total Expenses
            </p>

            <p className="text-xl font-bold text-red-600">
              ₹ {Math.round(totalExpenses).toLocaleString()}
            </p>

          </div>

          <div className="transition hover:scale-[1.03]">

            <p className="text-xs text-gray-500">
              Avg / Day
            </p>

            <p className="text-xl font-bold text-orange-500">
              ₹ {Math.round(avgExpense).toLocaleString()}
            </p>

          </div>

          <div className="transition hover:scale-[1.03]">

            <p className="text-xs text-gray-500">
              Cash Runway
            </p>

            <p className="text-xl font-bold text-green-600">
              {Math.round(cashRunway)} days
            </p>

          </div>

        </div>

      </div>


      {/* DONATION + HADIYA */}

      <div className="grid md:grid-cols-2 gap-4">

        <FinanceCard
          title="Donations"
          rows={[
            { label: "Received", value: totalDonations, color: "text-blue-600" },
            { label: "Balance", value: donationBalance, color: "text-green-600" }
          ]}
        />

        <FinanceCard
          title="Hadiya"
          rows={[
            { label: "Received", value: totalHadiya, color: "text-blue-600" },
            { label: "Given to Imam", value: hadiyaGivenToImam, color: "text-red-500" },
            { label: "Balance", value: hadiyaBalance, color: "text-green-600" }
          ]}
        />

      </div>


      {/* COLLECTION PURPOSES */}

      <TableCard
        title="Funds Received by Purpose"
        data={collectionsByPurpose}
      />


      {/* EXPENSE PURPOSES */}

      <TableCard
        title="Expenses by Purpose"
        data={expensesByPurpose}
      />

    </div>

  )

}


/* ---------- FINANCE CARD ---------- */

function FinanceCard({ title, rows }) {

  return (

    <div className="bg-white rounded-xl shadow-sm border p-5 transition hover:-translate-y-0.5 hover:shadow-md">

      <h3 className="font-semibold text-lg mb-4">
        {title}
      </h3>

      <div className="space-y-3">

        {rows.map((r, i) => (

          <div
            key={i}
            className="flex justify-between items-center transition hover:bg-gray-50 p-1 rounded"
          >

            <span className="text-sm text-gray-500">
              {r.label}
            </span>

            <span className={`font-semibold ${r.color}`}>
              ₹ {Math.round(r.value).toLocaleString()}
            </span>

          </div>

        ))}

      </div>

    </div>

  )

}


/* ---------- TABLE CARD ---------- */

function TableCard({ title, data }) {

  return (

    <div className="bg-white rounded-xl shadow-sm border p-5 transition hover:-translate-y-0.5 hover:shadow-md">

      <h3 className="font-semibold text-lg mb-4">
        {title}
      </h3>

      <table className="w-full text-sm">

        <thead className="bg-gray-50">

          <tr>
            <th className="text-left p-2">Purpose</th>
            <th className="text-right p-2">Amount</th>
          </tr>

        </thead>

        <tbody>

          {Object.entries(data).map(([p, a]) => (

            <tr
              key={p}
              className="border-t hover:bg-gray-50 transition"
            >

              <td className="p-2">{p}</td>

              <td className="p-2 text-right font-semibold">
                ₹ {a.toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}
import { useNavigate } from "react-router-dom"
import ExpenseTable from "../components/ExpenseTable"

export default function Expenses(){

  const navigate = useNavigate()

  const add = () => {

    if(localStorage.getItem("auth")==="true"){
      navigate("/expenses/new")
    }
    else{
      alert("Enter password in dashboard")
    }

  }

  return(

    <div>

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-bold">
          Expenses
        </h1>

      </div>

      <ExpenseTable/>

    </div>

  )

}
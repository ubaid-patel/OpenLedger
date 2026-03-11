import { useState } from "react"

export default function PasswordModal({open,onClose,onSuccess}){

  const [password,setPassword] = useState("")

  if(!open) return null

  const submit=()=>{

    if(password==="595"){
      onSuccess()
      onClose()
    }
    else{
      alert("Wrong password")
    }

  }

  return(

    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-xl shadow w-80">

        <h2 className="text-lg font-semibold mb-4">
          Enter Password
        </h2>

        <input
        type="password"
        className="border w-full p-2 rounded mb-4"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-2">

          <button
          onClick={onClose}
          className="px-4 py-2 border rounded">

            Cancel

          </button>

          <button
          onClick={submit}
          className="px-4 py-2 bg-blue-500 text-white rounded">

            Submit

          </button>

        </div>

      </div>

    </div>

  )

}
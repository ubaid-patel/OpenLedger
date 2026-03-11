import { Navigate } from "react-router-dom"

export default function AdminRoute({children}){

  const auth = localStorage.getItem("admin_auth")

  if(auth !== "true"){
    return <Navigate to="/admin" />
  }

  return children
}
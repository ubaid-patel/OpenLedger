import { useState } from "react"

export default function LazyImage({ src, alt, className }){

  const [loaded,setLoaded] = useState(false)

  return (

    <div className="relative overflow-hidden">

      {/* Blur placeholder */}

      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse"/>
      )}

      <img
        loading="lazy"
        src={src}
        alt={alt}
        onLoad={()=>setLoaded(true)}
        className={`${className} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

    </div>

  )

}
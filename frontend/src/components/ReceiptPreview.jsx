import { useState, useRef } from "react"
import { ZoomIn, ZoomOut, RotateCcw, X } from "lucide-react"

function optimizeImage(url){

  const width = window.innerWidth
  const dpr = window.devicePixelRatio || 1

  let targetWidth = Math.round(width * dpr)

  if(targetWidth > 1600) targetWidth = 1600

  return `${url}?width=${targetWidth}&quality=75&format=auto`

}

export default function ReceiptPreview({ url }){

  const [open,setOpen] = useState(false)
  const [zoom,setZoom] = useState(1)
  const [offset,setOffset] = useState({x:0,y:0})

  const startDistance = useRef(0)
  const startZoom = useRef(1)

  const panStart = useRef(null)

  const lastTap = useRef(0)
  const startY = useRef(null)

  /* ---------- DISTANCE ---------- */

  const getDistance = (touches)=>{
    const dx = touches[0].clientX - touches[1].clientX
    const dy = touches[0].clientY - touches[1].clientY
    return Math.sqrt(dx*dx + dy*dy)
  }

  /* ---------- TOUCH START ---------- */

  const handleTouchStart = (e)=>{

    if(e.touches.length===2){

      startDistance.current = getDistance(e.touches)
      startZoom.current = zoom

    }

    if(e.touches.length===1){

      const touch = e.touches[0]

      panStart.current = {
        x: touch.clientX - offset.x,
        y: touch.clientY - offset.y
      }

      startY.current = touch.clientY

      const now = Date.now()

      /* double tap */

      if(now-lastTap.current < 300){

        if(zoom===1){
          setZoom(2)
        }else{
          reset()
        }

      }

      lastTap.current = now

    }

  }

  /* ---------- TOUCH MOVE ---------- */

  const handleTouchMove = (e)=>{

    /* pinch zoom */

    if(e.touches.length===2){

      e.preventDefault()

      const newDistance = getDistance(e.touches)

      const scale = newDistance/startDistance.current

      const newZoom = startZoom.current * scale

      setZoom(Math.min(Math.max(newZoom,1),4))

    }

    /* pan */

    if(e.touches.length===1 && zoom>1){

      const touch = e.touches[0]

      setOffset({
        x: touch.clientX - panStart.current.x,
        y: touch.clientY - panStart.current.y
      })

    }

    /* swipe down close */

    if(e.touches.length===1 && zoom===1){

      const currentY = e.touches[0].clientY

      if(startY.current && currentY-startY.current > 120){
        setOpen(false)
      }

    }

  }

  /* ---------- ZOOM BUTTONS ---------- */

  const zoomIn = ()=> setZoom(z=>Math.min(z+0.3,4))
  const zoomOut = ()=> setZoom(z=>Math.max(z-0.3,1))

  const reset = ()=>{
    setZoom(1)
    setOffset({x:0,y:0})
  }

  return(

    <>

      {/* THUMBNAIL */}

      <img
        src={optimizeImage(url)}
        alt="receipt"
        onPointerDown={(e)=>{
          e.stopPropagation()
          setOpen(true)
        }}
        className="w-10 h-10 object-cover rounded border cursor-pointer hover:scale-105 transition"
      />

      {open && (

        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onPointerDown={()=>setOpen(false)}
        >

          {/* CLOSE (desktop only) */}

          <button
            onPointerDown={(e)=>{
              e.stopPropagation()
              setOpen(false)
            }}
            className="hidden md:block absolute top-6 right-6 z-50 bg-red-500 text-white p-3 rounded-full shadow-xl"
          >
            <X size={20}/>
          </button>

          {/* DESKTOP CONTROLS */}

          <div
            className="hidden md:flex absolute bottom-8 gap-3 z-50 bg-white/20 backdrop-blur-md p-2 rounded-full shadow-xl"
            onPointerDown={(e)=>e.stopPropagation()}
          >

            <button
              onPointerDown={zoomIn}
              className="bg-white p-2 rounded-full shadow"
            >
              <ZoomIn size={18}/>
            </button>

            <button
              onPointerDown={zoomOut}
              className="bg-white p-2 rounded-full shadow"
            >
              <ZoomOut size={18}/>
            </button>

            <button
              onPointerDown={reset}
              className="bg-white p-2 rounded-full shadow"
            >
              <RotateCcw size={18}/>
            </button>

          </div>

          {/* IMAGE */}

          <div
            className="overflow-hidden max-h-[92vh] max-w-[95vw]"
            onPointerDown={(e)=>e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            style={{touchAction:"none"}}
          >

            <img
              src={optimizeImage(url)}
              alt="receipt"
              style={{
                transform:`translate(${offset.x}px,${offset.y}px) scale(${zoom})`
              }}
              className="transition-transform duration-150 select-none"
            />

          </div>

        </div>

      )}

    </>

  )

}
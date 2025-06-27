import { useEffect, useRef } from "react"
import "./LoadingSpinner.css"

const LoadingSpinner = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationFrameId
    let rotation = 0

    canvas.width = 120
    canvas.height = 120

    const drawTire = (rotation) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rotation)
      ctx.beginPath()
      ctx.arc(0, 0, 50, 0, Math.PI * 2)
      ctx.fillStyle = "#333"
      ctx.fill()
      ctx.beginPath()
      ctx.arc(0, 0, 25, 0, Math.PI * 2)
      ctx.fillStyle = "#666"
      ctx.fill()
      for (let i = 0; i < 8; i++) {
        ctx.save()
        ctx.rotate((i * Math.PI) / 4)
        ctx.beginPath()
        ctx.rect(-5, -48, 10, 20)
        ctx.fillStyle = "#222"
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(-3, -25)
        ctx.lineTo(-3, -5)
        ctx.lineTo(3, -5)
        ctx.lineTo(3, -25)
        ctx.fillStyle = "#888"
        ctx.fill()

        ctx.restore()
      }

      // Restore the context state
      ctx.restore()
    }

    const animate = () => {
      rotation += 0.03
      drawTire(rotation)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="spinner-container">
      <canvas ref={canvasRef} className="tire-spinner"></canvas>
      <p>Loading...</p>
    </div>
  )
}

export default LoadingSpinner

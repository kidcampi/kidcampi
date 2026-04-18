import React, { useState } from 'react'
import frontBlackImage from './assets/frontblack.png'
import backBlackImage from './assets/backblack.png'
import frontWhiteImage from './assets/frontwhite.png'
import backWhiteImage from './assets/backwhite.png'

export default function App() {
  const [selectedTalla, setSelectedTalla] = useState('S')
  const [selectedColor, setSelectedColor] = useState('Negro')
  const [selectedView, setSelectedView] = useState('Front')
  const [cantidad, setCantidad] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const currentImage =
    selectedColor === 'Negro'
      ? selectedView === 'Front'
        ? frontBlackImage
        : backBlackImage
      : selectedView === 'Front'
        ? frontWhiteImage
        : backWhiteImage

  const handleCheckout = async () => {
    if (isLoading) return

    try {
      setIsLoading(true)

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          talla: selectedTalla,
          color: selectedColor,
          cantidad,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'No se pudo iniciar el pago')
      }

      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('No se pudo abrir Stripe Checkout. Revisa la configuración e inténtalo de nuevo.')
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#111111',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1150px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '60px',
        }}
      >
        <div
          style={{
            flex: '1 1 420px',
            maxWidth: '500px',
          }}
        >
          <img
            src={currentImage}
            alt="Camiseta"
            style={{
              width: '100%',
              borderRadius: '28px',
              display: 'block',
              objectFit: 'cover',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            }}
          />
        </div>

        <div
          style={{
            flex: '1 1 420px',
            maxWidth: '520px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#777',
              marginBottom: '14px',
            }}
          >
            Edición limitada
          </p>

          <h1
            style={{
              fontSize: '56px',
              lineHeight: '1',
              margin: '0 0 18px 0',
              fontWeight: '700',
            }}
          >
            Camiseta Essential
          </h1>

          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#555',
              marginBottom: '26px',
            }}
          >
            Una sola camiseta. Sin menús, sin distracciones. Un portal directo,
            limpio y enfocado únicamente en vender este producto.
          </p>

          <div
            style={{
              fontSize: '34px',
              fontWeight: '700',
              marginBottom: '30px',
            }}
          >
            29,95 €
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '15px',
              }}
            >
              Talla
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              {['S', 'M', 'L', 'XL'].map((talla) => (
                <button
                  key={talla}
                  type="button"
                  onClick={() => setSelectedTalla(talla)}
                  style={selectedTalla === talla ? selectedSize : sizeButton}
                >
                  {talla}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '15px',
              }}
            >
              Color
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                aria-label="Color negro"
                onClick={() => setSelectedColor('Negro')}
                style={selectedColor === 'Negro' ? selectedColorCircle : colorCircle}
              >
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#111111',
                    display: 'block',
                  }}
                />
              </button>

              <button
                type="button"
                aria-label="Color blanco"
                onClick={() => setSelectedColor('Blanco')}
                style={selectedColor === 'Blanco' ? selectedColorCircle : colorCircle}
              >
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d6d6d6',
                    display: 'block',
                  }}
                />
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '15px',
              }}
            >
              Vista
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              {['Front', 'Back'].map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setSelectedView(view)}
                  style={selectedView === view ? selectedSize : sizeButton}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <div
              style={{
                marginBottom: '12px',
                fontWeight: '600',
                fontSize: '15px',
              }}
            >
              Cantidad
            </div>

            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => {
                const value = Number(e.target.value)
                setCantidad(Number.isInteger(value) && value > 0 ? value : 1)
              }}
              style={{
                width: '90px',
                padding: '14px',
                borderRadius: '16px',
                border: '1px solid #d6d6d6',
                fontSize: '16px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isLoading}
            style={{
              padding: '17px 34px',
              borderRadius: '18px',
              border: 'none',
              backgroundColor: '#111111',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Redirigiendo...' : 'Comprar ahora'}
          </button>

          <p
            style={{
              marginTop: '22px',
              fontSize: '14px',
              color: '#888',
              lineHeight: '1.6',
            }}
          >
            Portal simple de un solo producto.
          </p>
        </div>
      </div>
    </div>
  )
}

const sizeButton = {
  padding: '13px 20px',
  borderRadius: '16px',
  border: '1px solid #d6d6d6',
  backgroundColor: '#ffffff',
  color: '#111111',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
}

const selectedSize = {
  padding: '13px 20px',
  borderRadius: '16px',
  border: '1px solid #111111',
  backgroundColor: '#111111',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
}

const colorCircle = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  border: '1px solid #d6d6d6',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: '0',
}

const selectedColorCircle = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  border: '2px solid #111111',
  backgroundColor: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: '0',
  boxShadow: '0 0 0 3px rgba(17,17,17,0.08)',
}

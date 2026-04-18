import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { talla, color, cantidad } = req.body || {}

    const tallaFinal = typeof talla === 'string' && talla.trim() ? talla.trim() : 'S'
    const colorFinal = typeof color === 'string' && color.trim() ? color.trim() : 'Negro'
    const cantidadNumero = Number(cantidad)
    const cantidadFinal = Number.isInteger(cantidadNumero) && cantidadNumero > 0 ? cantidadNumero : 1

    const origin = req.headers.origin || 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ['ES'],
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Camiseta Essential',
              description: `Color: ${colorFinal} · Talla: ${tallaFinal}`,
            },
            unit_amount: 100,
          },
          quantity: cantidadFinal,
        },
      ],
      metadata: {
        talla: tallaFinal,
        color: colorFinal,
        cantidad: String(cantidadFinal),
      },
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    })

    return res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return res.status(500).json({
      error: 'No se pudo crear la sesión de pago',
    })
  }
}

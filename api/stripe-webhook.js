import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function getRawBody(readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const signature = req.headers['stripe-signature']

  if (!signature) {
    return res.status(400).json({ error: 'Missing Stripe signature' })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Missing webhook secret' })
  }

  let event

  try {
    const rawBody = await getRawBody(req)

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        console.log('Pago completado:', {
          id: session.id,
          email: session.customer_details?.email || null,
          nombre_envio: session.shipping_details?.name || null,
          direccion_linea_1: session.shipping_details?.address?.line1 || null,
          direccion_linea_2: session.shipping_details?.address?.line2 || null,
          ciudad: session.shipping_details?.address?.city || null,
          codigo_postal: session.shipping_details?.address?.postal_code || null,
          provincia: session.shipping_details?.address?.state || null,
          pais: session.shipping_details?.address?.country || null,
          telefono: session.customer_details?.phone || null,
          talla: session.metadata?.talla || null,
          color: session.metadata?.color || null,
          cantidad: session.metadata?.cantidad || null,
          amount_total: session.amount_total || null,
          currency: session.currency || null,
        })

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        console.log('Checkout expirado:', session.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.log('Pago fallido:', paymentIntent.id)
        break
      }

      default:
        console.log(`Evento no manejado: ${event.type}`)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return res.status(500).json({ error: 'Webhook handler failed' })
  }
}

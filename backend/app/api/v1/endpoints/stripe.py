from fastapi import APIRouter, HTTPException, Request
from typing import Optional
import os

router = APIRouter()

@router.post("/create-checkout-session")
async def create_checkout_session(request: Request, price_id: str, customer_email: Optional[str] = None):
    """
    Create Stripe checkout session for subscription.
    
    For production:
    1. Install stripe: pip install stripe
    2. Add STRIPE_SECRET_KEY to environment
    3. Uncomment the code below
    """
    
    # import stripe
    # stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
    
    # try:
    #     checkout_session = stripe.checkout.Session.create(
    #         payment_method_types=['card'],
    #         line_items=[{
    #             'price': price_id,
    #             'quantity': 1,
    #         }],
    #         mode='subscription',
    #         success_url=request.headers.get('origin') + '/success?session_id={CHECKOUT_SESSION_ID}',
    #         cancel_url=request.headers.get('origin') + '/pricing',
    #         customer_email=customer_email,
    #     )
    #     return {"sessionId": checkout_session.id}
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
    
    return {
        "message": "Stripe integration placeholder. Add STRIPE_SECRET_KEY and uncomment code.",
        "price_id": price_id
    }

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhook events.
    
    Events to handle:
    - checkout.session.completed: User subscribed
    - customer.subscription.deleted: User cancelled
    - invoice.payment_failed: Payment failed
    """
    
    # import stripe
    # 
    # payload = await request.body()
    # sig_header = request.headers.get('stripe-signature')
    # webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    # 
    # try:
    #     event = stripe.Webhook.construct_event(
    #         payload, sig_header, webhook_secret
    #     )
    # except ValueError as e:
    #     raise HTTPException(status_code=400, detail="Invalid payload")
    # except stripe.error.SignatureVerificationError as e:
    #     raise HTTPException(status_code=400, detail="Invalid signature")
    # 
    # if event['type'] == 'checkout.session.completed':
    #     session = event['data']['object']
    #     # Update user subscription in database
    #     pass
    # 
    # return {"status": "success"}
    
    return {"message": "Webhook placeholder"}
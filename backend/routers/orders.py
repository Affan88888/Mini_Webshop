import json
import os
import uuid

from fastapi import FastAPI, Request, APIRouter

orders_router = APIRouter()

ORDERS_PATH = os.path.join("data", "orders.json")

@orders_router.post("/api/orders")
async def create_order(request: Request):
    data = await request.json()
    
    order_id = str(uuid.uuid4())
    order = {
        "id": order_id,
        "customer": data.get("customer"),
        "items": data.get("items"),
        "timestamp": data.get("timestamp")
    }

    try:
        with open(ORDERS_PATH, "r") as f:
            orders = json.load(f)
    except FileNotFoundError:
        orders = []

    orders.append(order)

    with open(ORDERS_PATH, "w") as f:
        json.dump(orders, f, indent=4)

    return {"message": "Order placed", "order_id": order_id}
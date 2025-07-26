import json
import os
import uuid

from fastapi import FastAPI, Request, APIRouter

orders_router = APIRouter()

ORDERS_PATH = os.path.join("data", "orders.json")

@orders_router.post("/create-order")
async def create_order(request: Request):
    """
    Kreira novu narudžbu i sprema je u orders.json fajl.
    Ako lista ne postoji, kreira se nova lista narudžbi.
    """
    data = await request.json()
    
    # Generisanje jedinstvenog ID-a za narudžbu
    order_id = str(uuid.uuid4())

    # Kreiranje objekta narudžbe
    order = {
        "id": order_id,
        "customer": data.get("customer"),       # Podaci o kupcu
        "items": data.get("items"),             # Lista naručenih artikala
        "timestamp": data.get("timestamp")      # Vrijeme kreiranja narudžbe
    }

    try:
        # Učitavanje postojećih narudžbi iz JSON datoteke
        with open(ORDERS_PATH, "r") as f:
            orders = json.load(f)
    except FileNotFoundError:
        # Ako lista ne postoji, koristi se prazna lista
        orders = []

    # Dodavanje nove narudžbe u listu
    orders.append(order)

    # Spremanje ažurirane liste nazad u datoteku
    with open(ORDERS_PATH, "w") as f:
        json.dump(orders, f, indent=4)

    # Vraćanje odgovora sa porukom i ID-em nove narudžbe
    return {"message": "Narudžba je uspješno kreirana", "order_id": order_id}

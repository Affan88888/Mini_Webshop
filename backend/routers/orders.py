import json
import os
import uuid
from uuid import UUID
from datetime import datetime

from fastapi import FastAPI, Request, APIRouter, HTTPException
from pydantic import BaseModel

orders_router = APIRouter()

# Putanja do fajla sa narudžbama
ORDERS_PATH = os.path.join("data", "orders.json")

# Model podataka za update order status
class OrderStatusUpdate(BaseModel):
    status: str
    status_timestamp: str

    
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
        "customer": data.get("customer"),       # Sastoji se od name, surname, address, email, phone
        "items": data.get("items"),
        "timestamp": data.get("timestamp"),
        "status": "pending",                   
        "status_timestamp": None               # Update-at ce se kada order bude accepted/denied/finished
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


@orders_router.get("/orders")
def get_all_orders():
    """
    Vraća sve narudžbe iz fajla orders.json.
    Ako fajl ne postoji ili je prazan, vraća se prazna lista.
    """
    try:
        # Učitavanje narudžbi iz fajla
        with open(ORDERS_PATH, "r") as f:
            orders = json.load(f)
    except FileNotFoundError:
        # Ako fajl ne postoji, vraća se prazna lista
        return []
    except json.JSONDecodeError:
        # Ako fajl nije validan JSON, prijavljuje se greška
        raise HTTPException(status_code=500, detail="Greška pri čitanju narudžbi")
    
    return orders

@orders_router.put("/orders/{order_id}")
def update_order_status(order_id: UUID, update: OrderStatusUpdate):
    """
    Ažurira status postojeće narudžbe na osnovu njenog ID-a.
    Ova ruta omogućava promjenu statusa narudžbe (npr. accepted, denied, finished)
    i bilježi vrijeme kada je status promijenjen.
    """
    try:
        # Učitavanje postojećih narudžbi iz JSON fajla
        with open(ORDERS_PATH, "r") as f:
            orders = json.load(f)

        updated = False

        # Prolazak kroz sve narudžbe kako bi se pronašla ona sa odgovarajućim ID-em
        for order in orders:
            if order["id"] == str(order_id):
                # Ažuriranje statusa i vremena promjene
                order["status"] = update.status
                order["status_timestamp"] = update.status_timestamp
                updated = True
                break

        # Ako nije pronađena narudžba s datim ID-em, vraća se greška
        if not updated:
            raise HTTPException(status_code=404, detail="Order not found")

        # Spremanje ažurirane liste narudžbi u fajl
        with open(ORDERS_PATH, "w") as f:
            json.dump(orders, f, indent=4)

        # Vraća se uspješan odgovor
        return {"message": "Order updated successfully"}

    except Exception as e:
        # Ako dođe do bilo kakve greške, vraća se odgovarajuća HTTP greška
        raise HTTPException(status_code=500, detail=str(e))

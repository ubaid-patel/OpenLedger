from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Expense(BaseModel):
    date: datetime
    paidBy: str
    mode: str
    purpose: str
    amount: float
    notes: Optional[str] = None
    receipts: Optional[str] = None


class Collection(BaseModel):
    name: str
    amount: float
    date: datetime
    mode: str
    notes: Optional[str] = None
from sqlmodel import SQLModel, Field, Relationship
from typing import List, Optional

class Dishes_Base(SQLModel):
    dishes_name: str
    dishes_description: str | None = None
    discount: float | None = None
    price: float

class Dishes(Dishes_Base, table=True):
    id: int | None = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="category_dishes.category")
    dishes_state: bool = Field(default=True)

class DishesCreate(Dishes_Base):
    category_id: int

class DishesRead(Dishes_Base):
    id: int
    category_id: int
    dishes_state: bool

class DishesUpdate(SQLModel):
    dishes_name: Optional[str] = None
    dishes_description: Optional[str] = None
    price: Optional[float] = None
    dishes_state: Optional[bool] = None
    discount: Optional[float] = None
    category_id: Optional[int] = None
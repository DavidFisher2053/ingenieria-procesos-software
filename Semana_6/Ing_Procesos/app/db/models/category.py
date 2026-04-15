from sqlmodel import SQLModel, Field
from typing import Optional

class CategoryBase(SQLModel):
    category: int
    category_description: str | None = None

class Category(CategoryBase, table=True):
    __tablename__ = "category_dishes"
    id: int | None = Field(default=None, primary_key=True)
    category: int = Field(index=True)
    category_description: str | None = None

class CategoryCreate(CategoryBase):
    pass

class CategoryRead(CategoryBase):
    id: int

class CategoryUpdate(SQLModel):
    category: Optional[int] = None
    category_description: Optional[str] = None

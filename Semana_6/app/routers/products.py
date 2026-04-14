from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.exc import IntegrityError
from db.database import select, get_Session, Session 
from db.models.dishes import Dishes, DishesCreate, DishesRead, DishesUpdate


router = APIRouter(prefix="/products",
                   tags=["products"], 
                   responses={status.HTTP_404_NOT_FOUND: {"message": "Producto no encontrado"}})

# ------ GET Obtener Platos ------ #
@router.get("/", response_model=list[DishesRead], status_code=status.HTTP_200_OK)
async def get_dishes(session: Session = Depends(get_Session)):
    dishes = session.exec(select(Dishes)).all()
    return dishes

# ------ GET Obtener Plato ------ #
@router.get("/{product_id}", response_model=DishesRead, status_code=status.HTTP_200_OK)
async def get_dish(product_id:int, session: Session = Depends(get_Session)):

    dish = session.get(Dishes, product_id)

    if not dish:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El plato no existe")

    return dish

# ------ POST Crear Plato ------ #
@router.post("/", response_model=DishesRead, status_code=status.HTTP_201_CREATED)
async def create_dish(dish: DishesCreate, session: Session = Depends(get_Session)):
    try:
        new_dish = Dishes(
            dishes_name=dish.dishes_name,
            dishes_description=dish.dishes_description,
            price=dish.price,
            discount=dish.discount,
            category_id=dish.category_id
        )

        session.add(new_dish)
        session.commit()
        session.refresh(new_dish)
        return new_dish

    except IntegrityError as e:
        session.rollback()
        error_str = str(e)
        if "dishes_name" in error_str:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre del plato ya está registrado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al crear el plato"
            )

# ------ PUT Actualizar Plato ------ #
@router.put("/{product_id}", response_model=DishesRead, status_code=status.HTTP_200_OK)
async def update_dish(product_id: int, dish_update: DishesUpdate, session: Session = Depends(get_Session)):
    try:
        dish = session.get(Dishes, product_id)
        if not dish:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El plato no existe")

        for key, value in dish_update.model_dump(exclude_unset=True).items():
            setattr(dish, key, value)
        
        session.add(dish)
        session.commit()
        session.refresh(dish)
        return dish
    
    except IntegrityError as e:
        session.rollback()
        error_str = str(e)
        if "dishes_name" in error_str:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre del plato ya está registrado"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al actualizar el plato"
            )

# ------ DELETE Eliminar Plato ------ #
@router.delete("/{product_id}")
async def delete_dish(product_id: int, session: Session = Depends(get_Session)):

    dish = session.get(Dishes, product_id)

    if not dish:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El plato no existe")
    
    session.delete(dish)
    session.commit()
    return {"message": "El plato ha sido eliminado"}
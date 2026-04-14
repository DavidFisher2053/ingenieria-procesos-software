from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.exc import IntegrityError
from db.database import select, get_Session, Session 
from db.models.user import Users, UserCreate, UserRead, UserUpdate
from core.security import hash_password


router = APIRouter(prefix="/users", tags=["users"], responses={status.HTTP_404_NOT_FOUND: {"message": "Usuario no encontrado"}})

@router.get("/", response_model=list[UserRead], status_code=status.HTTP_200_OK)
async def users(session: Session = Depends(get_Session)):
    users = session.exec(select(Users)).all()
    return users

# ------ GET Obtener Usuario ------ #
@router.get("/{user_id}", response_model=UserRead, status_code=status.HTTP_200_OK)
async def user(user_id:int, session: Session = Depends(get_Session)):

    user = session.get(Users, user_id)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El usuario no existe")

    return user


# ------ POST Crear Usuario ------ #
@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, session: Session = Depends(get_Session)):
    try:
        # Hashear la contraseña antes de guardarla
        hashed_password = hash_password(user.user_password)

        new_user = Users(
            user_name=user.user_name,
            user_password=hashed_password,
            user_email=user.user_email,
            user_full_name=user.user_full_name,
            user_role=2
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user

    except IntegrityError as e:
        session.rollback()
        if user.user_email in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        elif user.user_name in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre de usuario ya existe"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al crear el usuario"
            )

# ------ PUT Actualizar Usuario ------ #
@router.put("/{user_id}", response_model=UserRead, status_code=status.HTTP_200_OK)
async def update_user(user_id: int, user_update: UserUpdate, session: Session = Depends(get_Session)):
    try:
        user = session.get(Users, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El usuario no existe")

        user_update.user_password = hash_password(user_update.user_password) if user_update.user_password else None

        for key, value in user_update.model_dump(exclude_unset=True).items():
            setattr(user, key, value)
        
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    
    except IntegrityError as e:
        session.rollback()
        if user_update.user_email in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        elif user_update.user_name in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El nombre de usuario ya existe"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al crear el usuario"
            )



# ------ DELETE Eliminar Usuario ------ #
@router.delete("/{user_id}")
async def delete_user(user_id: int, session: Session = Depends(get_Session)):

    user = session.get(Users, user_id)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="El usuario no existe")
    
    session.delete(user)
    session.commit()
    return {"message": "El usuario ha sido eliminado"}
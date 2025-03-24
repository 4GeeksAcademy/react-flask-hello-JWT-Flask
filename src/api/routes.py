from flask import Blueprint, request, jsonify
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import json
from flask_bcrypt import Bcrypt 



api = Blueprint('api', __name__)
bcrypt = Bcrypt()

# Allow CORS requests to this API
CORS(api)

@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    if not users:
        return "not users found", 404
    return jsonify([user.serialize() for user in users]), 200

# Obtener un usuario por ID
@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404
    return jsonify(user.serialize()), 200

# Ruta de Registro
@api.route('/signup', methods=['POST'])
def create_user():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8') 

    new_user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_password
)
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "El usuario ya existe"}), 400

    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201


# Ruta de Inicio de Sesión (Login)
@api.route('/login', methods=['POST'])
def login_user():

    body = request.get_json()

    if not body or "email" not in body or "password" not in body:
        return jsonify({"msg": "credenciales no validas"}), 400 

    email = body["email"]
    password = body["password"]
    user = User.query.filter_by(email=email).first()
    print(user)
    #if bcrypt.check_password_hash(user.password, body["password"]):
    if user != None and bcrypt.check_password_hash(user.password, body["password"]):
        token=create_access_token(identity=user.email)
        user_data = {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
        
        return jsonify({"msg": "inicio de sesion exitoso", "token": token, "user": user_data}), 200
    return jsonify({"msg": "credenciales no validas"}), 400 

@api.route('/user', methods=['GET'])
@jwt_required()
def get_user_info():

    current_user_email = get_jwt_identity()

    user = User().query.filter_by(email=current_user_email).first()

    if not user:
        return jsonify({"msg": "usuario no encontrado"}), 400

    user_data = {
        "id": user.id,
        "email": user.email,
        "name": user.name
    }

    return jsonify(user_data), 200


# Ruta Privada (Protegida por JWT)
@api.route('/private', methods=['GET'])
@jwt_required()  # Solo accesible para usuarios autenticados
def private():
    current_user = get_jwt_identity()  # Obtener la identidad del usuario desde el token JWT
    return jsonify({"message": f"Hello user {current_user}, you have access to this page"}), 200


# Ruta de prueba (Hola)
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

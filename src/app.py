import os
from flask import Flask, jsonify, send_from_directory
from flask_migrate import Migrate
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_bcrypt import Bcrypt

# Configuración de entorno y directorios
ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

# Inicializar la aplicación Flask
app = Flask(__name__)
app.url_map.strict_slashes = False

# Configuración de la base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Configuración de JWT (clave secreta obtenida desde las variables de entorno)
app.config["JWT_SECRET_KEY"] = "cualquiercosa"
app.config["JWT_ACCESS_TOKEN_EXPIRE"] = timedelta(hours=1)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)


# Configuración de administración y comandos
setup_admin(app)
setup_commands(app)

# Registrar los endpoints de la API con un prefijo "/api"
app.register_blueprint(api, url_prefix='/api')

# Manejo de errores personalizados (APIException)
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# Ruta para generar un mapa del sitio (en desarrollo) o servir archivo estático
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# Cualquier otra ruta será tratada como archivo estático
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'  # Si no encuentra el archivo, redirige al index.html
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # Evitar el almacenamiento en caché
    return response

# Ejecutar la aplicación Flask
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))  # El puerto se toma de las variables de entorno
    app.run(host='0.0.0.0', port=PORT, debug=True)

import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_bcrypt import Bcrypt
from .models import db, User

bcrypt = Bcrypt()

# Sobrescribimos el ModelView para encriptar la contraseña antes de guardarla
class UserModelView(ModelView):
    def on_model_change(self, form, model, is_created):
        if is_created:  # Solo encripta cuando se crea un nuevo usuario
            model.password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        return super(UserModelView, self).on_model_change(form, model, is_created)

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Añadimos el UserModelView que sobrescribe el comportamiento de la creación de usuarios
    admin.add_view(UserModelView(User, db.session))

    # Puedes agregar más modelos aquí, si es necesario
    # admin.add_view(ModelView(OtherModel, db.session))

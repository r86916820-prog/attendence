from flask import Flask, render_template, redirect, url_for, flash
from flask_login import LoginManager
from config import Config
from models import db, Faculty
import os

app = Flask(__name__)
app.config.from_object(Config)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message_category = 'warning'

@login_manager.user_loader
def load_user(faculty_id):
    return Faculty.query.get(int(faculty_id))

# Custom Error Handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

# Import & Register Route Blueprints
# Note: In modular structure, routes are registered via Flask blueprints
def register_blueprints():
    try:
        from routes.auth import auth_bp
        from routes.main import main_bp
        from routes.departments import dept_bp
        from routes.subjects import subj_bp
        from routes.students import student_bp
        from routes.attendance import attendance_bp
        from routes.reports import reports_bp
        from routes.analytics import analytics_bp
        from routes.profile import profile_bp

        app.register_blueprint(auth_bp)
        app.register_blueprint(main_bp)
        app.register_blueprint(dept_bp)
        app.register_blueprint(subj_bp)
        app.register_blueprint(student_bp)
        app.register_blueprint(attendance_bp)
        app.register_blueprint(reports_bp)
        app.register_blueprint(analytics_bp)
        app.register_blueprint(profile_bp)
    except ImportError:
        pass

register_blueprints()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)

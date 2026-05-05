from datetime import datetime, timedelta
from pathlib import Path
from urllib.parse import urlparse
from uuid import uuid4
import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import OperationalError
import joblib
import numpy as np
import pandas as pd
from werkzeug.security import check_password_hash, generate_password_hash

from market_data import load_market_data, market_records, normalize_key

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None


BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent


def load_env_file(path, override=False):
    if not path.exists():
        return

    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if override or key not in os.environ:
            os.environ[key] = value


if load_dotenv:
    load_dotenv(PROJECT_DIR / ".env")
    load_dotenv(BASE_DIR / ".env", override=True)
else:
    load_env_file(PROJECT_DIR / ".env")
    load_env_file(BASE_DIR / ".env", override=True)

app = Flask(__name__)
CORS(app)


def sqlite_database_uri():
    sqlite_path = BASE_DIR / "instance" / "users.db"
    sqlite_path.parent.mkdir(parents=True, exist_ok=True)
    return f"sqlite:///{sqlite_path.as_posix()}"


def database_uri():
    url = os.getenv("DATABASE_URL")

    # If no DATABASE_URL → fallback to SQLite
    if not url or url.strip() == "":
        print("DATABASE_URL not set. Using SQLite fallback.")
        return sqlite_database_uri()

    # Fix common mistakes
    url = url.strip()

    # Convert postgres:// → postgresql+psycopg2://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg2://", 1)

    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)

    # Validate URL
    try:
        from sqlalchemy.engine.url import make_url
        make_url(url)
    except Exception as e:
        print(f"Invalid DATABASE_URL: {url}")
        print("Error:", e)
        print("Falling back to SQLite.")
        return sqlite_database_uri()

    return url


app.config["SQLALCHEMY_DATABASE_URI"] = database_uri()
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"pool_pre_ping": True}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv(
    "JWT_SECRET_KEY",
    "dev-change-this-secret-value-at-least-32-bytes",
)

db = SQLAlchemy(app)
jwt = JWTManager(app)

MODEL_PATH = BASE_DIR / "model" / "price_model.pkl"
LE_CROP_PATH = BASE_DIR / "model" / "le_crop.pkl"
LE_LOC_PATH = BASE_DIR / "model" / "le_loc.pkl"
METADATA_PATH = BASE_DIR / "model" / "model_metadata.pkl"
DATA_PATH = BASE_DIR / "data" / "crop_data.csv"

model = None
le_crop = None
le_loc = None
model_metadata = {}
df_data = pd.DataFrame()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    predictions = db.relationship(
        "Prediction", backref="user", lazy=True, cascade="all, delete-orphan"
    )


class Prediction(db.Model):
    __tablename__ = "predictions"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False, index=True)
    crop = db.Column(db.String(160), nullable=False)
    location = db.Column(db.String(160), nullable=False)
    target_date = db.Column(db.DateTime, nullable=False)
    predicted_price = db.Column(db.Float, nullable=False)
    previous_price = db.Column(db.Float, nullable=False)
    last_updated = db.Column(db.DateTime, nullable=False)
    prediction_range = db.Column(db.JSON, nullable=False)
    weather = db.Column(db.JSON, nullable=True)
    request_payload = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)


def load_resources():
    global model, le_crop, le_loc, model_metadata, df_data
    missing = [
        path
        for path in [MODEL_PATH, LE_CROP_PATH, LE_LOC_PATH, DATA_PATH]
        if not path.exists()
    ]
    if missing:
        print("Missing model/data files:", ", ".join(str(path) for path in missing))
        return

    model = joblib.load(MODEL_PATH)
    le_crop = joblib.load(LE_CROP_PATH)
    le_loc = joblib.load(LE_LOC_PATH)
    model_metadata = joblib.load(METADATA_PATH) if METADATA_PATH.exists() else {}
    df_data = load_market_data(DATA_PATH)
    print("Resources loaded successfully.")


# def init_database():
#     with app.app_context():
#         try:
#             db.create_all()
#         except OperationalError:
#             if os.getenv("ALLOW_SQLITE_FALLBACK") == "1":
#                 print(
#                     "Remote database connection failed. Falling back to local SQLite database."
#                 )
#                 db.session.remove()
#                 db.engine.dispose()
#                 app.config["SQLALCHEMY_DATABASE_URI"] = sqlite_database_uri()
#                 db.create_all()
#             else:
#                 raise

def init_database():
    with app.app_context():
        try:
            db.create_all()
            print("Connected to remote database.")
        except Exception as e:
            print("Database connection failed:", e)

            if os.getenv("ALLOW_SQLITE_FALLBACK") == "1":
                print("Switching to SQLite fallback...")

                db.session.remove()
                db.engine.dispose()

                app.config["SQLALCHEMY_DATABASE_URI"] = sqlite_database_uri()
                db.create_all()

                print("SQLite database initialized.")
            else:
                raise


def serialize_user(user):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "created_at": user.created_at.isoformat(),
    }


def serialize_prediction(prediction):
    return {
        "id": prediction.id,
        "crop": prediction.crop,
        "location": prediction.location,
        "target_date": prediction.target_date.strftime("%Y-%m-%d"),
        "predicted_price": round(float(prediction.predicted_price), 2),
        "previous_price": round(float(prediction.previous_price), 2),
        "last_updated": prediction.last_updated.strftime("%Y-%m-%d"),
        "predictions_range": prediction.prediction_range,
        "weather": prediction.weather,
        "created_at": prediction.created_at.isoformat(),
    }


def get_simulated_weather(location):
    patterns = {
        "mumbai": {"temp": 32, "rain": 5, "hum": 75},
        "delhi": {"temp": 38, "rain": 2, "hum": 30},
        "bangalore": {"temp": 28, "rain": 12, "hum": 50},
        "chennai": {"temp": 34, "rain": 8, "hum": 80},
        "kolkata": {"temp": 35, "rain": 15, "hum": 70},
    }

    base = patterns.get(normalize_key(location), {"temp": 30, "rain": 10, "hum": 60})
    return {
        "temp": round(base["temp"] + np.random.uniform(-3, 3), 1),
        "rain": round(max(0, base["rain"] + np.random.uniform(-5, 10)), 1),
        "hum": round(base["hum"] + np.random.uniform(-10, 10), 1),
    }


def parse_target_date(value):
    if not value:
        latest_date = df_data["date"].max() if not df_data.empty else pd.Timestamp.utcnow()
        return latest_date.to_pydatetime() + timedelta(days=1)
    return datetime.strptime(value, "%Y-%m-%d")


def feature_row(future_date, previous_price, previous_min, previous_max, crop_key, location_key):
    values = {
        "day_of_year": future_date.timetuple().tm_yday,
        "week_of_year": future_date.isocalendar()[1],
        "month": future_date.month,
        "year": future_date.year,
        "prev_price": previous_price,
        "prev_min_price": previous_min,
        "prev_max_price": previous_max,
        "crop_encoded": int(le_crop.transform([crop_key])[0]),
        "loc_encoded": int(le_loc.transform([location_key])[0]),
    }
    columns = model_metadata.get("feature_columns") or list(values)
    return pd.DataFrame([[values[column] for column in columns]], columns=columns)


@app.route("/health", methods=["GET"])
def health():
    db_uri = app.config["SQLALCHEMY_DATABASE_URI"]
    parsed_db = urlparse(db_uri.replace("postgresql+psycopg2://", "postgresql://", 1))
    return jsonify(
        {
            "ok": True,
            "model_loaded": model is not None,
            "rows": int(len(df_data)),
            "price_unit": model_metadata.get("price_unit", "INR per quintal"),
            "database": parsed_db.scheme,
            "database_host": parsed_db.hostname,
        }
    )


@app.route("/options", methods=["GET"])
def options():
    if df_data.empty:
        return jsonify({"crops": [], "locations": []})

    crop = request.args.get("crop")
    options_df = df_data
    if crop:
        options_df = options_df[options_df["crop_key"] == normalize_key(crop)]

    latest_date = df_data["date"].max()
    default_prediction_date = latest_date + pd.Timedelta(days=1)

    return jsonify(
        {
            "crops": sorted(df_data["crop"].drop_duplicates().tolist(), key=str.lower),
            "locations": sorted(
                options_df["location"].drop_duplicates().tolist(), key=str.lower
            ),
            "latest_date": latest_date.strftime("%Y-%m-%d"),
            "default_prediction_date": default_prediction_date.strftime("%Y-%m-%d"),
            "price_unit": model_metadata.get("price_unit", "INR per quintal"),
        }
    )


@app.route("/weather", methods=["GET"])
def weather():
    location = request.args.get("location", "mumbai")
    return jsonify(get_simulated_weather(location))


@app.route("/predict", methods=["POST"])
@jwt_required()
def predict():
    if model is None or df_data.empty:
        return jsonify({"msg": "Model or dataset not loaded"}), 500

    data = request.get_json() or {}
    crop = (data.get("crop") or "").strip()
    location = (data.get("location") or "").strip()
    if not crop or not location:
        return jsonify({"msg": "Crop and location are required"}), 400

    crop_key = normalize_key(crop)
    location_key = normalize_key(location)
    if crop_key not in set(le_crop.classes_) or location_key not in set(le_loc.classes_):
        return jsonify({"msg": "Selected crop or location is not available in the model"}), 400

    try:
        target_date = parse_target_date(data.get("date"))
    except ValueError:
        return jsonify({"msg": "Date must be in YYYY-MM-DD format"}), 400

    subset = df_data[
        (df_data["crop_key"] == crop_key) & (df_data["location_key"] == location_key)
    ].sort_values(by="date")

    if subset.empty:
        return jsonify({"msg": "No historical data for this crop and market"}), 404

    last_row = subset.iloc[-1]
    current_price = float(last_row["price"])
    previous_min = float(last_row["min_price"])
    previous_max = float(last_row["max_price"])
    last_updated = pd.to_datetime(last_row["date"]).to_pydatetime()

    results = []
    for offset in range(7):
        future_date = target_date + timedelta(days=offset)
        X = feature_row(
            future_date,
            current_price,
            previous_min,
            previous_max,
            crop_key,
            location_key,
        )
        predicted_price = max(0, float(model.predict(X)[0]))
        results.append(
            {
                "date": future_date.strftime("%Y-%m-%d"),
                "price": round(predicted_price, 2),
            }
        )
        current_price = predicted_price

    weather_ctx = get_simulated_weather(location)
    response = {
        "predicted_price": results[0]["price"],
        "previous_price": round(float(last_row["price"]), 2),
        "last_updated": last_updated.strftime("%Y-%m-%d"),
        "predictions_range": results,
        "weather": weather_ctx,
        "confidence": "86%",
        "price_unit": model_metadata.get("price_unit", "INR per quintal"),
    }

    prediction = Prediction(
        user_id=get_jwt_identity(),
        crop=last_row["crop"],
        location=last_row["location"],
        target_date=target_date,
        predicted_price=response["predicted_price"],
        previous_price=response["previous_price"],
        last_updated=last_updated,
        prediction_range=results,
        weather=weather_ctx,
        request_payload={"crop": crop, "location": location, "date": data.get("date")},
    )
    db.session.add(prediction)
    db.session.commit()

    response["saved_prediction_id"] = prediction.id
    return jsonify(response)


@app.route("/history", methods=["GET"])
def history():
    if df_data.empty:
        return jsonify([])

    crop = (request.args.get("crop") or "").strip()
    location = (request.args.get("location") or "").strip()
    limit = min(int(request.args.get("limit", 500)), 2000)

    subset = df_data
    if crop:
        subset = subset[subset["crop_key"] == normalize_key(crop)]
    if location:
        subset = subset[subset["location_key"] == normalize_key(location)]

    if crop or location:
        subset = subset.sort_values(by="date")
    else:
        subset = subset.sort_values(by="date", ascending=False).head(limit)

    return jsonify(market_records(subset.tail(limit) if crop or location else subset))


@app.route("/prediction-history", methods=["GET"])
@jwt_required()
def prediction_history():
    user_id = get_jwt_identity()
    limit = min(int(request.args.get("limit", 50)), 200)
    predictions = (
        Prediction.query.filter_by(user_id=user_id)
        .order_by(Prediction.created_at.desc())
        .limit(limit)
        .all()
    )
    return jsonify([serialize_prediction(prediction) for prediction in predictions])


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid email or password"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"access_token": token, "user": serialize_user(user)})


@app.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or not email or not password:
        return jsonify({"msg": "Name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email is already registered"}), 400

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({"msg": "User created", "access_token": token, "user": serialize_user(user)}), 201


@app.route("/user", methods=["GET"])
@jwt_required()
def user_profile():
    user = db.session.get(User, get_jwt_identity())
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(serialize_user(user))


load_resources()
init_database()

if __name__ == "__main__":
    print("Backend server is starting...")
    app.run(port=5000, debug=True)

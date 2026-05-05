from datetime import datetime, timezone
from pathlib import Path
import sys

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


MODEL_DIR = Path(__file__).resolve().parent
BACKEND_DIR = MODEL_DIR.parent
DATA_PATH = BACKEND_DIR / "data" / "crop_data.csv"

sys.path.append(str(BACKEND_DIR))
from market_data import load_market_data  # noqa: E402


FEATURE_COLUMNS = [
    "day_of_year",
    "week_of_year",
    "month",
    "year",
    "prev_price",
    "prev_min_price",
    "prev_max_price",
    "crop_encoded",
    "loc_encoded",
]


def add_training_features(df):
    df = df.sort_values(["crop_key", "location_key", "date"]).copy()

    df["prev_price"] = df.groupby(["crop_key", "location_key"])["price"].shift(1)
    df["prev_min_price"] = df.groupby(["crop_key", "location_key"])["min_price"].shift(1)
    df["prev_max_price"] = df.groupby(["crop_key", "location_key"])["max_price"].shift(1)

    fallback_pairs = [
        ("prev_price", "price"),
        ("prev_min_price", "min_price"),
        ("prev_max_price", "max_price"),
    ]
    for feature, source in fallback_pairs:
        crop_median = df.groupby("crop_key")[source].transform("median")
        global_median = df[source].median()
        df[feature] = df[feature].fillna(crop_median).fillna(global_median)

    df["day_of_year"] = df["date"].dt.dayofyear
    df["week_of_year"] = df["date"].dt.isocalendar().week.astype(int)
    df["month"] = df["date"].dt.month
    df["year"] = df["date"].dt.year

    le_crop = LabelEncoder()
    le_loc = LabelEncoder()
    df["crop_encoded"] = le_crop.fit_transform(df["crop_key"])
    df["loc_encoded"] = le_loc.fit_transform(df["location_key"])

    return df, le_crop, le_loc


def main():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    df = load_market_data(DATA_PATH)
    if df.empty:
        raise ValueError("No valid rows found in dataset after cleaning.")

    train_df, le_crop, le_loc = add_training_features(df)
    X = train_df[FEATURE_COLUMNS]
    y = train_df["price"]

    model = RandomForestRegressor(
        n_estimators=250,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )

    metrics = {}
    if len(train_df) >= 20:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        metrics = {
            "mae": round(float(mean_absolute_error(y_test, y_pred)), 2),
            "r2": round(float(r2_score(y_test, y_pred)), 4),
        }

    model.fit(X, y)

    metadata = {
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "feature_columns": FEATURE_COLUMNS,
        "source_dataset": str(DATA_PATH),
        "source_rows_after_cleaning": int(len(df)),
        "training_rows": int(len(train_df)),
        "crop_count": int(train_df["crop_key"].nunique()),
        "market_count": int(train_df["location_key"].nunique()),
        "date_min": train_df["date"].min().strftime("%Y-%m-%d"),
        "date_max": train_df["date"].max().strftime("%Y-%m-%d"),
        "price_unit": "INR per quintal",
        "metrics": metrics,
    }

    joblib.dump(model, MODEL_DIR / "price_model.pkl")
    joblib.dump(le_crop, MODEL_DIR / "le_crop.pkl")
    joblib.dump(le_loc, MODEL_DIR / "le_loc.pkl")
    joblib.dump(metadata, MODEL_DIR / "model_metadata.pkl")

    print("Model trained on mandi dataset")
    print(f"Rows: {metadata['training_rows']}")
    print(f"Crops: {metadata['crop_count']}")
    print(f"Markets: {metadata['market_count']}")
    print(f"Date range: {metadata['date_min']} to {metadata['date_max']}")
    if metrics:
        print(f"Validation MAE: {metrics['mae']}")
        print(f"Validation R2: {metrics['r2']}")


if __name__ == "__main__":
    main()

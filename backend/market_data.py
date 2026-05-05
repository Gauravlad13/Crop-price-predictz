from pathlib import Path

import pandas as pd


COLUMN_MAP = {
    "State": "state",
    "District": "district",
    "Market": "location",
    "Commodity": "crop",
    "Variety": "variety",
    "Grade": "grade",
    "Arrival_Date": "date",
    "Min Price": "min_price",
    "Max Price": "max_price",
    "Modal Price": "price",
}

REQUIRED_COLUMNS = set(COLUMN_MAP)
TEXT_COLUMNS = ["state", "district", "location", "crop", "variety", "grade"]
PRICE_COLUMNS = ["min_price", "max_price", "price"]


def clean_text(value):
    return " ".join(str(value).strip().split())


def normalize_key(value):
    return clean_text(value).lower()


def load_market_data(csv_path):
    csv_path = Path(csv_path)
    raw = pd.read_csv(csv_path)
    missing = REQUIRED_COLUMNS.difference(raw.columns)
    if missing:
        missing_columns = ", ".join(sorted(missing))
        raise ValueError(f"Missing required dataset columns: {missing_columns}")

    df = raw.rename(columns=COLUMN_MAP)

    for column in TEXT_COLUMNS:
        df[column] = df[column].map(clean_text)

    df["date"] = pd.to_datetime(df["date"], dayfirst=True, errors="coerce").dt.normalize()
    for column in PRICE_COLUMNS:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    df = df.dropna(subset=["date", "crop", "location", "price"])
    df = df[df["price"] > 0].copy()
    df["crop_key"] = df["crop"].map(normalize_key)
    df["location_key"] = df["location"].map(normalize_key)

    grouped = (
        df.groupby(["date", "crop_key", "location_key"], as_index=False)
        .agg(
            crop=("crop", "first"),
            location=("location", "first"),
            state=("state", "first"),
            district=("district", "first"),
            min_price=("min_price", "mean"),
            max_price=("max_price", "mean"),
            price=("price", "mean"),
            record_count=("price", "size"),
        )
        .sort_values(["date", "crop", "location"])
        .reset_index(drop=True)
    )

    for column in PRICE_COLUMNS:
        grouped[column] = grouped[column].round(2)

    return grouped


def market_records(df):
    records_df = df.copy()
    records_df["date"] = pd.to_datetime(records_df["date"]).dt.strftime("%Y-%m-%d")
    records_df = records_df[
        [
            "date",
            "crop",
            "location",
            "state",
            "district",
            "min_price",
            "max_price",
            "price",
            "record_count",
        ]
    ]
    return records_df.to_dict(orient="records")

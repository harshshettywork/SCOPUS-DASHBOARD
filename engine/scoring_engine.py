#!/usr/bin/env python3
"""
India Global Access Index - Python Scoring Engine & Pipeline
Formula:
  Route_Score(c, d) = Is_Direct(c, d) * V_d * W_d
  Raw_Score(c) = sum_{d in Destinations} Route_Score(c, d)
  Index_Score(c) = (Raw_Score(c) / max(Raw_Score)) * 100
"""

import json
import os
import sys
from typing import Dict, List, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEED_DATA_PATH = os.path.join(BASE_DIR, "db", "seed_data.json")
STORE_DATA_PATH = os.path.join(BASE_DIR, "db", "store.json")

def load_data() -> Dict[str, Any]:
    """Load data from store.json if present, otherwise fallback to seed_data.json."""
    path_to_load = STORE_DATA_PATH if os.path.exists(STORE_DATA_PATH) else SEED_DATA_PATH
    with open(path_to_load, "r", encoding="utf-8") as f:
        return json.load(f)

def calculate_route_score(is_direct: bool, visa_score: float, dest_weight: float) -> float:
    """Calculate single route score."""
    if not is_direct:
        return 0.0
    return round(float(visa_score) * float(dest_weight), 6)

def run_calculation_pipeline(data: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
    """Executes the full scoring matrix calculation."""
    if data is None:
        data = load_data()

    cities = data.get("cities", [])
    routes = data.get("routes", [])
    visa_rules = {v["dest_country"].lower(): v for v in data.get("visa_rules", [])}
    destination_weights = {w["dest_country"].lower(): w["dest_weight"] for w in data.get("destination_weights", [])}

    city_scores = {}
    for city in cities:
        iata = city["airport_iata"].upper()
        city_scores[iata] = {
            "airport_iata": iata,
            "city_name": city["city_name"],
            "state": city.get("state", ""),
            "intl_pax_volume": city.get("intl_pax_volume", 0),
            "raw_score": 0.0,
            "direct_dest_count": 0,
            "visa_free_dest_count": 0,
        }

    # Aggregate route scores per unique destination per origin
    seen_destinations = set()

    for route in routes:
        origin = route["origin_iata"].upper()
        if origin not in city_scores:
            continue

        dest_iata = route["dest_iata"].upper()
        unique_key = f"{origin}->{dest_iata}"
        if unique_key in seen_destinations:
            continue
        seen_destinations.add(unique_key)

        dest_country = route["dest_country"].strip()
        visa_info = visa_rules.get(dest_country.lower())
        visa_score = visa_info["visa_score"] if visa_info else 0.20
        dest_weight = destination_weights.get(dest_country.lower(), 0.20)

        is_direct = route.get("is_direct", True)
        r_score = calculate_route_score(is_direct, visa_score, dest_weight)

        city_scores[origin]["raw_score"] += r_score
        if is_direct:
            city_scores[origin]["direct_dest_count"] += 1
            if visa_score >= 0.8:
                city_scores[origin]["visa_free_dest_count"] += 1

    # Normalization
    raw_scores = [c["raw_score"] for c in city_scores.values()]
    max_raw_score = max(raw_scores) if raw_scores and max(raw_scores) > 0 else 1.0

    # Sort descending by raw_score then intl_pax_volume
    sorted_cities = sorted(
        city_scores.values(),
        key=lambda c: (c["raw_score"], c["intl_pax_volume"]),
        reverse=True
    )

    rankings = []
    for idx, c in enumerate(sorted_cities, 1):
        index_score = round((c["raw_score"] / max_raw_score) * 100.0, 1)
        rankings.append({
            "rank": idx,
            "airport_iata": c["airport_iata"],
            "city_name": c["city_name"],
            "state": c["state"],
            "intl_pax_volume": c["intl_pax_volume"],
            "raw_score": round(c["raw_score"], 4),
            "index_score": index_score,
            "direct_dest_count": c["direct_dest_count"],
            "visa_free_dest_count": c["visa_free_dest_count"],
        })

    return rankings

def print_rankings(rankings: List[Dict[str, Any]]) -> None:
    """Pretty-print the calculated rankings table."""
    print("=" * 90)
    print(f"{'RANK':<5} | {'IATA':<4} | {'CITY NAME':<40} | {'RAW':<7} | {'INDEX':<7} | {'DIRECT':<6} | {'VISA-FREE':<9}")
    print("=" * 90)
    for r in rankings:
        print(f"{r['rank']:<5} | {r['airport_iata']:<4} | {r['city_name'][:40]:<40} | {r['raw_score']:<7.4f} | {r['index_score']:<7.1f} | {r['direct_dest_count']:<6} | {r['visa_free_dest_count']:<9}")
    print("=" * 90)

if __name__ == "__main__":
    rankings = run_calculation_pipeline()
    print_rankings(rankings)

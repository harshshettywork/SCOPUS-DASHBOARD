import unittest
import sys
import os

# Add parent directory to path so engine can be imported
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.scoring_engine import calculate_route_score, run_calculation_pipeline

class TestScoringEngine(unittest.TestCase):
    def test_calculate_route_score_direct(self):
        """Test direct route score with known parameters."""
        # Visa Free (1.0) to Thailand (0.46)
        score = calculate_route_score(is_direct=True, visa_score=1.0, dest_weight=0.46)
        self.assertAlmostEqual(score, 0.46, places=4)

        # eVisa (0.6) to UAE (0.46)
        score_uae = calculate_route_score(is_direct=True, visa_score=0.6, dest_weight=0.46)
        self.assertAlmostEqual(score_uae, 0.276, places=4)

        # Visa Required (0.2) to US (0.95)
        score_us = calculate_route_score(is_direct=True, visa_score=0.2, dest_weight=0.95)
        self.assertAlmostEqual(score_us, 0.19, places=4)

    def test_calculate_route_score_indirect_is_zero(self):
        """Test indirect flight yields 0 route score."""
        score = calculate_route_score(is_direct=False, visa_score=1.0, dest_weight=0.95)
        self.assertEqual(score, 0.0)

    def test_unlisted_country_fallback(self):
        """Test pipeline with unlisted country routes falls back to default 0.20 weight and 0.20 visa score."""
        mock_data = {
            "cities": [
                {"airport_iata": "AAA", "city_name": "City Alpha", "state": "State A", "intl_pax_volume": 100000},
                {"airport_iata": "BBB", "city_name": "City Beta", "state": "State B", "intl_pax_volume": 50000}
            ],
            "routes": [
                # Unlisted destination country "Atlantis"
                {"origin_iata": "AAA", "dest_iata": "ATL", "dest_city": "Atlantis City", "dest_country": "Atlantis", "is_direct": True},
            ],
            "visa_rules": [],
            "destination_weights": []
        }

        rankings = run_calculation_pipeline(mock_data)
        # Expected raw score for AAA: 0.20 (unlisted visa) * 0.20 (unlisted weight) = 0.04
        self.assertEqual(len(rankings), 2)
        top_city = rankings[0]
        self.assertEqual(top_city["airport_iata"], "AAA")
        self.assertAlmostEqual(top_city["raw_score"], 0.04, places=4)
        self.assertEqual(top_city["index_score"], 100.0)

    def test_zero_routes_isolated_city(self):
        """Test isolated city with zero direct routes has 0 raw score and 0 index score."""
        mock_data = {
            "cities": [
                {"airport_iata": "HUB", "city_name": "Connected Hub", "state": "State A", "intl_pax_volume": 500000},
                {"airport_iata": "ISO", "city_name": "Isolated Airport", "state": "State B", "intl_pax_volume": 10000}
            ],
            "routes": [
                {"origin_iata": "HUB", "dest_iata": "BKK", "dest_city": "Bangkok", "dest_country": "Thailand", "is_direct": True}
            ],
            "visa_rules": [
                {"dest_country": "Thailand", "visa_category": "VISA_FREE", "visa_score": 1.0, "max_stay_days": "60 Days", "fee_usd": 0}
            ],
            "destination_weights": [
                {"dest_country": "Thailand", "dest_weight": 0.460}
            ]
        }

        rankings = run_calculation_pipeline(mock_data)
        self.assertEqual(len(rankings), 2)

        hub = [r for r in rankings if r["airport_iata"] == "HUB"][0]
        iso = [r for r in rankings if r["airport_iata"] == "ISO"][0]

        self.assertEqual(hub["rank"], 1)
        self.assertEqual(hub["index_score"], 100.0)
        self.assertEqual(hub["direct_dest_count"], 1)

        self.assertEqual(iso["rank"], 2)
        self.assertEqual(iso["raw_score"], 0.0)
        self.assertEqual(iso["index_score"], 0.0)
        self.assertEqual(iso["direct_dest_count"], 0)

    def test_full_dataset_execution(self):
        """Test full dataset runs and returns 20 ranked cities with Delhi at Rank 1 (100.0 score)."""
        rankings = run_calculation_pipeline()
        self.assertEqual(len(rankings), 20)
        
        # Delhi should be rank 1 with 100.0 index score
        self.assertEqual(rankings[0]["airport_iata"], "DEL")
        self.assertEqual(rankings[0]["rank"], 1)
        self.assertEqual(rankings[0]["index_score"], 100.0)
        
        # Mumbai should be rank 2
        self.assertEqual(rankings[1]["airport_iata"], "BOM")
        self.assertEqual(rankings[1]["rank"], 2)

        # Monotonically non-increasing scores
        for i in range(len(rankings) - 1):
            self.assertGreaterEqual(rankings[i]["index_score"], rankings[i+1]["index_score"])

if __name__ == "__main__":
    unittest.main()

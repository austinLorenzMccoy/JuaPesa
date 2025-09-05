#!/usr/bin/env python3
import sys
import requests

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"

r = requests.get(f"{BASE}/testall", timeout=5)
print("GET /testall =>", r.status_code, r.text)

# Example curl equivalent:
# curl -sS "${BASE}/testall" | jq .

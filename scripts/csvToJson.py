import csv
import json

csv_file = '../public/standings.csv'
json_file = '../public/standings.json'

with open(csv_file, newline='') as f:
    reader = csv.DictReader(f)
    rows = list(reader)

with open(json_file, 'w') as f:
    json.dump(rows, f, indent=2)
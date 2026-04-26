import pandas as pd
import json
import os
import math

excel_file = 'intern_assignment_support_pack_dev_only_v3.xlsx'

print(f"Reading Excel file: {excel_file}")

developers = pd.read_excel(excel_file, sheet_name='Dim_Developers')
issues = pd.read_excel(excel_file, sheet_name='Fact_Jira_Issues')
prs = pd.read_excel(excel_file, sheet_name='Fact_Pull_Requests')
deployments = pd.read_excel(excel_file, sheet_name='Fact_CI_Deployments')
bugs = pd.read_excel(excel_file, sheet_name='Fact_Bug_Reports')

data = {
    'developers': developers.to_dict('records'),
    'issues': issues.to_dict('records'),
    'prs': prs.to_dict('records'),
    'deployments': deployments.to_dict('records'),
    'bugs': bugs.to_dict('records')
}

def convert_nan(obj):
    if isinstance(obj, dict):
        return {k: convert_nan(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_nan(item) for item in obj]
    elif isinstance(obj, float) and math.isnan(obj):
        return None
    else:
        return obj

data = convert_nan(data)

output_path = 'src/data/data.json'
os.makedirs('src/data', exist_ok=True)

with open(output_path, 'w') as f:
    json.dump(data, f, indent=2, default=str)

print(f"✅ Data converted successfully!")
print(f"✅ Saved to {output_path}")
print(f"Total developers: {len(data['developers'])}")
print(f"Total issues:     {len(data['issues'])}")
print(f"Total PRs:        {len(data['prs'])}")
print(f"Total deployments:{len(data['deployments'])}")
print(f"Total bugs:       {len(data['bugs'])}")

import json
import pickle 

with open('pd_business.pkl', 'rb') as f:
    pd_business = pickle.load(f)

id_data = {}

count = 0
for index, row in pd_business.iterrows():
    id_data[str(count)] = {'id': row.name, 'state': row.location[0]}
    count += 1

with open('id_data.json', 'w') as json_file:
    json.dump(id_data, json_file)
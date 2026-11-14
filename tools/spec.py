import json,sys,urllib.parse
print('spec='+urllib.parse.quote(json.dumps(json.load(open(sys.argv[1])))))

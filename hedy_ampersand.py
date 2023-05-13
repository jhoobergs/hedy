import hedy
import sys
import json

data = sys.stdin.readlines()
code = "\n".join(data)

res = hedy.transpile_ampersand(code,1)

print(json.dumps(res.code, indent=2))
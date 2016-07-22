#!/usr/bin/env python

try:
  # For Python 3.0 and later
  from urllib.request import urlopen
except ImportError:
  # Fall back to Python 2's urllib2
  from urllib2 import urlopen

# try:
#     import ssl
# except ImportError:
#     print "error: no ssl support"

import json
from pprint import pprint

def get_jsonparsed_data(url):
  """Receive the content of ``url``, parse it as JSON and return the
     object.
  """
  response = urlopen(url)
  data = str(response.read())
  return json.load(data)





with open('../config/config.json') as data_file:    
    data = json.load(data_file)

url = data["serverURL"] + str(data["coordinate"]["longitude"]) + "/" + str(data["coordinate"]["latitude"])
pprint(url)

resp = get_jsonparsed_data("https://pokevision.com/map/data/37.3988088/-121.98594980000001")
pprint(resp)


# response = urllib.urlopen(url)
# data = json.loads(response.read())
# print data
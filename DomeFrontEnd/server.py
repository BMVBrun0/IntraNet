#!/usr/bin/env python3

import http.server
import ssl

httpd = http.server.HTTPServer(('localhost', 8000), http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket,
certfile='C:/GitHub/IntraNetDome-v2/cert.pem',
keyfile='C:/GitHub/IntraNetDome-v2/key.pem',

                               server_side=True)
httpd.serve_forever()

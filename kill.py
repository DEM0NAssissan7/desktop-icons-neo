#!/usr/bin/env python3

import subprocess

sp = subprocess.run(['ps', '-ax'], capture_output = True)
for linea in sp.stdout.decode('utf-8').split('\n'):
    if -1 == linea.find("ding.js"):
        continue
    linea = linea.strip();
    pid = linea.split(" ")[0]
    subprocess.run(['kill', pid])

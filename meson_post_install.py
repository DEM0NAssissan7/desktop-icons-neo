#!/usr/bin/python3

import os
import subprocess

prefix = os.environ['MESON_INSTALL_DESTDIR_PREFIX']
schemadir = os.path.join(prefix, 'share', 'glib-2.0', 'schemas')

# Packaging tools define DESTDIR and this isn't needed for them
if 'DESTDIR' not in os.environ:
    print('Compiling GSettings schemas...')
    subprocess.call(['glib-compile-schemas', schemadir])

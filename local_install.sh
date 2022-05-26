#!/bin/bash

# LICENSE INFORMATION
# 
# Desktop Icons: Neo - A desktop icons extension for GNOME with numerous features, 
# customizations, and optimizations.
# 
# Copyright 2021 Abdurahman Elmawi (cooper64doom@gmail.com)
# 
# This project is based on Desktop Icons NG (https://gitlab.com/rastersoft/desktop-icons-ng),
# a desktop icons extension for GNOME licensed under the GPL v3.
# 
# This project is free and open source software as described in the GPL v3.
# 
# This project (Desktop Icons: Neo) is licensed under the GPL v3. To view the details of this license, 
# visit https://www.gnu.org/licenses/gpl-3.0.html for the necessary information
# regarding this project's license.
#

rm -rf ~/.local/share/gnome-shell/extensions/desktopicons-neo@darkdemon/*
rm -rf .build
mkdir .build
meson --prefix=$HOME/.local/ --localedir=share/gnome-shell/extensions/desktopicons-neo@darkdemon/locale .build
ninja -C .build install
rm -rf .build

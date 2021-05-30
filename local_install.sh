#!/bin/bash

rm -rf ~/.local/share/gnome-shell/extensions/desktopicons-neo@rastersoft.com/*
rm -rf .build
mkdir .build
meson --prefix=$HOME/.local/ --localedir=share/gnome-shell/extensions/desktopicons-neo@rastersoft.com/locale .build
ninja -C .build install

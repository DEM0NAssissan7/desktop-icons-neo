#!/bin/bash

rm -rf ~/.local/share/gnome-shell/extensions/desktopicons-neo@darkdemon/*
rm -rf .build
mkdir .build
meson --prefix=$HOME/.local/ --localedir=share/gnome-shell/extensions/desktopicons-neo@darkdemon/locale .build
ninja -C .build install
rm -rf .build

#!/usr/bin/env bash

# Export extension as zip file for extensions.gnome.org
# ----------------------------------------------------
#
# Usage:
# ./export-zip.sh - builds extension & create zip inside repository

set -e

REPO_DIR="$(pwd)"
BUILD_DIR="${REPO_DIR}/builddir"
UUID="ding@rastersoft.com"
LOCAL_PREFIX="${REPO_DIR}/${UUID}"
EXTENSIONS_DIR="${LOCAL_PREFIX}/share/gnome-shell/extensions/${UUID}"
SCHEMADIR="${LOCAL_PREFIX}/share/glib-2.0/schemas"

# Check old builddir
if [ -d "${PWD}/${BUILD_DIR}" ]; then
  echo "A current build directory already exists. Would you like to remove it?"
  select yn in "Yes" "No"; do
    case $yn in
      Yes )
        rm -rf "${PWD:?}/${BUILD_DIR}"
        echo "Build directory was removed succesfuly"
      break;;
      No )
        echo "The old build directory must be removed first. Exiting"
      exit;;
    esac
  done
fi

# Meson build
echo "# -------------------"
echo "# Buiding with meson"
echo "# -------------------"
meson --prefix="${LOCAL_PREFIX}" --localedir=locale "${BUILD_DIR}" "${REPO_DIR}"
ninja -C "${BUILD_DIR}" install

# Create distribution ZIP file
echo -e "\\n# --------------------------"
echo "# Create extension ZIP file"
echo "# --------------------------"
rm -rf "${REPO_DIR}/${UUID}.zip" "${LOCAL_PREFIX}/${UUID}.zip"
cd "${LOCAL_PREFIX}" || exit
mkdir schemas
cp "${SCHEMADIR}"/*.xml schemas/
glib-compile-schemas schemas/
cp -r "${EXTENSIONS_DIR}"/* .
zip -qr "${UUID}.zip" ./*.js ./*.css ./*.json ./locale ./schemas
mv -f "${UUID}.zip" "${REPO_DIR}/"
cd "${REPO_DIR}" || exit

# Clean
rm -rf "${BUILD_DIR}" "${LOCAL_PREFIX}"

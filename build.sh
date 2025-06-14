#!/bin/bash

# Simple build script for Obsidian Bookmark Plus

build_browser() {
    local browser=$1
    echo "Building $browser extension..."
    mkdir -p ./dist/$browser
    cp manifest-$browser.json manifest.json
    npx web-ext build --ignore-files ./images ./manifest-*.json --artifacts-dir=./dist/$browser --overwrite-dest
    echo "$browser extension built"
}

case "$1" in
    "firefox")
        build_browser firefox
        ;;
    "chrome")
        build_browser chrome
        ;;
    "all"|"")
        echo "Building extensions for both browsers..."
        echo ""
        build_browser firefox
        echo ""
        build_browser chrome
        echo ""
        echo "Both extensions built successfully!"
        ;;
    "clean")
        echo "Cleaning build artifacts..."
        rm -f manifest.json
        rm -rf dist/
        echo "Cleaned"
        ;;
    *)
        echo "Usage: ./build.sh [all|firefox|chrome|clean]"
        echo ""
        echo "Examples:"
        echo "  ./build.sh           # Build both browsers (default)"
        echo "  ./build.sh all       # Build both browsers"
        echo "  ./build.sh firefox   # Build Firefox extension only"
        echo "  ./build.sh chrome    # Build Chrome extension only" 
        echo "  ./build.sh clean     # Clean build artifacts"
        ;;
esac
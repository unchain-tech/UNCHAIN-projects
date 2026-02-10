#!/bin/bash

# prepare-translation.sh
# Helper script to prepare directory structure for translating a project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if project path is provided
if [ $# -eq 0 ]; then
    print_error "No project path provided"
    echo "Usage: $0 <project-path>"
    echo "Example: $0 docs/Ethereum/ETH-dApp"
    exit 1
fi

PROJECT_PATH=$1

# Check if project path exists
if [ ! -d "$PROJECT_PATH" ]; then
    print_error "Project path does not exist: $PROJECT_PATH"
    exit 1
fi

# Extract relative path from docs/
if [[ $PROJECT_PATH == docs/* ]]; then
    REL_PATH=${PROJECT_PATH#docs/}
else
    print_error "Project path must start with 'docs/'"
    echo "Example: docs/Ethereum/ETH-dApp"
    exit 1
fi

PROJECT_NAME=$(basename "$PROJECT_PATH")
TRANSLATION_BASE="i18n/en/docusaurus-plugin-content-docs/current"
TRANSLATION_PATH="$TRANSLATION_BASE/$REL_PATH"

print_info "Project: $PROJECT_NAME"
print_info "Source: $PROJECT_PATH"
print_info "Target: $TRANSLATION_PATH"

# Check if translation already exists
if [ -d "$TRANSLATION_PATH" ]; then
    print_warning "Translation directory already exists: $TRANSLATION_PATH"
    read -p "Do you want to continue? This might overwrite existing files. (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Aborted by user"
        exit 0
    fi
fi

# Create base directory structure
print_info "Creating directory structure..."
mkdir -p "$TRANSLATION_PATH"

# Find all markdown files and create corresponding directory structure
while IFS= read -r -d '' file; do
    # Get relative path from project root
    rel_file="${file#$PROJECT_PATH/}"
    dir_name=$(dirname "$rel_file")
    
    if [ "$dir_name" != "." ]; then
        mkdir -p "$TRANSLATION_PATH/$dir_name"
        print_info "Created directory: $TRANSLATION_PATH/$dir_name"
    fi
done < <(find "$PROJECT_PATH" -name "*.md" -print0)

# Count files
file_count=$(find "$PROJECT_PATH" -name "*.md" | wc -l)

print_info "Directory structure created!"
print_info "Found $file_count markdown files to translate"
echo ""
print_info "Next steps:"
echo "  1. Translate each markdown file from:"
echo "     $PROJECT_PATH/"
echo "     to:"
echo "     $TRANSLATION_PATH/"
echo ""
echo "  2. You can use AI tools (ChatGPT, Claude, DeepL) for translation"
echo "     See docs/TRANSLATION_GUIDE.md for tips"
echo ""
echo "  3. Test your translation:"
echo "     yarn start --locale en"
echo ""
echo "  4. Build to check for errors:"
echo "     yarn build"
echo ""

# List all files that need translation
echo "Files to translate:"
find "$PROJECT_PATH" -name "*.md" | sort | while read file; do
    rel_file="${file#$PROJECT_PATH/}"
    target_file="$TRANSLATION_PATH/$rel_file"
    if [ -f "$target_file" ]; then
        echo "  [EXISTS] $rel_file"
    else
        echo "  [ TODO ] $rel_file"
    fi
done

echo ""
print_info "Translation preparation complete! 🎉"

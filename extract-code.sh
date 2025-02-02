#!/bin/bash

# Create output file
output_file="project_code.txt"
echo "# Project Code Extract" > "$output_file"
echo "# Generated on $(date)" >> "$output_file"
echo "" >> "$output_file"

# Find and process files
find . \
    -type f \
    \( \
        -name "*.js" -o \
        -name "*.jsx" -o \
        -name "*.ts" -o \
        -name "*.tsx" -o \
        -name "*.svelte" -o \
        -name "*.vue" -o \
        -name "*.css" -o \
        -name "*.scss" -o \
        -name "*.sass" -o \
        -name "*.less" -o \
        -name "*.html" -o \
        -name "*.php" -o \
        -name "*.py" -o \
        -name "*.rb" -o \
        -name "*.java" -o \
        -name "*.go" -o \
        -name "*.rs" -o \
        -name "*.json" -o \
        -name "*.prisma" -o \
        -name "*.graphql" -o \
        -name "*.md" \
    \) \
    ! -path "*/node_modules/*" \
    ! -path "*/.next/*" \
    ! -path "*/.svelte-kit/*" \
    ! -path "*/.output/*" \
    ! -path "*/cache/*" \
    ! -path "*/build/*" \
    ! -path "*/dist/*" \
    ! -path "*/webpack/*" \
    ! -path "*/.git/*" \
    ! -path "*/coverage/*" \
    ! -path "*/cypress/*" \
    ! -path "*/__tests__/*" \
    ! -path "*/.vscode/*" \
    ! -path "*/.idea/*" \
    ! -path "*/tmp/*" \
    ! -path "*/temp/*" \
    -exec sh -c '
        for file do
            # Get file extension
            ext="${file##*.}"
            
            echo "" >> "'$output_file'"
            echo "============================================================" >> "'$output_file'"
            echo "File: $file" >> "'$output_file'"
            echo "Type: .$ext" >> "'$output_file'"
            echo "============================================================" >> "'$output_file'"
            echo "" >> "'$output_file'"
            cat "$file" >> "'$output_file'"
            echo "" >> "'$output_file'"
            echo "" >> "'$output_file'"
        done
    ' sh {} +

echo "Code has been extracted to $output_file"

# Print summary of extracted files
echo ""
echo "Summary of extracted files:"
echo "------------------------"
find . \
    -type f \
    \( \
        -name "*.js" -o \
        -name "*.jsx" -o \
        -name "*.ts" -o \
        -name "*.tsx" -o \
        -name "*.svelte" -o \
        -name "*.vue" -o \
        -name "*.css" -o \
        -name "*.scss" -o \
        -name "*.sass" -o \
        -name "*.less" -o \
        -name "*.html" -o \
        -name "*.php" -o \
        -name "*.py" -o \
        -name "*.rb" -o \
        -name "*.java" -o \
        -name "*.go" -o \
        -name "*.rs" -o \
        -name "*.json" -o \
        -name "*.prisma" -o \
        -name "*.graphql" -o \
        -name "*.md" \
    \) \
    ! -path "*/node_modules/*" \
    ! -path "*/.next/*" \
    ! -path "*/.svelte-kit/*" \
    ! -path "*/.output/*" \
    ! -path "*/cache/*" \
    ! -path "*/build/*" \
    ! -path "*/dist/*" \
    ! -path "*/webpack/*" \
    ! -path "*/.git/*" \
    ! -path "*/coverage/*" \
    ! -path "*/cypress/*" \
    ! -path "*/__tests__/*" \
    ! -path "*/.vscode/*" \
    ! -path "*/.idea/*" \
    ! -path "*/tmp/*" \
    ! -path "*/temp/*" \
    -exec sh -c 'echo "$(basename "{}")"' \;
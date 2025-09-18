#!/bin/bash

# JuaPesa Paper Compilation Script
# This script compiles the LaTeX paper with proper bibliography handling

echo "🔨 Compiling JuaPesa Research Paper..."

# Check if pdflatex is available
if ! command -v pdflatex &> /dev/null; then
    echo "❌ Error: pdflatex not found. Please install a LaTeX distribution."
    echo "   - macOS: Install MacTeX"
    echo "   - Windows: Install MiKTeX"
    echo "   - Linux: Install texlive-full"
    exit 1
fi

# Check if bibtex is available
if ! command -v bibtex &> /dev/null; then
    echo "❌ Error: bibtex not found. Please install a LaTeX distribution."
    exit 1
fi

# First pass - generate aux files
echo "📝 First pass: Generating auxiliary files..."
pdflatex -interaction=nonstopmode main.tex

if [ $? -ne 0 ]; then
    echo "❌ Error: First pdflatex pass failed. Check main.tex for syntax errors."
    exit 1
fi

# Process bibliography
echo "📚 Processing bibliography..."
bibtex main

if [ $? -ne 0 ]; then
    echo "❌ Error: Bibliography processing failed. Check references.bib for errors."
    exit 1
fi

# Second pass - incorporate bibliography
echo "📝 Second pass: Incorporating bibliography..."
pdflatex -interaction=nonstopmode main.tex

if [ $? -ne 0 ]; then
    echo "❌ Error: Second pdflatex pass failed."
    exit 1
fi

# Third pass - final compilation
echo "📝 Third pass: Final compilation..."
pdflatex -interaction=nonstopmode main.tex

if [ $? -ne 0 ]; then
    echo "❌ Error: Third pdflatex pass failed."
    exit 1
fi

# Clean up auxiliary files
echo "🧹 Cleaning up auxiliary files..."
rm -f main.aux main.bbl main.blg main.log main.out main.toc

echo "✅ Paper compiled successfully!"
echo "📄 Output: main.pdf"
echo ""
echo "🎯 Next steps:"
echo "   1. Review the generated PDF"
echo "   2. Make any necessary edits to main.tex"
echo "   3. Re-run this script to update the PDF"
echo "   4. Submit to arXiv when ready"
echo ""
echo "📚 For submission help, see README.md"

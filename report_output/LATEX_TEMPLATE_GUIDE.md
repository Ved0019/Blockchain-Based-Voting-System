# LaTeX Project Report Template - Usage Guide

## Overview

This is a complete LaTeX template for the **Hybrid Cloud and Distributed Ledger E-Voting System** project report. The template follows academic/technical documentation standards suitable for thesis submission, capstone projects, or professional technical documentation.

## Directory Structure

```
report_output/
├── main.tex                      # Main document entry point
├── glossary.tex                  # Acronym definitions for glossaries package
├── references.bib                # Bibliography (IEEE style)
├── frontmatter/
│   ├── titlepage.tex             # Title page
│   ├── declaration.tex           # Declaration/certificate page
│   ├── abstract.tex              # Abstract (250-350 words)
│   ├── acknowledgments.tex       # Acknowledgments
│   └── abbreviations.tex         # List of abbreviations
├── chapters/
│   ├── chapter01_introduction.tex
│   ├── chapter02_literature_review.tex
│   ├── chapter03_architecture.tex
│   ├── chapter04_implementation.tex
│   ├── chapter05_results.tex
│   ├── chapter06_discussion.tex
│   └── chapter07_conclusion.tex
├── appendices/
│   ├── appendix_a_code_structure.tex
│   ├── appendix_b_api_documentation.tex
│   ├── appendix_c_deployment_guide.tex
│   ├── appendix_d_user_manual.tex
│   ├── appendix_e_test_cases.tex
│   ├── appendix_f_config_files.tex
│   └── appendix_g_glossary.tex
└── figures/                      # Place images here (PNG, PDF, SVG)
```

## Quick Start (Overleaf)

1. **Create new project** on [Overleaf](https://overleaf.com)
2. **Upload all files** from `report_output/` maintaining directory structure
3. **Set main file** to `main.tex`
4. **Compile** - Overleaf auto-runs `latexmk` (pdflatex → biber → pdflatex × 2)

## Local Compilation

### Option 1: Using Podman / Docker (Fastest, zero system clutter)
```bash
cd report_output
podman run --rm -v "$PWD":/workdir:Z -w /workdir docker.io/danteev/texlive latexmk -pdf -g main.tex
```

### Option 2: Native Install (Fedora Linux)
```bash
sudo dnf install texlive-scheme-medium texlive-latexmk texlive-biber texlive-glossaries texlive-pgfplots texlive-csquotes
cd report_output
latexmk -pdf -g main.tex
```

### Option 3: Native Install (Ubuntu/Debian)
```bash
sudo apt-get install texlive-full texlive-latex-extra latexmk biber
cd report_output
latexmk -pdf -g main.tex
```

## Customization Points

### 1. Project Metadata (main.tex lines 85-95)

```latex
\newcommand{\projecttitle}{Hybrid Cloud and Distributed Ledger E-Voting System}
\newcommand{\projectsubtitle}{A Blockchain-Based Secure Electronic Voting Platform using Hedera Consensus Service}
\newcommand{\authorname}{Your Name}
\newcommand{\studentid}{Your Student ID}
\newcommand{\supervisor}{Dr. Supervisor Name}
\newcommand{\institution}{Your Institution / University}
\newcommand{\department}{Department of Computer Science}
\newcommand{\degree}{Bachelor of Technology / Master of Technology}
\newcommand{\submissiondate}{October 2026}
```

### 2. Font Options (main.tex lines 27-42)

Uncomment **one** font option:

```latex
% Option 1: Latin Modern (default, recommended)
\usepackage{lmodern}

% Option 2: Times New Roman
%\usepackage{mathptmx}
%\usepackage{helvet}
%\usepackage{courier}

% Option 3: Libertinus
%\usepackage{libertinus}

% Option 4: Palatino
%\usepackage{mathpazo}

% Option 5: XCharter
%\usepackage{XCharter}
```

### 3. Page Margins (main.tex line 48)

```latex
\geometry{
    left=30mm, right=25mm, top=25mm, bottom=25mm,
    headheight=14.5pt, includeheadfoot
}
```

### 4. Line Spacing (main.tex line 52)

```latex
\onehalfspacing  % 1.5x for body
% \doublespacing  % if required by institution
```

## Adding Content

### Chapter Content

Edit the respective files in `chapters/`:
- Replace placeholder text with your actual content
- Add figures to `figures/` and reference with `\includegraphics{figures/filename}`
- Add tables using `booktabs` syntax (see existing examples)

### Figures

```latex
\begin{figure}[H]
\centering
\includegraphics[width=0.8\textwidth]{figures/architecture.png}
\caption{System architecture diagram}
\label{fig:architecture}
\end{figure}
```

### Code Listings

```latex
\begin{lstlisting}[style=codeStyle, caption=Your caption, label=lst:label]
your code here
\end{lstlisting}
```

### Citations

Add entries to `references.bib` and cite with:
```latex
\cite{key}           % [1]
\cite{key1,key2}     % [1, 2]
\cite{key} shows...  % [1] shows...
```

### Acronyms

Use in text:
```latex
\gls{HCS}           % First use: "Hedera Consensus Service (HCS)"
\gls{HCS}           % Subsequent: "HCS"
\acrfull{HCS}       % Always full: "Hedera Consensus Service"
```

Run `makeglossaries main` after first pdflatex.

## Key Packages Included

| Package | Purpose |
|---------|---------|
| `lmodern` | Latin Modern fonts (improved Computer Modern) |
| `microtype` | Typography improvements |
| `booktabs` | Professional tables |
| `listings` | Syntax-highlighted code |
| `tikz/pgfplots` | Diagrams and charts |
| `biblatex` + `biber` | IEEE bibliography |
| `glossaries` | Acronym management |
| `hyperref` | Clickable cross-references |
| `cleveref` | Smart references (`\cref{fig:1}` → "Figure 1") |
| `appendix` | Appendix formatting |
| `fancyhdr` | Headers/footers |

## Common Issues & Fixes

### "File not found" for figures
- Ensure images are in `figures/` directory
- Use relative paths: `figures/image.png`
- Supported formats: PNG, PDF, JPG, SVG (via Inkscape)

### Bibliography not appearing
```bash
pdflatex main
biber main
pdflatex main
pdflatex main
```

### Glossary not appearing
```bash
pdflatex main
makeglossaries main
pdflatex main
```

### "Too many floats" error
- Add `\clearpage` before problematic sections
- Use `[H]` placement for tables/figures (requires `float` package)

### Font warnings
- Install missing fonts or switch to available option
- Latin Modern (`lmodern`) works out-of-the-box everywhere

## Template Features

✅ **Professional formatting** - IEEE-style bibliography, booktabs tables  
✅ **Code listings** - Syntax highlighting for JS, JSON, terminal output  
✅ **Cross-references** - Figures, tables, listings, equations, sections  
✅ **Acronyms** - Auto-expanding on first use  
✅ **Appendices** - Properly formatted with lettered numbering  
✅ **Front matter** - Title, declaration, abstract, acknowledgments, abbreviations  
✅ **Git-ready** - Modular structure for version control  
✅ **Overleaf compatible** - Zero-config compilation  

## Adapting for Your Project

1. **Replace all `\projecttitle`, `\authorname`, etc.** in `main.tex`
2. **Rewrite chapter content** in `chapters/*.tex` with your actual work
3. **Add your figures** to `figures/`
4. **Update bibliography** in `references.bib` with your sources
5. **Customize appendices** with your actual code/config/test data
6. **Adjust page limits** by modifying spacing/margins if needed

## Estimated Output

- **Pages**: ~35-45 (excluding appendices)
- **Word count**: ~12,000-15,000 words (main matter)
- **Compile time**: ~10-15 seconds on Overleaf

## Support

For issues:
1. Check Overleaf logs for specific errors
2. Verify all `\input{}` paths match directory structure
3. Ensure `biber` backend is selected (not `bibtex`)
4. Clear cache and recompile: `latexmk -C && latexmk -pdf main`

---

*Template created for Blockchain-Based-Voting-System project*  
*Compatible with: Overleaf, TeX Live, MikTeX, MacTeX*  
*Last updated: 2026-10-28*
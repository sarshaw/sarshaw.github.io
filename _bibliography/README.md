## Core citation fields
title, author, year
journal (for articles)
booktitle (for conferences)
school (for thesis)
publisher, pages, volume, number, month

## Link/button fields (render as buttons)
doi -> DOI button
arxiv -> arXiv button
html -> HTML button
pdf -> PDF button
slides -> Slides button
poster -> Poster button
supp -> Supplement button
video -> Video button
website -> Website button
code -> Code button
blog -> Blog button

## Expandable content
abstract -> Abstract toggle
bibtex_show={true} -> Bib toggle (expandable BibTeX block + download in your current setup)
award, award_name -> Award badge + expandable award text
note -> extra line under venue/date

## Your site-specific grouping/tags
pub_type -> publication type badge/grouping
talk_type -> talk type badge/grouping
abbr or abbr_tags -> theme/topic tags
selected={true} -> can be used for selected publications
preview -> thumbnail (if enabled)

## Citation badge/metrics fields
altmetric
dimensions
google_scholar_id
inspirehep_id
pmid, isbn, eprint (used by some badge logic/fallbacks)

## example

@inproceedings{lastname2026shortkey,
  title        = {Paper Title Here},
  author       = {Last, First and Coauthor, First and Coauthor, First},
  booktitle    = {Proceedings of ...},
  year         = {2026},
  pages        = {1--10},
  publisher    = {ACM},

  % Optional metadata shown on your site
  abstract     = {2-5 sentence plain-language summary.},
  bibtex_show  = {true},
  note         = {Acceptance rate: 24\%.},
  selected     = {true},

  % Your custom grouping/tagging
  pub_type     = {Refereed Conference Papers},
  abbr_tags    = {AI in Education, HCI},

  % Buttons
  doi          = {10.1145/1234567.1234568},
  pdf          = {my-paper.pdf},                     % local: assets/pdf/my-paper.pdf
  slides       = {my-slides.pdf},                    % opens in new tab
  poster       = {my-poster.pdf},
  supp         = {my-supplement.pdf},
  code         = {https://github.com/you/repo},
  website      = {https://project-page.example},
  video        = {https://youtu.be/xxxx},
  blog         = {https://blog.example/post}
}

- pdf, slides, poster, supp:
    - If filename only (e.g. slides={deck.pdf}), file should be in assets/pdf/.
    - If full URL, it links directly.
- bibtex_show={true} enables the expandable Bib block and download button.
- abbr_tags should match keys in _data/themes.yml for consistent topic badges.
- pub_type should match one of your keys in _data/pub_types.yml.
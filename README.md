# dermodelphi
Code for rendering a dermoscopy Delphi consensus site that collects data
for a dermoscopy diagnostics taxonomy.

## Collaborators
- Veronica Rotemberg
- Konstantinos Liopyris
- Alon Scope

## Installation steps
- clone the repository into a folder
- if you haven't (globally) installed nodemon, use ```npm install -g nodemon``` (make sure that python version 2 is first on the path!)
- run npm install in both the mern-app and mern-backend folders

## Summary from initial discussion with collaborators on 7/10/2019
Data capture for the Delphi project:

The taxonomy has four (4) preliminary levels (prior to stage 1 of the Delphi process):

- A: so far only benign (color coded either green or blue, give people a preference), and malignant (color coded red)
- B: super-category of diagnoses (e.g. Cysts)
- C: diagnostic label that clinical assessors need to provide for diagnosis and image upload (e.g. Milium)
- D: optional sub-category/modifiers (which will not be fully captured by the first round of Delphi!)

For the diagnosis labels (level C), people might have a different preference
for the order of "Term (explanation)" vs. "Explanation (Term)", and should be
able to make a global selection to see the labels in their preference of order.

People START with level C (generally alphabetically, by B, with exceptions;
and beginning with benign, then malignant categories).

The overall visualization should allow people to see (readily):

- the overall structure
- which parts of C (boxes) they have already answered (e.g. by displaying those labels with the text faded + lock icon)
- each label (B and C) is a link to the corresponding page

For EACH level:

- top control: checkbox "everything clear", which checks all "correct" boxes, locks the pane, and people click next
- bottom controls:
  - next button (will be "resume" if jumped there from search), if page incomplete, mark missing information and don't allow continue; once next is pressed successfully "lock" page
  - lock/unlock icon with button "click to edit" (only clickable if controls are currently locked)

For A:

- multiple-entry: add entry to hierarchy level, add FREETEXT "new_label"
- correct (TRUE or FALSE)
- if NOT correct (correct == FALSE), also capture
  - label incorrect (more severe than type), add FREETEXT "corrected_label"

For both B/C:

- multiple-entry: add entry to hierarchy level, add FREETEXT "new_label"
- correct (TRUE or FALSE), if checked, disable dropdown
- if NOT correct (correct == FALSE), also capture
  - misspelled/typo, add FREETEXT "corrected_label"
  - label incorrect/change term (more severe than typo), add FREETEXT "changed_label"
  - additional synonyms, add FREETEXT, "synonyms_label"
  - (for C only) combine entry with another entry (B+B, C+C), dropdown with all of same B + add "other" + FREETEXT "combine_other_label"
  - add sub-category, modifiers (i.e. add "D"), + FREETEXT "modifiers_for_label"
  - change hierarchy: assign level of C to different level of A/B (two dropdowns, add "other", which alters hierarchy A or B; if entry for A is added, add union of all Bs to that A)
  - (for C only, if modifier exists) "modifier needs work", + FREETEXT "change_modifier"
  - (for C only) delete label
  - comments: add FREETEXT "comments"

Views:

- top view is a (partial) tree with the current *BOX* of level C
- controls
  - top row
    - "see full list" (button/link)
    - #/N counter for boxes
    - search box for elements (with "Go!" link activated when a term is selected)
  - bottom "row"
    - partial tree view

- bottom view is the "agreement configuration" view
- controls:
  - full agreement (checkbox, will check all agrees, lock all other controls; if other controls touched, disable this)
  - rows with
    - label (with optional D/modifiers in smaller font below)
    - agree checkbox (if clicked, disable other row controls, once changes are made in other controls, agree becomes disable)
    - disagree *dropdown* (with initial selection being "select...")
    - plus additional control (free text or dropdown)
  - add entry, if clicked, add row with text field and pre-checked "agree" as well as "delete" button, add entry button then moved one row below
  - bottom row:
    - next/resume (resume if jumped there)
    - lock/unlock icon with "click to edit" link that is disabled if controls are unlocked, once next is clicked, perform plausibility checks, if unsuccessful, highlight rows with problems, or if successful, lock this "page" (box) and either move on or return to previous location

## Suggested frameworks
- D3.js (for tree visualization, might require removing certain information from data/tree structure)
- webix.js (commercial framework already available at MSKCC)
- alternatively: react/Vue (?)

### D3.js

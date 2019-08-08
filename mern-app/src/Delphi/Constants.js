// main texts
export const TITLE_TXT = 'Diagnosis Mapper'
export const TITLE_TXT_FULL = 'Dermatology Diagnosis Mapper - Consensus Survey'

// hot-keys
export const HK_MARK_BLOCK_AS_CORRECT = 'alt+x'
export const HK_NEXT_BLOCK = 'alt+n'

// image filenames and settings
export const IMG_LOCK_LOCKED = '/img/locked.png'
export const IMG_LOCK_LOCKED_ALT = 'Block locked'
export const IMG_LOCK_SIZE = 24
export const IMG_LOCK_UNLOCKED = '/img/unlocked.png'
export const IMG_LOCK_UNLOCKED_ALT = 'Block unlocked'
export const IMG_LOGO = '/img/dm_logo.png'
export const IMG_LOGO_ALT = TITLE_TXT + ' logo'
export const IMG_LOGO_SIZE = 60

// user/session ID
export const SESS_BEGIN = 'Begin or resume session'
export const SESS_ERROR_NOTFOUND = 'Session information not found. Please try again!'
export const SESS_ERROR_UNEXPECTED = 'Unexpected server response. Please try again!'
export const SESS_INFO = 'Session ID: '
export const SESS_LABEL = 'User info: '
export const SESS_PROGRESS = 'Progress: '
export const SESS_PROMPT_EMAIL = 'Please enter your email address...'
export const SESS_PROMPT_ID = 'and session ID...'

// block controls
export const BLOCKS_ADDCAT = 98
export const BLOCKS_ALL = 99
export const BLOCKS_ALL_TXT = 'See all diagnoses (overview)'
export const BLOCKS_FIRST = 10101
export const BLOCKS_INSTRUCT = 5
export const BLOCKS_WELCOME = 0
export const BLOCK_MARK_AS_CORRECT = 'Mark entire block as correct'
export const BLOCK_NEXT = 'Save and continue'
export const BLOCK_PREVIOUS = 'Go back'
export const BLOCK_REVIEW_ALL = 'Review all choices'
export const BLOCK_SAVE = 'Save only'
export const BLOCK_TXT = ', block '
export const BLOCK_UNLOCKED = 'This block is currently unlocked'
export const CATEGORY_FIRST = 101

// table texts
export const TABLE_CATEGORY = 'Category: '
export const TABLE_CORRECT = 'correct'
export const TABLE_CORRECTED = 'corrected'
export const TABLE_CORRECT_NOT_YET = 'to be checked'
export const TABLE_CURRENT_CATEGORY = 'Current Category: '
export const TABLE_HEADER_DIAGNOSIS = 'Diagnosis (name)'
export const TABLE_HEADER_CORRECT = 'Correct?'
export const TABLE_HEADER_CORRECTION = 'Correction (configure as needed)'
export const TABLE_HEADER_NEWCAT = 'Category name'
export const TABLE_HEADER_NEWSUPERCAT = 'Super-category name'
export const TABLE_NO_DIAGNOSES = 'No diagnoses in this category.'

// name mangling
export const TXT_AKA = 'a.k.a. '
export const TXT_AND_MODIFIABLE_BY = ' and '
export const TXT_MODIFIABLE_BY = 'modifiable by '
export const TXT_TO_BE_COMBINED_WITH = ' to be combined with: '
export const TXT_TO_BE_CORRECTED_BY = 'to be corrected by: '
export const TXT_TO_BE_DELETED = ' to be deleted '
export const TXT_TO_BE_MOVED_TO = 'to be moved to category '
export const TXT_TO_BE_MOVED_OTHER = ' (user provided)'

// correction types
export const CORRECTION_COMBINE = 'CORRECTION_COMBINE'
export const CORRECTION_DELETE = 'CORRECTION_DELETE'
export const CORRECTION_DELMODS = 'CORRECTION_DELMODS'
export const CORRECTION_EDITMODS = 'CORRECTION_EDITMODS'
export const CORRECTION_MOVECAT = 'CORRECTION_MOVETOCAT'
export const CORRECTION_NEWMODS = 'CORRECTION_ADDMODS'
export const CORRECTION_NEWNAME = 'CORRECTION_NEWNAME'
export const CORRECTION_NEWSYNS = 'CORRECTION_ADDSYNS'
export const CORRECTION_NONE = 'CORRECTION_NONE'
export const CORRECTION_OTHER = 'CORRECTION_OTHER'
export const CORRECTION_SPELLING = 'CORRECTION_SPELLING'

// and their associated dropdown entries
export const CORRECTION_COMBINE_TXT = 'Combine with other diagnosis'
export const CORRECTION_DELETE_TXT = 'Remove diagnosis completely'
export const CORRECTION_DELMODS_TXT = 'Remove modifiers'
export const CORRECTION_EDITMODS_TXT = 'Edit modifiers'
export const CORRECTION_MOVECAT_TXT = 'Assign to a different category'
export const CORRECTION_NEWMODS_TXT = 'Add modifiers'
export const CORRECTION_NEWNAME_TXT = 'Suggest different name'
export const CORRECTION_NEWSYNS_TXT = 'Additional synonyms'
export const CORRECTION_NONE_TXT = 'Correction needed...'
export const CORRECTION_OTHER_TXT = 'Other (please specify!)'
export const CORRECTION_SPELLING_TXT = 'Wrong spelling'

// and control placeholder texts
export const CORRECTION_COMBINE_SELECT = 'Please select the diagnosis to combine with...'
export const CORRECTION_MOVECAT_EMPTY = 'Please enter a category name...'
export const CORRECTION_MOVECAT_OTHER = 'Other (please specify...)'
export const CORRECTION_MOVECAT_SELECT = 'Please select the category to move this to...'
export const CORRECTION_NEWNAME_EMPTY = 'Please enter a new diagnosis name...'
export const CORRECTION_NEWMODS_EMPTY = 'Please enter additional modifiers...'
export const CORRECTION_NEWSYNS_EMPTY = 'Please enter additional synonyms...'
export const CORRECTION_OTHER_EMPTY = 'Please describe the desired correction(s)...'
export const CORRECTION_SPELLING_EMPTY = 'Please provide the correct spelling...'

// new entry texts
export const NEWENTRY_CANCEL = 'Cancel'
export const NEWENTRY_CONFIRM = 'Confirm'
export const NEWENTRY_CREATE = 'Add a new diagnosis (name)'
export const NEWENTRY_NAME_EMPTY = 'Please enter the diagnosis name...'
export const NEWENTRY_CAT_SELECT = 'Please select the desired category...'
export const NEWENTRY_CAT_NEW = 'Create a new category...'
export const NEWENTRY_PLACEIN = 'placed in'
export const NEWENTRY_ERROR_BAD_BLOCK = 'Category block not found!'
export const NEWENTRY_ERROR_CNAME = 'Duplicate or missing diagnosis name!'
export const NEWCATEGORY_ACAT_NEW = 'New super-category...'
export const NEWCATEGORY_ACAT_ANAME_EMPTY = 'Please enter a super-category name...'
export const NEWCATEGORY_ACAT_BNAME_EMPTY = 'Please enter a new category name...'
export const NEWCATEGORY_ERROR_ANAME = 'Duplicate or missing new super-category name!'
export const NEWCATEGORY_ERROR_BNAME = 'Duplicate or missing new category name!'

// additional texts
export const TXT_TOGGLE_TREE_OFF = 'Click here to hide the taxonomy tree'
export const TXT_TOGGLE_TREE_ON = 'Click here to show the taxonomy tree'
export const TXT_NOT_YET_IMPLEMENTED = 'Feature not yet implemented...'
export const TXT_SUBMIT = 'Submit'

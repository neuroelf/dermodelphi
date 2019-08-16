// main texts
export const TITLE_TXT = 'Diagnosis Mapper'
export const TITLE_TXT_DIAG = 'ISIC-designated-diagnosis'
export const TITLE_TXT_FULL = 'ISIC-Designated Diagnosis Mapper'
export const TITLE_TXT_MINI = 'IDDx'
export const TITLE_TXT_SUBTITLE = 'Consensus Survey'

// hot-keys
export const HK_MARK_BLOCK_AS_CORRECT = 'alt+x'
export const HK_NEXT_BLOCK = 'alt+n'

// image filenames and settings
export const IMG_LOCK_LOCKED = '/img/locked.png'
export const IMG_LOCK_LOCKED_ALT = 'Block locked'
export const IMG_LOCK_SIZE = 24
export const IMG_LOCK_UNLOCKED = '/img/unlocked.png'
export const IMG_LOCK_UNLOCKED_ALT = 'Block unlocked'
export const IMG_LOGO = '/img/dm_logo_2.png'
export const IMG_LOGO_ALT = TITLE_TXT + ' logo'
export const IMG_LOGO_HEIGHT = 60
export const IMG_LOGO_WIDTH = 120

// search results
export const SEARCH_MAX_RESULTS = 30

// user/session ID/token
export const SESS_BEGIN = 'Begin or resume session'
export const SESS_ERROR_NOTFOUND = 'Session information not found. Please try again!'
export const SESS_ERROR_UNEXPECTED = 'Unexpected server response. Please try again!'
export const SESS_INFO = 'Session ID: '
export const SESS_LABEL = 'User info: '
export const SESS_PROGRESS = 'Progress: '
export const SESS_PROMPT_EMAIL = 'Please enter your email address...'
export const SESS_PROMPT_ID = 'and session ID...'
export const SESS_SAVE_ERROR = 'Saving data failed. Please try again!'
export const TOKEN_ERROR_UNEXPECTED = 'Unexpected server response. Please try again!'
export const TOKEN_PROMPT_ID = 'admin access code...'

// block controls
export const BLOCKS_ADDCAT = 98
export const BLOCKS_ALL = 99
export const BLOCKS_ALL_TXT = 'See all diagnoses (overview)'
export const BLOCKS_FIRST = 10101
export const BLOCKS_INSTRUCT = 5
export const BLOCKS_WELCOME = 0
export const BLOCK_MARK_AS_CORRECT = 'Mark entire block as correct'
export const BLOCK_NEXT = 'Save & continue'
export const BLOCK_PREVIOUS = 'Go back'
export const BLOCK_REVIEW_ALL = 'Review all choices'
export const BLOCK_SAVE = 'Save only'
export const BLOCK_TXT = ', block '
export const BLOCK_UNLOCKED = 'This block is currently unlocked'
export const CATEGORY_FIRST = 101

// table texts
export const TABLE_CATEGORY = 'Category: '
export const TABLE_CATEGORY_ADD = 'add category'
export const TABLE_CORRECT = 'correct'
export const TABLE_CORRECTED = 'corrected'
export const TABLE_CORRECT_NOT_YET = 'pending'
export const TABLE_CURRENT_CATEGORY = 'Current Category: '
export const TABLE_HEADER_DIAGNOSIS = 'IDDx term'
export const TABLE_HEADER_CORRECT = 'Correct?'
export const TABLE_HEADER_CORRECTION = 'Correction (configure as needed)'
export const TABLE_HEADER_NEWCAT = 'Category name'
export const TABLE_HEADER_NEWSUPERCAT = 'Super-category name'
export const TABLE_NO_DIAGNOSES = 'No diagnoses in this category.'

// name mangling
export const TXT_AKA = 'a.k.a. '
export const TXT_AKA_EDITED = 'now a.k.a. '
export const TXT_AKA_NEW = 'additionally a.k.a. '
export const TXT_AND_MODIFIABLE_BY = ' and '
export const TXT_CORRECTED_TO = ' corrected to '
export const TXT_MODIFIABLE_BY = 'modifiable by '
export const TXT_MODIFIABLE_BY_NEW = 'additionally modifiable by '
export const TXT_MODS_DELETED = 'modifiers deleted'
export const TXT_MODS_TO_BE_EDITED = ' existing modifiers edited: '
export const TXT_RENAMED_TO = ' renamed to '
export const TXT_SYNS_DELETED = 'synonyms deleted'
export const TXT_SYNS_TO_BE_EDITED = ' existing synonyms edited: '
export const TXT_TO_BE_COMBINED_WITH = ' to be combined with: '
export const TXT_TO_BE_CORRECTED_TO = ' term to be corrected to '
export const TXT_TO_BE_CORRECTED_BY = 'to be corrected by: '
export const TXT_TO_BE_DELETED = ' to be deleted '
export const TXT_TO_BE_MOVED_TO = 'to be moved to category '
export const TXT_TO_BE_MOVED_OTHER = ' (user provided)'
export const TXT_TO_BE_RENAMED_TO = ' to be renamed to '
export const TXT_TO_BE_REPLACED_WITH = ' to be replaced with '

// correction types
export const CORRECTION_COMBINE = 'CORRECTION_COMBINE'
export const CORRECTION_DELETE = 'CORRECTION_DELETE'
export const CORRECTION_DELBOTH = 'CORRECTION_DELBOTH'
export const CORRECTION_DELMODS = 'CORRECTION_DELMODS'
export const CORRECTION_DELSYNS = 'CORRECTION_DELSYNS'
export const CORRECTION_EDITMODS = 'CORRECTION_EDITMODS'
export const CORRECTION_EDITSYNS = 'CORRECTION_EDITSYNS'
export const CORRECTION_FILL1 = 'CORRECTION_FILL1'
export const CORRECTION_FILL2 = 'CORRECTION_FILL2'
export const CORRECTION_FILL3 = 'CORRECTION_FILL3'
export const CORRECTION_FILL4 = 'CORRECTION_FILL4'
export const CORRECTION_FILL5 = 'CORRECTION_FILL5'
export const CORRECTION_FILL8 = 'CORRECTION_FILL8'
export const CORRECTION_FILL9 = 'CORRECTION_FILL9'
export const CORRECTION_MOVECAT = 'CORRECTION_MOVETOCAT'
export const CORRECTION_NEWMODS = 'CORRECTION_ADDMODS'
export const CORRECTION_NEWNAME = 'CORRECTION_NEWNAME'
export const CORRECTION_NEWSYNS = 'CORRECTION_ADDSYNS'
export const CORRECTION_NONE = 'CORRECTION_NONE'
export const CORRECTION_OTHER = 'CORRECTION_OTHER'
export const CORRECTION_SPELLING = 'CORRECTION_SPELLING'

// and their associated dropdown entries
export const CORRECTION_COMBINE_TXT = 'Combine with another IDDx term'
export const CORRECTION_COMBINE_USER_DEFINED_TXT = ' (user defined term)'
export const CORRECTION_DELETE_TXT = 'Remove IDDx term completely'
export const CORRECTION_DELBOTH_TXT = 'Remove modifiers and synonyms'
export const CORRECTION_DELMODS_TXT = 'Remove modifiers'
export const CORRECTION_DELSYNS_TXT = 'Remove synonym(s)'
export const CORRECTION_EDITMODS_TXT = 'Edit modifiers'
export const CORRECTION_EDITSYNS_TXT = 'Edit synonym(s)'
export const CORRECTION_FILLING_TXT = '--------------------------------'
export const CORRECTION_MOVECAT_TXT = 'Assign IDDX term to another category'
export const CORRECTION_NEWMODS_TXT = 'Add modifiers'
export const CORRECTION_NEWNAME_TXT = 'Suggest a different name for IDDx term'
export const CORRECTION_NEWSYNS_TXT = 'Add synonym(s)'
export const CORRECTION_NONE_ALT = 'Go back to original'
export const CORRECTION_NONE_TXT = 'Correction needed...'
export const CORRECTION_OTHER_TXT = 'Other (please specify)'
export const CORRECTION_SPELLING_TXT = 'Correct spelling of IDDx term'

// and control placeholder texts
export const CORRECTION_COMBINE_SELECT = 'Please select the IDDx term to combine with...'
export const CORRECTION_EDITMODS_EMPTY = 'Please enter the corrected modifiers...'
export const CORRECTION_EDITSYNS_EMPTY = 'Please enter the corrected synonyms...'
export const CORRECTION_MOVECAT_EMPTY = 'Please enter a category name...'
export const CORRECTION_MOVECAT_OTHER = 'Other (please specify...)'
export const CORRECTION_MOVECAT_SELECT = 'Please select the category to move this to...'
export const CORRECTION_MOVECAT_SCAT_UNKNOWN = 'User-defined super-category'
export const CORRECTION_MOVECAT_USER = ' (user-defined category)'
export const CORRECTION_NEWNAME_EMPTY = 'Please enter a new IDDx term...'
export const CORRECTION_NEWMODS_EMPTY = 'Please enter additional modifiers...'
export const CORRECTION_NEWSYNS_EMPTY = 'Please enter additional synonyms...'
export const CORRECTION_OTHER_EMPTY = 'Please describe the desired correction(s)...'
export const CORRECTION_SPELLING_EMPTY = 'Please provide the correct spelling...'

// new entry texts
export const NEWENTRY_CANCEL = 'Cancel'
export const NEWENTRY_CONFIRM = 'Confirm'
export const NEWENTRY_CREATE = 'Add a new IDDx term'
export const NEWENTRY_NAME_EMPTY = 'Please enter the IDDx term...'
export const NEWENTRY_CAT_SELECT = 'Please select the desired category...'
export const NEWENTRY_CAT_NEW = 'Create a new category...'
export const NEWENTRY_PLACEIN = 'placed in'
export const NEWENTRY_ERROR_BAD_BLOCK = 'Category block not found!'
export const NEWENTRY_ERROR_CNAME = 'Duplicate or missing IDDx term!'
export const NEWCATEGORY_ACAT_NEW = 'New super-category...'
export const NEWCATEGORY_ACAT_ANAME_EMPTY = 'Please enter a super-category name...'
export const NEWCATEGORY_ACAT_BNAME_EMPTY = 'Please enter a new category name...'
export const NEWCATEGORY_ERROR_ANAME = 'Duplicate or missing new super-category name!'
export const NEWCATEGORY_ERROR_BNAME = 'Duplicate or missing new category name!'

// additional texts
export const TXT_TOGGLE_TREE_OFF = 'Click here to hide the suggested taxonomy tree'
export const TXT_TOGGLE_TREE_ON = 'Click here to show the suggested taxonomy tree'
export const TXT_NOT_YET_IMPLEMENTED = 'Feature not yet implemented...'
export const TXT_SEARCH_NORESULTS = 'Nothing found.'
export const TXT_SEARCH_PROMPT = 'Search for IDDx terms, categories...'
export const TXT_SEARCH_RESULTS = 'Results...'
export const TXT_SEARCH_RESULTS_A = 'Super-category: '
export const TXT_SEARCH_RESULTS_B = 'Category: '
export const TXT_SUBMIT = 'Submit'

// results output
export const TXT_RESULTS_APPROVE = 'Approve'
export const TXT_RESULTS_CORRECTED = 'Corrected'
export const TXT_RESULTS_CORRECTIONS = 'Corrections requested'
export const TXT_RESULTS_DELETE = 'Deleted'
export const TXT_RESULTS_NORESULTS = 'No results yet.'
export const TXT_RESULTS_NUMRATERS = ' rater(s) corrected this block'
export const TXT_RESULTS_PENDING = 'Pending'
export const TXT_RESULTS_RATERID = 'Rater (ID)'
export const TXT_RESULTS_STATUS = 'Status'

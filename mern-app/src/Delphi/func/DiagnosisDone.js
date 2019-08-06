import * as DC from '../Constants'

// this function performs a series of mangling steps
export default function DiagnosisDone(rowState) {

    // don't look further if a control is not marked as correct and no selection made
    if ((!rowState.correct) && (rowState.correction === DC.CORRECTION_NONE)) {
        return false;
    }

    // if, on the other hand, the row state *is* correct, check next
    if (rowState.correct) {
        return true;
    }

    // otherwise, we check depending on the state of correction
    switch (rowState.correction) {
        case DC.CORRECTION_SPELLING:
            if (rowState.corrspelling === '') {
                return false;
            }
            break;
        case DC.CORRECTION_NEWNAME:
            if (rowState.corrnewname === '') {
                return false;
            }
            break;
        case DC.CORRECTION_NEWSYNS:
            if (rowState.corrnewsyns === '') {
                return false;
            }
            break;
        case DC.CORRECTION_COMBINE:
            if (rowState.corrcombine === 0) {
                return false;
            }
            break;
        case DC.CORRECTION_MOVECAT:
            if (rowState.corrmoveto === 0) {
                return false;
            }
            if ((rowState.corrmoveto === DC.BLOCKS_ALL) &&
                (rowState.corrmovetox === '')) {
                return false;
            }
            break;
        case DC.CORRECTION_NEWMODS:
            if (rowState.corrnewmods === '') {
                return false;
            }
            break;
        case DC.CORRECTION_OTHER:
            if (rowState.corrother === '') {
                return false;
            }
            break;
        default:
            break;
    }
    return true;
}

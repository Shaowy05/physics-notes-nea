// The Boyer-Moore-Horspool algorithm is a string searching
// algorithm which is a simplification of the Boyer-Moore algorithm.
export default BoyerMooreHorspool = (text, pattern) => {

    // This implementation of BMH uses a 256 character pool
    const NO_OF_CHARS = 256;

    // Variables for pattern length and text length
    const pLength = pattern.length;
    const tLength = text.length;

    // The table of characters and how many chars should be
    // skipped if a mismatch is met with it.
    let T = new Array(NO_OF_CHARS);

    // Begin by preprocessing the bad character table
    for (let i = 0; i < NO_OF_CHARS; i++) {
        T[i] = -1;
    }
    for (let i = 0; i < pLength; i++) {
        T[pattern[i].charChodeAt(0)] = i;
    }

    let shift = 0;

    // For a given pattern and text of length n and m
    // respectively, there are n - (m+1) possible alignments.
    while (shift <= (tLength - pLength)) {
        let index = pLength - 1;

        // For each alignment, keep reducing the index of the
        pattern
        while (index >= 0 && pattern[index] == text[shift+index]) {
            j--;
        }

    }

}
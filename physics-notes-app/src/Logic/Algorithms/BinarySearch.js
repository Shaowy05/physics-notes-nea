// Declaring the searching algorithm with arrow notation. The function will take in an array of numerical
// values and a search value, the number we are searching for.
const binarySearch = (array, searchValue) => {

    // First we define a variable called left, used to store the first index of the array.
    let left = 0;
    // The right will store the last index of the array.
    let right = array.length - 1;
    // Middle will be the index of the value that we are trying to compare to the search value, initially
    // null since we don't know where the middle of the array is going to be.
    let middle = null;

    // Loop as long as the left index is smaller than or equal to the right index.
    while (left <= right) {

        // Set the middle variable to the index of the centre item in the array. Here I have opted for
        // rounding the value down, but variants where it is rounded up also exist.
        middle = Math.floor((left + right) / 2);

        // If the centre item is smaller than the value we are looking for, then we want to search the
        // 'right' side of the array, so we assign the a new value to the left variable, specifically
        // one higher than the middle index.
        if (array[middle] < searchValue) {
            left = middle + 1;
        }
        // If the value is higher, then the value we are looking for must be in the 'left' side of the
        // array, so instead we set the right pointer to be one less than the index indicated by the
        // middle variable.
        else if (array[middle] > searchValue) {
            right = middle - 1;
        }
        // If neither of the first conditions are met, then the value at the index indicated by middle
        // must be the value we are looking for, so we return this index back to the user.
        else {
            return middle;
        }

    }

    // If the entire array has been searched through, then the value we wanted is not in the array,
    // and we can safely return false.
    return false;

}

// Finally we export the binarySearch function so that it can be used in other parts of the web application.
export default binarySearch;
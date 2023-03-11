// First we declare a merge sort function with arrow notation, taking in an array of values to be sorted.
// This mergesort works uniquely on numerical values, any sorting needed for non-numerical arrays will
// have to first be converted to a numerical array and then use some form of hash table to return to
// the orginal values.
const mergeSort = array => {

    // In order to make sure that the function does not throw any errors during runtime, we need to
    // first validate that all of the items in the array is a number. If not then we log an error and
    // escape out of the function. Here we use the .some() method to easily loop through the array,
    // the javascript typeof keyword to determine whether or not the item is valid.
    // if (array.some(element => typeof element !== 'number')) {
    //     console.log('Non numerical value in array - Cannot sort');
    //     return;
    // }

    // Then we define the base case, if the length of the array is 1 (or less) then the array is considered
    // sorted. This is important to terminate the splitting of any arrays during the merge sort algorithm.
    if (array.length <= 1) {
        // We also return the array if it is sorted.
        return array;
    }

    // Now we implement the recursive case. Here we create two arrays, left and right. Left is the left
    // side of the array that we are splitting and right is the right side. First we declare them as
    // empty, and then we add values later.
    let left = [];
    let right = [];

    // For each element in the array, here we are using the .forEach method on the array, passing in
    // the element itself, and its index i into the callback function, perform the following...
    array.forEach((element, i) => {
        // If the index of the element is less than half the arrays length, it belongs in the left array.
        if (i < array.length / 2) {
            left.push(element);
        // Otherwise, push it to the right array.
        } else {
            right.push(element);
        }
    });

    // Now we recursively call the merge sort algorithm on the left array in order to sort the left
    // array.
    left = mergeSort(left);
    // And the same goes for the right array.
    right = mergeSort(right);

    // After both the left and the right are sorted, we can return the merged version of the two, the
    // merge function is defined below.
    return merge(left, right);

}

// This is the merge function that works with the merge sort function. The purpose of the merge function
// is to take two different arrays, and combine them in such a way that it returns a sorted, combined
// array. The merge function takes in two parameters, the left array and the right array.
const merge = (left, right) => {

    // Here we create the merged array variable, this will be used to store the final merged array to
    // be returned.
    let merged = [];

    // While the length of the left array is not 0, and the length of the right array is not 0...
    while (left.length !== 0 && right.length !== 0) {

        // If the next item in the left array is smaller than the first item in the right array, then
        // we want to add the first item of the left array to the merged variable. Here .shift() is
        // a built in method which removes the first item of the array and also returns it.
        if (left[0] <= right[0]) {
            merged.push(left.shift());
        // And vice versa for the right array.
        } else {
            merged.push(right.shift());
        }

    }
    
    // At the end of the while loop, there will still be some items left in either the left array or
    // the right array. These will be the largest items, since both the left and right arrays are sorted
    // when they are passed into the function. As a result, we have to concatenate the results onto
    // the end of the merged variable at the end of the merge function.
    if (left.length !== 0) {
        merged = merged.concat(left);
    }
    if (right.length !== 0) {
        merged = merged.concat(right);
    }

    // Finally, return the merged array
    return merged;

}

// Here we export the mergeSort function so that it can be used elsewhere in the program.
export {mergeSort as default, merge};
const mergeSort = array => {

    // The base case for the recursive algorithm.
    // An array of length 0 or 1 is considered sorted.
    if (array.length <= 1) {
        return array;
    }

    // Recursive case
    let left = new Array()
    let right = new Array()

    array.forEach((element, i) => {
        if (i < array.length / 2) {
            left.push(element);
        } else {
            right.push(element);
        }
    });

    left = mergeSort(left);
    right = mergeSort(right);

    return merge(left, right);

}

const merge = (left, right) => {

    // Instantiate the variable to store the merged array
    let merged = new Array();

    while (left.length !== 0 && right.length !== 0) {
        if (left[0] <= right[0]) {
            merged.push(left[0]);
            left.shift();
        } else {
            merged.push(right[0]);
            right.shift();
        }

        // Either array may have elements left in them.
        // Here we add them onto the end of the array
        if (left.length !== 0) {
            merged.push(left);
        }
        if (right.length !== 0) {
            merged.push(right);
        }

        return merged;

    }
    
}

export {mergeSort as default, merge};
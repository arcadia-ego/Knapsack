const fs = require('fs');

function naiveKnapsack(items, capacity) {
  // what is the value we have when we don't pick up any items
  // value[0, w] = 0
  // value[i, w] = value[i-1, w] if W[i] > w
  
  // recursive solution
  function recurse(i, size) {
    // base case
    if (i == 0) {
      return {
        value: 0,
        size: 0,
        chosen: []
      };
    }

    // how do we move towards our base case?
    // recurse(items.length, capacity)
    // recurse(items.length - 1, capacity)
    // recurse(items.length - 2, capacity)

    // Pick up an item
    // case: item doesn't fit
    
    else if (items[i].size > size) {
      return recurse(i - 1, size);
    }

    // case: item does fit, but it might not be worth
    // as much as the sum of values of items we currently
    // have in our bag
    else {
      // the max value we've accumulated so far 
      const r0 = recurse(i - 1, size);
      // the max value we could have if we added the new item we picked
      // but evicted some others
      const r1 = recurse(i - 1, size - items[i].size);

      r1.value += items[i].value;

      if (r0.value > r1.value) {
        return r0;
      } else {
        r1.size += items[i].size;
        r1.chosen = r1.chosen.concat(i);
        return r1;
      }
    }
  }

  return recurse(items.length - 1, capacity);
}

// Recursive Memoized 

function knapsackRecursiveMemoized(items, capacity) {
  const cache = Array(items.length);
  //fill the cache array with more arrays
  for (let i = 0; i < items.length; i++) {
    cache[i] = Array(capacity + 1).fill(null);
  }
//i is index, size is where we pass capacity (remaining capacity)
  function recurseMemoized(i, size) {
    let answer = cache[i][size];
    if(!answer) {
      answer = recurse(i,size);
      cache[i][size] = Object.assign({}, answer);
    }
    return answer
  }
  function recurse(i,size) {
    if(i===0) {
      return {
        size: 0,
        value: 0,
        chosen: []
      }
    } else if (items[i].size > size) {
      return recurseMemoized(i-1, size);
    } else {
      const r0 = recurseMemoized(i-1, size);
      const r1 = recurseMemoized(i-1, size - items[i].size);
      r1.value += items[i].value;
      if(r0.value > r1.value) {
        return r0;
      } else {
        r1.size += items[i].size;
        r1.chosen = r1.chosen.concat(i);
        return r1;
      }
    }
  }
  return recurseMemoized(items.length - 1, capacity);
}

//iterative memo
function knapsackIterative(items, capacity) {
  const cache = Array(items.length);

  for(let i = 0; i < items.length; i++){
    cache[i] = Array(capacity+1).fill(null);
  }
  //fill cache with base values
  for(let i = 0; i <= capacity; i++) {
    cache[0][i] ={
      size: 0,
      value: 0,
      chosen: []
    };
  }
  //looping through all items;
  for (let i = 1; i < items.length; i++) {
    //loop through capacities
    for(let  j = 0; j<= capacity; j++) {
      if(items[i].size > j) {
        //if item doesn't fit use previous best value
        cache[i][j] = cache[i-1][j];
      } else {
        //item does not vid, look at prev value and the value we'll get, by taking the current item choose the best one
        const r0 = cache[i-1][j];
        const r1 = Object.assign({}, cache[i-1][j - items[i].size]);
        r1.value += items[i].value;
        if (r0.value > r1.value) {
          cache[i][j] = r0;
        } else {
          r1.size += items[i].size;
          r1.chosen = r1.chosen.concat(i);
          cache[i][j] = r1;
        }
      }
    }
  }
  return cache[cache.length - 1][capacity];
}

const argv = process.argv.slice(2);

// add an error check to check the number of params
if (argv.length != 2) {
  console.error('usage: [filename] [capacity]');
  process.exit(1);
}

const filename = argv[0];
const capacity = argv[1];

// read the file that was passed to our program

const filedata = fs.readFileSync(filename, 'utf8');

const lines = filedata.trim().split(/[\r\n]+/g);

// process the lines 

const items = [];

for (let l of lines) {
  const [index, size, value] = l.split(' ').map(n => parseInt(n));
  
  items[index] = {
    index,
    size,
    value,
  };
}

function iterativeMemo(items, capacity) {
  //iterate over every item and prioritize the highest value/size ratio
  const cache = Array(items);
  const cache = [];

}


console.log("Naive Recursive implementation: ", naiveKnapsack(items, capacity));
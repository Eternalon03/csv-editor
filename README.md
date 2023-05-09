# csv-editor

# What I learnt doing this project

Pandas is built upon NumPY, needs NumPY to run

Vectorization: replacing explicit loops with array expressions, one or two orders of magnitude faster
  NumPy delegates the looping from array expressions internally to optimized C and Fortran functions, since python is slow
  
  for-loop
 ```
 def count_transitions(x) -> int:
     count = 0
     for i, j in zip(x[:-1], x[1:]):
         if j and not i:
             count += 1
     return count
 ```
 
 vectorization
 ```
 np.count_nonzero(x[:-1] < x[1:])
 ```

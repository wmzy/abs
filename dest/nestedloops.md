# 10.2\. 嵌套循环

_嵌套循环_就是在一个循环中还有一个循环, 内部循环在外部循环体中. 在外部循环的每次执行过程中都会触发内部循环, 直到内部循环执行结束. 外部循环执行了多少次, 内部循环就完成多少次. 当然, 无论是内部循环还是外部循环的_break_语句都会打断处理过程.

* * *

**例子 10-19\. 嵌套循环**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # nested-loop.sh: 嵌套的"for"循环. 
  3 
  4 outer=1             # 设置外部循环计数.
  5 
  6 # 开始外部循环.
  7 for a in 1 2 3 4 5
  8 do
  9   echo "Pass $outer in outer loop."
 10   echo "---------------------"
 11   inner=1           # 重置内部循环计数.
 12 
 13   # ===============================================
 14   # 开始内部循环.
 15   for b in 1 2 3 4 5
 16   do
 17     echo "Pass $inner in inner loop."
 18     let "inner+=1"  # 增加内部循环计数.
 19   done
 20   # 内部循环结束.
 21   # ===============================================
 22 
 23   let "outer+=1"    # 增加外部循环的计数.
 24   echo              # 每次外部循环之间的间隔.
 25 done               
 26 # 外部循环结束.
 27 
 28 exit 0</pre>

 |

* * *

关于嵌套的[while循环](loops1.md#WHILELOOPREF)请参考[例子 26-11](arrays.md#BUBBLE), 关于while循环中嵌套[until循环](loops1.md#UNTILLOOPREF)的例子请参考[例子 26-13](arrays.md#EX68).
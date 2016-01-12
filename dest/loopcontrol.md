# 10.3\. 循环控制

**影响循环行为的命令**

*   **break**, **continue**
*   **break**和**continue**这两个循环控制命令 [[1]](#FTN.AEN5681) 与其他语言的类似命令的行为是相同的. **break**命令用来跳出循环, 而**continue**命令只会跳过本次循环, 忽略本次循环剩余的代码, 进入循环的下一次_迭代_.

    * * *

    **例子 10-20\. **break**和**continue**命令在循环中的效果**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 LIMIT=19  # 上限
      4 
      5 echo
      6 echo "Printing Numbers 1 through 20 (but not 3 and 11)."
      7 
      8 a=0
      9 
     10 while [ $a -le "$LIMIT" ]
     11 do
     12  a=$(($a+1))
     13 
     14  if [ "$a" -eq 3 ] || [ "$a" -eq 11 ]  # 除了3和11.
     15  then
     16    continue      # 跳过本次循环剩余的语句.
     17  fi
     18 
     19  echo -n "$a "   # 在$a等于3和11的时候，这句将不会执行.
     20 done 
     21 
     22 # 练习:
     23 # 为什么循环会打印出20?
     24 
     25 echo; echo
     26 
     27 echo Printing Numbers 1 through 20, but something happens after 2.
     28 
     29 ##################################################################
     30 
     31 # 同样的循环, 但是用'break'来代替'continue'.
     32 
     33 a=0
     34 
     35 while [ "$a" -le "$LIMIT" ]
     36 do
     37  a=$(($a+1))
     38 
     39  if [ "$a" -gt 2 ]
     40  then
     41    break  # 将会跳出整个循环.
     42  fi
     43 
     44  echo -n "$a "
     45 done
     46 
     47 echo; echo; echo
     48 
     49 exit 0</pre>

     |

    * * *

    **break**命令可以带一个参数. 一个不带参数的**break**命令只能退出最内层的循环, 而**break N**可以退出`N`层循环.

    * * *

    **例子 10-21\. 多层循环的退出**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # break-levels.sh: 退出循环.
      3 
      4 # "break N" 退出N层循环.
      5 
      6 for outerloop in 1 2 3 4 5
      7 do
      8   echo -n "Group $outerloop:   "
      9 
     10   # --------------------------------------------------------
     11   for innerloop in 1 2 3 4 5
     12   do
     13     echo -n "$innerloop "
     14 
     15     if [ "$innerloop" -eq 3 ]
     16     then
     17       break  # 试试   break 2   来看看发生什么事.
     18              # (内部循环和外部循环都被"Break"了. )
     19     fi
     20   done
     21   # --------------------------------------------------------
     22 
     23   echo
     24 done  
     25 
     26 echo
     27 
     28 exit 0</pre>

     |

    * * *

    **continue**命令也可以象**break**命令一样带一个参数. 一个不带参数的**continue**命令只会去掉本次循环的剩余代码. 而**continue N**将会把`N`层循环的剩余代码都去掉, 但是循环的次数不变.

    * * *

    **例子 10-22\. 多层循环的continue**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # "continue N" 命令, 将让N层的循环全部被continue.
      3 
      4 for outer in I II III IV V           # 外部循环
      5 do
      6   echo; echo -n "Group $outer: "
      7 
      8   # --------------------------------------------------------------------
      9   for inner in 1 2 3 4 5 6 7 8 9 10  # 内部循环
     10   do
     11 
     12     if [ "$inner" -eq 7 ]
     13     then
     14       continue 2  # 在第2层循环上的continue, 也就是"外部循环".
     15                   # 使用"continue"来替代这句, 
     16                   # 然后看一下一个正常循环的行为.
     17     fi  
     18 
     19     echo -n "$inner "  # 7 8 9 10 将不会被echo.
     20   done  
     21   # --------------------------------------------------------------------
     22   # 译者注: 如果在此处添加echo的话, 当然也不会输出.
     23 done
     24 
     25 echo; echo
     26 
     27 # 练习:
     28 # 在脚本中放入一个有意义的"continue N". 
     29 
     30 exit 0</pre>

     |

    * * *

    * * *

    **例子 10-23\. 在实际的任务中使用<span class="QUOTE">"continue N"</span>**

    | 

    <pre class="PROGRAMLISTING">  1 # Albert Reiner 给出了一个关于使用"continue N"的例子:
      2 # ---------------------------------------------------------
      3 
      4 #  假定我有很多作业需要运行, 这些任务要处理一些数据,
      5 #+ 这些数据保存在某个目录下的文件里, 文件是以预先给定的模式进行命名的. 
      6 #+ 有几台机器要访问这个目录, 
      7 #+ 我想把工作都分配给这几台不同的机器,
      8 #+ 然后我一般会在每台机器里运行类似下面的代码:
      9 
     10 while true
     11 do
     12   for n in .iso.*
     13   do
     14     [ "$n" = ".iso.opts" ] && continue
     15     beta=${n#.iso.}
     16     [ -r .Iso.$beta ] && continue
     17     [ -r .lock.$beta ] && sleep 10 && continue
     18     lockfile -r0 .lock.$beta || continue
     19     echo -n "$beta: " `date`
     20     run-isotherm $beta
     21     date
     22     ls -alF .Iso.$beta
     23     [ -r .Iso.$beta ] && rm -f .lock.$beta
     24     continue 2
     25   done
     26   break
     27 done
     28 
     29 #  在我的应用中的某些细节是很特殊的, 尤其是sleep N, 
     30 #+ 但是更一般的模式是:
     31 
     32 while true
     33 do
     34   for job in {pattern}
     35   do
     36     {job already done or running} && continue
     37     {mark job as running, do job, mark job as done}
     38     continue 2
     39   done
     40   break        # 而所谓的`sleep 600'只不过是想避免程序太快结束, 而达不到演示效果. 
     41 done
     42 
     43 #  脚本只有在所有任务都完成之后才会停止运行,
     44 #+ (包括那些运行时新添加的任务). 
     45 #+ 通过使用合适的lockfiles,
     46 #+ 可以使几台机器协作运行而不会产生重复的处理,
     47 #+ [在我的这个例子中, 重复处理会使处理时间延长一倍时间, 因此我很想避免这个问题].
     48 #+ 同样, 如果每次都从头开始搜索, 可以由文件名得到处理顺序.
     49 #+ 当然, 还有一种办法, 也可以不使用`continue 2',
     50 #+ 但这样的话, 就不得不检查相同的任务是不是已经被完成过了,
     51 #+ (而我们应该马上来找到下一个要运行的任务)
     52 #+ (在演示的情况中, 检查新任务前我们终止或睡眠了很长一段时间).
     53 #+ </pre>

     |

    * * *

    | ![Caution](./images/caution.gif) | 

    **continue N**结构如果用在有意义的场合中, 往往都很难理解, 并且技巧性很高. 所以最好的方法就是尽量避免使用它.

     |

### 注意事项

| [[1]](loopcontrol.md#AEN5681) | 

这两个命令是shell的[内建](internal.md#BUILTINREF)命令, 而不象其他的循环命令那样, 比如[while](loops1.md#WHILELOOPREF)和[case](testbranch.md#CASEESAC1), 这两个是[关键字](internal.md#KEYWORDREF).

 |
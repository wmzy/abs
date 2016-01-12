# 15\. 算术扩展

算术扩展提供了一种强力工具, 可以在脚本中执行(整型)算法操作. 可以使用[backticks](commandsub.md#BACKQUOTESREF), [double parentheses](dblparens.md), 或[let](internal.md#LETREF)来将字符串转换为数字表达式.

**一些变化**

*   使用后置引用的算术扩展(通常都是和[expr](moreadv.md#EXPRREF)一起使用)
*   | 

    <pre class="PROGRAMLISTING">  1 z=`expr $z + 3`          # 'expr'命令将会执行这个扩展. </pre>

     |

*   使用双括号形式的算术扩展, 也可以使用**let**命令
*   后置引用形式的算术扩展已经被双括号形式所替代了 -- <kbd class="USERINPUT">((...))</kbd>和<kbd class="USERINPUT">$((...))</kbd> -- 当然也可以使用非常方便的**let**结构.

    | 

    <pre class="PROGRAMLISTING">  1 z=$(($z+3))
      2 z=$((z+3))                                  #  也正确. 
      3                                             #  使用双括号的形式, 
      4                                             #+ 参数解引用
      5                                             #+ 是可选的. 
      6 
      7 # $((EXPRESSION))是算数表达式.              #  不要与命令替换
      8                                             #+ 相混淆. 
      9 
     10 
     11 
     12 # 使用双括号的形式也可以不用给变量赋值. 
     13 
     14   n=0
     15   echo "n = $n"                             # n = 0
     16 
     17   (( n += 1 ))                              # 递增. 
     18 # (( $n += 1 )) is incorrect!
     19   echo "n = $n"                             # n = 1
     20 
     21 
     22 let z=z+3
     23 let "z += 3"  #  使用引用的形式, 允许在变量赋值的时候存在空格. 
     24               #  'let'命令事实上执行得的是算术赋值, 
     25               #+ 而不是算术扩展. </pre>

     |

    下边是一些在脚本中使用算术扩展的例子:

    1.  [例子 12-9](moreadv.md#EX45)

    2.  [例子 10-14](loops1.md#EX25)

    3.  [例子 26-1](arrays.md#EX66)

    4.  [例子 26-11](arrays.md#BUBBLE)

    5.  [例子 A-17](contributed-scripts.md#TREE)
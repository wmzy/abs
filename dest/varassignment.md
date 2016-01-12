# 4.2\. 变量赋值

*   <span class="TOKEN">=</span>
*   赋值操作(_前后都不能有空白_)

    | ![Caution](./images/caution.gif) | 

    因为[=](comparison-ops.md#EQUALSIGNREF)和[-eq](comparison-ops.md#EQUALREF)都可以用做条件测试操作, 所以不要与这里的赋值操作相混淆.

    注意: <span class="TOKEN">=</span>既可以用做条件测试操作, 也可以用于赋值操作, 这需要视具体的上下文而定.

     |

    * * *

    **例子 4-2\. 简单的变量赋值**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # "裸体"变量
      3 
      4 echo
      5 
      6 # 变量什么时候是"裸体"的, 比如前边少了$的时候?
      7 # 当它被赋值的时候, 而不是被引用的时候.
      8 
      9 # 赋值
     10 a=879
     11 echo "The value of \"a\" is $a."
     12 
     13 # 使用'let'赋值
     14 let a=16+5
     15 echo "The value of \"a\" is now $a."
     16 
     17 echo
     18 
     19 # 在'for'循环中(事实上, 这是一种伪赋值):
     20 echo -n "Values of \"a\" in the loop are: "
     21 for a in 7 8 9 11
     22 do
     23   echo -n "$a "
     24 done
     25 
     26 echo
     27 echo
     28 
     29 # 使用'read'命令进行赋值(这也是一种赋值的类型):
     30 echo -n "Enter \"a\" "
     31 read a
     32 echo "The value of \"a\" is now $a."
     33 
     34 echo
     35 
     36 exit 0</pre>

     |

    * * *

    * * *

    **例子 4-3\. 简单和复杂, 两种类型的变量赋值**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 a=23              # 简单的赋值
      4 echo $a
      5 b=$a
      6 echo $b
      7 
      8 # 现在让我们来点小变化(命令替换).
      9 
     10 a=`echo Hello!`   # 把'echo'命令的结果传给变量'a'
     11 echo $a
     12 #  注意, 如果在一个#+的命令替换结构中包含一个(!)的话, 
     13 #+ 那么在命令行下将无法工作.
     14 #+ 因为这触发了Bash的"历史机制."
     15 #  但是, 在脚本中使用的话, 历史功能是被禁用的, 所以就能够正常的运行.
     16 
     17 a=`ls -l`         # 把'ls -l'的结果赋值给'a'
     18 echo $a           # 然而, 如果没有引号的话将会删除ls结果中多余的tab和换行符.
     19 echo
     20 echo "$a"         # 如果加上引号的话, 那么就会保留ls结果中的空白符.
     21                   # (具体请参阅"引用"的相关章节.)
     22 
     23 exit 0</pre>

     |

    * * *

    使用_$(...)_机制来进行变量赋值(这是一种比[后置引用(反引号`)](commandsub.md#BACKQUOTESREF)更新的一种方法). 事实上这两种方法都是[命令替换](commandsub.md#COMMANDSUBREF)的一种形式.

    | 

    <pre class="PROGRAMLISTING">  1 # From /etc/rc.d/rc.local
      2 R=$(cat /etc/redhat-release)
      3 arch=$(uname -m)</pre>

     |
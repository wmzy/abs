# 9.4\. 指定变量的类型: 使用declare或者typeset

_declare_或者_typeset_[内建](internal.md#BUILTINREF)命令(这两个命令是完全一样的)允许指定变量的具体类型. 在某些编程语言中, 这是指定变量类型的一种很弱的形式. **declare**命令是从Bash 2.0之后才被引入的命令. **typeset**也可以用在ksh的脚本中.

**declare/typeset选项**

*   <span class="TOKEN">-r</span> <tt class="REPLACEABLE">_只读_</tt>
*   | 

    <pre class="PROGRAMLISTING">  1 declare -r var1</pre>

     |

    (<kbd class="USERINPUT">declare -r var1</kbd>与<kbd class="USERINPUT">readonly var1</kbd>是完全一样的)

    这和C语言中的**const**关键字一样, 都用来指定变量为只读. 如果你尝试修改一个只读变量的值, 那么会产生错误信息.

*   <span class="TOKEN">-i</span> <tt class="REPLACEABLE">_整型_</tt>
*   | 

    <pre class="PROGRAMLISTING">  1 declare -i number
      2 # 脚本将会把变量"number"按照整型进行处理. 
      3 
      4 number=3
      5 echo "Number = $number"     # Number = 3
      6 
      7 number=three
      8 echo "Number = $number"     # Number = 0
      9 # 脚本尝试把字符串"three"作为整数来求值(译者注: 当然会失败, 所以出现值为0). </pre>

     |

    如果把一个变量指定为整型的话, 那么即使没有[expr](moreadv.md#EXPRREF)或者[let](internal.md#LETREF)命令, 也允许使用特定的算术运算.

    | 

    <pre class="PROGRAMLISTING">  1 n=6/3
      2 echo "n = $n"       # n = 6/3
      3 
      4 declare -i n
      5 n=6/3
      6 echo "n = $n"       # n = 2</pre>

     |

*   <span class="TOKEN">-a</span> <tt class="REPLACEABLE">_数组_</tt>
*   | 

    <pre class="PROGRAMLISTING">  1 declare -a indices</pre>

     |

    变量`indices`将被视为数组.

*   <span class="TOKEN">-f</span> <tt class="REPLACEABLE">_函数_</tt>
*   | 

    <pre class="PROGRAMLISTING">  1 declare -f</pre>

     |

    如果在脚本中使用<kbd class="USERINPUT">declare -f</kbd>, 而不加任何参数的话, 那么将会列出这个脚本之前定义的所有函数.

    | 

    <pre class="PROGRAMLISTING">  1 declare -f function_name</pre>

     |

    如果在脚本中使用<kbd class="USERINPUT">declare -f function_name</kbd>这种形式的话, 将只会列出这个函数的名字.

*   <span class="TOKEN">-x</span> [export](internal.md#EXPORTREF)
*   | 

    <pre class="PROGRAMLISTING">  1 declare -x var3</pre>

     |

    这句将会声明一个变量, 并作为这个脚本的环境变量被导出.

*   -x var=$value
*   | 

    <pre class="PROGRAMLISTING">  1 declare -x var3=373</pre>

     |

    **declare**命令允许在声明变量类型的同时给变量赋值.

* * *

**例子 9-22\. 使用**declare**来指定变量的类型**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 func1 ()
  4 {
  5 echo This is a function.
  6 }
  7 
  8 declare -f        # 列出前面定义的所有函数.
  9 
 10 echo
 11 
 12 declare -i var1   # var1是个整型变量.
 13 var1=2367
 14 echo "var1 declared as $var1"
 15 var1=var1+1       # 整型变量的声明并不需要使用'let'命令.
 16 echo "var1 incremented by 1 is $var1."
 17 # 尝试修改一个已经声明为整型变量的值.
 18 echo "Attempting to change var1 to floating point value, 2367.1."
 19 var1=2367.1       # 产生错误信息, 并且变量并没有被修改.
 20 echo "var1 is still $var1"
 21 
 22 echo
 23 
 24 declare -r var2=13.36         # 'declare'允许设置变量的属性, 
 25                               #+ 同时给变量赋值.
 26 echo "var2 declared as $var2" # 试图修改只读变量的值.
 27 var2=13.37                    # 产生错误消息, 并且从脚本退出.
 28 
 29 echo "var2 is still $var2"    # 将不会执行到这行.
 30 
 31 exit 0                        # 脚本也不会从此处退出.</pre>

 |

* * *

| ![Caution](./images/caution.gif) | 

使用_declare_内建命令可以限制变量的_作用域_.

| 

<pre class="PROGRAMLISTING">  1 foo ()
  2 {
  3 FOO="bar"
  4 }
  5 
  6 bar ()
  7 {
  8 foo
  9 echo $FOO
 10 }
 11 
 12 bar   # 打印bar. </pre>

 |

然而 . . .

| 

<pre class="PROGRAMLISTING">  1 foo (){
  2 declare FOO="bar"
  3 }
  4 
  5 bar ()
  6 {
  7 foo
  8 echo $FOO
  9 }
 10 
 11 bar  # 什么都不打印.
 12 
 13 
 14 # 感谢, Michael Iatrou, 指出这点. </pre>

 |

 |
# 34.2\. Bash, 版本3

2004年7月27日, Chet Ramey发布了Bash版本3\. 这一版本修复了相当多的bug, 并加入了一些新特性.

新增加的一些属性有:

*   一个新的, 更加通用的**{a..z}**[大括号扩展](special-chars.md#BRACEEXPREF)操作符.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 for i in {1..10}
      4 #  比下面的方式更简单, 更直接
      5 #+ for i in $(seq 10)
      6 do
      7   echo -n "$i "
      8 done
      9 
     10 echo
     11 
     12 # 1 2 3 4 5 6 7 8 9 10</pre>

     |

*   **${!array[@]}**操作符, 用于扩展给定[数组](arrays.md#ARRAYREF)所有元素索引.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 Array=(element-zero element-one element-two element-three)
      4 
      5 echo ${Array[0]}   # 元素0
      6                    # 数组的第一个元素. 
      7 
      8 echo ${!Array[@]}  # 0 1 2 3
      9                    # 数组的全部索引. 
     10 
     11 for i in ${!Array[@]}
     12 do
     13   echo ${Array[i]} # 元素0
     14                    # 元素1
     15                    # 元素2
     16                    # 元素3
     17                    #
     18                    # 数组的全部元素. 
     19 done</pre>

     |

*   **=~** [正则表达式](regexp.md#REGEXREF)匹配操作符, 在[双中括号](testconstructs.md#DBLBRACKETS)测试表达式中的应用. (Perl也有一个类似的操作符. )

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 variable="This is a fine mess."
      4 
      5 echo "$variable"
      6 
      7 if [[ "$variable" =~ "T*fin*es*" ]]
      8 # 在[[ 双中括号 ]]中使用=~操作符进行正则匹配. 
      9 then
     10   echo "match found"
     11       # match found
     12 fi</pre>

     |

    或者, 更有用的用法:

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 input=$1
      4 
      5 
      6 if [[ "$input" =~ "[1-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9]" ]]
      7 # NNN-NN-NNNN
      8 # 每个N都是一个数字. 
      9 # 但是, 第一个数字不能为0\. 
     10 then
     11   echo "Social Security number."
     12   # 处理SSN.
     13 else
     14   echo "Not a Social Security number!"
     15   # 或者, 要求正确的输入. 
     16 fi</pre>

     |

    还有一个使用**=~**操作符的例子, 请参考[例子 A-29](contributed-scripts.md#WHX)和[例子 17-14](x13628.md#MAILBOXGREP).

| ![Caution](./images/caution.gif) | 

Bash 3.0版本的更新, 将会导致一小部分为早期Bash版本编写的脚本不能工作. _对于一些重要的早期脚本来说, 需要进行测试, 以保证它们在新版本的Bash中也可以正常工作!_

如果发生确实不能正常工作的情况, 那么_高级Bash脚本编程指南_中的某些脚本就必须被修复(请参考[例子 A-20](contributed-scripts.md#OBJORIENTED)和[例子 9-4](internalvariables.md#TOUT)).

 |

## <a name="AEN16211">34.2.1\. Bash, 版本3.1</a>

Bash3.1版本的更新修复了一部分bug, 并且在其他方面也做了一些小的修改.

*   <span class="TOKEN">+=</span>操作符是新添加的, 可以放在之前只能有<span class="TOKEN">=</span>赋值操作符出现的地方.

    | 

    <pre class="PROGRAMLISTING">  1 a=1
      2 echo $a        # 1
      3 
      4 a+=5           # 在Bash的早期版本中就不行, 只能运行在Bash3.1或更新的版本上. 
      5 echo $a        # 15
      6 
      7 a+=Hello
      8 echo $a        # 15Hello</pre>

     |

    在这里, <span class="TOKEN">+=</span>是作为_字符串连接_操作符. 注意, 它在这种特定的上下文中所表现出来的行为, 与在[let](internal.md#LETREF)结构中所表现出来的行为是不同的.

    | 

    <pre class="PROGRAMLISTING">  1 a=1
      2 echo $a        # 1
      3 
      4 let a+=5       # 整数的算术运算, 而不是字符串连接. 
      5 echo $a        # 6
      6 
      7 let a+=Hello   # 不会给a"添加"任何东西.  
      8 echo $a        # 6</pre>

     |
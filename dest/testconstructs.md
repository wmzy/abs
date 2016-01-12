# 7.1\. 条件测试结构

*   **if/then**结构用来判断命令列表的[退出状态码](exit-status.md#EXITSTATUSREF)是否为<span class="RETURNVALUE">0</span>(因为在UNIX惯例, 0表示<span class="QUOTE">"成功"</span>), 如果成功的话, 那么就执行接下来的一个或多个命令.

*   有一个专有命令**[** ([左中括号](special-chars.md#LEFTBRACKET), 特殊字符). 这个命令与**test**命令等价, 并且出于效率上的考虑, 这是一个[内建](internal.md#BUILTINREF)命令. 这个命令把它的参数作为比较表达式或者作为文件测试, 并且根据比较的结果来返回一个退出状态码(0 表示真, 1表示假).

*   在版本2.02的Bash中, 引入了[[[ ... ]]](testconstructs.md#DBLBRACKETS)_扩展测试命令_, 因为这种表现形式可能对某些语言的程序员来说更容易熟悉一些. 注意**[[**是一个[关键字](internal.md#KEYWORDREF), 并不是一个命令.

    Bash把<kbd class="USERINPUT">[[ $a -lt $b ]]</kbd>看作一个单独的元素, 并且返回一个退出状态码.

    [(( ... ))](dblparens.md)和[let ...](internal.md#LETREF)结构也能够返回退出状态码, 当它们所测试的算术表达式的结果为非零的时候, 将会返回退出状态码<span class="RETURNVALUE">0</span>. 这些[算术扩展](arithexp.md#ARITHEXPREF)结构被用来做算术比较.

    | 

    <pre class="PROGRAMLISTING">  1 let "1<2" returns 0 (as "1<2" expands to "1")
      2 (( 0 && 1 )) returns 1 (as "0 && 1" expands to "0")</pre>

     |

*   **if**命令能够测试任何命令, 并不仅仅是中括号中的条件.

    | 

    <pre class="PROGRAMLISTING">  1 if cmp a b &> /dev/null  # 禁止输出.
      2 then echo "Files a and b are identical."
      3 else echo "Files a and b differ."
      4 fi
      5 
      6 # 非常有用的"if-grep"结构:
      7 # ------------------------
      8 if grep -q Bash file
      9 then echo "File contains at least one occurrence of Bash."
     10 fi
     11 
     12 word=Linux
     13 letter_sequence=inu
     14 if echo "$word" | grep -q "$letter_sequence"
     15 # "-q" 选项是用来禁止输出的.
     16 then
     17   echo "$letter_sequence found in $word"
     18 else
     19   echo "$letter_sequence not found in $word"
     20 fi
     21 
     22 
     23 if COMMAND_WHOSE_EXIT_STATUS_IS_0_UNLESS_ERROR_OCCURRED
     24 then echo "Command succeeded."
     25 else echo "Command failed."
     26 fi</pre>

     |

*   一个**if/then**结构可以包含嵌套的比较操作和条件判断操作.

    | 

    <pre class="PROGRAMLISTING">  1 if echo "Next *if* is part of the comparison for the first *if*."
      2 
      3   if [[ $comparison = "integer" ]]
      4     then (( a < b ))
      5   else
      6     [[ $a < $b ]]
      7   fi
      8 
      9 then
     10   echo '$a is less than $b'
     11 fi</pre>

     |

    _谦虚的Stephane Chazelas解释了<span class="QUOTE">"if-test"</span>的详细细节._

* * *

**例子 7-1\. 什么是真?**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 #  小技巧:
  4 #  如果你不能够确定一个特定的条件该如何进行判断,
  5 #+ 那么就使用if-test结构. 
  6 
  7 echo
  8 
  9 echo "Testing \"0\""
 10 if [ 0 ]      # zero
 11 then
 12   echo "0 is true."
 13 else
 14   echo "0 is false."
 15 fi            # 0 为真.
 16 
 17 echo
 18 
 19 echo "Testing \"1\""
 20 if [ 1 ]      # one
 21 then
 22   echo "1 is true."
 23 else
 24   echo "1 is false."
 25 fi            # 1 为真.
 26 
 27 echo
 28 
 29 echo "Testing \"-1\""
 30 if [ -1 ]     # 负1
 31 then
 32   echo "-1 is true."
 33 else
 34   echo "-1 is false."
 35 fi            # -1 为真.
 36 
 37 echo
 38 
 39 echo "Testing \"NULL\""
 40 if [ ]        # NULL (空状态)
 41 then
 42   echo "NULL is true."
 43 else
 44   echo "NULL is false."
 45 fi            # NULL 为假.
 46 
 47 echo
 48 
 49 echo "Testing \"xyz\""
 50 if [ xyz ]    # 字符串
 51 then
 52   echo "Random string is true."
 53 else
 54   echo "Random string is false."
 55 fi            # 随便的一串字符为真.
 56 
 57 echo
 58 
 59 echo "Testing \"\$xyz\""
 60 if [ $xyz ]   # 判断$xyz是否为null, 但是...
 61               # 这只是一个未初始化的变量.
 62 then
 63   echo "Uninitialized variable is true."
 64 else
 65   echo "Uninitialized variable is false."
 66 fi            # 未定义的初始化为假.
 67 
 68 echo
 69 
 70 echo "Testing \"-n \$xyz\""
 71 if [ -n "$xyz" ]            # 更加正规的条件检查.
 72 then
 73   echo "Uninitialized variable is true."
 74 else
 75   echo "Uninitialized variable is false."
 76 fi            # 未初始化的变量为假.
 77 
 78 echo
 79 
 80 
 81 xyz=          # 初始化了, 但是赋null值.
 82 
 83 echo "Testing \"-n \$xyz\""
 84 if [ -n "$xyz" ]
 85 then
 86   echo "Null variable is true."
 87 else
 88   echo "Null variable is false."
 89 fi            # null变量为假. 
 90 
 91 
 92 echo
 93 
 94 
 95 # 什么时候"false"为真?
 96 
 97 echo "Testing \"false\""
 98 if [ "false" ]              #  看起来"false"只不过是一个字符串而已. 
 99 then
100   echo "\"false\" is true." #+ 并且条件判断的结果为真.
101 else
102   echo "\"false\" is false."
103 fi            # "false" 为真.
104 
105 echo
106 
107 echo "Testing \"\$false\""  # 再来一个, 未初始化的变量.
108 if [ "$false" ]
109 then
110   echo "\"\$false\" is true."
111 else
112   echo "\"\$false\" is false."
113 fi            # "$false" 为假.
114               # 现在, 我们得到了预期的结果.
115 
116 #  如果我们测试以下为初始化的变量"$true"会发生什么呢?
117 
118 echo
119 
120 exit 0</pre>

 |

* * *

**练习.** 解释上边的[例子 7-1](testconstructs.md#EX10)的行为.

| 

<pre class="PROGRAMLISTING">  1 if [ condition-true ]
  2 then
  3    command 1
  4    command 2
  5    ...
  6 else
  7    # 可选的(如果不需要可以省去).
  8    # 如果原始的条件判断的结果为假, 那么在这里添加默认的代码块来执行.
  9    command 3
 10    command 4
 11    ...
 12 fi</pre>

 |

| ![Note](./images/note.gif) | 

如果_if_和_then_在条件判断的同一行上的话, 必须使用分号来结束_if_表达式. _if_和_then_都是[关键字](internal.md#KEYWORDREF). 关键字(或者命令)如果作为表达式的开头, 并且如果想在同一行上再写一个新的表达式的话, 那么必须使用分号来结束上一句表达式.

| 

<pre class="PROGRAMLISTING">  1 if [ -x "$filename" ]; then</pre>

 |

 |

**Else if和elif**

*   <span class="TOKEN">elif</span>
*   <kbd class="USERINPUT">elif</kbd>是<span class="TOKEN">else if</span>的缩写形式. 作用是在外部的判断结构中再嵌入一个内部的<span class="TOKEN">if/then</span>结构.

    | 

    <pre class="PROGRAMLISTING">  1 if [ condition1 ]
      2 then
      3    command1
      4    command2
      5    command3
      6 elif [ condition2 ]
      7 # 与else if一样
      8 then
      9    command4
     10    command5
     11 else
     12    default-command
     13 fi</pre>

     |

<kbd class="USERINPUT">if test condition-true</kbd>结构与<kbd class="USERINPUT">if [ condition-true ]</kbd>完全相同. 就像我们前面所看到的, 左中括号, **[** , 是调用**test**命令的标识. 而关闭条件判断用的的右中括号, **]**, 在if/test结构中并不是严格必需的, 但是在Bash的新版本中必须要求使用.

| ![Note](./images/note.gif) | 

**test**命令在Bash中是[内建](internal.md#BUILTINREF)命令, 用来测试文件类型, 或者用来比较字符串. 因此, 在Bash脚本中, **test**命令并_不会_调用外部的<tt class="FILENAME">/usr/bin/test</tt>中的test命令, 这是_sh-utils_工具包中的一部分. 同样的, <span class="TOKEN">[</span>也并不会调用<tt class="FILENAME">/usr/bin/[</tt>, 这是<tt class="FILENAME">/usr/bin/test</tt>的符号链接.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">type test</kbd>
<samp class="COMPUTEROUTPUT">test is a shell builtin</samp>
<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">type '['</kbd>
<samp class="COMPUTEROUTPUT">[ is a shell builtin</samp>
<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">type '[['</kbd>
<samp class="COMPUTEROUTPUT">[[ is a shell keyword</samp>
<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">type ']]'</kbd>
<samp class="COMPUTEROUTPUT">]] is a shell keyword</samp>
<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">type ']'</kbd>
<samp class="COMPUTEROUTPUT">bash: type: ]: not found</samp>
	      </pre>

 |

 |

* * *

**例子 7-2\. <span class="TOKEN">test</span>, <tt class="FILENAME">/usr/bin/test</tt>, <span class="TOKEN">[ ]</span>, 和<tt class="FILENAME">/usr/bin/[</tt>都是等价命令**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 echo
  4 
  5 if test -z "$1"
  6 then
  7   echo "No command-line arguments."
  8 else
  9   echo "First command-line argument is $1."
 10 fi
 11 
 12 echo
 13 
 14 if /usr/bin/test -z "$1"      # 与内建的"test"命令结果相同. 
 15 then
 16   echo "No command-line arguments."
 17 else
 18   echo "First command-line argument is $1."
 19 fi
 20 
 21 echo
 22 
 23 if [ -z "$1" ]                # 与上边的代码块作用相同.
 24 #   if [ -z "$1"                应该能够运行, 但是...
 25 #+  Bash报错, 提示缺少关闭条件测试的右中括号. 
 26 then
 27   echo "No command-line arguments."
 28 else
 29   echo "First command-line argument is $1."
 30 fi
 31 
 32 echo
 33 
 34 
 35 if /usr/bin/[ -z "$1" ]       # 再来一个, 与上边的代码块作用相同.
 36 # if /usr/bin/[ -z "$1"       # 能够工作, 但是还是给出一个错误消息.
 37 #                             # 注意:
 38 #                               在版本3.x的Bash中, 这个bug已经被修正了.
 39 then
 40   echo "No command-line arguments."
 41 else
 42   echo "First command-line argument is $1."
 43 fi
 44 
 45 echo
 46 
 47 exit 0</pre>

 |

* * *

<span class="TOKEN">[[ ]]</span>结构比<span class="TOKEN">[ ]结构更加通用</span>. 这是一个_扩展的test命令_, 是从_ksh88_中引进的.

| ![Note](./images/note.gif) | 

在<span class="TOKEN">[[</span>和<span class="TOKEN">]]</span>之间所有的字符都不会发生文件名扩展或者单词分割, 但是会发生参数扩展和命令替换.

 |

| 

<pre class="PROGRAMLISTING">  1 file=/etc/passwd
  2 
  3 if [[ -e $file ]]
  4 then
  5   echo "Password file exists."
  6 fi</pre>

 |

| ![Tip](./images/tip.gif) | 

使用**[[ ... ]]**条件判断结构, 而不是**[ ... ]**, 能够防止脚本中的许多逻辑错误. 比如, <span class="TOKEN">&&</span>, <span class="TOKEN">||</span>, <span class="TOKEN"><</span>, 和<span class="TOKEN">></span> 操作符能够正常存在于<span class="TOKEN">[[ ]]</span>条件判断结构中, 但是如果出现在<span class="TOKEN">[ ]</span>结构中的话, 会报错.

 |

| ![Note](./images/note.gif) | 

在**if**后面也不一定非得是**test**命令或者是用于条件判断的中括号结构( [ ] 或 [[ ]] ).

| 

<pre class="PROGRAMLISTING">  1 dir=/home/bozo
  2 
  3 if cd "$dir" 2>/dev/null; then   # "2>/dev/null" 会隐藏错误信息.
  4   echo "Now in $dir."
  5 else
  6   echo "Can't change to $dir."
  7 fi</pre>

 |

"if COMMAND"结构将会返回COMMAND的退出状态码.

与此相似, 在中括号中的条件判断也不一定非得要**if**不可, 也可以使用[列表结构](list-cons.md#LISTCONSREF).

| 

<pre class="PROGRAMLISTING">  1 var1=20
  2 var2=22
  3 [ "$var1" -ne "$var2" ] && echo "$var1 is not equal to $var2"
  4 
  5 home=/home/bozo
  6 [ -d "$home" ] || echo "$home directory does not exist."</pre>

 |

 |

[(( ))结构](dblparens.md)扩展并计算一个算术表达式的值. 如果表达式的结果为0, 那么返回的[退出状态码](exit-status.md#EXITSTATUSREF)为<span class="RETURNVALUE">1</span>, 或者是<span class="QUOTE">"假"</span>. 而一个非零值的表达式所返回的退出状态码将为<span class="RETURNVALUE">0</span>, 或者是<span class="QUOTE">"true"</span>. 这种情况和先前所讨论的**test**命令和<span class="TOKEN">[ ]</span>结构的行为正好相反.

* * *

**例子 7-3\. 算术测试需要使用<span class="TOKEN">(( ))</span>**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # 算术测试.
  3 
  4 # (( ... ))结构可以用来计算并测试算术表达式的结果. 
  5 # 退出状态将会与[ ... ]结构完全相反!
  6 
  7 (( 0 ))
  8 echo "Exit status of \"(( 0 ))\" is $?."         # 1
  9 
 10 (( 1 ))
 11 echo "Exit status of \"(( 1 ))\" is $?."         # 0
 12 
 13 (( 5 > 4 ))                                      # 真
 14 echo "Exit status of \"(( 5 > 4 ))\" is $?."     # 0
 15 
 16 (( 5 > 9 ))                                      # 假
 17 echo "Exit status of \"(( 5 > 9 ))\" is $?."     # 1
 18 
 19 (( 5 - 5 ))                                      # 0
 20 echo "Exit status of \"(( 5 - 5 ))\" is $?."     # 1
 21 
 22 (( 5 / 4 ))                                      # 除法也可以.
 23 echo "Exit status of \"(( 5 / 4 ))\" is $?."     # 0
 24 
 25 (( 1 / 2 ))                                      # 除法的计算结果 < 1.
 26 echo "Exit status of \"(( 1 / 2 ))\" is $?."     # 截取之后的结果为 0.
 27                                                  # 1
 28 
 29 (( 1 / 0 )) 2>/dev/null                          # 除数为0, 非法计算. 
 30 #           ^^^^^^^^^^^
 31 echo "Exit status of \"(( 1 / 0 ))\" is $?."     # 1
 32 
 33 # "2>/dev/null"起了什么作用?
 34 # 如果这句被删除会怎样?
 35 # 尝试删除这句, 然后在运行这个脚本. 
 36 
 37 exit 0</pre>

 |

* * *
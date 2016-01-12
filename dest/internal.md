# 11\. 内部命令与内建命令

_内建命令_指的就是包含在Bash工具包中的**命令**, 从字面意思上看就是_built in_. 这主要是考虑到执行效率的问题 -- 内建命令将比外部命令执行的更快, 一部分原因是因为外部命令通常都需要fork出一个单独的进程来执行 -- 另一部分原因是特定的内建命令需要直接访问shell的内核部分.

| 

当一个命令或者是shell本身需要初始化(或者_创建_)一个新的子进程来执行一个任务的时候, 这种行为被称为_fork_. 这个新产生的进程被叫做_子进程_, 并且这个进程是从_父进程_中_fork_出来的. 当_子进程_执行它的任务时, _父进程_也在运行.

注意: 当_父进程_获得了_子进程_的_进程ID_时, 父进程可以给子进程传递参数, 然而_反过来却不行_. [这将会产生不可思议的并且很难追踪的问题.](gotchas.md#PARCHILDPROBREF)

* * *

**例子 11-1\. 一个fork出多个自身实例的脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # spawn.sh
  3 
  4 
  5 PIDS=$(pidof sh $0)  # 这个脚本不同实例的进程ID. 
  6 P_array=( $PIDS )    # 把它们放到数组里(为什么?).
  7 echo $PIDS           # 显示父进程和子进程的进程ID. 
  8 let "instances = ${#P_array[*]} - 1"  # 计算元素个数, 至少为1.
  9                                       # 为什么减1?
 10 echo "$instances instance(s) of this script running."
 11 echo "[Hit Ctl-C to exit.]"; echo
 12 
 13 
 14 sleep 1              # 等一下.
 15 sh $0                # 再来一次, Sam.
 16 
 17 exit 0               # 没必要; 脚本永远不会运行到这里.
 18                      # 为什么运行不到这里?
 19 
 20 #  在使用Ctl-C退出之后,
 21 #+ 是否所有产生出来的进程都会被kill掉?
 22 #  如果是这样的话, 为什么?
 23 
 24 # 注意:
 25 # ----
 26 # 小心, 不要让这个脚本运行太长时间.
 27 # 它最后会吃掉你绝大多数的系统资源.
 28 
 29 #  是否有合适的脚本技术, 
 30 #+ 用于产生脚本自身的大量实例.
 31 #  为什么或为什么不?</pre>

 |

* * *

通常情况下, 脚本中的Bash_内建命令_在运行的时候是不会fork出一个子进程的. 但是脚本中的外部或者过滤命令通常_会_fork出一个子进程.

 |

一个内建命令通常会与一个系统命令同名, 但是Bash在内部重新实现了这些命令. 比如, Bash的**echo**命令与<tt class="FILENAME">/bin/echo</tt>就不尽相同, 虽然它们的行为在绝大多数情况下都是一样的.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 echo "This line uses the \"echo\" builtin."
  4 /bin/echo "This line uses the /bin/echo system command."</pre>

 |

_关键字_的意思就是_保留_字, 对于shell来说关键字具有特殊的含义, 并且用来构建shell语法结构. 比如, <span class="QUOTE">"<span class="TOKEN">for</span>"</span>, <span class="QUOTE">"<span class="TOKEN">while</span>"</span>, <span class="QUOTE">"do"</span>, 和 <span class="QUOTE">"<span class="TOKEN">!</span>"</span> 都是关键字. 与[内建命令](internal.md#BUILTINREF)相似的是, 关键字也是Bash的骨干部分, 但是与_内建命令_不同的是, 关键字本身并不是一个命令, 而是一个比较大的命令结构的一部分. [[1]](#FTN.AEN5922)

**I/O**

*   **echo**
*   打印(到 <tt class="FILENAME">stdout</tt>)一个表达式或者变量(参考[例子 4-1](varsubn.md#EX9)).

    | 

    <pre class="PROGRAMLISTING">  1 echo Hello
      2 echo $a</pre>

     |

    **echo**命令需要`-e`参数来打印转义字符. 参考[例子 5-2](escapingsection.md#ESCAPED).

    通常情况下, 每个**echo**命令都会在终端上新起一行, 但是`-n`参数会阻止新起一行.

    | ![Note](./images/note.gif) | 

    **echo**命令可以作为输入, 通过管道传递到一系列命令中去.

    | 

    <pre class="PROGRAMLISTING">  1 if echo "$VAR" | grep -q txt   # if [[ $VAR = *txt* ]]
      2 then
      3   echo "$VAR contains the substring sequence \"txt\""
      4 fi</pre>

     |

     |

    | ![Note](./images/note.gif) | 

    **echo**命令可以与[命令替换](commandsub.md#COMMANDSUBREF)组合起来, 这样可以用来设置一个变量.

    <kbd class="USERINPUT">a=`echo "HELLO" | tr A-Z a-z`</kbd>

    参考[例子 12-19](textproc.md#LOWERCASE), [例子 12-3](moreadv.md#EX57), [例子 12-42](mathc.md#MONTHLYPMT), 和 [例子 12-43](mathc.md#BASE).

     |

    小心**echo `command`**将会删除任何由<tt class="REPLACEABLE">_command_</tt>所产生的换行符.

    [$IFS](internalvariables.md#IFSREF) (内部域分隔符) 一搬都会将 <span class="TOKEN">\n</span> (换行符) 包含在它的[空白](special-chars.md#WHITESPACEREF)字符集合中. Bash因此会根据参数中的换行来分离<tt class="REPLACEABLE">_command_</tt>的输出, 然后**echo**. 最后**echo**将以空格代替换行来输出这些参数.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l /usr/share/apps/kjezz/sounds</kbd>
    <samp class="COMPUTEROUTPUT">-rw-r--r--    1 root     root         1407 Nov  7  2000 reflect.au
     -rw-r--r--    1 root     root          362 Nov  7  2000 seconds.au</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo `ls -l /usr/share/apps/kjezz/sounds`</kbd>
    <samp class="COMPUTEROUTPUT">total 40 -rw-r--r-- 1 root root 716 Nov 7 2000 reflect.au -rw-r--r-- 1 root root 362 Nov 7 2000 seconds.au</samp>
    	      </pre>

     |

    所以, 我们怎么做才能够在一个需要_echo_出来的字符串中嵌入换行呢?

    | 

    <pre class="PROGRAMLISTING">  1 # 嵌入一个换行?
      2 echo "Why doesn't this string \n split on two lines?"
      3 # 上边这句的\n将被打印出来. 达不到换行的目的.
      4 
      5 # 让我们再试试其他方法.
      6 
      7 echo
      8 	     
      9 echo $"A line of text containing
     10 a linefeed."
     11 # 打印出两个独立的行(嵌入换行成功了).
     12 # 但是, 是否必须有"$"作为变量前缀? 
     13 
     14 echo
     15 
     16 echo "This string splits
     17 on two lines."
     18 # 不, 并不是非有"$"不可.
     19 
     20 echo
     21 echo "---------------"
     22 echo
     23 
     24 echo -n $"Another line of text containing
     25 a linefeed."
     26 # 打印出两个独立的行(嵌入换行成功了).
     27 # 即使使用了-n选项, 也没能阻止换行. (译者注: -n 阻止了第2个换行)
     28 
     29 echo
     30 echo
     31 echo "---------------"
     32 echo
     33 echo
     34 
     35 # 然而, 下边的代码就没能像期望的那样运行.
     36 # 为什么失败? 提示: 因为分配到了变量.
     37 string1=$"Yet another line of text containing
     38 a linefeed (maybe)."
     39 
     40 echo $string1
     41 # Yet another line of text containing a linefeed (maybe).
     42 #                                    ^
     43 # 换行变成了空格.
     44 
     45 # 感谢, Steve Parker, 指出了这点.</pre>

     |

    | ![Note](./images/note.gif) | 

    这个命令是shell的一个内建命令, 与<tt class="FILENAME">/bin/echo</tt>不同, 虽然行为相似.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">type -a echo</kbd>
    <samp class="COMPUTEROUTPUT">echo is a shell builtin
     echo is /bin/echo</samp>
    	      </pre>

     |

     |

*   **printf**
*   **printf**命令, 格式化输出, 是**echo**命令的增强版. 它是C语言`printf()`库函数的一个有限的变形, 并且在语法上有些不同.

    **printf** <tt class="REPLACEABLE">_format-string_</tt>... <tt class="REPLACEABLE">_parameter_</tt>...

    这是Bash的内建版本, 与<tt class="FILENAME">/bin/printf</tt>或者<tt class="FILENAME">/usr/bin/printf</tt>命令不同. 如果想更深入的了解, 请察看**printf**(系统命令)的man页.

    | ![Caution](./images/caution.gif) | 

    老版本的Bash可能不支持**printf**.

     |

    * * *

    **例子 11-2\. 使用**printf**的例子**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # printf 示例
      3 
      4 PI=3.14159265358979
      5 DecimalConstant=31373
      6 Message1="Greetings,"
      7 Message2="Earthling."
      8 
      9 echo
     10 
     11 printf "Pi to 2 decimal places = %1.2f" $PI
     12 echo
     13 printf "Pi to 9 decimal places = %1.9f" $PI  # 都能够正确的结束.
     14 
     15 printf "\n"                                  # 打印一个换行,
     16                                              # 等价于 'echo' . . .
     17 
     18 printf "Constant = \t%d\n" $DecimalConstant  # 插入一个 tab (\t).
     19 
     20 printf "%s %s \n" $Message1 $Message2
     21 
     22 echo
     23 
     24 # ==========================================#
     25 # 模拟C函数, sprintf().
     26 # 使用一个格式化的字符串来加载一个变量.
     27 
     28 echo 
     29 
     30 Pi12=$(printf "%1.12f" $PI)
     31 echo "Pi to 12 decimal places = $Pi12"
     32 
     33 Msg=`printf "%s %s \n" $Message1 $Message2`
     34 echo $Msg; echo $Msg
     35 
     36 #  像我们所看到的一样, 现在'sprintf'可以
     37 #+ 作为一个可被加载的模块,
     38 #+ 但是不具可移植性.
     39 
     40 exit 0</pre>

     |

    * * *

    使用**printf**的最主要的应用就是格式化错误消息.

    | 

    <pre class="PROGRAMLISTING">  1 E_BADDIR=65
      2 
      3 var=nonexistent_directory
      4 
      5 error()
      6 {
      7   printf "$@" >&2
      8   # 格式化传递进来的位置参数, 并把它们送到stderr.
      9   echo
     10   exit $E_BADDIR
     11 }
     12 
     13 cd $var || error $"Can't cd to %s." "$var"
     14 
     15 # 感谢, S.C.</pre>

     |

*   **read**
*   从<tt class="FILENAME">stdin</tt>中<span class="QUOTE">"读取"</span>一个变量的值, 也就是, 和键盘进行交互, 来取得变量的值. 使用`-a`参数可以**read**数组变量(参考[例子 26-6](arrays.md#EX67)).

    * * *

    **例子 11-3\. 使用**read**来进行变量分配**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # "Reading" 变量.
      3 
      4 echo -n "Enter the value of variable 'var1': "
      5 # -n 选项, 阻止换行.
      6 
      7 read var1
      8 # 注意: 在var1前面没有'/pre>, 因为变量正在被设置. 
      9 
     10 echo "var1 = $var1"
     11 
     12 
     13 echo
     14 
     15 # 一个单独的'read'语句可以设置多个变量. 
     16 echo -n "Enter the values of variables 'var2' and 'var3' (separated by a space or tab): "
     17 read var2 var3
     18 echo "var2 = $var2      var3 = $var3"
     19 # 如果你只输入了一个值, 那么其他的变量还是处于未设置状态(null). 
     20 
     21 exit 0</pre>

     |

    * * *

    一个不带变量参数的**read**命令, 将会把来自键盘的输入存入到专用变量[$REPLY](internalvariables.md#REPLYREF)中.

    * * *

    **例子 11-4\. 当使用一个不带变量参数的**read**命令时, 将会发生什么?**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # read-novar.sh
      3 
      4 echo
      5 
      6 # -------------------------- #
      7 echo -n "Enter a value: "
      8 read var
      9 echo "\"var\" = "$var""
     10 # 到这里为止, 都与期望的一样.
     11 # -------------------------- #
     12 
     13 echo
     14 
     15 # ------------------------------------------------------------------- #
     16 echo -n "Enter another value: "
     17 read           #  没有变量分配给'read'命令, 所以...
     18                #+ 输入将分配给默认变量, $REPLY.
     19 var="$REPLY"
     20 echo "\"var\" = "$var""
     21 # 这部分代码和上边的代码等价.
     22 # ------------------------------------------------------------------- #
     23 
     24 echo
     25 
     26 exit 0</pre>

     |

    * * *

    一般的, 当输入给**read**时, 输入一个<kbd class="USERINPUT">\</kbd>, 然后回车, 将会阻止产生一个新行. `-r`选项将会让 <kbd class="USERINPUT">\</kbd> 转义.

    * * *

    **例子 11-5\. **read**命令的多行输入**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 echo
      4 
      5 echo "Enter a string terminated by a \\, then press <ENTER>."
      6 echo "Then, enter a second string, and again press <ENTER>."
      7 read var1     # 当 read $var1 时, "\" 将会阻止产生新行. 
      8               #     first line \
      9               #     second line
     10 
     11 echo "var1 = $var1"
     12 #     var1 = first line second line
     13 
     14 #  对于每个以 "\" 结尾的行, 
     15 #+ 你都会看到一个下一行的提示符, 让你继续向var1输入内容.
     16 
     17 echo; echo
     18 
     19 echo "Enter another string terminated by a \\ , then press <ENTER>."
     20 read -r var2  # -r 选项会让 "\" 转义.
     21               #     first line \
     22 
     23 echo "var2 = $var2"
     24 #     var2 = first line \
     25 
     26 # 第一个 <ENTER> 就会结束var2变量的录入.
     27 
     28 echo 
     29 
     30 exit 0</pre>

     |

    * * *

    **read**命令有些有趣的选项, 这些选项允许打印出一个提示符, 然后在不输入**ENTER**的情况下, 可以读入你所按下的字符的内容.

    | 

    <pre class="PROGRAMLISTING">  1 # 不敲回车, 读取一个按键字符.
      2 
      3 read -s -n1 -p "Hit a key " keypress
      4 echo; echo "Keypress was "\"$keypress\""."
      5 
      6 # -s 选项意味着不打印输入.
      7 # -n N 选项意味着只接受N个字符的输入.
      8 # -p 选项意味着在读取输入之前打印出后边的提示符.
      9 
     10 # 使用这些选项是有技巧的, 因为你需要用正确的顺序来使用它们.
     11 		</pre>

     |

    **read**命令的`-n`选项也可以检测_方向键_, 和一些控制按键.

    * * *

    **例子 11-6\. 检测方向键**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # arrow-detect.sh: 检测方向键, 和一些非打印字符的按键.
      3 # 感谢, Sandro Magi, 告诉了我们怎么做到这点.
      4 
      5 # --------------------------------------------
      6 # 按键所产生的字符编码.
      7 arrowup='\[A'
      8 arrowdown='\[B'
      9 arrowrt='\[C'
     10 arrowleft='\[D'
     11 insert='\[2'
     12 delete='\[3'
     13 # --------------------------------------------
     14 
     15 SUCCESS=0
     16 OTHER=65
     17 
     18 echo -n "Press a key...  "
     19 # 如果不是上边列表所列出的按键, 可能还是需要按回车. (译者注: 因为一般按键是一个字符)
     20 read -n3 key                      # 读取3个字符.
     21 
     22 echo -n "$key" | grep "$arrowup"  # 检查输入字符是否匹配.
     23 if [ "$?" -eq $SUCCESS ]
     24 then
     25   echo "Up-arrow key pressed."
     26   exit $SUCCESS
     27 fi
     28 
     29 echo -n "$key" | grep "$arrowdown"
     30 if [ "$?" -eq $SUCCESS ]
     31 then
     32   echo "Down-arrow key pressed."
     33   exit $SUCCESS
     34 fi
     35 
     36 echo -n "$key" | grep "$arrowrt"
     37 if [ "$?" -eq $SUCCESS ]
     38 then
     39   echo "Right-arrow key pressed."
     40   exit $SUCCESS
     41 fi
     42 
     43 echo -n "$key" | grep "$arrowleft"
     44 if [ "$?" -eq $SUCCESS ]
     45 then
     46   echo "Left-arrow key pressed."
     47   exit $SUCCESS
     48 fi
     49 
     50 echo -n "$key" | grep "$insert"
     51 if [ "$?" -eq $SUCCESS ]
     52 then
     53   echo "\"Insert\" key pressed."
     54   exit $SUCCESS
     55 fi
     56 
     57 echo -n "$key" | grep "$delete"
     58 if [ "$?" -eq $SUCCESS ]
     59 then
     60   echo "\"Delete\" key pressed."
     61   exit $SUCCESS
     62 fi
     63 
     64 
     65 echo " Some other key pressed."
     66 
     67 exit $OTHER
     68 
     69 #  练习:
     70 #  -----
     71 #  1) 使用'case'结构来代替'if'结构, 
     72 #+    这样可以简化这个脚本.
     73 #  2) 添加 "Home", "End", "PgUp", 和 "PgDn" 这些按键的检查.</pre>

     |

    * * *

    | ![Note](./images/note.gif) | 

    对于**read**命令来说, `-n`选项不会检测**ENTER**(新行)键.

     |

    **read**命令的`-t`选项允许时间输入(参考[例子 9-4](internalvariables.md#TOUT)).

    **read**命令也可以从[重定向](io-redirection.md#IOREDIRREF)的文件中<span class="QUOTE">"读取"</span>变量的值. 如果文件中的内容超过一行, 那么只有第一行被分配到这个变量中. 如果**read**命令的参数个数超过一个, 那么每个变量都会从文件中取得一个分配的字符串作为变量的值, 这些字符串都是以[定义的空白字符](special-chars.md#WHITESPACEREF)来进行分隔的. 小心使用!

    * * *

    **例子 11-7\. 通过[文件重定向](io-redirection.md#IOREDIRREF)来使用**read**命令**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 read var1 <data-file
      4 echo "var1 = $var1"
      5 # var1将会把"data-file"的第一行的全部内容都为它的值.
      6 
      7 read var2 var3 <data-file
      8 echo "var2 = $var2   var3 = $var3"
      9 # 注意, 这里的"read"命令将会产生一种不直观的行为. 
     10 # 1) 重新从文件的开头开始读入变量.
     11 # 2) 每个变量都设置成了以空白分割的字符串.
     12 #    而不是之前的以整行的内容作为变量的值.
     13 # 3) 而最后一个变量将会取得第一行剩余的全部部分(译者注: 不管是否以空白分割).
     14 # 4) 如果需要赋值的变量个数比文件中第一行以空白分割的字符串个数还多的话, 
     15 #    那么这些变量将会被赋空值.
     16 
     17 echo "------------------------------------------------"
     18 
     19 # 如何用循环来解决上边所提到的问题:
     20 while read line
     21 do
     22   echo "$line"
     23 done <data-file
     24 # 感谢, Heiner Steven 指出了这点.
     25 
     26 echo "------------------------------------------------"
     27 
     28 # 使用$IFS(内部域分隔变量)来将每行的输入单独的放到"read"中,
     29 # 前提是如果你不想使用默认空白的话.
     30 
     31 echo "List of all users:"
     32 OIFS=$IFS; IFS=:       # /etc/passwd 使用 ":" 作为域分隔符.
     33 while read name passwd uid gid fullname ignore
     34 do
     35   echo "$name ($fullname)"
     36 done </etc/passwd   # I/O 重定向.
     37 IFS=$OIFS              # 恢复原始的$IFS.
     38 # 这段代码也是Heiner Steven编写的.
     39 
     40 
     41 
     42 #  在循环内部设置$IFS变量, 
     43 #+ 而不用把原始的$IFS
     44 #+ 保存到临时变量中.
     45 #  感谢, Dim Segebart, 指出了这点.
     46 echo "------------------------------------------------"
     47 echo "List of all users:"
     48 
     49 while IFS=: read name passwd uid gid fullname ignore
     50 do
     51   echo "$name ($fullname)"
     52 done </etc/passwd   # I/O 重定向.
     53 
     54 echo
     55 echo "\$IFS still $IFS"
     56 
     57 exit 0</pre>

     |

    * * *

    | ![Note](./images/note.gif) | 

    [管道](special-chars.md#PIPEREF)输出到**read**命令中, 使用管道[echo](internal.md#ECHOREF)输出来设置变量[将会失败](gotchas.md#BADREAD0).

    然而, 使用管道[cat](basic.md#CATREF)输出_看起来_能够正常运行.

    | 

    <pre class="PROGRAMLISTING">  1 cat file1 file2 |
      2 while read line
      3 do
      4 echo $line
      5 done</pre>

     |

    但是, 就像Bj鰊 Eriksson所指出的:

    * * *

    **例子 11-8\. 管道输出到read中的问题**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/sh
      2 # readpipe.sh
      3 # 这个例子是由Bjon Eriksson所编写的.
      4 
      5 last="(null)"
      6 cat $0 |
      7 while read line
      8 do
      9     echo "{$line}"
     10     last=$line
     11 done
     12 printf "\nAll done, last:$last\n"
     13 
     14 exit 0  # 代码结束.
     15         # 下边是脚本的(部分)输出.
     16         # 'echo'出了多余的大括号.
     17 
     18 #############################################
     19 
     20 ./readpipe.sh 
     21 
     22 {#!/bin/sh}
     23 {last="(null)"}
     24 {cat $0 |}
     25 {while read line}
     26 {do}
     27 {echo "{$line}"}
     28 {last=$line}
     29 {done}
     30 {printf "nAll done, last:$lastn"}
     31 
     32 
     33 All done, last:(null)
     34 
     35 变量(last)被设置在子shell中, 并没有被设置在外边. </pre>

     |

    * * *

    在许多Linux发行版上, **gendiff**脚本通常都在<tt class="FILENAME">/usr/bin</tt>下, 将[find](moreadv.md#FINDREF)的输出通过管道传到_while read_结构中.

    | 

    <pre class="PROGRAMLISTING">  1 find $1 \( -name "*$2" -o -name ".*$2" \) -print |
      2 while read f; do
      3 . . .</pre>

     |

     |

**文件系统**

*   **cd**
*   **cd**, 修改目录命令, 在脚本中用的最多的时候就是当命令需要在指定目录下运行时, 需要用它来修改当前工作目录.

    | 

    <pre class="PROGRAMLISTING">  1 (cd /source/directory && tar cf - . ) | (cd /dest/directory && tar xpvf -)</pre>

     |

    [来自于[之前引用过](special-chars.md#COXEX)的一个例子, 是由Alan Cox编写的]

    `-P` (physical)选项对于**cd**命令的意义是忽略符号链接.

    **cd -** 将会把工作目录修改至[$OLDPWD](internalvariables.md#OLDPWD), 也就是之前的工作目录.

    | ![Caution](./images/caution.gif) | 

    当我们使用两个"/"来作为**cd**命令的参数时, 结果却出乎我们的意料. .

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cd //</kbd>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">pwd</kbd>
    <samp class="COMPUTEROUTPUT">//</samp>
    	      </pre>

     |

    输出应该是, 并且当然应该是 <samp class="COMPUTEROUTPUT">/</samp>. 无论在命令下还是在脚本中, 这都是个问题. |

*   **pwd**
*   打印出当前的工作目录. 这将给出用户(或脚本)的当前工作目录 (参考[例子 11-9](internal.md#EX37)). 使用这个命令的结果和从内建变量[$PWD](internalvariables.md#PWDREF)中所读取的值是相同的.

*   **pushd**, **popd**, **dirs**
*   这几个命令可以使得工作目录书签化, 就是可以按顺序向前或向后移动工作目录. 压栈的动作可以保存工作目录列表. 选项可以允许对目录栈做不同的操作.

    <kbd class="USERINPUT">pushd dir-name</kbd>把路径<tt class="REPLACEABLE">_dir-name_</tt>压入目录栈, 同时修改当前目录到<tt class="REPLACEABLE">_dir-name_</tt>.

    **popd**将目录栈最上边的目录弹出, 同时将当前目录修改为刚弹出来的那个目录.

    **dirs**列出所有目录栈的内容 (与[$DIRSTACK](internalvariables.md#DIRSTACKREF)变量相比较). 一个成功的**pushd**或者**popd**将会自动调用**dirs**命令.

    对于那些并没有对当前目录做硬编码, 并且需要对当前工作目录做灵活修改的脚本来说, 使用这些命令是再好不过了. 注意内建`$DIRSTACK`数组变量, 这个变量可以在脚本中进行访问, 并且它们保存了目录栈的内容.

    * * *

    **例子 11-9\. 修改当前工作目录**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 dir1=/usr/local
      4 dir2=/var/spool
      5 
      6 pushd $dir1
      7 # 将自动运行一个 'dirs' (把目录栈的内容列到stdout上).
      8 echo "Now in directory `pwd`." # 使用后置引用的 'pwd'.
      9 
     10 # 现在对'dir1'做一些操作.
     11 pushd $dir2
     12 echo "Now in directory `pwd`."
     13 
     14 # 现在对'dir2'做一些操作.
     15 echo "The top entry in the DIRSTACK array is $DIRSTACK."
     16 popd
     17 echo "Now back in directory `pwd`."
     18 
     19 # 现在, 对'dir1'做更多的操作.
     20 popd
     21 echo "Now back in original working directory `pwd`."
     22 
     23 exit 0
     24 
     25 # 如果你不使用 'popd' 将会发生什么 -- 然后退出这个脚本?
     26 # 你最后将落在哪个目录中? 为什么?</pre>

     |

    * * *

**变量**

*   **let**
*   **let**命令将执行变量的算术操作. 在许多情况下, 它被看作是复杂的[expr](moreadv.md#EXPRREF)命令的一个简化版本.

    * * *

    **例子 11-10\. 使用<span class="QUOTE">"let"</span>命令来做算术运算.**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 echo
      4 
      5 let a=11            # 与 'a=11' 相同
      6 let a=a+5           # 等价于 let "a = a + 5"
      7                     # (双引号和空格是这句话更具可读性.)
      8 echo "11 + 5 = $a"  # 16
      9 
     10 let "a <<= 3"       # 等价于 let "a = a << 3"
     11 echo "\"\$a\" (=16) left-shifted 3 places = $a"
     12                     # 128
     13 
     14 let "a /= 4"        # 等价于 let "a = a / 4"
     15 echo "128 / 4 = $a" # 32
     16 
     17 let "a -= 5"        # 等价于 let "a = a - 5"
     18 echo "32 - 5 = $a"  # 27
     19 
     20 let "a *=  10"      # 等价于 let "a = a * 10"
     21 echo "27 * 10 = $a" # 270
     22 
     23 let "a %= 8"        # 等价于 let "a = a % 8"
     24 echo "270 modulo 8 = $a  (270 / 8 = 33, remainder $a)"
     25                     # 6
     26 
     27 echo
     28 
     29 exit 0</pre>

     |

    * * *

*   **eval**
*   <kbd class="USERINPUT">eval arg1 [arg2] ... [argN]</kbd>

    将表达式中的参数, 或者表达式列表, 组合起来, 然后_评价_它们(译者注: 通常用来执行). 任何被包含在表达示中的变量都将被扩展. 结果将会被转化到命令中. 如果你想从命令行中或者是从脚本中产生代码, 那么这个命令就非常有用了.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">process=xterm</kbd>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">show_process="eval ps ax | grep $process"</kbd>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">$show_process</kbd>
    <samp class="COMPUTEROUTPUT">1867 tty1     S      0:02 xterm
     2779 tty1     S      0:00 xterm
     2886 pts/1    S      0:00 grep xterm</samp>
    	      </pre>

     |

    * * *

    **例子 11-11\. 展示**eval**命令的效果**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 y=`eval ls -l`  #  与 y=`ls -l` 很相似
      4 echo $y         #+ 但是换行符将会被删除, 因为"echo"的变量未被""引用.
      5 echo
      6 echo "$y"       #  用""将变量引用起来, 换行符就不会被空格替换了.
      7 
      8 echo; echo
      9 
     10 y=`eval df`     #  与 y=`df` 很相似
     11 echo $y         #+ 换行符又被空格替换了.
     12 
     13 #  当没有LF(换行符)出现时, 如果使用"awk"这样的工具来分析输出的结果, 
     14 #+ 应该能更容易一些.
     15 
     16 echo
     17 echo "==========================================================="
     18 echo
     19 
     20 # 现在,来看一下怎么用"eval"命令来"扩展"一个变量 . . .
     21 
     22 for i in 1 2 3 4 5; do
     23   eval value=$i
     24   #  value=$i 具有相同的效果, 在这里并不是非要使用"eval"不可. 
     25   #  一个缺乏特殊含义的变量将被评价为自身 -- 也就是说,
     26   #+ 这个变量除了能够被扩展成自身所表示的字符外, 不能被扩展成任何其他的含义.
     27   echo $value
     28 done
     29 
     30 echo
     31 echo "---"
     32 echo
     33 
     34 for i in ls df; do
     35   value=eval $i
     36   #  value=$i 在这里就与上边这句有了本质上的区别.
     37   #  "eval" 将会评价命令 "ls" 和 "df" . . .
     38   #  术语 "ls" 和 "df" 就具有特殊含义,
     39   #+ 因为它们被解释成命令,
     40   #+ 而不是字符串本身.
     41   echo $value
     42 done
     43 
     44 
     45 exit 0</pre>

     |

    * * *

    * * *

    **例子 11-12\. 强制登出(log-off)**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 结束ppp进程来强制登出log-off.
      3 
      4 # 本脚本应该以root用户的身份来运行.
      5 
      6 killppp="eval kill -9 `ps ax | awk '/ppp/ { print $1 }'`"
      7 #                     -------- ppp的进程ID -------  
      8 
      9 $killppp                  # 这个变量现在成为了一个命令.
     10 
     11 
     12 # 下边的命令必须以root用户的身份来运行.
     13 
     14 chmod 666 /dev/ttyS3      # 恢复读写权限,否则什么?
     15 #  因为在ppp上执行一个SIGKILL将会修改串口的权限,
     16 #+ 我们把权限恢复到之前的状态.
     17 
     18 rm /var/lock/LCK..ttyS3   # 删除串口琐文件.为什么?
     19 
     20 exit 0
     21 
     22 # 练习:
     23 # -----
     24 # 1) 编写一个脚本来验证是否root用户正在运行它.
     25 # 2) 做一个检查, 在杀掉某个进程之前, 
     26 #+   检查一下这个将要被杀掉的进程是否正在运行.
     27 # 3) 基于'fuser'来编写达到这个目的的另一个版本的脚本
     28 #+      if [ fuser -s /dev/modem ]; then . . .</pre>

     |

    * * *

    * * *

    **例子 11-13\. 另一个<span class="QUOTE">"rot13"</span>版本**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 使用'eval'的一个"rot13"的版本,(译者:rot13就是把26个字母,从中间分为2半,各13个).
      3 # 与脚本"rot13.sh" 比较一下.
      4 
      5 setvar_rot_13()              # "rot13" 函数
      6 {
      7   local varname=$1 varvalue=$2
      8   eval $varname='$(echo "$varvalue" | tr a-z n-za-m)'
      9 }
     10 
     11 
     12 setvar_rot_13 var "foobar"   # 将 "foobar" 传递到 rot13函数中.
     13 echo $var                    # sbbone
     14 
     15 setvar_rot_13 var "$var"     # 传递 "sbbone" 到rot13函数中.
     16                              # 又变成了原始值.
     17 echo $var                    # foobar
     18 
     19 # 这个例子是Segebart Chazelas编写的.
     20 # 作者又修改了一下.
     21 
     22 exit 0</pre>

     |

    * * *

    Rory Winston 捐献了下边的脚本, 关于使用**eval**命令.

    * * *

    **例子 11-14\. 在Perl脚本中使用**eval**命令来强制变量替换**

    | 

    <pre class="PROGRAMLISTING">  1 In the Perl script "test.pl":
      2         ...		
      3         my $WEBROOT = <WEBROOT_PATH>;
      4         ...
      5 
      6 To force variable substitution try:
      7         $export WEBROOT_PATH=/usr/local/webroot
      8         $sed 's/<WEBROOT_PATH>/$WEBROOT_PATH/' < test.pl > out
      9 
     10 But this just gives:
     11         my $WEBROOT = $WEBROOT_PATH;
     12 
     13 However:
     14         $export WEBROOT_PATH=/usr/local/webroot
     15         $eval sed 's%\<WEBROOT_PATH\>%$WEBROOT_PATH%' < test.pl > out
     16 #        ====
     17 
     18 That works fine, and gives the expected substitution:
     19         my $WEBROOT = /usr/local/webroot;
     20 
     21 
     22 ### Paulo Marcel Coelho Aragao校正了这个原始例子.</pre>

     |

    * * *

    | ![Caution](./images/caution.gif) | 

    **eval**命令是有风险的, 如果你有更合适的方法来实现功能的话, 尽量避免使用它. <kbd class="USERINPUT">eval $COMMANDS</kbd>将会执行命令<tt class="REPLACEABLE">_COMMANDS_</tt>的内容, 如果命令中包含有**rm -rf ***这样的东西, 可能就不是你想要的了. 当你运行一个包含有**eval**命令的陌生人所编写的代码片段的时候, 这是一件很危险的事情.

     |

*   **set**
*   **set**命令用来修改内部脚本变量的值. 它的一个作用就是触发[选项标志位](options.md#OPTIONSREF)来帮助决定脚本的行为. 另一个作用是以一个命令的结果(<kbd class="USERINPUT">set `command`</kbd>)来重新设置脚本的[位置参数](internalvariables.md#POSPARAMREF). 脚本将会从命令的输出中重新分析出位置参数.

    * * *

    **例子 11-15\. 使用**set**命令来改变脚本的位置参数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # script "set-test"
      4 
      5 # 使用3个命令行参数来调用这个脚本,
      6 # 比如, "./set-test one two three".
      7 
      8 echo
      9 echo "Positional parameters before  set \`uname -a\` :"
     10 echo "Command-line argument #1 = $1"
     11 echo "Command-line argument #2 = $2"
     12 echo "Command-line argument #3 = $3"
     13 
     14 
     15 set `uname -a` # 把`uname -a`的命令输出设置
     16                # 为新的位置参数.
     17 
     18 echo $_        # unknown(译者注: 这要看你的uname -a输出了,这句打印出的就是输出的最后一个单词.)
     19 # 在脚本中设置标志.
     20 
     21 echo "Positional parameters after  set \`uname -a\` :"
     22 # $1, $2, $3, 等等. 这些位置参数将被重新初始化为`uname -a`的结果
     23 echo "Field #1 of 'uname -a' = $1"
     24 echo "Field #2 of 'uname -a' = $2"
     25 echo "Field #3 of 'uname -a' = $3"
     26 echo ---
     27 echo $_        # ---
     28 echo
     29 
     30 exit 0</pre>

     |

    * * *

    关于位置参数更多有趣的事情.

    * * *

    **例子 11-16\. 反转位置参数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # revposparams.sh: 反转位置参数.
      3 # 本脚本由Dan Jacobson所编写, 本书作者做了一些格式上的修正.
      4 
      5 
      6 set a\ b c d\ e;
      7 #     ^      ^     转义的空格
      8 #       ^ ^        未转义的空格
      9 OIFS=$IFS; IFS=:;
     10 #              ^   保存旧的IFS, 然后设置新的IFS.
     11 
     12 echo
     13 
     14 until [ $# -eq 0 ]
     15 do          #      步进位置参数.
     16   echo "### k0 = "$k""     # 步进之前
     17   k=$1:$k;  #      将每个位置参数都附加在循环变量的后边.
     18 #     ^
     19   echo "### k = "$k""      # 步进之后
     20   echo
     21   shift;
     22 done
     23 
     24 set $k  #  设置一个新的位置参数.
     25 echo -
     26 echo $# #  察看位置参数的个数.
     27 echo -
     28 echo
     29 
     30 for i   #  省略 "in list" 结构, 
     31         #+ 为位置参数设置变量 -- i --.
     32 do
     33   echo $i  # 显示新的位置参数.
     34 done
     35 
     36 IFS=$OIFS  # 恢复 IFS.
     37 
     38 #  问题:
     39 #  是否有必要设置新的IFS, 内部域分隔符,
     40 #+ 才能够让这个脚本正常运行? (译者注: 当然有必要.)
     41 #  如果你没设置新的IFS, 会发生什么? 试一下.
     42 #  并且, 在第17行, 为什么新的IFS要使用 -- 一个冒号 -- ,
     43 #+ 来将位置参数附加到循环变量中?
     44 #  这么做的目的是什么?
     45 
     46 exit 0
     47 
     48 $ ./revposparams.sh
     49 
     50 ### k0 = 
     51 ### k = a b
     52 
     53 ### k0 = a b
     54 ### k = c a b
     55 
     56 ### k0 = c a b
     57 ### k = d e c a b
     58 
     59 -
     60 3
     61 -
     62 
     63 d e
     64 c
     65 a b</pre>

     |

    * * *

    不使用任何选项或参数来调用**set**命令的话, 将会列出所有的[环境变量](othertypesv.md#ENVREF)和其他所有的已经初始化过的变量.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">set</kbd>
    <samp class="COMPUTEROUTPUT">AUTHORCOPY=/home/bozo/posts
     BASH=/bin/bash
     BASH_VERSION=/samp>2.05.8(1)-release'
     ...
     XAUTHORITY=/home/bozo/.Xauthority
     _=/etc/bashrc
     variable22=abc
     variable23=xzy</samp>
    	      </pre>

     |

    如果使用参数`--`来调用**set**命令的话, 将会明确的分配位置参数. 如果`--`选项后边没有跟变量名的话, 那么结果就使得所有位置参数都被_unsets_了.

    * * *

    **例子 11-17\. 重新分配位置参数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 variable="one two three four five"
      4 
      5 set -- $variable
      6 # 将位置参数的内容设为变量"$variable"的内容.
      7 
      8 first_param=$1
      9 second_param=$2
     10 shift; shift        # 将最前面的两个位置参数移除.
     11 remaining_params="$*"
     12 
     13 echo
     14 echo "first parameter = $first_param"             # one
     15 echo "second parameter = $second_param"           # two
     16 echo "remaining parameters = $remaining_params"   # three four five
     17 
     18 echo; echo
     19 
     20 # 再来一次.
     21 set -- $variable
     22 first_param=$1
     23 second_param=$2
     24 echo "first parameter = $first_param"             # one
     25 echo "second parameter = $second_param"           # two
     26 
     27 # ======================================================
     28 
     29 set --
     30 # 如果没指定变量,那么将会unset所有的位置参数.
     31 
     32 first_param=$1
     33 second_param=$2
     34 echo "first parameter = $first_param"             # (null value)
     35 echo "second parameter = $second_param"           # (null value)
     36 
     37 exit 0</pre>

     |

    * * *

    参考[例子 10-2](loops1.md#EX22A)和[例子 12-51](extmisc.md#EX33A).

*   **unset**
*   **unset**命令用来删除一个shell变量, 这个命令的效果就是把这个变量设为_null_. 注意: 这个命令对位置参数无效.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">unset PATH</kbd>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $PATH</kbd>
     <samp class="COMPUTEROUTPUT"></samp> 
    <samp class="PROMPT">bash$</samp> </pre>

     |

    * * *

    **例子 11-18\. <span class="QUOTE">"Unsett"</span>一个变量**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # unset.sh: Unset 一个变量.
      3 
      4 variable=hello                       # 初始化.
      5 echo "variable = $variable"
      6 
      7 unset variable                       # Unset.
      8                                      # 与 variable= 效果相同.
      9 echo "(unset) variable = $variable"  # $variable 设为 null.
     10 
     11 exit 0</pre>

     |

    * * *

*   **export**
*   **export**命令将会使得被export的变量在所运行脚本(或shell)的所有子进程中都可用. _不幸的是, 没有办法_将_变量_export_到父进程中, 这里所指的父进程就是调用这个脚本的脚本或shell._ 关于**export**命令的一个重要的用法就是使用在[启动文件](files.md#FILESREF1)中, 启动文件用来初始化和设置[环境变量](othertypesv.md#ENVREF), 这样, 用户进程才能够访问环境变量.

    * * *

    **例子 11-19\. 使用**export**命令来将一个变量传递到一个内嵌[awk](awk.md#AWKREF)的脚本中**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 #  这是"求列的和"脚本的另外一个版本(col-totaler.sh)
      4 #+ 那个脚本可以把目标文件中的指定的列上的所有数字全部累加起来,求和.
      5 #  这个版本将把一个变量通过export的形式传递到'awk'中 . . .
      6 #+ 并且把awk脚本放到一个变量中.
      7 
      8 
      9 ARGS=2
     10 E_WRONGARGS=65
     11 
     12 if [ $# -ne "$ARGS" ] # 检查命令行参数的个数.
     13 then
     14    echo "Usage: `basename $0` filename column-number"
     15    exit $E_WRONGARGS
     16 fi
     17 
     18 filename=$1
     19 column_number=$2
     20 
     21 #===== 上边的这部分,与原始脚本完全一样 =====#
     22 
     23 export column_number
     24 # 将列号export出来, 这样后边的进程就可用了.
     25 
     26 
     27 # -----------------------------------------------
     28 awkscript='{ total += $ENVIRON["column_number"] }
     29 END { print total }'
     30 # 是的, 变量可以保存awk脚本.
     31 # -----------------------------------------------
     32 
     33 # 现在, 运行这个awk脚本.
     34 awk "$awkscript" "$filename"
     35 
     36 # 感谢, Stephane Chazelas.
     37 
     38 exit 0</pre>

     |

    * * *

    | ![Tip](./images/tip.gif) | 

    可以在一个操作中同时进行赋值和export变量, 比如: **export var1=xxx**.

    然而, 就像Greg Keraunen所指出的, 在某些情况下, 如果使用上边这种形式的话, 将与先设置变量, 然后export变量效果不同.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">export var=(a b); echo ${var[0]}</kbd>
    <samp class="COMPUTEROUTPUT">(a b)</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">var=(a b); export var; echo ${var[0]}</kbd>
    <samp class="COMPUTEROUTPUT">a</samp>
    	      </pre>

     |

     |

*   **declare**, **typeset**
*   [declare](declareref.md)和[typeset](declareref.md)命令被用来指定或限制变量的属性.

*   **readonly**
*   与[declare -r](declareref.md)作用相同, 设置变量的只读属性, 或者可以认为这个变量就是一个常量. 设置了这种属性之后, 如果你还要修改它, 那么将会得到一个错误信息. 这种情况与_C_语言中的**const**常量类型是相同的.

*   **getopts**
*   可以说这个命令是分析传递到脚本中命令行参数的最强力的工具. 这个命令与外部命令[getopt](extmisc.md#GETOPTY), 还有_C_语言中的库函数**getopt**的作用是相同的. 它允许传递和连接多个选项 [[2]](#FTN.AEN6448) 到脚本中, 并且能够分配多个参数到脚本中(比如: <kbd class="USERINPUT">scriptname -abc -e /usr/local</kbd>).

    **getopts**结构使用两个隐含变量. `$OPTIND`是参数指针(_选项索引_) 和`$OPTARG`(_选项参数_)(可选的)可以在选项后边附加一个参数. 在声明标签中, 选项名后边的冒号用来提示这个选项名已经分配了一个参数.

    **getopts**结构通常都组成一组放在一个[while循环](loops1.md#WHILELOOPREF)中, 循环过程中每次处理一个选项和参数, 然后增加隐含变量`$OPTIND`的值, 再进行下一次的处理.

    | ![Note](./images/note.gif) | 

    1.  通过命令行传递到脚本中的参数前边必须加上一个减号(`-`). `-`是一个前缀, 这样**getopts**命令把这个参数看作为一个_选项_. 事实上, **getopts**不会处理不带`-`前缀的参数, 如果第一个参数就没有`-`, 那么将会结束选项的处理.

    2.  **getopts**的**while**循环模板与标准的**while**循环模板有些不同, 没有标准循环中的中括号[]判断条件.

    3.  **getopts**结构将会取代外部命令[getopt](extmisc.md#GETOPTY).

     |

    | 

    <pre class="PROGRAMLISTING">  1 while getopts ":abcde:fg" Option
      2 # 开始的声明.
      3 # a, b, c, d, e, f, 和 g 被认为是选项(标志).
      4 # 'e' 选项后边的 : 提示这个选项需要带一个参数.
      5 # 译者注:	解释一下 'a' 前边的那个 : 的作用.
      6 #			如果选项'e'不带参数进行调用的话, 会产生一个错误信息.
      7 #			这个开头的 : 就是用来屏蔽掉这个错误信息的, 
      8 #			因为我们一般都会有默认处理, 所以并不需要这个错误信息.
      9 do
     10   case $Option in
     11     a ) # 对选项'a'作些操作.
     12     b ) # 对选项'b'作些操作.
     13     ...                                           
     14     e)  # 对选项'e'作些操作, 同时处理一下$OPTARG,
     15         # 这个变量里边将保存传递给选项"e"的参数.
     16     ...                                           
     17     g ) # 对选项'g'作些操作.
     18   esac
     19 done
     20 shift $(($OPTIND - 1))
     21 # 将参数指针向下移动.
     22 
     23 # 所有这些远没有它看起来的那么复杂.<嘿嘿>.
     24 	      </pre>

     |

    * * *

    **例子 11-20\. 使用**getopts**命令来来读取传递给脚本的选项/参数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 练习 getopts 和 OPTIND
      3 # 在Bill Gradwohl的建议下, 这个脚本于 10/09/03 被修改.
      4 
      5 
      6 # 在这里我们将学习如何使用 'getopts' 来处理脚本的命令行参数.
      7 # 参数被作为"选项"(标志)来解析, 并且对选项分配参数. 
      8 
      9 # 试一下, 使用如下方法来调用这个脚本
     10 # 'scriptname -mn'
     11 # 'scriptname -oq qOption' (qOption 可以是任意的哪怕有些诡异字符的字符串.)
     12 # 'scriptname -qXXX -r'
     13 #
     14 # 'scriptname -qr'    - 意外的结果, "r" 将被看成是选项 "q" 的参数.
     15 # 'scriptname -q -r'  - 意外的结果, 同上.
     16 # 'scriptname -mnop -mnop'  - 意外的结果
     17 # (OPTIND在选项刚传递进来的地方是不可靠的). 
     18 # (译者注: 也就是说OPTIND只是一个参数指针, 指向下一个参数的位置.
     19 #  比如:	-mnop 在mno处理的位置OPTION都为1, 而到p的处理就变成2, 
     20 #			-m -n -o 在m的时候OPTION为2, 而n为3, o为4,
     21 #			也就是说它总指向下一个位置). 
     22 #
     23 #  如果选项需要一个参数的话("flag:"), 那么它将获取
     24 #+ 命令行上紧挨在它后边的任何字符.
     25 
     26 NO_ARGS=0 
     27 E_OPTERROR=65
     28 
     29 if [ $# -eq "$NO_ARGS" ]  # 不带命令行参数就调用脚本?
     30 then
     31   echo "Usage: `basename $0` options (-mnopqrs)"
     32   exit $E_OPTERROR        # 如果没有参数传递进来, 那么就退出脚本, 并且解释此脚本的用法.
     33 fi  
     34 # 用法: scriptname -options
     35 # 注意: 必须使用破折号 (-) 
     36 
     37 
     38 while getopts ":mnopq:rs" Option
     39 do
     40   case $Option in
     41     m     ) echo "Scenario #1: option -m-   [OPTIND=${OPTIND}]";;
     42     n | o ) echo "Scenario #2: option -$Option-   [OPTIND=${OPTIND}]";;
     43     p     ) echo "Scenario #3: option -p-   [OPTIND=${OPTIND}]";;
     44     q     ) echo "Scenario #4: option -q-\
     45  with argument \"$OPTARG\"   [OPTIND=${OPTIND}]";;
     46     #  注意, 选项'q'必须分配一个参数, 
     47     #+ 否则, 默认将失败.
     48     r | s ) echo "Scenario #5: option -$Option-";;
     49     *     ) echo "Unimplemented option chosen.";;   # 默认情况的处理
     50   esac
     51 done
     52 
     53 shift $(($OPTIND - 1))
     54 #  (译者注: shift命令是可以带参数的, 参数就是移动的个数)
     55 #  将参数指针减1, 这样它将指向下一个参数.
     56 #  $1 现在引用的是命令行上的第一个非选项参数,
     57 #+ 如果有一个这样的参数存在的话.
     58 
     59 exit 0
     60 
     61 #   就像 Bill Gradwohl 所描述的,
     62 #  "getopts机制允许指定一个参数, 
     63 #+ 但是scriptname -mnop -mnop就是一种比较特殊的情况, 
     64 #+ 因为在使用OPTIND的时候, 没有可靠的方法来区分到底传递进来了什么东西."</pre>

     |

    * * *

**脚本行为**

*   **source**, <span class="TOKEN">.</span> ([点](special-chars.md#DOTREF) 命令)
*   当在命令行中调用的时候, 这个命令将会执行一个脚本. 当在脚本中调用的时候, <kbd class="USERINPUT">source file-name</kbd> 将会加载<tt class="FILENAME">file-name</tt>文件. sourc一个文件(或点命令)将会在脚本中_引入_代码, 并将这些代码附加到脚本中(与_C_语言中的<kbd class="USERINPUT">#include</kbd>指令效果相同). 最终的结果就像是在使用<span class="QUOTE">"source"</span>的行上插入了相应文件的内容. 在多个脚本需要引用相同的数据, 或者需要使用函数库的情况下, 这个命令非常有用.

    * * *

    **例子 11-21\. <span class="QUOTE">"includ"</span>一个数据文件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 . data-file    # 加载一个数据文件.
      4 # 与"source data-file"效果相同, 但是更具可移植性.
      5 
      6 #  文件"data-file"必须存在于当前工作目录, 
      7 #+ 因为这个文件是使用'basename'来引用的. 
      8 
      9 # 现在, 引用这个文件中的一些数据. 
     10 
     11 echo "variable1 (from data-file) = $variable1"
     12 echo "variable3 (from data-file) = $variable3"
     13 
     14 let "sum = $variable2 + $variable4"
     15 echo "Sum of variable2 + variable4 (from data-file) = $sum"
     16 echo "message1 (from data-file) is \"$message1\""
     17 # 注意:                             将双引号转义
     18 
     19 print_message This is the message-print function in the data-file.
     20 
     21 
     22 exit 0</pre>

     |

    上边[例子 11-21](internal.md#EX38)所使用的数据文件<tt class="FILENAME">data-file</tt>, 必须和上边的脚本放在同一目录下.

    | 

    <pre class="PROGRAMLISTING">  1 # 这是需要被脚本加载的数据文件.
      2 # 这种文件可以包含变量, 函数, 等等.
      3 # 在脚本中可以通过'source'或者'.'命令来加载.
      4                                              
      5 # 让我们初始化一些变量.
      6 
      7 variable1=22
      8 variable2=474
      9 variable3=5
     10 variable4=97
     11 
     12 message1="Hello, how are you?"
     13 message2="Enough for now. Goodbye."
     14 
     15 print_message ()
     16 {
     17 # echo出所有传递进来的消息.
     18 
     19   if [ -z "$1" ]
     20   then
     21     return 1
     22     # 如果没有参数的话, 会出错.
     23   fi
     24 
     25   echo
     26 
     27   until [ -z "$1" ]
     28   do
     29     # 循环处理传递到函数中的参数.
     30     echo -n "$1"
     31     # 每次 echo 一个参数, -n禁止换行.
     32     echo -n " "
     33     # 在参数之间插入空格. 
     34     shift
     35     # 切换到下一个.
     36   done  
     37 
     38   echo
     39 
     40   return 0
     41 }  </pre>

     |

    * * *

    如果_source_进来的文件本身就一个可执行脚本的话, 那么它将运行起来, 然后将控制权交还给调用它的脚本. 一个_source_进来的可执行脚本可以使用[return](complexfunct.md#RETURNREF)命令来达到这个目的.

    (可选的)也可以向_source_文件中传递参数, 这些参数将被看作[位置参数](othertypesv.md#POSPARAMREF1).

    | 

    <pre class="PROGRAMLISTING">  1 source $filename $arg1 arg2</pre>

     |

    你甚至可以在脚本文件中_source_它自身, 虽然这么做看不出有什么实际的应用价值.

    * * *

    **例子 11-22\. 一个(没什么用的)source自身的脚本**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # self-source.sh: 一个脚本"递归"的source自身. 
      3 # 来自于"Stupid Script Tricks," 卷 II.
      4 
      5 MAXPASSCNT=100    # 最大的可执行次数. 
      6 
      7 echo -n  "$pass_count  "
      8 #  在第一次运行的时候,这句只不过echo出2个空格,
      9 #+ 因为$pass_count还没被初始化.
     10 
     11 let "pass_count += 1"
     12 #  假定这个未初始化的变量$pass_count
     13 #+ 可以在第一次运行的时候+1.
     14 #  这句可以正常工作在Bash和pdksh下, 但是
     15 #+ 它依赖于不可移植(并且可能危险)的行为.
     16 #  更好的方法是在使用$pass_count之前,先把这个变量初始化为0.
     17 
     18 while [ "$pass_count" -le $MAXPASSCNT ]
     19 do
     20   . $0   # 脚本"source"自身, 而不是调用自己.
     21          # ./$0 (应该能够正常递归)不能在这正常运行. 为什么?
     22 done  
     23 
     24 #  这里发生的动作并不是真正的递归,
     25 #+ 因为脚本成功的展开了自己,换句话说,
     26 #+ 在每次循环的过程中
     27 #+ 在每个'source'行(第20行)上
     28 #  都产生了新的代码.
     29 #
     30 #  当然, 脚本会把每个新'source'进来文件的"#!"行
     31 #+ 都解释成注释, 而不会把它看成是一个新的脚本.
     32 
     33 echo
     34 
     35 exit 0   # 最终的效果就是从1数到100.
     36          # 真是让人印象深刻.
     37 
     38 # 练习:
     39 # -----
     40 # 使用这个小技巧编写一些真正能够干些事情的脚本. </pre>

     |

    * * *

*   **exit**
*   无条件的停止一个脚本的运行. **exit**命令可以随意的取得一个整数参数, 然后把这个参数作为这个脚本的[退出状态码](exit-status.md#EXITSTATUSREF). 在退出一个简单脚本的时候, 使用<kbd class="USERINPUT">exit 0</kbd>的话, 是种好习惯, 因为这表明成功运行.

    | ![Note](./images/note.gif) | 

    如果不带参数调用**exit**命令退出的话, 那么退出状态码将会将会是脚本中最后一个命令的退出状态码. 等价于**exit $?**.

     |

*   **exec**
*   这个shell内建命令将使用一个特定的命令来取代当前进程. 一般的当shell遇到一个命令, 它会[forks off](internal.md#FORKREF)一个子进程来真正的运行命令. 使用**exec**内建命令, shell就不会fork了, 并且命令的执行将会替换掉当前shell. 因此, 在脚本中使用时, 一旦**exec**所执行的命令执行完毕, 那么它就会强制退出脚本. [[3]](#FTN.AEN6568)

    * * *

    **例子 11-23\. **exec**命令的效果**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 exec echo "Exiting \"$0\"."   # 脚本应该在这里退出.
      4 
      5 # ----------------------------------
      6 # The following lines never execute.
      7 
      8 echo "This echo will never echo."
      9 
     10 exit 99                       #  脚本是不会在这里退出的.
     11                               #  脚本退出后会使用'echo $?'
     12                               #+ 来检查一下退出码.
     13                               #  一定 *不是* 99.</pre>

     |

    * * *

    * * *

    **例子 11-24\. 一个**exec**自身的脚本**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # self-exec.sh
      3 
      4 echo
      5 
      6 echo "This line appears ONCE in the script, yet it keeps echoing."
      7 echo "The PID of this instance of the script is still $."
      8 #     上边这行展示了并没有fork出子shell.
      9 
     10 echo "==================== Hit Ctl-C to exit ===================="
     11 
     12 sleep 1
     13 
     14 exec $0   #  产生了本脚本的另一个实例,
     15           #+ 但是这个新产生的实例却代替了原来的实例.
     16 
     17 echo "This line will never echo!"  # 为什么不是这样?
     18 
     19 exit 0</pre>

     |

    * * *

    **exec**命令还能够用来[重新分配文件描述符](x13380.md#USINGEXECREF). 比如, <kbd class="USERINPUT">exec <zzz-file</kbd>将会用<tt class="FILENAME">zzz-file</tt>来代替<tt class="FILENAME">stdin</tt>.

    | ![Note](./images/note.gif) | 

    [find](moreadv.md#FINDREF)命令的`-exec`选项与shell内建的**exec**命令是<tt class="REPLACEABLE">_不同_</tt>的.

     |

*   **shopt**
*   这个命令允许shell在空闲时修改shell选项 (见[例子 24-1](aliases.md#AL)和[例子 24-2](aliases.md#UNAL)). 它经常出现在[启动文件](files.md#FILESREF1)中, 但在一般脚本中也常出现. 需要在[版本2](bashver2.md#BASH2REF)之后的Bash中才支持.

    | 

    <pre class="PROGRAMLISTING">  1 shopt -s cdspell
      2 # 使用'cd'命令时,允许产生少量的拼写错误.
      3 cd /hpme  # 噢! 应该是'/home'.
      4 pwd       # /home
      5           # 拼写错误被纠正了.</pre>

     |

*   **caller**
*   将**caller**命令放到[函数](functions.md#FUNCTIONREF)中, 将会在<tt class="FILENAME">stdout</tt>上打印出函数的_调用者_信息.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 function1 ()
      4 {
      5   # 在 function1 () 内部.
      6   caller 0   # 显示调用者信息.
      7 }
      8 
      9 function1    # 脚本的第9行.
     10 
     11 # 9 main test.sh
     12 # ^                 函数调用者所在的行号.
     13 #   ^^^^            从脚本的"main"部分开始调用的.
     14 #        ^^^^^^^    调用脚本的名字.
     15 
     16 caller 0     # 没效果, 因为这个命令不在函数中. </pre>

     |

    **caller**命令也可以在一个被[source](internal.md#SOURCEREF)的脚本中返回_调用者_信息. 当然这个调用者就是[source](internal.md#SOURCEREF)这个脚本的脚本. 就像函数一样, 这是一个<span class="QUOTE">"子例程调用"</span>.

    你会发现这个命令在调试的时候特别有用.

**命令**

*   **true**
*   这是一个返回(<span class="RETURNVALUE">零</span>)成功[退出状态码](exit-status.md#EXITSTATUSREF)的命令, 但是除此之外不做任何事.

    | 

    <pre class="PROGRAMLISTING">  1 # 死循环
      2 while true   # 这里的true可以用":"来替换
      3 do
      4    operation-1
      5    operation-2
      6    ...
      7    operation-n
      8    # 需要一种手段从循环中跳出来, 或者是让这个脚本挂起.
      9 done</pre>

     |

*   **false**
*   这是一个返回失败[退出状态码](exit-status.md#EXITSTATUSREF)的命令, 但是除此之外不做任何事.

    | 

    <pre class="PROGRAMLISTING">  1 # 测试 "false" 
      2 if false
      3 then
      4   echo "false evaluates \"true\""
      5 else
      6   echo "false evaluates \"false\""
      7 fi
      8 # 失败会显示 "false"
      9 
     10 
     11 # while "false" 循环 (空循环)
     12 while false
     13 do
     14    # 这里面的代码不会被执行. 
     15    operation-1
     16    operation-2
     17    ...
     18    operation-n
     19    # 什么事都没发生!
     20 done   </pre>

     |

*   **type [cmd]**
*   与外部命令[which](filearchiv.md#WHICHREF)很相像, **type cmd**将会给出<span class="QUOTE">"cmd"</span>的完整路径. 与**which**命令不同的是, **type**命令是Bash内建命令. `-a`是**type**命令的一个非常有用的选项, 它用来鉴别参数是<tt class="REPLACEABLE">_关键字_</tt>还是<tt class="REPLACEABLE">_内建命令_</tt>, 也可以用来定位同名的系统命令.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">type '['</kbd>
    <samp class="COMPUTEROUTPUT">[ is a shell builtin</samp>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">type -a '['</kbd>
    <samp class="COMPUTEROUTPUT">[ is a shell builtin
     [ is /usr/bin/[</samp>
    	      </pre>

     |

*   **hash [cmds]**
*   在shell的hash表中, [[4]](#FTN.AEN6708) 记录指定命令的路径名, 所以在shell或脚本中调用这个命令的话, 就不需要再在`$PATH`中重新搜索这个命令了. 如果不带参数的调用**hash**命令, 它将列出所有已经被hash的命令. `-r`选项会重新设置hash表.

*   **bind**
*   **bind**内建命令用来显示或修改_readline_ [[5]](#FTN.AEN6736) 的键绑定.

*   **help**
*   获得shell内建命令的一个小的使用总结. 与[whatis](filearchiv.md#WHATISREF)命令比较象, 但**help**命令是内建命令.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">help exit</kbd>
    <samp class="COMPUTEROUTPUT">exit: exit [n]
        Exit the shell with a status of N.  If N is omitted, the exit status
        is that of the last command executed.</samp>
    	      </pre>

     |

### 注意事项

| [[1]](internal.md#AEN5922) | 

其中有一个例外就是[time](timedate.md#TIMREF)命令, Bash的官方文档说这个命令是一个关键字.

 |
| [[2]](internal.md#AEN6448) | 

一个选项就是一个行为上比较象标志位的参数, 可以用来打开或关闭脚本的某些行为. 而和某个特定选项相关的参数就是用来控制这个选项(标志)功能是开启还是关闭.

 |
| [[3]](internal.md#AEN6568) | 

除非**exec**命令被用来[重新分配文件描述符](x13380.md#USINGEXECREF).

 |
| [[4]](internal.md#AEN6708) | 

_Hash_是一种处理数据的方法, 这种方法就是为表中的数据建立查找键. _而数据项本身_是<span class="QUOTE">"不规则"</span>的, 这样就需要通过一个简单的数学算法来产生一个数字, 这个数字被用来作为查找键.

使用_hash_的一个最有利的优点就是提高了速度. 而缺点就是会产生<span class="QUOTE">"冲撞"</span> -- 也就是说, 可能会有多个数据元素使用同一个主键. possible.

关于hash的例子请参考[例子 A-21](contributed-scripts.md#HASHLIB)和[例子 A-22](contributed-scripts.md#HASHEXAMPLE).

 |
| [[5]](internal.md#AEN6736) | 

在一个交互的shell中, _readline_库就是Bash用来读取输入的. (译者注: 比如默认的Emacs风格的输入, 当然也可以改为vi风格的输入)

 |
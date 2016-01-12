# 16.2\. 代码块重定向

象[while](loops1.md#WHILELOOPREF), [until](loops1.md#UNTILLOOPREF), 和[for](loops1.md#FORLOOPREF1)循环代码块, 甚至[if/then](tests.md#IFTHEN)测试结构的代码块, 都可以对<tt class="FILENAME">stdin</tt>进行重定向. 即使函数也可以使用这种重定向方式(请参考[例子 23-11](complexfunct.md#REALNAME)). 要想做到这些, 都要依靠代码块结尾的<span class="TOKEN"><</span>操作符.

* * *

**例子 16-5\. _while_循环的重定向**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # redir2.sh
  3 
  4 if [ -z "$1" ]
  5 then
  6   Filename=names.data       # 如果没有指定文件名, 则使用这个默认值. 
  7 else
  8   Filename=$1
  9 fi  
 10 #+ Filename=${1:-names.data}
 11 #  这句可代替上面的测试(参数替换).
 12 
 13 count=0
 14 
 15 echo
 16 
 17 while [ "$name" != Smith ]  # 为什么变量$name要用引号?
 18 do
 19   read name                 # 从$Filename文件中读取输入, 而不是在stdin中读取输入. 
 20   echo $name
 21   let "count += 1"
 22 done <"$Filename"           # 重定向stdin到文件$Filename. 
 23 #    ^^^^^^^^^^^^
 24 
 25 echo; echo "$count names read"; echo
 26 
 27 exit 0
 28 
 29 #  注意在一些比较老的shell脚本编程语言中, 
 30 #+ 重定向的循环是放在子shell里运行的. 
 31 #  因此, $count 值返回后会是 0, 此值是在循环开始前的初始值. 
 32 #  *如果可能的话*, 尽量避免在Bash或ksh中使用子shell,
 33 #+ 所以这个脚本能够正确的运行. 
 34 #  (多谢Heiner Steven指出这个问题.)
 35 
 36 #  然而 . . .
 37 #  Bash有时还是*会*在一个使用管道的"while-read"循环中启动一个子shell, 
 38 #+ 与重定向的"while"循环还是有区别的. 
 39 
 40 abc=hi
 41 echo -e "1\n2\n3" | while read l
 42      do abc="$l"
 43         echo $abc
 44      done
 45 echo $abc
 46 
 47 #  感谢, Bruno de Oliveira Schneider
 48 #+ 给出上面的代码片段来演示此问题. 
 49 #  同时, 感谢, Brian Onn, 修正了一个注释错误. </pre>

 |

* * *

* * *

**例子 16-6\. 重定向_while_循环的另一种形式**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 # 这是上个脚本的另一个版本. 
  4 
  5 #  Heiner Steven建议, 
  6 #+ 为了避免重定向循环运行在子shell中(老版本的shell会这么做), 最好让重定向循环运行在当前工作区内, 
  7 #+ 这样的话, 需要提前进行文件描述符重定向, 
  8 #+ 因为变量如果在(子shell上运行的)循环中被修改的话, 循环结束后并不会保存修改后的值. 
  9 
 10 
 11 if [ -z "$1" ]
 12 then
 13   Filename=names.data     # 如果没有指定文件名则使用默认值. 
 14 else
 15   Filename=$1
 16 fi  
 17 
 18 
 19 exec 3<&0                 # 将stdin保存到文件描述符3\. 
 20 exec 0<"$Filename"        # 重定向标准输入. 
 21 
 22 count=0
 23 echo
 24 
 25 
 26 while [ "$name" != Smith ]
 27 do
 28   read name               # 从stdin(现在已经是$Filename了)中读取. 
 29   echo $name
 30   let "count += 1"
 31 done                      #  从文件$Filename中循环读取
 32                           #+ 因为文件(译者注：指默认文件, 在本节最后)有20行. 
 33 
 34 #  这个脚本原先在"while"循环的结尾还有一句: 
 35 #+      done <"$Filename" 
 36 #  练习:
 37 #  为什么不需要这句了? 
 38 
 39 
 40 exec 0<&3                 # 恢复保存的stdin. 
 41 exec 3<&-                 # 关闭临时文件描述符3\. 
 42 
 43 echo; echo "$count names read"; echo
 44 
 45 exit 0</pre>

 |

* * *

* * *

**例子 16-7\. 重定向_until_循环**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # 和前面的例子相同, 但使用的是"until"循环. 
  3 
  4 if [ -z "$1" ]
  5 then
  6   Filename=names.data         # 如果没有指定文件名那就使用默认值. 
  7 else
  8   Filename=$1
  9 fi  
 10 
 11 # while [ "$name" != Smith ]
 12 until [ "$name" = Smith ]     # 把!=改为=.
 13 do
 14   read name                   # 从$Filename中读取, 而不是从stdin中读取. 
 15   echo $name
 16 done <"$Filename"             # 重定向stdin到文件$Filename. 
 17 #    ^^^^^^^^^^^^
 18 
 19 # 结果和前面例子的"while"循环相同. 
 20 
 21 exit 0</pre>

 |

* * *

* * *

**例子 16-8\. 重定向_for_循环**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 if [ -z "$1" ]
  4 then
  5   Filename=names.data          # 如果没有指定文件名就使用默认值. 
  6 else
  7   Filename=$1
  8 fi  
  9 
 10 line_count=`wc $Filename | awk '{ print $1 }'`
 11 #           目标文件的行数. 
 12 #
 13 #  此处的代码太过做作, 并且写得很难看, 
 14 #+ 但至少展示了"for"循环的stdin可以重定向...
 15 #+ 当然, 你得足够聪明, 才能看得出来. 
 16 #
 17 # 更简洁的写法是     line_count=$(wc -l < "$Filename")
 18 
 19 
 20 for name in `seq $line_count`  # "seq"打印出数字序列. 
 21 # while [ "$name" != Smith ]   --   比"while"循环更复杂   --
 22 do
 23   read name                    # 从$Filename中, 而非从stdin中读取. 
 24   echo $name
 25   if [ "$name" = Smith ]       # 因为用for循环, 所以需要这个多余测试. 
 26   then
 27     break
 28   fi  
 29 done <"$Filename"              # 重定向stdin到文件$Filename. 
 30 #    ^^^^^^^^^^^^
 31 
 32 exit 0</pre>

 |

* * *

我们也可以修改前面的例子使其能重定向循环的标准输出.

* * *

**例子 16-9\. 重定向_for_循环(<tt class="FILENAME">stdin</tt>和<tt class="FILENAME">stdout</tt>都进行重定向)**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 if [ -z "$1" ]
  4 then
  5   Filename=names.data          # 如果没有指定文件名, 则使用默认值. 
  6 else
  7   Filename=$1
  8 fi  
  9 
 10 Savefile=$Filename.new         # 保存最终结果的文件名. 
 11 FinalName=Jonah                # 终止"read"时的名称. 
 12 
 13 line_count=`wc $Filename | awk '{ print $1 }'`  # 目标文件的行数. 
 14 
 15 
 16 for name in `seq $line_count`
 17 do
 18   read name
 19   echo "$name"
 20   if [ "$name" = "$FinalName" ]
 21   then
 22     break
 23   fi  
 24 done < "$Filename" > "$Savefile"     # 重定向stdin到文件$Filename, 
 25 #    ^^^^^^^^^^^^^^^^^^^^^^^^^^^       并且将它保存到备份文件中. 
 26 
 27 exit 0</pre>

 |

* * *

* * *

**例子 16-10\. 重定向_if/then_测试结构**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 if [ -z "$1" ]
  4 then
  5   Filename=names.data   # 如果文件名没有指定, 使用默认值. 
  6 else
  7   Filename=$1
  8 fi  
  9 
 10 TRUE=1
 11 
 12 if [ "$TRUE" ]          # if true    和   if :   都可以. 
 13 then
 14  read name
 15  echo $name
 16 fi <"$Filename"
 17 #  ^^^^^^^^^^^^
 18 
 19 # 只读取了文件的第一行. 
 20 # An "if/then"测试结构不能自动地反复地执行, 除非把它们嵌到循环里. 
 21 
 22 exit 0</pre>

 |

* * *

* * *

**例子 16-11\. 用于上面例子的<span class="QUOTE">"names.data"</span>数据文件**

| 

<pre class="PROGRAMLISTING">  1 Aristotle
  2 Belisarius
  3 Capablanca
  4 Euler
  5 Goethe
  6 Hamurabi
  7 Jonah
  8 Laplace
  9 Maroczy
 10 Purcell
 11 Schmidt
 12 Semmelweiss
 13 Smith
 14 Turing
 15 Venn
 16 Wilson
 17 Znosko-Borowski
 18 
 19 #  此数据文件用于: 
 20 #+ "redir2.sh", "redir3.sh", "redir4.sh", "redir4a.sh", "redir5.sh".</pre>

 |

* * *

重定向代码块的<tt class="FILENAME">stdout</tt>, 与"将代码块的输出保存到文件中"具有相同的效果. 请参考[例子 3-2](special-chars.md#RPMCHECK).

[here document](here-docs.md#HEREDOCREF) 是重定向代码块的一个特例.
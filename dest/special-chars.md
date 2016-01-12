# 3\. 特殊字符

**用在脚本和其他地方的特殊字符**

*   <span class="TOKEN">#</span>
*   **注释.** 行首以<span class="TOKEN">#</span>([#!是个例外](sha-bang.md#MAGNUMREF))开头是注释.

    | 

    <pre class="PROGRAMLISTING">  1 # This line is a comment.</pre>

     |

    注释也可以放在于本行命令的后边.

    | 

    <pre class="PROGRAMLISTING">  1 echo "A comment will follow." # 注释在这里.
      2 #                            ^ 注意#前边的空白</pre>

     |

    注释也可以放在本行行首[空白](special-chars.md#WHITESPACEREF)的后面.

    | 

    <pre class="PROGRAMLISTING">  1 	# A tab precedes this comment.</pre>

     |

    | ![Caution](./images/caution.gif) | 

    命令是不能放在同一行上注释的后边的. 因为没有办法把注释结束掉, 好让同一行上后边的<span class="QUOTE">"代码生效"</span>. 只能够另起一行来使用下一个命令.

     |

    | ![Note](./images/note.gif) | 

    当然, 在**echo**中转义的<span class="TOKEN">#</span>是_不能_作为注释的. 同样的, <span class="TOKEN">#</span>也可以出现在[特定的参数替换结构](parameter-substitution.md#PSUB2)中, 或者是出现在[数字常量表达式](numerical-constants.md#NUMCONSTANTS)中.

    | 

    <pre class="PROGRAMLISTING">  1 echo "The # here does not begin a comment."
      2 echo 'The # here does not begin a comment.'
      3 echo The \# here does not begin a comment.
      4 echo The # 这里开始一个注释.
      5 
      6 echo ${PATH#*:}       # 参数替换, 不是一个注释.
      7 echo $(( 2#101011 ))  # 数制转换, 不是一个注释.
      8 
      9 # 感谢, S.C.</pre>

     |

    标准的[引用和转义](quoting.md#QUOTINGREF)字符(" ' \)可以用来转义#. |

    某些特定的[模式匹配操作](parameter-substitution.md#PSOREX1)也可以使用<span class="TOKEN">#</span>.

*   <span class="TOKEN">;</span>
*   **命令分隔符[分号, 即;].** 可以在同一行上写两个或两个以上的命令.

    | 

    <pre class="PROGRAMLISTING">  1 echo hello; echo there
      2 
      3 
      4 if [ -x "$filename" ]; then    # 注意: "if"和"then"需要分隔. 
      5                                # 为什么?
      6   echo "File $filename exists."; cp $filename $filename.bak
      7 else
      8   echo "File $filename not found."; touch $filename
      9 fi; echo "File test complete."</pre>

     |

    注意一下<span class="QUOTE">"<span class="TOKEN">;</span>"</span>某些情况下需要[转义](escapingsection.md#ESCP).

*   <span class="TOKEN">;;</span>
*   **终止[case](testbranch.md#CASEESAC1)选项[双分号, 即;;].**

    | 

    <pre class="PROGRAMLISTING">  1 case "$variable" in
      2 abc)  echo "\$variable = abc" ;;
      3 xyz)  echo "\$variable = xyz" ;;
      4 esac</pre>

     |

*   <span class="TOKEN">.</span>
*   **<span class="QUOTE">"点"</span>命令[句点, 即.].** 等价于[source](internal.md#SOURCEREF)命令(参见 [例子 11-21](internal.md#EX38)). 这是一个bash的[内建命令](internal.md#BUILTINREF).

*   <span class="TOKEN">.</span>
*   **<span class="QUOTE">"点"</span>作为文件名的一部分.** 如果点放在文件名的开头的话, 那么这个文件将会成为<span class="QUOTE">"隐藏"</span>文件, 并且[ls](basic.md#LSREF)命令将不会正常的显示出这个文件.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">touch .hidden-file</kbd>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l</kbd>	      
    <samp class="COMPUTEROUTPUT">total 10
     -rw-r--r--    1 bozo      4034 Jul 18 22:04 data1.addressbook
     -rw-r--r--    1 bozo      4602 May 25 13:58 data1.addressbook.bak
     -rw-r--r--    1 bozo       877 Dec 17  2000 employment.addressbook</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -al</kbd>	      
    <samp class="COMPUTEROUTPUT">total 14
     drwxrwxr-x    2 bozo  bozo      1024 Aug 29 20:54 ./
     drwx------   52 bozo  bozo      3072 Aug 29 20:51 ../
     -rw-r--r--    1 bozo  bozo      4034 Jul 18 22:04 data1.addressbook
     -rw-r--r--    1 bozo  bozo      4602 May 25 13:58 data1.addressbook.bak
     -rw-r--r--    1 bozo  bozo       877 Dec 17  2000 employment.addressbook
     -rw-rw-r--    1 bozo  bozo         0 Aug 29 20:54 .hidden-file</samp>
    	        </pre>

     |

    如果作为目录名的话, _一个单独的点_代表当前的工作目录, 而_两个点_表示上一级目录.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">pwd</kbd>
    <samp class="COMPUTEROUTPUT">/home/bozo/projects</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cd .</kbd>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">pwd</kbd>
    <samp class="COMPUTEROUTPUT">/home/bozo/projects</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cd ..</kbd>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">pwd</kbd>
    <samp class="COMPUTEROUTPUT">/home/bozo/</samp>
    	        </pre>

     |

    _点_经常会出现在文件移动命令的目的参数(目录)的位置上.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cp /home/bozo/current_work/junk/* .</kbd>
    	        </pre>

     |

*   <span class="TOKEN">.</span>
*   **<span class="QUOTE">"点"</span>字符匹配.** 当用作[匹配字符](x13673.md#REGEXDOT)的作用时, 通常都是作为[正则表达式](regexp.md#REGEXREF)的一部分来使用, <span class="QUOTE">"点"</span>用来匹配任何的单个字符.

*   <span class="TOKEN">"</span>
*   **[部分引用](varsubn.md#DBLQUO)[双引号, 即"].** _"STRING"_将会阻止(解释)_STRING_中大部分特殊的字符. 参见 [5](quoting.md).

*   <span class="TOKEN">'</span>
*   **[全引用](varsubn.md#SNGLQUO)[单引号, 即'].** _'STRING'_将会阻止_STRING_中所有特殊字符的解释. 这是一种比使用<span class="TOKEN">"</span>更强烈的形式. 参见 [5](quoting.md).

*   <span class="TOKEN">,</span>
*   **[逗号操作符](ops.md#COMMAOP).** **逗号操作符**链接了一系列的算术操作. 虽然里边所有的内容都被运行了,但只有最后一项被返回.

    | 

    <pre class="PROGRAMLISTING">  1 let "t2 = ((a = 9, 15 / 3))"  # Set "a = 9" and "t2 = 15 / 3"</pre>

     |

*   <span class="TOKEN">\</span>
*   **[转义符](escapingsection.md#ESCP)[反斜线, 即\].** 一种对单字符的引用机制.

    <kbd class="USERINPUT">\X</kbd>将会<span class="QUOTE">"转义"</span>字符_X_. 这等价于_<span class="QUOTE">"X"</span>_, 也等价于_'X'_. <span class="TOKEN">\</span>通常用来转义<span class="TOKEN">"</span>和<span class="TOKEN">'</span>, 这样双引号和但引号就不会被解释成特殊含义了.

    参见 [5](quoting.md)来深入地了解转义符的详细解释.

*   <span class="TOKEN">/</span>
*   **文件名路径分隔符[斜线, 即/].** 分隔文件名不同的部分(比如 <tt class="FILENAME">/home/bozo/projects/Makefile</tt>).

    也可以用来作为除法[算术操作符](ops.md#AROPS1).

*   <span class="TOKEN">`</span>
*   **[命令替换](commandsub.md#COMMANDSUBREF).** **`command`**结构可以将**命令**的输出赋值到一个变量中去. 我们在后边的[后置引用(backquotes)](commandsub.md#BACKQUOTESREF)或后置标记(backticks)中也会讲解.

*   <span class="TOKEN">:</span>
*   **空命令[冒号, 即:].** 等价于<span class="QUOTE">"NOP"</span> (<tt class="REPLACEABLE">_no op_</tt>, 一个什么也不干的命令). 也可以被认为与shell的内建命令[true](internal.md#TRUEREF)作用相同. <span class="QUOTE">"<span class="TOKEN">:</span>"</span>命令是一个bash的[内建命令](internal.md#BUILTINREF), 它的[退出码(exit status)](exit-status.md#EXITSTATUSREF)是<span class="QUOTE">"true"</span>(<span class="RETURNVALUE">0</span>).

    | 

    <pre class="PROGRAMLISTING">  1 :
      2 echo $?   # 0</pre>

     |

    死循环:

    | 

    <pre class="PROGRAMLISTING">  1 while :
      2 do
      3    operation-1
      4    operation-2
      5    ...
      6    operation-n
      7 done
      8 
      9 # 与下边相同:
     10 #    while true
     11 #    do
     12 #      ...
     13 #    done</pre>

     |

    在if/then中的占位符:

    | 

    <pre class="PROGRAMLISTING">  1 if condition
      2 then :   # 什么都不做,引出分支. 
      3 else
      4    take-some-action
      5 fi</pre>

     |

    在一个二元命令中提供一个占位符, 具体参见[例子 8-2](ops.md#ARITHOPS), 和[默认参数](parameter-substitution.md#DEFPARAM).

    | 

    <pre class="PROGRAMLISTING">  1 : ${username=`whoami`}
      2 # ${username=`whoami`}   如果没有开头的":"的话, 将会给出一个错误, 
      3 #                        除非"username"是一个命令或者内建命令...</pre>

     |

    在[here document](here-docs.md#HEREDOCREF)中提供一个命令所需的占位符. 参见[例子 17-10](here-docs.md#ANONHEREDOC).

    使用[参数替换](parameter-substitution.md#PARAMSUBREF)来评估字符串变量 (参见[例子 9-15](parameter-substitution.md#EX6)).

    | 

    <pre class="PROGRAMLISTING">  1 : ${HOSTNAME?} ${USER?} ${MAIL?}
      2 #  如果一个或多个必要的环境变量没被设置的话, 
      3 #+ 就打印错误信息. </pre>

     |

    **[变量扩展/子串替换](parameter-substitution.md#EXPREPL1)**.

    在与<span class="TOKEN">></span>[重定向操作符](io-redirection.md#IOREDIRREF)结合使用时, 将会把一个文件清空, 但是并不会修改这个文件的权限. 如果之前这个文件并不存在, 那么就创建这个文件.

    | 

    <pre class="PROGRAMLISTING">  1 : > data.xxx   # 文件"data.xxx"现在被清空了. 
      2 
      3 # 与 cat /dev/null >data.xxx 的作用相同 
      4 # 然而,这并不会产生一个新的进程, 因为":"是一个内建命令. </pre>

     |

    参见[例子 12-14](textproc.md#EX12).

    在与<span class="TOKEN">>></span>重定向操作符结合使用时, 将不会对预先存在的目标文件(<kbd class="USERINPUT">: >> target_file</kbd>)产生任何影响. 如果这个文件之前并不存在, 那么就创建它.

    | ![Note](./images/note.gif) | 

    这只适用于正规文件, 而不适用于管道, 符号连接, 和某些特殊文件.

     |

    也可能用来作为注释行, 虽然我们不推荐这么做. 使用<span class="TOKEN">#</span>来注释的话, 将关闭剩余行的错误检查, 所以可以在注释行中写任何东西. 然而, 使用<span class="TOKEN">:</span>的话将不会这样.

    | 

    <pre class="PROGRAMLISTING">  1 : This is a comment that generates an error, ( if [ $x -eq 3] ).</pre>

     |

    <span class="QUOTE">"<span class="TOKEN">:</span>"</span>还用来在<tt class="FILENAME">/etc/passwd</tt>和[$PATH](internalvariables.md#PATHREF)变量中做分隔符.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $PATH</kbd>
    <samp class="COMPUTEROUTPUT">/usr/local/bin:/bin:/usr/bin:/usr/X11R6/bin:/sbin:/usr/sbin:/usr/games</samp></pre>

     |

*   <span class="TOKEN">!</span>
*   **取反操作符[叹号, 即!].** <span class="TOKEN">!</span>操作符将会反转命令的[退出码](exit-status.md#EXITSTATUSREF)的结果, (具体参见[例子 6-2](exit-status.md#NEGCOND)). 也会反转测试操作符的意义, 比如修改<span class="QUOTE">"等号"</span>( [=](comparison-ops.md#EQUALSIGNREF) )为<span class="QUOTE">"不等号"</span>( != ). <span class="TOKEN">!</span>操作符是Bash的[关键字](internal.md#KEYWORDREF).

    在一个不同的上下文中, <span class="TOKEN">!</span>也会出现在[变量的间接引用](ivr.md#IVRREF)中.

    在另一种上下文中, 如_命令行_模式下, <span class="TOKEN">!</span>还能反转bash的_历史机制_ (参见[Appendix J](histcommands.md)). 需要注意的是, 在一个脚本中, _历史机制_是被禁用的.

*   <span class="TOKEN">*</span>
*   **通配符[星号, 即*].** <span class="TOKEN">*</span>可以用来做文件名匹配(这个东西有个专有名词叫[globbing](globbingref.md))的<span class="QUOTE">"通配符"</span>. 含义是, 可以用来匹配给定目录下的任何文件名.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo *</kbd>
    <samp class="COMPUTEROUTPUT">abs-book.sgml add-drive.sh agram.sh alias.sh</samp>
    	      </pre>

     |

    <span class="TOKEN">*</span>也可以用在[正则表达式](regexp.md#REGEXREF)中, 用来匹配任意个数(包含0个)的字符.

*   <span class="TOKEN">*</span>
*   **[算术操作符](ops.md#AROPS1).** 在算术操作符的上下文中, <span class="TOKEN">*</span>号表示乘法运算.

    如果要做求幂运算, 使用<span class="TOKEN">**</span>, 这是[求幂操作符](ops.md#EXPONENTIATIONREF).

*   <span class="TOKEN">?</span>
*   **测试操作符.** 在一个特定的表达式中, <span class="TOKEN">?</span>用来测试一个条件的结果.

    在一个[双括号结构](dblparens.md)中, <span class="TOKEN">?</span>就是C语言的三元操作符. 参见[例子 9-31](dblparens.md#CVARS).

    在[参数替换](parameter-substitution.md#PARAMSUBREF)表达式中, <span class="TOKEN">?</span>[用来测试一个变量是否被set了.](parameter-substitution.md#QERRMSG) .

*   <span class="TOKEN">?</span>
*   **通配符.** <span class="TOKEN">?</span>在[通配(globbing)](globbingref.md)中, 用来做匹配单个字符的<span class="QUOTE">"通配符"</span>, 在[正则表达式](x13673.md#EXTREGEX)中, 也是用来[表示一个字符](x13673.md#QUEXREGEX).

*   <span class="TOKEN">$</span>
*   **[变量替换](varsubn.md)(引用变量的内容).**

    | 

    <pre class="PROGRAMLISTING">  1 var1=5
      2 var2=23skidoo
      3 
      4 echo $var1     # 5
      5 echo $var2     # 23skidoo</pre>

     |

    在一个变量前面加上<span class="TOKEN">$</span>用来引用这个变量的_值_.

*   <span class="TOKEN">$</span>
*   **行结束符.** 在[正则表达式中](regexp.md#REGEXREF), <span class="QUOTE">"$"</span>表示行结束符.

*   <span class="TOKEN">${}</span>
*   **[参数替换](parameter-substitution.md#PARAMSUBREF).**

*   <span class="TOKEN">$*</span>, <span class="TOKEN">$@</span>
*   **[位置参数](internalvariables.md#APPREF).**

*   <span class="TOKEN">$?</span>
*   **退出状态码变量.** [$? 变量](exit-status.md#EXSREF) 保存了一个命令, 一个[函数](functions.md#FUNCTIONREF), 或者是脚本本身的[退出状态码](exit-status.md#EXITSTATUSREF).

*   <span class="TOKEN">$</span>
*   **进程ID变量.** 这个[$$ 变量](internalvariables.md#PROCCID) 保存了它所在脚本的_进程 ID_ [[1]](#FTN.AEN907)

*   <span class="TOKEN">()</span>
*   **命令组.**

    | 

    <pre class="PROGRAMLISTING">  1 (a=hello; echo $a)</pre>

     |

    | ![Important](./images/important.gif) | 

    在<tt class="REPLACEABLE">_括号_</tt>中的命令列表, 将会作为一个[子shell](subshells.md#SUBSHELLSREF)来运行.

    在括号中的变量,由于是在子shell中,所以对于脚本剩下的部分是不可用的. 父进程, 也就是脚本本身, [将不能够读取在子进程中创建的变量](subshells.md#PARVIS), 也就是在子shell中创建的变量.

    | 

    <pre class="PROGRAMLISTING">  1 a=123
      2 ( a=321; )	      
      3 
      4 echo "a = $a"   # a = 123
      5 # 在圆括号中a变量, 更像是一个局部变量. </pre>

     |

     |

    **初始化数组.**

    | 

    <pre class="PROGRAMLISTING">  1 Array=(element1 element2 element3)</pre>

     |

*   <span class="TOKEN">{xxx,yyy,zzz,...}</span>
*   **大括号扩展.**

    | 

    <pre class="PROGRAMLISTING">  1 cat {file1,file2,file3} > combined_file
      2 # 把file1, file2, file3连接在一起, 并且重定向到combined_file中.
      3 
      4 
      5 cp file22.{txt,backup}
      6 # 拷贝"file22.txt"到"file22.backup"中</pre>

     |

    一个命令可能会对<tt class="REPLACEABLE">_大括号_</tt> [[2]](#FTN.AEN950) 中的以逗号分割的文件列表起作用. ([通配(globbing)](globbingref.md))将对大括号中的文件名做扩展.

    | ![Caution](./images/caution.gif) | 

    在大括号中, 不允许有空白, _除非_这个空白被引用或转义.

    <kbd class="USERINPUT">echo {file1,file2}\ :{\ A," B",' C'}</kbd>

    <samp class="COMPUTEROUTPUT">file1 : A file1 : B file1 : C file2 : A file2 : B file2 : C</samp>

     |

*   <span class="TOKEN">{}</span>
*   **代码块[大括号, 即{}].** 又被称为_内部组_, 这个结构事实上创建了一个_匿名函数_(一个没有名字的函数). 然而, 与<span class="QUOTE">"标准"</span>[函数](functions.md#FUNCTIONREF)不同的是, 在其中声明的变量,对于脚本其他部分的代码来说还是可见的.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">{ local a;
    	      a=123; }</kbd>
    <samp class="COMPUTEROUTPUT">bash: local: can only be used in a
    function</samp>
    	      </pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 a=123
      2 { a=321; }
      3 echo "a = $a"   # a = 321   (说明在代码块中对变量a所作的修改, 影响了外边的变量)
      4 
      5 # 感谢, S.C.</pre>

     |

    下边的代码展示了在大括号结构中代码的[I/O 重定向](io-redirection.md#IOREDIRREF).

    * * *

    **例子 3-1\. 代码块和I/O重定向**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 从/etc/fstab中读行.
      3 
      4 File=/etc/fstab
      5 
      6 {
      7 read line1
      8 read line2
      9 } < $File
     10 
     11 echo "First line in $File is:"
     12 echo "$line1"
     13 echo
     14 echo "Second line in $File is:"
     15 echo "$line2"
     16 
     17 exit 0
     18 
     19 # 现在, 你怎么分析每行的分割域?
     20 # 小提示: 使用awk.</pre>

     |

    * * *

    * * *

    **例子 3-2\. 将一个代码块的结果保存到文件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # rpm-check.sh
      3 
      4 # 这个脚本的目的是为了描述, 列表, 和确定是否可以安装一个rpm包.
      5 # 在一个文件中保存输出.
      6 # 
      7 # 这个脚本使用一个代码块来展示.
      8 
      9 SUCCESS=0
     10 E_NOARGS=65
     11 
     12 if [ -z "$1" ]
     13 then
     14   echo "Usage: `basename $0` rpm-file"
     15   exit $E_NOARGS
     16 fi  
     17 
     18 { 
     19   echo
     20   echo "Archive Description:"
     21   rpm -qpi $1       # 查询说明.
     22   echo
     23   echo "Archive Listing:"
     24   rpm -qpl $1       # 查询列表.
     25   echo
     26   rpm -i --test $1  # 查询rpm包是否可以被安装.
     27   if [ "$?" -eq $SUCCESS ]
     28   then
     29     echo "$1 can be installed."
     30   else
     31     echo "$1 cannot be installed."
     32   fi  
     33   echo
     34 } > "$1.test"       # 把代码块中的所有输出都重定向到文件中.
     35 
     36 echo "Results of rpm test in file $1.test"
     37 
     38 # 查看rpm的man页来查看rpm的选项.
     39 
     40 exit 0</pre>

     |

    * * *

    | ![Note](./images/note.gif) | 

    与上面所讲到的()中的命令组不同的是, {大括号}中的代码块将_不会_开启一个新的[子shell](subshells.md#SUBSHELLSREF). [[3]](#FTN.AEN1001)

     |

*   <span class="TOKEN">{} \;</span>
*   **路径名.** 一般都在[find](moreadv.md#FINDREF)命令中使用. 这_不是_一个shell[内建命令](internal.md#BUILTINREF).

    | ![Note](./images/note.gif) | 

    <span class="QUOTE">"<span class="TOKEN">;</span>"</span>用来结束**find**命令序列的`-exec`选项. 它需要被保护以防止被shell所解释.

     |

*   <span class="TOKEN">[ ]</span>
*   **条件测试.**

    [条件测试](tests.md#IFTHEN)表达式放在**[ ]**中. 值得注意的是**[**是shell内建**test**命令的一部分, _并不是_<tt class="FILENAME">/usr/bin/test</tt>中的外部命令的一个链接.

*   <span class="TOKEN">[[ ]]</span>
*   **测试.**

    测试表达式放在<span class="TOKEN">[[ ]]</span>中. (shell[关键字](internal.md#KEYWORDREF)).

    具体参见关于[[[ ... ]]结构的讨论](testconstructs.md#DBLBRACKETS).

*   <span class="TOKEN">[ ]</span>
*   **数组元素.**

    在一个[array](arrays.md#ARRAYREF)结构的上下文中, 中括号用来引用数组中每个元素的编号.

    | 

    <pre class="PROGRAMLISTING">  1 Array[1]=slot_1
      2 echo ${Array[1]}</pre>

     |

*   <span class="TOKEN">[ ]</span>
*   **字符范围.**

    用作[正则表达式](regexp.md#REGEXREF)的一部分, 方括号描述一个匹配的[字符范围](x13673.md#BRACKETSREF).

*   <span class="TOKEN">(( ))</span>
*   **整数扩展.**

    扩展并计算在<span class="TOKEN">(( ))</span>中的整数表达式.

    请参考关于[(( ... )) 结构](dblparens.md)的讨论.

*   <span class="TOKEN">></span> <span class="TOKEN">&></span> <span class="TOKEN">>&</span> <span class="TOKEN">>></span> <span class="TOKEN"><</span> <span class="TOKEN"><></span>
*   **[重定向](io-redirection.md#IOREDIRREF).**

    <kbd class="USERINPUT">scriptname >filename</kbd> 重定向<tt class="FILENAME">scriptname</tt>的输出到文件<tt class="FILENAME">filename</tt>中. 如果<tt class="FILENAME">filename</tt>存在的话, 那么将会被覆盖.

    <kbd class="USERINPUT">command &>filename</kbd> 重定向<tt class="FILENAME">command</tt>的<tt class="FILENAME">stdout</tt>和<tt class="FILENAME">stderr</tt>到<tt class="FILENAME">filename</tt>中.

    <kbd class="USERINPUT">command >&2</kbd> 重定向<tt class="FILENAME">command</tt>的<tt class="FILENAME">stdout</tt>到<tt class="FILENAME">stderr</tt>中.

    <kbd class="USERINPUT">scriptname >>filename</kbd> 把<tt class="FILENAME">scriptname</tt>的输出追加到文件<tt class="FILENAME">filename</tt>中. 如果<tt class="FILENAME">filename</tt>不存在的话, 将会被创建.

    <kbd class="USERINPUT">[i]<>filename</kbd> 打开文件<tt class="FILENAME">filename</tt>用来读写, 并且分配[文件描述符](io-redirection.md#FDREF)<span class="TOKEN">i</span>给这个文件. 如果<tt class="FILENAME">filename</tt>不存在, 这个文件将会被创建.

    **[进程替换](process-sub.md#PROCESSSUBREF).**

    <kbd class="USERINPUT">(command)></kbd>

    <kbd class="USERINPUT"><(command)</kbd>

    [在一种不同的上下文中](comparison-ops.md#LTREF), <span class="QUOTE">"<span class="TOKEN"><</span>"</span>和<span class="QUOTE">"<span class="TOKEN">></span>"</span>可用来做 [字符串比较操作](comparison-ops.md#SCOMPARISON1).

    [在另一种上下文中](comparison-ops.md#INTLT), <span class="QUOTE">"<span class="TOKEN"><</span>"</span>和<span class="QUOTE">"<span class="TOKEN">></span>"</span>可用来做 [整数比较操作](comparison-ops.md#ICOMPARISON1). 参见[例子 12-9](moreadv.md#EX45).

*   <span class="TOKEN"><<</span>
*   **用在[here document](here-docs.md#HEREDOCREF)中的重定向.**

*   <span class="TOKEN"><<<</span>
*   **用在[here string](x13628.md#HERESTRINGSREF)中的重定向.**

*   <span class="TOKEN"><</span>, <span class="TOKEN">></span>
*   **[ASCII comparison](comparison-ops.md#LTREF).**

    | 

    <pre class="PROGRAMLISTING">  1 veg1=carrots
      2 veg2=tomatoes
      3 
      4 if [[ "$veg1" < "$veg2" ]]
      5 then
      6   echo "Although $veg1 precede $veg2 in the dictionary,"
      7   echo "this implies nothing about my culinary preferences."
      8 else
      9   echo "What kind of dictionary are you using, anyhow?"
     10 fi</pre>

     |

*   <span class="TOKEN">\<</span>, <span class="TOKEN">\></span>
*   **[正则表达式](regexp.md#REGEXREF)中的[单词边界](x13673.md#ANGLEBRAC) .**

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep '\<the\>' textfile</kbd>

*   <span class="TOKEN">|</span>
*   **管道.** 分析前边命令的输出, 并将输出作为后边命令的输入. 这是一种产生命令链的好方法.

    | 

    <pre class="PROGRAMLISTING">  1 echo ls -l | sh
      2 #  传递"echo ls -l"的输出到shell中,
      3 #+ 与一个简单的"ls -l"结果相同.
      4 
      5 
      6 cat *.lst | sort | uniq
      7 # 合并和排序所有的".lst"文件, 然后删除所有重复的行. </pre>

     |

    | 

    管道是进程间通讯的一个典型办法, 将一个进程的<tt class="FILENAME">stdout</tt>放到另一个进程的<tt class="FILENAME">stdin</tt>中. 标准的方法是将一个一般命令的输出, 比如[cat](basic.md#CATREF)或者[echo](internal.md#ECHOREF), 传递到一个 <span class="QUOTE">"过滤命令"</span>(在这个过滤命令中将处理输入)中, 然后得到结果.

    <kbd class="USERINPUT">cat $filename1 $filename2 | grep $search_word</kbd>

     |

    当然输出的命令也可以传递到脚本中.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # uppercase.sh : 修改输入, 全部转换为大写.
      3 
      4 tr 'a-z' 'A-Z'
      5 #  字符范围必须被""引用起来
      6 #+ 来阻止产生单字符的文件名.
      7 
      8 exit 0</pre>

     |

    现在让我们输送**ls -l**的输出到一个脚本中.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l | ./uppercase.sh</kbd>
    <samp class="COMPUTEROUTPUT">-RW-RW-R--    1 BOZO  BOZO       109 APR  7 19:49 1.TXT
     -RW-RW-R--    1 BOZO  BOZO       109 APR 14 16:48 2.TXT
     -RW-R--R--    1 BOZO  BOZO       725 APR 20 20:56 DATA-FILE</samp>
    	      </pre>

     |

    | ![Note](./images/note.gif) | 

    管道中的每个进程的<tt class="FILENAME">stdout</tt>比须被下一个进程作为<tt class="FILENAME">stdin</tt>来读入. 否则, 数据流会_阻塞_, 并且管道将产生一些非预期的行为.

    | 

    <pre class="PROGRAMLISTING">  1 cat file1 file2 | ls -l | sort
      2 # 从"cat file1 file2"中的输出并没出现. </pre>

     |

    作为[子进程](othertypesv.md#CHILDREF)的运行的管道, 不能够改变脚本的变量.

    | 

    <pre class="PROGRAMLISTING">  1 variable="initial_value"
      2 echo "new_value" | read variable
      3 echo "variable = $variable"     # variable = initial_value</pre>

     |

    如果管道中的某个命令产生了一个异常,并中途失败,那么这个管道将过早的终止. 这种行为被叫做_broken pipe_, 并且这种状态下将发送一个_SIGPIPE_ [信号](debugging.md#SIGNALD).

     |

*   <span class="TOKEN">>|</span>
*   **强制重定向(即使设置了[noclobber选项](options.md#NOCLOBBERREF) -- 就是-C选项).** 这将强制的覆盖一个现存文件.

*   <span class="TOKEN">||</span>
*   **[或-逻辑操作](ops.md#ORREF).** 在一个[条件测试结构](testconstructs.md#TESTCONSTRUCTS1)中, 如果条件测试结构两边中的_任意一边_结果为true的话, <span class="TOKEN">||</span>操作就会返回<span class="RETURNVALUE">0</span>(代表执行成功).

*   <span class="TOKEN">&</span>
*   **后台运行命令.** 一个命令后边跟一个<span class="TOKEN">&</span> 表示在后台运行.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">sleep 10 &</kbd>
    <samp class="COMPUTEROUTPUT">[1] 850</samp>
    <samp class="COMPUTEROUTPUT">[1]+  Done                    sleep 10</samp>
    	      </pre>

     |

    在一个脚本中,命令和[循环](loops1.md#FORLOOPREF1)都可能运行在后台.

    * * *

    **例子 3-3\. 在后台运行一个循环**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # background-loop.sh
      3 
      4 for i in 1 2 3 4 5 6 7 8 9 10            # 第一个循环.
      5 do
      6   echo -n "$i "
      7 done & # 在后台运行这个循环.
      8        # 在第2个循环之后, 将在某些时候执行. 
      9 
     10 echo   # 这个'echo'某些时候将不会显示. 
     11 
     12 for i in 11 12 13 14 15 16 17 18 19 20   # 第二个循环.
     13 do
     14   echo -n "$i "
     15 done  
     16 
     17 echo   # 这个'echo'某些时候将不会显示. 
     18 
     19 # ======================================================
     20 
     21 # 期望的输出应该是:
     22 # 1 2 3 4 5 6 7 8 9 10 
     23 # 11 12 13 14 15 16 17 18 19 20 
     24 
     25 # 然而实际的结果有可能是:
     26 # 11 12 13 14 15 16 17 18 19 20 
     27 # 1 2 3 4 5 6 7 8 9 10 bozo $
     28 # (第2个'echo'没执行, 为什么?)
     29 
     30 # 也可能是: 
     31 # 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20
     32 # (第1个'echo'没执行, 为什么?)
     33 
     34 # 非常少见的执行结果, 也有可能是: 
     35 # 11 12 13 1 2 3 4 5 6 7 8 9 10 14 15 16 17 18 19 20 
     36 # 前台的循环先于后台的执行.
     37 
     38 exit 0
     39 
     40 #  Nasimuddin Ansari 建议加一句 sleep 1
     41 #+ 在6行和14行的 echo -n "$i" 之后加这句.
     42 #+ 为了真正的乐趣.</pre>

     |

    * * *

    | ![Caution](./images/caution.gif) | 

    在一个脚本内后台运行一个命令,有可能造成这个脚本的挂起,等待一个按键 响应. 幸运的是, 我们有针对这个问题的[解决办法](x6756.md#WAITHANG).

     |

*   <span class="TOKEN">&&</span>
*   **[与-逻辑操作](ops.md#LOGOPS1).** 在一个[条件测试结构](testconstructs.md#TESTCONSTRUCTS1)中, 只有在条件测试结构的_两边_结果都为true的时候, <span class="TOKEN">&&</span>操作才会返回<span class="RETURNVALUE">0</span>(代表sucess).

*   <span class="TOKEN">-</span>
*   **选项, 前缀.** 在所有的命令内如果想使用选项参数的话,前边都要加上<span class="QUOTE">"-"</span>.

    <kbd class="USERINPUT">COMMAND -[Option1][Option2][...]</kbd>

    <kbd class="USERINPUT">ls -al</kbd>

    <kbd class="USERINPUT">sort -dfu $filename</kbd>

    <kbd class="USERINPUT">set -- $variable</kbd>

    | 

    <pre class="PROGRAMLISTING">  1 if [ $file1 -ot $file2 ]
      2 then
      3   echo "File $file1 is older than $file2."
      4 fi
      5 
      6 if [ "$a" -eq "$b" ]
      7 then
      8   echo "$a is equal to $b."
      9 fi
     10 
     11 if [ "$c" -eq 24 -a "$d" -eq 47 ]
     12 then
     13   echo "$c equals 24 and $d equals 47."
     14 fi</pre>

     |

*   <span class="TOKEN">-</span>
*   **用于重定向<tt class="FILENAME">stdin</tt>或<tt class="FILENAME">stdout</tt>[破折号, 即-].**

    | 

    <pre class="PROGRAMLISTING">  1 (cd /source/directory && tar cf - . ) | (cd /dest/directory && tar xpvf -)
      2 # 从一个目录移动整个目录树到另一个目录
      3 # [感谢Alan Cox <a.cox@swansea.ac.uk>, 走出了部分修改]
      4 
      5 # 1) cd /source/directory    源目录
      6 # 2) &&                     "与列表": 如果'cd'命令成功了, 那么就执行下边的命令. 
      7 # 3) tar cf - .              'c'创建一个新文档, 'f'后边跟'-'指定目标文件作为stdout
      8 #                            '-'后边的'f'(file)选项, 指明作为stdout的目标文件. 
      9 #                            并且在当前目录('.')执行.
     10 # 4) |                       管道...
     11 # 5) ( ... )                 一个子shell
     12 # 6) cd /dest/directory      改变当前目录到目标目录.
     13 # 7) &&                     "与列表", 同上
     14 # 8) tar xpvf -              'x'解档, 'p'保证所有权和文件属性,
     15 #                            'v'发完整消息到stdout,
     16 #                            'f'后边跟'-',从stdin读取数据. 
     17 #
     18 #                            注意:'x' 是一个命令, 'p', 'v', 'f' 是选项.
     19 # Whew!
     20 
     21 
     22 
     23 # 更优雅的写法应该是:
     24 #   cd source/directory
     25 #   tar cf - . | (cd ../dest/directory; tar xpvf -)
     26 #
     27 #     当然也可以这么写:
     28 # cp -a /source/directory/* /dest/directory
     29 #     或者:
     30 # cp -a /source/directory/* /source/directory/.[^.]* /dest/directory
     31 #     如果在/source/directory中有隐藏文件的话.</pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 bunzip2 -c linux-2.6.16.tar.bz2 | tar xvf -
      2 #  --未解压的tar文件--    | --然后把它传递到"tar"中--
      3 #  如果 "tar" 没能够正常的处理"bunzip2",
      4 #+ 这就需要使用管道来执行2个单独的步骤来完成它.
      5 #  这个练习的目的是解档"bzipped"的kernel源文件.</pre>

     |

    注意, 在这个上下文中<span class="QUOTE">"-"</span>本身并不是一个Bash操作, 而是一个可以被特定的UNIX工具识别的选项, 这些特定的UNIX工具特指那些可以写输出到<tt class="FILENAME">stdout</tt>的工具, 比如**tar**, **cat**, 等等.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo "whatever" | cat -</kbd>
    <samp class="COMPUTEROUTPUT">whatever</samp> </pre>

     |

    在需要一个文件名的位置, <tt class="REPLACEABLE">_-_</tt>重定向输出到<tt class="FILENAME">stdout</tt>(有时候会在<kbd class="USERINPUT">tar和cf</kbd>中出现), 或者从<tt class="FILENAME">stdin</tt>接受输入, 而不是从一个文件中接受输入. 这是在管道中使用文件导向(file-oriented)工具来作为过滤器的一种方法.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">file</kbd>
    <samp class="COMPUTEROUTPUT">Usage: file [-bciknvzL] [-f namefile] [-m magicfiles] file...</samp>
    	      </pre>

     |

    在命令行上单独给出一个[file](filearchiv.md#FILEREF), 会给出一个错误信息.

    添加一个<span class="QUOTE">"-"</span>将得到一个更有用的结果. 这会使shell等待用户输入.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">file -</kbd>
    <kbd class="USERINPUT">abc</kbd>
    <samp class="COMPUTEROUTPUT">standard input:              ASCII text</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">file -</kbd>
    <kbd class="USERINPUT">#!/bin/bash</kbd>
    <samp class="COMPUTEROUTPUT">standard input:              Bourne-Again shell script text executable</samp>
    	      </pre>

     |

    现在命令从<tt class="FILENAME">stdin</tt>中接受了输入, 并分析它.

    <span class="QUOTE">"-"</span>可以被用来将<tt class="FILENAME">stdout</tt>通过管道传递到其他命令中. 这样就允许使用[在一个文件开头添加几行](assortedtips.md#PREPENDREF)的技巧.

    使用[diff](filearchiv.md#DIFFREF)命令来和另一个文件的_某一段_进行比较:

    <kbd class="USERINPUT">grep Linux file1 | diff file2 -</kbd>

    最后, 来展示一个使用<tt class="REPLACEABLE">_-_</tt>的[tar](filearchiv.md#TARREF)命令的一个真实的例子.

    * * *

    **例子 3-4\. 备份最后一天所有修改的文件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 #  在一个"tarball"中(经过tar和gzip处理过的文件)
      4 #+ 备份最后24小时当前目录下d所有修改的文件. 
      5 
      6 BACKUPFILE=backup-$(date +%m-%d-%Y)
      7 #                 在备份文件中嵌入时间.
      8 #                 Thanks, Joshua Tschida, for the idea.
      9 archive=${1:-$BACKUPFILE}
     10 #  如果在命令行中没有指定备份文件的文件名,
     11 #+ 那么将默认使用"backup-MM-DD-YYYY.tar.gz".
     12 
     13 tar cvf - `find . -mtime -1 -type f -print` > $archive.tar
     14 gzip $archive.tar
     15 echo "Directory $PWD backed up in archive file \"$archive.tar.gz\"."
     16 
     17 
     18 #  Stephane Chazelas指出上边代码,
     19 #+ 如果在发现太多的文件的时候, 或者是如果文件
     20 #+ 名包括空格的时候, 将执行失败.
     21 
     22 # Stephane Chazelas建议使用下边的两种代码之一:
     23 # -------------------------------------------------------------------
     24 #   find . -mtime -1 -type f -print0 | xargs -0 tar rvf "$archive.tar"
     25 #      使用gnu版本的"find".
     26 
     27 
     28 #   find . -mtime -1 -type f -exec tar rvf "$archive.tar" '{}' \;
     29 #         对于其他风格的UNIX便于移植, 但是比较慢.
     30 # -------------------------------------------------------------------
     31 
     32 
     33 exit 0</pre>

     |

    * * *

    | ![Caution](./images/caution.gif) | 

    以<span class="QUOTE">"-"</span>开头的文件名在使用<span class="QUOTE">"-"</span>作为重定向操作符的时候, 可能会产生问题. 应该写一个脚本来检查这个问题, 并给这个文件加上合适的前缀. 比如: <tt class="FILENAME">./-FILENAME</tt>, <tt class="FILENAME">$PWD/-FILENAME</tt>, 或者 <tt class="FILENAME">$PATHNAME/-FILENAME</tt>.

    如果变量以<tt class="REPLACEABLE">_-_</tt>开头进行命名, 可能也会引起问题.

    | 

    <pre class="PROGRAMLISTING">  1 var="-n"
      2 echo $var		
      3 # 具有"echo -n"的效果了,这样什么都不会输出的. </pre>

     |

     |

*   <span class="TOKEN">-</span>
*   **先前的工作目录.** **cd -**将会回到先前的工作目录. 它使用了[$OLDPWD](internalvariables.md#OLDPWD) [环境变量](othertypesv.md#ENVREF).

    | ![Caution](./images/caution.gif) | 

    不要混淆这里所使用的<span class="QUOTE">"-"</span>和先前我们所讨论的<span class="QUOTE">"-"</span>重定向操作符. 对于<span class="QUOTE">"-"</span>的具体解释只能依赖于具体的上下文.

     |

*   <span class="TOKEN">-</span>
*   **减号.** 减号属于[算术操作](ops.md#AROPS1).

*   <span class="TOKEN">=</span>
*   **等号.** [赋值操作](varassignment.md#EQREF)

    | 

    <pre class="PROGRAMLISTING">  1 a=28
      2 echo $a   # 28</pre>

     |

    在[另一种上下文环境中](comparison-ops.md#EQUALSIGNREF), <span class="QUOTE">"<span class="TOKEN">=</span>"</span>也用来做[字符串比较](comparison-ops.md#SCOMPARISON1)操作.

*   <span class="TOKEN">+</span>
*   **加号.** 加法[算术操作](ops.md#AROPS1).

    在[另一种上下文环境中](x13673.md#PLUSREF), <span class="TOKEN">+</span>也是一种[正则表达式](regexp.md)操作.

*   <span class="TOKEN">+</span>
*   **选项.** 一个命令或者过滤器的选项标记.

    某些命令[内建命令](internal.md#BUILTINREF)使用<span class="TOKEN">+</span>来打开特定的选项, 用<span class="TOKEN">-</span>来禁用这些特定的选项.

*   <span class="TOKEN">%</span>
*   **[取模](ops.md#MODULOREF).** 取模(一次除法的余数)[算术操作](ops.md#AROPS1).

    在[不同的上下文中](parameter-substitution.md#PCTPATREF), <span class="TOKEN">%</span>也是一种[模式匹配](parameter-substitution.md#PSUB2)操作.

*   <span class="TOKEN">~</span>
*   **home目录[波浪号, 即~].** 相当于[$HOME](internalvariables.md#HOMEDIRREF)内部变量. _~bozo_是bozo的home目录, 并且**ls ~bozo**将列出其中的内容. <span class="TOKEN">~/</span>就是当前用户的home目录, 并且**ls ~/**将列出其中的内容.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo ~bozo</kbd>
    <samp class="COMPUTEROUTPUT">/home/bozo</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo ~</kbd>
    <samp class="COMPUTEROUTPUT">/home/bozo</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo ~/</kbd>
    <samp class="COMPUTEROUTPUT">/home/bozo/</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo ~:</kbd>
    <samp class="COMPUTEROUTPUT">/home/bozo:</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo ~nonexistent-user</kbd>
    <samp class="COMPUTEROUTPUT">~nonexistent-user</samp>
    	      </pre>

     |

*   <span class="TOKEN">~+</span>
*   **当前工作目录.** 相当于[$PWD](internalvariables.md#PWDREF)内部变量.

*   <span class="TOKEN">~-</span>
*   **先前的工作目录.** 相当于[$OLDPWD](internalvariables.md#OLDPWD)内部变量.

*   <span class="TOKEN">=~</span>
*   **[正则表达式匹配](bashver3.md#REGEXMATCHREF).** 这个操作将会在[version 3](bashver3.md#BASH3REF)版本的Bash部分进行讲解.

*   <span class="TOKEN">^</span>
*   **行首.** 在[正则表达式](regexp.md#REGEXREF)中, <span class="QUOTE">"^"</span>表示定位到文本行的行首.

*   控制字符
*   **修改终端或文本显示的行为. .** 控制字符以**CONTROL** + **key**这种方式进行组合(同时按下). 控制字符也可以使用_8进制_或_16进制_表示法来进行表示, 但是前边必须要加上_转义符_.

    控制字符在脚本中不能正常使用.

    *   <kbd class="USERINPUT">Ctl-B</kbd>

        退格(非破坏性的), 就是退格但是不删掉前面的字符.

    *   <kbd class="USERINPUT">Ctl-C</kbd>

        break. 终结一个前台作业.

    *   <kbd class="USERINPUT">Ctl-D</kbd>

        从一个shell中登出(与[exit](exit-status.md#EXITCOMMANDREF)很相像).

        <span class="QUOTE">"EOF"</span>(文件结束). 这也能从<tt class="FILENAME">stdin</tt>中终止输入.

        在console或者在_xterm_窗口中输入的时候, <kbd class="USERINPUT">Ctl-D</kbd>将删除光标下字符. 当没有字符时, <kbd class="USERINPUT">Ctl-D</kbd>将退出当前会话, 在一个xterm窗口中, 则会产生关闭此窗口的效果.

    *   <kbd class="USERINPUT">Ctl-G</kbd>

        <span class="QUOTE">"哔"</span> (beep). 在一些老式的打字机终端上, 它会响一下铃.

    *   <kbd class="USERINPUT">Ctl-H</kbd>

        <span class="QUOTE">"退格"</span>(破坏性的), 就是在退格之后, 还要删掉前边的字符.

        | 

        <pre class="PROGRAMLISTING">  1 #!/bin/bash
          2 # Embedding Ctl-H in a string.
          3 
          4 a="^H^H"                  # 两个 Ctl-H's (backspaces).
          5 echo "abcdef"             # abcdef
          6 echo -n "abcdef$a "       # abcd f
          7 #  Space at end  ^              ^ 两次退格.
          8 echo -n "abcdef$a"        # abcdef
          9 #  结尾没有空格                   没有 backspace 的效果了(why?).
         10                           # 结果并不像期望的那样.
         11 echo; echo</pre>

         |

    *   <kbd class="USERINPUT">Ctl-I</kbd>

        水平制表符.

    *   <kbd class="USERINPUT">Ctl-J</kbd>

        重起一行(换一行并到行首). 在脚本中, 也可以使用8进制表示法 -- '\012' 或者16进制表示法 -- '\x0a' 来表示.

    *   <kbd class="USERINPUT">Ctl-K</kbd>

        垂直制表符.

        当在console或者_xterm_窗口中输入文本时, <kbd class="USERINPUT">Ctl-K</kbd>将会删除从光标所在处到行为的全部字符. 在脚本中, <kbd class="USERINPUT">Ctl-K</kbd>的行为有些不同, 具体请参见下边的Lee Maschmeyer的例子程序.

    *   <kbd class="USERINPUT">Ctl-L</kbd>

        清屏(清除终端的屏幕显示). 在终端中, 与[clear](terminalccmds.md#CLEARREF)命令的效果相同. 当发送到打印机上时, <kbd class="USERINPUT">Ctl-L</kbd>会让打印机将打印纸卷到最后.

    *   <kbd class="USERINPUT">Ctl-M</kbd>

        回车.

        | 

        <pre class="PROGRAMLISTING">  1 #!/bin/bash
          2 # Thank you, Lee Maschmeyer, for this example.
          3 
          4 read -n 1 -s -p /pre>Control-M leaves cursor at beginning of this line. Press Enter. \x0d'
          5                                   # 当然, '0d'就是二进制的回车. 
          6 echo >&2   #  '-s'参数使得任何输入都不将回显出来.
          7            #+ 所以, 明确的重起一行是必要的.
          8 
          9 read -n 1 -s -p /pre>Control-J leaves cursor on next line. \x0a'
         10            #  '0a' 等价于Control-J, 换行.
         11 echo >&2
         12 
         13 ###
         14 
         15 read -n 1 -s -p /pre>And Control-K\x0bgoes straight down.'
         16 echo >&2   #  Control-K 是垂直制表符.
         17 
         18 # 关于垂直制表符效果的一个更好的例子见下边:
         19 
         20 var=/pre>\x0aThis is the bottom line\x0bThis is the top line\x0a'
         21 echo "$var"
         22 #  这句与上边的例子使用的是同样的办法, 然而:
         23 echo "$var" | col
         24 #  这将造成垂直制表符右边的部分比左边部分高. 
         25 #  这也解释了为什么我们要在行首和行尾加上一个换行符 --
         26 #+ 这样可以避免屏幕显示混乱. 
         27 
         28 # Lee Maschmeyer的解释:
         29 # --------------------------
         30 #  在这里[第一个垂直制表符的例子中] . . . 
         31 #+ 这个垂直制表符使得还没回车就直接打印下来. 
         32 #  这只能在那些不能"后退"的设备中才行, 
         33 #+ 比如说Linux的console. 
         34 #  垂直制表符的真正意义是向上移, 而不是向下. 
         35 #  它可以用来让打印机打印上标. 
         36 #  col工具可以模拟垂直制表符的正确行为. 
         37 
         38 exit 0</pre>

         |

    *   <kbd class="USERINPUT">Ctl-Q</kbd>

        恢复(XON).

        在一个终端中恢复<tt class="FILENAME">stdin</tt>.

    *   <kbd class="USERINPUT">Ctl-S</kbd>

        挂起(XOFF).

        在一个终端中冻结<tt class="FILENAME">stdin</tt>. (使用Ctl-Q可以恢复输入.)

    *   <kbd class="USERINPUT">Ctl-U</kbd>

        删除光标到行首的所有字符. 在某些设置下, _不管光标的所在位置_<kbd class="USERINPUT">Ctl-U</kbd>都将删除整行输入.

    *   <kbd class="USERINPUT">Ctl-V</kbd>

        当输入字符时, <kbd class="USERINPUT">Ctl-V</kbd>允许插入控制字符. 比如, 下边的两个例子是等价的:

        | 

        <pre class="PROGRAMLISTING">  1 echo -e '\x0a'
          2 echo <Ctl-V><Ctl-J></pre>

         |

        <kbd class="USERINPUT">Ctl-V</kbd>主要用于文本编辑.

    *   <kbd class="USERINPUT">Ctl-W</kbd>

        当在控制台或一个xterm窗口敲入文本时, <kbd class="USERINPUT">Ctl-W</kbd>将会删除当前光标到左边最近一个空格间的全部字符. 在某些设置下, <kbd class="USERINPUT">Ctl-W</kbd>将会删除当前光标到左边第一个非字母或数字之间的全部字符.

    *   <kbd class="USERINPUT">Ctl-Z</kbd>

        暂停前台作业.

*   空白
*   **用来分隔函数, 命令或变量. .** 空白包含_空格_, _tab_, _空行_, 或者是它们之间任意的组合体. [[4]](#FTN.AEN1759) 在某些上下文中, 比如[变量赋值](gotchas.md#WSBAD), 空白是不被允许的, 会产生语法错误.

    空行不会影响脚本的行为, 因此使用空行可以很好的划分独立的函数段以增加可读性.

    特殊变量[$IFS](internalvariables.md#IFSREF)用来做一些输入命令的分隔符, 默认情况下是空白.

    如果想在字符串或变量中使用空白, 那么应该使用[引用](quoting.md#QUOTINGREF).

### 注意事项

| [[1]](special-chars.md#AEN907) | 

_PID_, 或_进程 ID_, 是分配给运行进程的一个数字. 要想察看所有运行进程的_PID_可以使用[ps](system.md#PPSSREF)命令.

 |
| [[2]](special-chars.md#AEN950) | 

The shell does the _brace expansion_. The command itself acts upon the _result_ of the expansion.

 |
| [[3]](special-chars.md#AEN1001) | 

例外: 在pipe中的一个大括号中的代码段_可能_运行在一个 [子shell](subshells.md#SUBSHELLSREF)中.

| 

<pre class="PROGRAMLISTING">  1 ls | { read firstline; read secondline; }
  2 #  错误. 在大括号中的代码段, 将运行到子shell中, 
  3 #+ 所以"ls"的输出将不能传递到代码块中. 
  4 echo "First line is $firstline; second line is $secondline"  # 不能工作.
  5 
  6 # 感谢, S.C.</pre>

 |

 |
| [[4]](special-chars.md#AEN1759) | 

一个换行符(<span class="QUOTE">"重起一行"</span>)也被认为是空白符. 这也就解释了为什么一个只包含换行符的_空行_也被认为是空白.

 |
# 12.2\. 复杂命令

**更高级的用户命令**

*   **find**
*   -exec <tt class="REPLACEABLE">_COMMAND_</tt> \;

    在每一个**find**匹配到的文件执行<tt class="REPLACEABLE">_COMMAND_</tt>命令. 命令序列以<span class="TOKEN">;</span>结束(<span class="QUOTE">";"</span>是[转义符](escapingsection.md#ESCP)以保证shll传递到**find**命令中的字符不会被解释为其他的特殊字符).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">find ~/ -name '*.txt'</kbd>
    <samp class="COMPUTEROUTPUT">/home/bozo/.kde/share/apps/karm/karmdata.txt
     /home/bozo/misc/irmeyc.txt
     /home/bozo/test-scripts/1.txt</samp>
    	      </pre>

     |

    如果<tt class="REPLACEABLE">_COMMAND_</tt>中包含<span class="TOKEN">{}</span>, 那么**find**命令将会用所有匹配文件的路径名来替换<span class="QUOTE">"{}"</span>.

    | 

    <pre class="PROGRAMLISTING">  1 find ~/ -name 'core*' -exec rm {} \;
      2 # 从用户的 home 目录中删除所有的 core dump文件. </pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 find /home/bozo/projects -mtime 1
      2 #  列出最后一天被修改的
      3 #+ 在/home/bozo/projects目录树下的所有文件.
      4 #
      5 #  mtime = 目标文件最后修改的时间
      6 #  ctime = 修改后的最后状态(通过'chmod'或其他方法)
      7 #  atime = 最后访问时间
      8 
      9 DIR=/home/bozo/junk_files
     10 find "$DIR" -type f -atime +5 -exec rm {} \;
     11 #                                      ^^
     12 #  大括号就是"find"命令用来替换目录的地方.
     13 #
     14 #  删除至少5天内没被访问过的
     15 #+ "/home/bozo/junk_files" 中的所有文件.
     16 #
     17 #  "-type filetype", where
     18 #  f = regular file
     19 #  d = directory, etc.
     20 #  ('find' 命令的man页包含有完整的选项列表.) </pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 find /etc -exec grep '[0-9][0-9]*[.][0-9][0-9]*[.][0-9][0-9]*[.][0-9][0-9]*' {} \;
      2 
      3 # 在 /etc 目录中的文件找到所所有包含 IP 地址(xxx.xxx.xxx.xxx) 的文件.
      4 # 可能会查找到一些多余的匹配. 我们如何去掉它们呢?
      5 
      6 # 或许可以使用如下方法:
      7 
      8 find /etc -type f -exec cat '{}' \; | tr -c '.[:digit:]' '\n' \
      9 | grep '^[^.][^.]*\.[^.][^.]*\.[^.][^.]*\.[^.][^.]*/pre>
     10 #
     11 #  [:digit:] 是一种字符类.
     12 #+ 关于字符类的介绍请参考 POSIX 1003.2 标准化文档. 
     13 
     14 # 感谢, Stephane Chazelas. </pre>

     |

    | ![Note](./images/note.gif) | 

    **find**命令的`-exec`选项不应该与shell中的内建命令[exec](internal.md#EXECREF)相混淆.

     |

    * * *

    **例子 12-3\. **糟糕的文件名**, 删除当前目录下文件名中包含一些糟糕字符(包括[空白](special-chars.md#WHITESPACEREF)的文件.**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # badname.sh
      3 # 删除当前目录下文件名中包含一些特殊字符的文件.(这些特殊字符指的是不应该出现在文件名中的字符)
      4 
      5 for filename in *
      6 do
      7   badname=`echo "$filename" | sed -n /[\+\{\;\"\\\=\?~\(\)\<\>\&\*\|\$]/p`
      8 # badname=`echo "$filename" | sed -n '/[+{;"\=?~()<>&*|$]/p'`  这句也行.
      9 # 删除文件名包含这些字符的文件:     + { ; " \ = ? ~ ( ) < > & * | $
     10 #
     11   rm $badname 2>/dev/null
     12 #             ^^^^^^^^^^^ 错误消息将被抛弃.
     13 done
     14 
     15 # 现在, 处理文件名中以任何方式包含空白的文件.
     16 find . -name "* *" -exec rm -f {} \;
     17 # "find"命令匹配到的目录名将替换到"{}"的位置.
     18 # '\'是为了保证';'被正确的转义, 并且放到命令的结尾.
     19 
     20 exit 0
     21 
     22 #---------------------------------------------------------------------
     23 # 这行下边的命令将不会运行, 因为有 "exit" 命令.
     24 
     25 # 下边这句可以用来替换上边的脚本: 
     26 find . -name '*[+{;"\\=?~()<>&*|$ ]*' -exec rm -f '{}' \;
     27 # (感谢, S.C.)</pre>

     |

    * * *

    * * *

    **例子 12-4\. 通过文件的_inode_号来删除文件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # idelete.sh: 通过文件的inode号来删除文件.
      3 
      4 #  当文件名以一个非法字符开头的时候, 这就非常有用了,
      5 #+ 比如 ? 或 -.
      6 
      7 ARGCOUNT=1                      # 文件名参数必须被传递到脚本中.
      8 E_WRONGARGS=70
      9 E_FILE_NOT_EXIST=71
     10 E_CHANGED_MIND=72
     11 
     12 if [ $# -ne "$ARGCOUNT" ]
     13 then
     14   echo "Usage: `basename $0` filename"
     15   exit $E_WRONGARGS
     16 fi  
     17 
     18 if [ ! -e "$1" ]
     19 then
     20   echo "File \""$1"\" does not exist."
     21   exit $E_FILE_NOT_EXIST
     22 fi  
     23 
     24 inum=`ls -i | grep "$1" | awk '{print $1}'`
     25 # inum = inode 文件的(索引节点)号.
     26 # --------------------------------------------------------
     27 # 每个文件都有一个inode号, 这个号用来记录文件物理地址信息.
     28 # --------------------------------------------------------
     29 
     30 echo; echo -n "Are you absolutely sure you want to delete \"$1\" (y/n)? "
     31 # 'rm' 命令的 '-v' 选项得询问也会出现这句话.
     32 read answer
     33 case "$answer" in
     34 [nN]) echo "Changed your mind, huh?"
     35       exit $E_CHANGED_MIND
     36       ;;
     37 *)    echo "Deleting file \"$1\".";;
     38 esac
     39 
     40 find . -inum $inum -exec rm {} \;
     41 #                           ^^
     42 #        大括号就是"find"命令
     43 #+       用来替换文本输出的地方.
     44 echo "File "\"$1"\" deleted!"
     45 
     46 exit 0</pre>

     |

    * * *

    请参考[例子 12-27](filearchiv.md#EX48), [例子 3-4](special-chars.md#EX58), 和[例子 10-9](loops1.md#FINDSTRING) 这些例子展示了如何使用**find**命令. 对于这个强大而又复杂的命令来说, 查看man页可以获得更多的细节.

*   **xargs**
*   这是给命令传递参数的一个过滤器, 也是组合多个命令的一个工具. 它把一个数据流分割为一些足够小的块, 以方便过滤器和命令进行处理. 由此这个命令也是[后置引用](commandsub.md#BACKQUOTESREF)的一个强有力的替换. 当在一般情况下使用<span class="ERRORNAME">过多参数</span>的[命令替换](commandsub.md#COMMANDSUBREF)都会产生失败的现象, 这时候使用**xargs**命令来替换, 一般都能成功. [[1]](#FTN.AEN7492) 一般的, **xargs**从<tt class="FILENAME">stdin</tt>或者管道中读取数据, 但是它也能够从文件的输出中读取数据.

    **xargs**的默认命令是[echo](internal.md#ECHOREF). 这意味着通过管道传递给**xargs**的输入将会包含换行和空白, 不过通过**xargs**的处理, 换行和空白将被空格取代.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l</kbd>
    <samp class="COMPUTEROUTPUT">total 0
     -rw-rw-r--    1 bozo  bozo         0 Jan 29 23:58 file1
     -rw-rw-r--    1 bozo  bozo         0 Jan 29 23:58 file2</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l | xargs</kbd>
    <samp class="COMPUTEROUTPUT">total 0 -rw-rw-r-- 1 bozo bozo 0 Jan 29 23:58 file1 -rw-rw-r-- 1 bozo bozo 0 Jan 29 23:58 file2</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">find ~/mail -type f | xargs grep "Linux"</kbd>
    <samp class="COMPUTEROUTPUT">./misc:User-Agent: slrn/0.9.8.1 (Linux)
     ./sent-mail-jul-2005: hosted by the Linux Documentation Project.
     ./sent-mail-jul-2005: (Linux Documentation Project Site, rtf version)
     ./sent-mail-jul-2005: Subject: Criticism of Bozo's Windows/Linux article
     ./sent-mail-jul-2005: while mentioning that the Linux ext2/ext3 filesystem
     . . .</samp>
    	      </pre>

     |

    <kbd class="USERINPUT">ls | xargs -p -l gzip</kbd> 使用[gzips](filearchiv.md#GZIPREF)压缩当前目录下的每个文件, 每次压缩一个, 并且在每次压缩前都提示用户.

    | ![Tip](./images/tip.gif) | 

    一个有趣的**xargs**选项是`-n <tt class="REPLACEABLE">_NN_</tt>`, <tt class="REPLACEABLE">_NN_</tt>用来限制每次传递进来参数的个数.

    <kbd class="USERINPUT">ls | xargs -n 8 echo</kbd>以每行<tt class="LITERAL">8</tt>列的形式列出当前目录下的所有文件.

     |

    | ![Tip](./images/tip.gif) | 

    另一个有用的选项是`-0`, 使用**find -print0****grep -lZ**这两种组合方式. 这允许处理包含空白或引号的参数.

    <kbd class="USERINPUT">find / -type f -print0 | xargs -0 grep -liwZ GUI | xargs -0 rm -f</kbd>

    <kbd class="USERINPUT">grep -rliwZ GUI / | xargs -0 rm -f</kbd>

    上边两行都可用来删除任何包含<span class="QUOTE">"GUI"</span>的文件. _(感谢, S.C.)_

     |

    * * *

    **例子 12-5\. Logfile: 使用**xargs**来监控系统log**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 从/var/log/messagesGenerates的尾部开始
      4 # 产生当前目录下的一个lof文件.
      5 
      6 # 注意: 如果这个脚本被一个一般用户调用的话,
      7 # /var/log/messages 必须是全部可读的.
      8 #         #root chmod 644 /var/log/messages
      9 
     10 LINES=5
     11 
     12 ( date; uname -a ) >>logfile
     13 # 时间和机器名
     14 echo --------------------------------------------------------------------- >>logfile
     15 tail -$LINES /var/log/messages | xargs |  fmt -s >>logfile
     16 echo >>logfile
     17 echo >>logfile
     18 
     19 exit 0
     20 
     21 #  注意:
     22 #  -----
     23 #  像 Frank Wang 所指出,
     24 #+ 在原文件中的任何不匹配的引号(包括单引号和双引号)
     25 #+ 都会给xargs造成麻烦.
     26 #                                                                             
     27 #  他建议使用下边的这行来替换上边的第15行:
     28 #     tail -$LINES /var/log/messages | tr -d "\"'" | xargs | fmt -s >>logfile
     29 
     30 
     31 
     32 #  练习:
     33 #  -----
     34 #  修改这个脚本, 使得这个脚本每个20分钟
     35 #+ 就跟踪一下 /var/log/messages 的修改记录.
     36 #  提示: 使用 "watch" 命令. </pre>

     |

    * * *

    [As in find](moreadv.md#CURLYBRACKETSREF), a curly bracket pair serves as a placeholder for replacement text.

    * * *

    **例子 12-6\. 把当前目录下的文件拷贝到另一个文件中**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # copydir.sh
      3 
      4 #  将当前目录下($PWD)的所有文件都拷贝到
      5 #+ 命令行所指定的另一个目录中去.
      6 
      7 E_NOARGS=65
      8 
      9 if [ -z "$1" ]   # 如果没有参数传递进来那就退出.
     10 then
     11   echo "Usage: `basename $0` directory-to-copy-to"
     12   exit $E_NOARGS
     13 fi  
     14 
     15 ls . | xargs -i -t cp ./{} $1
     16 #            ^^ ^^      ^^
     17 #  -t 是 "verbose" (输出命令行到stderr) 选项.
     18 #  -i 是"替换字符串"选项.
     19 #  {} 是输出文本的替换点.
     20 #  这与在"find"命令中使用{}的情况很相像.
     21 #                                                       
     22 #  列出当前目录下的所有文件(ls .),
     23 #+ 将 "ls" 的输出作为参数传递到 "xargs"(-i -t 选项) 中,
     24 #+ 然后拷贝(cp)这些参数({})到一个新目录中($1).
     25 #                                                       
     26 #  最终的结果和下边的命令等价,
     27 #+   cp * $1
     28 #+ 除非有文件名中嵌入了"空白"字符.
     29 
     30 exit 0</pre>

     |

    * * *

    * * *

    **例子 12-7\. 通过名字kill进程**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # kill-byname.sh: 通过名字kill进程.
      3 # 与脚本kill-process.sh相比较.
      4 
      5 #  例如,
      6 #+ 试一下 "./kill-byname.sh xterm" --
      7 #+ 并且查看你系统上的所有xterm都将消失.
      8                                                                
      9 #  警告:
     10 #  -----
     11 #  这是一个非常危险的脚本.
     12 #  运行它的时候一定要小心. (尤其是以root身份运行时)
     13 #+ 因为运行这个脚本可能会引起数据丢失或产生其他一些不好的效果.
     14 
     15 E_BADARGS=66
     16 
     17 if test -z "$1"  # 没有参数传递进来?
     18 then
     19   echo "Usage: `basename $0` Process(es)_to_kill"
     20   exit $E_BADARGS
     21 fi
     22 
     23 
     24 PROCESS_NAME="$1"
     25 ps ax | grep "$PROCESS_NAME" | awk '{print $1}' | xargs -i kill {} 2&>/dev/null
     26 #                                                       ^^      ^^
     27 
     28 # -----------------------------------------------------------
     29 # 注意:
     30 # -i 参数是xargs命令的"替换字符串"选项.
     31 # 大括号对的地方就是替换点.
     32 # 2&>/dev/null 将会丢弃不需要的错误消息.
     33 # -----------------------------------------------------------
     34 
     35 exit $?
     36 
     37 #  在这个脚本中, "killall"命令具有相同的效果, 
     38 #+ 但是这么做就没有教育意义了.</pre>

     |

    * * *

    * * *

    **例子 12-8\. 使用**xargs****分析单词出现的频率****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # wf2.sh: 分析一个文本文件中单词出现的频率. 
      3 
      4 # 使用 'xargs' 将文本行分解为单词.
      5 # 与后边的 "wf.sh" 脚本相比较.
      6 
      7 
      8 # 检查命令行上输入的文件.
      9 ARGS=1
     10 E_BADARGS=65
     11 E_NOFILE=66
     12 
     13 if [ $# -ne "$ARGS" ]
     14 # 纠正传递到脚本中的参数个数?
     15 then
     16   echo "Usage: `basename $0` filename"
     17   exit $E_BADARGS
     18 fi
     19 
     20 if [ ! -f "$1" ]       # 检查文件是否存在.
     21 then
     22   echo "File \"$1\" does not exist."
     23   exit $E_NOFILE
     24 fi
     25 
     26 
     27 
     28 #####################################################################
     29 cat "$1" | xargs -n1 | \
     30 #  列出文件, 每行一个单词.
     31 tr A-Z a-z | \
     32 #  将字符转换为小写.
     33 sed -e 's/\.//g'  -e 's/\,//g' -e 's/ /\
     34 /g' | \
     35 #  过滤掉句号和逗号,
     36 #+ 并且将单词间的空格修改为换行,
     37 sort | uniq -c | sort -nr
     38 #  最后统计出现次数, 把数字显示在第一列, 然后显示单词, 并按数字排序.
     39 #####################################################################
     40 
     41 #  这个例子的作用与"wf.sh"的作用是一样的,
     42 #+ 但是这个例子比较臃肿, 并且运行起来更慢一些(为什么?).
     43 
     44 exit 0</pre>

     |

    * * *

*   <kbd class="USERINPUT">expr</kbd>
*   通用求值表达式: 通过给定的操作(参数必须以空格分开)连接参数, 并对参数求值. 可以使算术操作, 比较操作, 字符串操作或者是逻辑操作.

    *   <kbd class="USERINPUT">expr 3 + 5</kbd>
    *   返回<tt class="LITERAL">8</tt>

    *   <kbd class="USERINPUT">expr 5 % 3</kbd>
    *   返回2

    *   <kbd class="USERINPUT">expr 1 / 0</kbd>
    *   返回错误消息, _expr: division by zero_

        不允许非法的算术操作.

    *   <kbd class="USERINPUT">expr 5 \* 3</kbd>
    *   返回15

        在算术表达式**expr**中使用乘法操作时, 乘法符号必须被转义.

    *   <kbd class="USERINPUT">y=`expr $y + 1`</kbd>
    *   增加变量的值, 与<kbd class="USERINPUT">let y=y+1</kbd>和<kbd class="USERINPUT">y=$(($y+1))</kbd>的效果相同. 这是使用[算术表达式](arithexp.md#ARITHEXPREF)的一个例子.

    *   <kbd class="USERINPUT">z=`expr substr $string $position $length`</kbd>
    *   在位置$position上提取$length长度的子串.

    * * *

    **例子 12-9\. 使用**expr****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 # 展示一些使用'expr'的例子
      4 # ========================
      5 
      6 echo
      7 
      8 # 算术 操作
      9 # ---- ----
     10 
     11 echo "Arithmetic Operators"
     12 echo
     13 a=`expr 5 + 3`
     14 echo "5 + 3 = $a"
     15 
     16 a=`expr $a + 1`
     17 echo
     18 echo "a + 1 = $a"
     19 echo "(incrementing a variable)"
     20 
     21 a=`expr 5 % 3`
     22 # 取模操作
     23 echo
     24 echo "5 mod 3 = $a"
     25 
     26 echo
     27 echo
     28 
     29 # 逻辑 操作
     30 # ---- ----
     31 
     32 #  true返回1, false返回0,
     33 #+ 而Bash的使用惯例则相反.
     34 
     35 echo "Logical Operators"
     36 echo
     37 
     38 x=24
     39 y=25
     40 b=`expr $x = $y`         # 测试相等.
     41 echo "b = $b"            # 0  ( $x -ne $y )
     42 echo
     43 
     44 a=3
     45 b=`expr $a \> 10`
     46 echo 'b=`expr $a \> 10`, therefore...'
     47 echo "If a > 10, b = 0 (false)"
     48 echo "b = $b"            # 0  ( 3 ! -gt 10 )
     49 echo
     50 
     51 b=`expr $a \< 10`
     52 echo "If a < 10, b = 1 (true)"
     53 echo "b = $b"            # 1  ( 3 -lt 10 )
     54 echo
     55 # 注意转义操作.
     56 
     57 b=`expr $a \<= 3`
     58 echo "If a <= 3, b = 1 (true)"
     59 echo "b = $b"            # 1  ( 3 -le 3 )
     60 # 也有 "\>=" 操作 (大于等于).
     61 
     62 
     63 echo
     64 echo
     65 
     66 
     67 
     68 # 字符串 操作
     69 # ------ ----
     70 
     71 echo "String Operators"
     72 echo
     73 
     74 a=1234zipper43231
     75 echo "The string being operated upon is \"$a\"."
     76 
     77 # 长度: 字符串长度
     78 b=`expr length $a`
     79 echo "Length of \"$a\" is $b."
     80 
     81 # 索引: 从字符串的开头查找匹配的子串,
     82 #       并取得第一个匹配子串的位置.
     83 b=`expr index $a 23`
     84 echo "Numerical position of first \"2\" in \"$a\" is \"$b\"."
     85 
     86 # substr: 从指定位置提取指定长度的字串.
     87 b=`expr substr $a 2 6`
     88 echo "Substring of \"$a\", starting at position 2,\
     89 and 6 chars long is \"$b\"."
     90 
     91 
     92 #  'match' 操作的默认行为就是从字符串的开始进行搜索,
     93 #+  并匹配第一个匹配的字符串.
     94 #
     95 #        使用正则表达式
     96 b=`expr match "$a" '[0-9]*'`               #  数字的个数.
     97 echo Number of digits at the beginning of \"$a\" is $b.
     98 b=`expr match "$a" '\([0-9]*\)'`           #  注意, 需要转义括号
     99 #                   ==      ==              + 这样才能触发子串的匹配.
    100 echo "The digits at the beginning of \"$a\" are \"$b\"."
    101 
    102 echo
    103 
    104 exit 0</pre>

     |

    * * *

    | ![Important](./images/important.gif) | 

    [:](special-chars.md#NULLREF)操作可以替换**match**命令. 比如, <kbd class="USERINPUT">b=`expr $a : [0-9]*`</kbd>与上边所使用的<kbd class="USERINPUT">b=`expr match $a [0-9]*`</kbd>完全等价.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 echo
      4 echo "String operations using \"expr \$string : \" construct"
      5 echo "==================================================="
      6 echo
      7 
      8 a=1234zipper5FLIPPER43231
      9 
     10 echo "The string being operated upon is \"`expr "$a" : '\(.*\)'`\"."
     11 #     转义括号对的操作.						            ==  ==
     12 
     13 #       ***************************
     14 #+				转义括号对
     15 #+           用来匹配一个子串
     16 #       ***************************
     17 
     18 
     19 #  如果不转义括号的话...
     20 #+ 那么'expr'将把string操作转换为一个整数.
     21 
     22 echo "Length of \"$a\" is `expr "$a" : '.*'`."   # 字符串长度
     23 
     24 echo "Number of digits at the beginning of \"$a\" is `expr "$a" : '[0-9]*'`."
     25 
     26 # ------------------------------------------------------------------------- #
     27 
     28 echo
     29 
     30 echo "The digits at the beginning of \"$a\" are `expr "$a" : '\([0-9]*\)'`."
     31 #                                                             ==      ==
     32 echo "The first 7 characters of \"$a\" are `expr "$a" : '\(.......\)'`."
     33 #         =====                                          ==       ==
     34 # 再来一个, 转义括号对强制一个子串匹配.
     35 #
     36 echo "The last 7 characters of \"$a\" are `expr "$a" : '.*\(.......\)'`."
     37 #         ====                  字符串操作的结尾		^^
     38 #  (最后这个模式的意思是忽略前边的任何字符,直到最后7个字符,
     39 #+  最后7个点就是需要匹配的任意7个字符的字串)
     40 
     41 echo
     42 
     43 exit 0</pre>

     |

     |

上边的脚本展示了**expr**如何使用_转义括号对-- \( ... \) --_ 和[正则表达式](regexp.md#REGEXREF)一起来分析和匹配子串. 下边是另外一个例子, 这次的例子是真正的<span class="QUOTE">"应用用例"</span>.

| 

<pre class="PROGRAMLISTING">  1 # 去掉字符串开头和结尾的空白. 
  2 LRFDATE=`expr "$LRFDATE" : '[[:space:]]*\(.*\)[[:space:]]*/pre>`
  3 
  4 #  来自于Peter Knowle的"booklistgen.sh"脚本
  5 #+ 用来将文件转换为Sony Librie格式.
  6 #  (http://booklistgensh.peterknowles.com)</pre>

 |

[Perl](wrapper.md#PERLREF), [sed](sedawk.md#SEDREF), 和[awk](awk.md#AWKREF)是更强大的字符串分析工具. 在脚本中加入一段比较短的**sed**或者**awk**<span class="QUOTE">"子程序"</span>(参考[Section 33.2](wrapper.md)), 比使用**expr**更有吸引力.

参考[Section 9.2](string-manipulation.md)可以了解到更多使用**expr**进行字符串操作的例子.

### 注意事项

| [[1]](moreadv.md#AEN7492) | 

即使在某些不必非得强制使用_xargs_的情况下, 使用这个命令也会明显的提高多文件批处理执行命令的速度.

 |
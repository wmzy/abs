# 12.4\. 文本处理命令

**处理文本和文本文件的命令**

*   **sort**
*   文件排序, 通常用在管道中当过滤器来使用. 这个命令可以依据指定的关键字或指定的字符位置, 对文件行进行排序. 使用`-m`选项, 它将会合并预排序的输入文件. 想了解这个命令的全部参数请参考这个命令的_info页_. 请参考[例子 10-9](loops1.md#FINDSTRING), [例子 10-10](loops1.md#SYMLINKS), 和[例子 A-8](contributed-scripts.md#MAKEDICT).

*   **tsort**
*   拓扑排序, 读取以空格分隔的有序对, 并且依靠输入模式进行排序.

*   **uniq**
*   这个过滤器将会删除一个已排序文件中的重复行. 这个命令经常出现在[sort](textproc.md#SORTREF)命令的管道后边.

    | 

    <pre class="PROGRAMLISTING">  1 cat list-1 list-2 list-3 | sort | uniq > final.list
      2 # 将3个文件连接起来,
      3 # 将它们排序,
      4 # 删除其中重复的行,
      5 # 最后将结果重定向到一个文件中. </pre>

     |

    `-c`用来统计每行出现的次数, 并把次数作为前缀放到输出行的前面.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat testfile</kbd>
    <samp class="COMPUTEROUTPUT">This line occurs only once.
     This line occurs twice.
     This line occurs twice.
     This line occurs three times.
     This line occurs three times.
     This line occurs three times.</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">uniq -c testfile</kbd>
     <samp class="COMPUTEROUTPUT">1 This line occurs only once.
           2 This line occurs twice.
           3 This line occurs three times.</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">sort testfile | uniq -c | sort -nr</kbd>
     <samp class="COMPUTEROUTPUT">3 This line occurs three times.
           2 This line occurs twice.
           1 This line occurs only once.</samp>
    	      </pre>

     |

    <kbd class="USERINPUT">sort INPUTFILE | uniq -c | sort -nr</kbd> 命令先对<tt class="FILENAME">INPUTFILE</tt>文件进行排序, 然后统计_每行出现的次数_ (**sort**命令的`-nr`选项会产生一个数字的反转排序). 这种命令模板一般都用来分析log文件或者用来分析字典列表, 或者用在那些需要检查文本词汇结构的地方.

    * * *

    **例子 12-11\. 分析单词出现的频率**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # wf.sh: 分析文本文件中词汇出现的频率. 
      3 # "wf2.sh"脚本是一个效率更高的版本. 
      4 
      5 
      6 # 从命令行中检查输入的文件. 
      7 ARGS=1
      8 E_BADARGS=65
      9 E_NOFILE=66
     10 
     11 if [ $# -ne "$ARGS" ]  # 检验传递到脚本中参数的个数. 
     12 then
     13   echo "Usage: `basename $0` filename"
     14   exit $E_BADARGS
     15 fi
     16 
     17 if [ ! -f "$1" ]       # 检查传入的文件是否存在. 
     18 then
     19   echo "File \"$1\" does not exist."
     20   exit $E_NOFILE
     21 fi
     22 
     23 
     24 
     25 ########################################################
     26 # main ()
     27 sed -e 's/\.//g'  -e 's/\,//g' -e 's/ /\
     28 /g' "$1" | tr 'A-Z' 'a-z' | sort | uniq -c | sort -nr
     29 #                           =========================
     30 #                              检查单词出现的频率
     31 
     32 #  过滤掉句号和逗号, 
     33 #+ 并且把单词间的空格转化为换行, 
     34 #+ 然后转化为小写, 
     35 #+ 最后统计单词出现的频率并按频率排序. 
     36 
     37 #  Arun Giridhar建议将上边的代码修改为: 
     38 #  . . . | sort | uniq -c | sort +1 [-f] | sort +0 -nr
     39 #  这句添加了第2个排序主键, 所以
     40 #+ 这个与上边等价的例子将按照字母顺序进行排序.
     41 #  就像他所解释的:
     42 #  "这是一个有效的根排序, 首先对频率最少的
     43 #+ 列进行排序
     44 #+ (单词或者字符串, 忽略大小写)
     45 #+ 然后对频率最高的列进行排序."
     46 #
     47 #  像Frank Wang所解释的那样, 上边的代码等价于: 
     48 #+       . . . | sort | uniq -c | sort +0 -nr
     49 #+ 用下边这行也行: 
     50 #+       . . . | sort | uniq -c | sort -k1nr -k
     51 ########################################################
     52 
     53 exit 0
     54 
     55 # 练习:
     56 # -----
     57 # 1) 使用'sed'命令来过滤其他的标点符号,
     58 #+   比如分号. 
     59 # 2) 修改这个脚本, 添加能够过滤多个空格或者
     60 #    空白的能力. </pre>

     |

    * * *

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat testfile</kbd>
    <samp class="COMPUTEROUTPUT">This line occurs only once.
     This line occurs twice.
     This line occurs twice.
     This line occurs three times.
     This line occurs three times.
     This line occurs three times.</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">./wf.sh testfile</kbd>
     <samp class="COMPUTEROUTPUT">6 this
           6 occurs
           6 line
           3 times
           3 three
           2 twice
           1 only
           1 once</samp>
    	       </pre>

     |

*   **expand**, **unexpand**
*   **expand**命令将会把每个tab转化为一个空格. 这个命令经常用在管道中.

    **unexpand**命令将会把每个空格转化为一个tab. 效果与**expand**命令相反.

*   **cut**
*   一个从文件中提取特定域的工具. 这个命令与[awk](awk.md#AWKREF)中使用的<kbd class="USERINPUT">print $N</kbd>命令很相似, 但是更受限. 在脚本中使用**cut**命令会比使用**awk**命令来得容易一些. 最重要的选项就是`-d`(字段定界符)和`-f`(域分隔符)选项.

    使用**cut**来获得所有mount上的文件系统的列表:

    | 

    <pre class="PROGRAMLISTING">  1 cut -d ' ' -f1,2 /etc/mtab</pre>

     |

    使用**cut**命令列出OS和内核版本:

    | 

    <pre class="PROGRAMLISTING">  1 uname -a | cut -d" " -f1,3,11,12</pre>

     |

    使用**cut**命令从e-mail中提取消息头:

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep '^Subject:' read-messages | cut -c10-80</kbd>
    <samp class="COMPUTEROUTPUT">Re: Linux suitable for mission-critical apps?
     MAKE MILLIONS WORKING AT HOME!!!
     Spam complaint
     Re: Spam complaint</samp></pre>

     |

    使用**cut**命令来分析一个文件:

    | 

    <pre class="PROGRAMLISTING">  1 # 列出所有在/etc/passwd中的用户. 
      2 
      3 FILENAME=/etc/passwd
      4 
      5 for user in $(cut -d: -f1 $FILENAME)
      6 do
      7   echo $user
      8 done
      9 
     10 # 感谢Oleg Philon对此的建议. </pre>

     |

    <kbd class="USERINPUT">cut -d ' ' -f2,3 filename</kbd>等价于<kbd class="USERINPUT">awk -F'[ ]' '{ print $2, $3 }' filename</kbd>

    | ![Note](./images/note.gif) | 

    你甚至可以指定换行符作为字段定界符. 这个小伎俩实际上就是在命令行上插入一个换行(**RETURN**). (译者: linux使用lf作为换行符).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cut -d'
     ' -f3,7,19 testfile</kbd>
    <samp class="COMPUTEROUTPUT">This is line 3 of testfile.
     This is line 7 of testfile.
     This is line 19 of testfile.</samp>
    	      </pre>

     |

    感谢, Jaka Kranjc指出这点.

     |

    请参考[例子 12-43](mathc.md#BASE).

*   **paste**
*   将多个文件, 以每个文件一列的形式合并到一个文件中, 合并后文件中的每一列就是原来的一个文件. 与**cut**结合使用, 经常用于创建系统log文件.

*   **join**
*   这个命令与**paste**命令属于同类命令. 但是它能够完成某些特殊的目地. 这个强力工具能够以一种特殊的形式来合并两个文件, 这种特殊的形式本质上就是一个关联数据库的简单版本.

    **join**命令只能够操作两个文件. 它可以将那些具有特定标记域(通常是一个数字标签)的行合并起来, 并且将结果输出到<tt class="FILENAME">stdout</tt>. 被加入的文件应该事先根据标记域进行排序以便于能够正确的匹配.

    | 

    <pre class="PROGRAMLISTING">  1 File: 1.data
      2 
      3 100 Shoes
      4 200 Laces
      5 300 Socks</pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 File: 2.data
      2 
      3 100 $40.00
      4 200 $1.00
      5 300 $2.00</pre>

     |

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">join 1.data 2.data</kbd>
    <samp class="COMPUTEROUTPUT">File: 1.data 2.data

     100 Shoes $40.00
     200 Laces $1.00
     300 Socks $2.00</samp>
    	      </pre>

     |

    | ![Note](./images/note.gif) | 

    在输出中标记域将只会出现一次.

     |

*   **head**
*   把文件的头部内容打印到<tt class="FILENAME">stdout</tt>上(默认为<tt class="LITERAL">10</tt>行, 可以自己修改). 这个命令有一些比较有趣的选项.

    * * *

    **例子 12-12\. 哪个文件是脚本?**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # script-detector.sh: 在一个目录中检查所有的脚本文件. 
      3 
      4 TESTCHARS=2    # 测试前两个字符.
      5 SHABANG='#!'   # 脚本都是以"#!"开头的. 
      6 
      7 for file in *  # 遍历当前目录下的所有文件. 
      8 do
      9   if [[ `head -c$TESTCHARS "$file"` = "$SHABANG" ]]
     10   #      head -c2                      #!
     11   #  '-c' 选项将从文件头输出指定个数的字符, 
     12   #+ 而不是默认的行数. 
     13   then
     14     echo "File \"$file\" is a script."
     15   else
     16     echo "File \"$file\" is *not* a script."
     17   fi
     18 done
     19   
     20 exit 0
     21 
     22 #  练习:
     23 #  -----
     24 #  1) 修改这个脚本, 
     25 #+    让它可以指定扫描的路径. 
     26 #+    (而不是只搜索当前目录). 
     27 #
     28 #  2) 以这个脚本目前的状况, 它不能正确识别出
     29 #+    Perl, awk, 和其他一些脚本语言的脚本文件.
     30 #     修正这个问题.</pre>

     |

    * * *

    * * *

    **例子 12-13\. 产生10-进制随机数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # rnd.sh: 输出一个10进制随机数
      3 
      4 # 由Stephane Chazelas所编写的这个脚本.
      5 
      6 head -c4 /dev/urandom | od -N4 -tu4 | sed -ne '1s/.* //p'
      7 
      8 
      9 # =================================================================== #
     10 
     11 # 分析
     12 # ----
     13 
     14 # head:
     15 # -c4 选项将取得前4个字节.
     16                                                
     17 # od:
     18 # -N4 选项将限制输出为4个字节.
     19 # -tu4 选项将使用无符号10进制格式来输出.
     20                                                
     21 # sed: 
     22 # -n 选项, 使用"s"命令与"p"标志组合的方式,
     23 # 将会只输出匹配的行.
     24                                                
     25                                                
     26                                                
     27 # 本脚本作者解释'sed'命令的行为如下.
     28 
     29 # head -c4 /dev/urandom | od -N4 -tu4 | sed -ne '1s/.* //p'
     30 # ----------------------------------> |
     31 
     32 # 假设一直处理到"sed"命令时的输出--> |
     33 # 为 0000000 1198195154\n
     34                                                                                   
     35 #  sed命令开始读取字串: 0000000 1198195154\n.
     36 #  这里它发现一个换行符,
     37 #+ 所以sed准备处理第一行 (0000000 1198195154).
     38 #  sed命令开始匹配它的<range>和<action>. 第一个匹配的并且只有这一个匹配的:
     39                                                                                   
     40 #   range     action
     41 #   1         s/.* //p
     42                                                                                   
     43 #  因为行号在range中, 所以sed开始执行action:
     44 #+ 替换掉以空格结束的最长的字符串, 在这行中这个字符串是
     45 #  ("0000000 "), 用空字符串(//)将这个匹配到的字串替换掉, 如果成功, 那就打印出结果
     46 #  ("p"在这里是"s"命令的标志, 这与单独的"p"命令是不同的).
     47                                                                                   
     48 #  sed命令现在开始继续读取输入. (注意在继续之前, 
     49 #+ continuing, 如果没使用-n选项的话, sed命令将再次
     50 #+ 将这行打印一遍).
     51                                                                                   
     52 # 现在, sed命令读取剩余的字符串, 并且找到文件的结尾.
     53 # sed命令开始处理第2行(这行也被标记为'/pre>
     54 # 因为这已经是最后一行).
     55 # 所以这行没被匹配到<range>中, 这样sed命令就结束了.
     56                                                                                   
     57 #  这个sed命令的简短的解释是:
     58 #  "在第一行中删除第一个空格左边全部的字符,
     59 #+ 然后打印出来."
     60                                                                                   
     61 # 一个更好的来达到这个目的的方法是:
     62 #           sed -e 's/.* //;q'
     63                                                                                   
     64 # 这里, <range>和<action>分别是(也可以写成
     65 #           sed -e 's/.* //' -e q):
     66                                                                                   
     67 #   range                    action
     68 #   nothing (matches line)   s/.* //
     69 #   nothing (matches line)   q (quit)
     70                                                                                   
     71 #  这里, sed命令只会读取第一行的输入.
     72 #  将会执行2个命令, 并且会在退出之前打印出(已经替换过的)这行(因为"q" action),
     73 #+ 因为没使用"-n"选项.
     74                                                                                   
     75 # =================================================================== #
     76                                                                                   
     77 # 也可以使用如下一个更简单的语句来代替:
     78 #           head -c4 /dev/urandom| od -An -tu4
     79 
     80 exit 0</pre>

     |

    * * *

    请参考[例子 12-35](filearchiv.md#EX52).
*   **tail**
*   将一个文件结尾部分的内容输出到<tt class="FILENAME">stdout</tt>中(默认为<tt class="LITERAL">10</tt>行). 通常用来跟踪一个系统logfile的修改情况, 如果使用`-f`选项的话, 这个命令将会继续显示添加到文件中的行.

    * * *

    **例子 12-14\. 使用**tail**命令来监控系统log**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 filename=sys.log
      4 
      5 cat /dev/null > $filename; echo "Creating / cleaning out file."
      6 #  如果文件不存在的话就创建文件,
      7 #+ 然后将这个文件清空.
      8 #  : > filename   和   > filename 也能完成这个工作.
      9 
     10 tail /var/log/messages > $filename  
     11 # /var/log/messages 必须具有全局的可读权限才行. 
     12 
     13 echo "$filename contains tail end of system log."
     14 
     15 exit 0</pre>

     |

    * * *

    | ![Tip](./images/tip.gif) | 

    为了列出一个文本文件中的指定行的内容, 可以将**head**命令的输出通过[管道](special-chars.md#PIPEREF)传递到**tail -1**中. 比如<kbd class="USERINPUT">head -8 database.txt | tail -1</kbd>将会列出<tt class="FILENAME">database.txt</tt>文件第8行的内容.

    下边是将一个文本文件中指定范围的所有行都保存到一个变量中:

    | 

    <pre class="PROGRAMLISTING">  1 var=$(head -$m $filename | tail -$n)
      2 
      3 # filename = 文件名
      4 # m = 从文件开头到块结尾的行数
      5 # n = 想保存到变量中的指定行数(从块结尾开始截断)</pre>

     |

     |

    请参考[例子 12-5](moreadv.md#EX41), [例子 12-35](filearchiv.md#EX52)和[例子 29-6](debugging.md#ONLINE).

*   **grep**
*   使用[正则表达式](regexp.md#REGEXREF)的一个多用途文本搜索工具. 这个命令本来是**ed**行编辑器中的一个命令/过滤器: <kbd class="USERINPUT">g/re/p</kbd> -- _global - regular expression - print_.

    **grep** <tt class="REPLACEABLE">_pattern_</tt> [<tt class="REPLACEABLE">_file_</tt>...]

    在文件中搜索所有<tt class="REPLACEABLE">_pattern_</tt>出现的位置, <tt class="REPLACEABLE">_pattern_</tt>既可以是要搜索的字符串, 也可以是一个正则表达式.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep '[rst]ystem./kbd> osinfo.txt</kbd>
    <samp class="COMPUTEROUTPUT">The GPL governs the distribution of the Linux operating system.</samp>
    	      </pre>

     |

    如果没有指定文件参数, **grep**通常用在[管道](special-chars.md#PIPEREF)中对<tt class="FILENAME">stdout</tt>进行过滤.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ps ax | grep clock</kbd>
    <samp class="COMPUTEROUTPUT">765 tty1     S      0:00 xclock
     901 pts/1    S      0:00 grep clock</samp>
    	      </pre>

     |

    `-i` 选项在搜索时忽略大小写.

    `-w` 选项用来匹配整个单词.

    `-l` 选项仅列出符合匹配的文件, 而不列出匹配行.

    `-r` (递归) 选项不仅在当前工作目录下搜索匹配, 而且搜索子目录.

    `-n` 选项列出所有匹配行, 并显示行号.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep -n Linux osinfo.txt</kbd>
    <samp class="COMPUTEROUTPUT">2:This is a file containing information about Linux.
     6:The GPL governs the distribution of the Linux operating system.</samp>
    	      </pre>

     |

    `-v` (或者`--invert-match`)选项将会显示所有_不匹配的行_.

    | 

    <pre class="PROGRAMLISTING">  1 grep pattern1 *.txt | grep -v pattern2
      2 
      3 # 匹配在"*.txt"中所有包含 "pattern1"的行, 
      4 # 而***不显示***匹配包含"pattern2"的行.	      </pre>

     |

    `-c` (`--count`) 选项将只会显示匹配到的行数的总数,而不会列出具体的匹配.

    | 

    <pre class="PROGRAMLISTING">  1 grep -c txt *.sgml   # (在 "*.sgml" 文件中, 匹配"txt"的行数的总数.)
      2 
      3 
      4 #   grep -cz .
      5 #            ^ 点
      6 # 意思是计数 (-c) 所有以空字符分割(-z) 的匹配 "."的项
      7 # "."是正则表达式的一个符号, 表达匹配任意一个非空字符(至少要包含一个字符).
      8 # 
      9 printf 'a b\nc  d\n\n\n\n\n\000\n\000e\000\000\nf' | grep -cz .     # 3
     10 printf 'a b\nc  d\n\n\n\n\n\000\n\000e\000\000\nf' | grep -cz '/pre>   # 5
     11 printf 'a b\nc  d\n\n\n\n\n\000\n\000e\000\000\nf' | grep -cz '^'   # 5
     12 #
     13 printf 'a b\nc  d\n\n\n\n\n\000\n\000e\000\000\nf' | grep -c '/pre>    # 9
     14 # 默认情况下, 是使用换行符(\n)来分隔匹配项.
     15 
     16 # 注意  -z 选项是 GNU "grep" 特定的选项.
     17 
     18 
     19 # 感谢, S.C.</pre>

     |

    当有多个文件参数的时候, **grep**将会指出哪个文件中包含具体的匹配.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep Linux osinfo.txt misc.txt</kbd>
    <samp class="COMPUTEROUTPUT">osinfo.txt:This is a file containing information about Linux.
     osinfo.txt:The GPL governs the distribution of the Linux operating system.
     misc.txt:The Linux operating system is steadily gaining in popularity.</samp>
    	      </pre>

     |

    | ![Tip](./images/tip.gif) | 

    如果在**grep**命令只搜索一个文件的时候, 那么可以简单的把<tt class="FILENAME">/dev/null</tt>作为第二个文件参数传递给**grep**.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep Linux osinfo.txt /dev/null</kbd>
    <samp class="COMPUTEROUTPUT">osinfo.txt:This is a file containing information about Linux.
     osinfo.txt:The GPL governs the distribution of the Linux operating system.</samp>
    	      </pre>

     |

     |

    如果存在一个成功的匹配, 那么**grep**命令将会返回0作为[退出状态码](exit-status.md#EXITSTATUSREF), 这样就可以将**grep**命令的结果放在脚本的条件测试中来使用, 尤其和`-q`(禁止输出)选项组合时特别有用.

    | 

    <pre class="PROGRAMLISTING">  1 SUCCESS=0                      # 如果grep匹配成功
      2 word=Linux
      3 filename=data.file
      4 
      5 grep -q "$word" "$filename"    # "-q"选项将使得什么都不输出到stdout上.
      6 
      7 if [ $? -eq $SUCCESS ]
      8 # if grep -q "$word" "$filename"   这句话可以代替行 5 - 7.
      9 then
     10   echo "$word found in $filename"
     11 else
     12   echo "$word not found in $filename"
     13 fi</pre>

     |

    [例子 29-6](debugging.md#ONLINE)展示了如何使用**grep**命令在一个系统logfile中进行一个单词的模式匹配.

    * * *

    **例子 12-15\. 在脚本中模拟<span class="QUOTE">"grep"</span>的行为**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # grp.sh: 一个非常粗糙的'grep'命令的实现. 
      3 
      4 E_BADARGS=65
      5 
      6 if [ -z "$1" ]    # 检查传递给脚本的参数. 
      7 then
      8   echo "Usage: `basename $0` pattern"
      9   exit $E_BADARGS
     10 fi  
     11 
     12 echo
     13 
     14 for file in *     # 遍历$PWD下的所有文件.
     15 do
     16   output=$(sed -n /"$1"/p $file)  # 命令替换.
     17 
     18   if [ ! -z "$output" ]           # 如果"$output"不加双引号将会发生什么?
     19   then
     20     echo -n "$file: "
     21     echo $output
     22   fi              #  sed -ne "/$1/s|^|${file}: |p"  这句与上边这段等价. 
     23 
     24   echo
     25 done  
     26 
     27 echo
     28 
     29 exit 0
     30 
     31 # 练习:
     32 # -----
     33 # 1) 在任何给定的文件中,如果有超过一个匹配的话, 在输出中添加新行. 
     34 # 2) 添加一些特征. </pre>

     |

    * * *

    如何使用**grep**命令来搜索两个(或两个以上)独立的模式? 如果你想在一个或多个文件中显示既匹配<span class="QUOTE">"pattern1"</span>_又匹配_<span class="QUOTE">"pattern2"</span>的所有匹配的话, 那又该如何做呢? (译者: 这是取交集的情况, 如果取并集该怎么办呢?)

    一个方法是通过[管道](special-chars.md#PIPEREF)来将**grep pattern1**的结果传递到**grep pattern2**中.

    比如, 给定如下文件:

    | 

    <pre class="PROGRAMLISTING">  1 # 文件名: tstfile
      2 
      3 This is a sample file.
      4 This is an ordinary text file.
      5 This file does not contain any unusual text.
      6 This file is not unusual.
      7 Here is some text.</pre>

     |

    现在, 让我们在这个文件中搜索_既_包含 <span class="QUOTE">"file"</span>_又_包含<span class="QUOTE">"text"</span>的所有行.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep file tstfile</kbd>
    <samp class="COMPUTEROUTPUT"># 文件名: tstfile
     This is a sample file.
     This is an ordinary text file.
     This file does not contain any unusual text.
     This file is not unusual.</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep file tstfile | grep text</kbd>
    <samp class="COMPUTEROUTPUT">This is an ordinary text file.
     This file does not contain any unusual text.</samp></pre>

     |

    --

    **egrep** - _扩展的grep_ - 这个命令与**grep -E**等价. 这个命令用起来有些不同, 由于使用[正则表达式](regexp.md#REGEXREF)的扩展集合, 将会使得搜索更具灵活性. 它也允许逻辑|(_或_)操作.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash $</samp> <kbd class="USERINPUT">egrep 'matches|Matches' file.txt</kbd>
    <samp class="COMPUTEROUTPUT">Line 1 matches.
     Line 3 Matches.
     Line 4 contains matches, but also Matches</samp>
                  </pre>

     |

    **fgrep** - _快速的grep_ - 这个命令与**grep -F**等价. 这是一种按照字符串字面意思进行的搜索(即不允许使用正则表达式), 这样有时候会使搜索变得容易一些.

    | ![Note](./images/note.gif) | 

    在某些Linux发行版中, **egrep**和**fgrep**都是**grep**命令的符号链接或者别名, 只不过在调用的时候分别使用了`-E`和`-F`选项罢了.

     |

    * * *

    **例子 12-16\. 在_1913年的韦氏词典_中查找定义**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # dict-lookup.sh
      3 
      4 #  这个脚本在1913年的韦氏词典中查找定义.
      5 #  这本公共词典可以通过不同的
      6 #+ 站点来下载,包括
      7 #+ Project Gutenberg (http://www.gutenberg.org/etext/247).
      8 #                                                                  
      9 #  在使用本脚本之前,
     10 #+ 先要将这本字典由DOS格式转换为UNIX格式(只以LF作为行结束符).
     11 #  将这个文件存储为纯文本形式, 并且保证是未压缩的ASCII格式.
     12 #  将DEFAULT_DICTFILE变量以path/filename形式设置好.
     13 
     14 
     15 E_BADARGS=65
     16 MAXCONTEXTLINES=50                        # 显示的最大行数. 
     17 DEFAULT_DICTFILE="/usr/share/dict/webster1913-dict.txt"
     18                                           # 默认的路径和文件名.
     19                                           # 在必要的时候可以进行修改.
     20 #  注意:
     21 #  -----
     22 #  这个特定的1913年版的韦氏词典
     23 #+ 在每个入口都是以大写字母开头的
     24 #+ (剩余的字符都是小写).
     25 #  只有每部分的第一行是以这种形式开始的,
     26 #+ 这也就是为什么搜索算法是下边的这个样子.
     27 
     28 
     29 
     30 if [[ -z $(echo "$1" | sed -n '/^[A-Z]/p') ]]
     31 #  必须指定一个要查找的单词,
     32 #+ 并且这个单词必须以大写字母开头.
     33 then
     34   echo "Usage: `basename $0` Word-to-define [dictionary-file]"
     35   echo
     36   echo "Note: Word to look up must start with capital letter,"
     37   echo "with the rest of the word in lowercase."
     38   echo "--------------------------------------------"
     39   echo "Examples: Abandon, Dictionary, Marking, etc."
     40   exit $E_BADARGS
     41 fi
     42 
     43 
     44 if [ -z "$2" ]                            #  也可以指定不同的词典
     45                                           #+ 作为这个脚本的第2个参数传递进来.
     46 then
     47   dictfile=$DEFAULT_DICTFILE
     48 else
     49   dictfile="$2"
     50 fi
     51 
     52 # ---------------------------------------------------------
     53 Definition=$(fgrep -A $MAXCONTEXTLINES "$1 \\" "$dictfile")
     54 #                                   以 "Word \..." 这种形式定义
     55 #                                                               
     56 #  当然, 即使搜索一个特别大的文本文件的时候
     57 #+ "fgrep"也是足够快的.
     58 
     59 
     60 # 现在, 剪掉定义块.
     61 
     62 echo "$Definition" |
     63 sed -n '1,/^[A-Z]/p' |
     64 #  从输出的第一行
     65 #+ 打印到下一部分的第一行.
     66 sed '$d' | sed '$d'
     67 #  删除输出的最后两行
     68 #+ (空行和下一部分的第一行).
     69 # ---------------------------------------------------------
     70 
     71 exit 0
     72 
     73 # 练习:
     74 # -----
     75 # 1)  修改这个脚本, 让它具备能够处理任何字符形式的输入
     76 #   + (大写, 小写, 或大小写混合), 然后将其转换为
     77 #   + 能够处理的统一形式.
     78 #                                                       
     79 # 2)  将这个脚本转化为一个GUI应用,
     80 #   + 使用一些比如像"gdialog"的东西 .  .  .
     81 #     这样的话, 脚本将不再从命令行中
     82 #   + 取得这些参数.
     83 #                                                       
     84 # 3)  修改这个脚本让它具备能够分析另外一个
     85 #   + 公共词典的能力, 比如 U.S. Census Bureau Gazetteer.</pre>

     |

    * * *

    **agrep** (_近似grep_)扩展了**grep**近似匹配的能力. 搜索的字符串可能会与最终匹配结果所找到字符串有些不同. 这个工具并不是核心Linux发行版的一部分.

    | ![Tip](./images/tip.gif) | 

    为了搜索压缩文件, 应使用**zgrep**, **zegrep**, 或**zfgrep**. 这些命令也可以对未压缩的文件进行搜索, 只不过会比一般的**grep**, **egrep**, 和**fgrep**慢上一些. 当然, 在你要搜索的文件中如果混合了压缩和未压缩的文件的话, 那么使用这些命令是非常方便的.

    如果要搜索[bzipped](filearchiv.md#BZIPREF)类型的文件, 使用**bzgrep**.

     |

*   **look**
*   **look**命令与**grep**命令很相似, 但是这个命令只能做<span class="QUOTE">"字典查询"</span>, 也就是它所搜索的文件必须是已经排过序的单词列表. 默认情况下, 如果没有指定搜索哪个文件, **look**命令就默认搜索<tt class="FILENAME">/usr/dict/words</tt>(译者: 感觉好像应该是<tt class="FILENAME">/usr/share/dict/words</tt>), 当然也可以指定其他目录下的文件进行搜索.

    * * *

    **例子 12-17\. 检查列表中单词的正确性**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # lookup: 对指定数据文件中的每个单词都做一遍字典查询. 
      3 
      4 file=words.data  # 指定的要搜索的数据文件. 
      5 
      6 echo
      7 
      8 while [ "$word" != end ]  # 数据文件中最后一个单词. 
      9 do
     10   read word      # 从数据文件中读, 因为在循环的后边重定向了. 
     11   look $word > /dev/null  # 不想将字典文件中的行显示出来.
     12   lookup=$?      # 'look'命令的退出状态. 
     13 
     14   if [ "$lookup" -eq 0 ]
     15   then
     16     echo "\"$word\" is valid."
     17   else
     18     echo "\"$word\" is invalid."
     19   fi  
     20 
     21 done <"$file"    # 将stdin重定向到$file, 所以"reads"来自于$file.
     22 
     23 echo
     24 
     25 exit 0
     26 
     27 # ----------------------------------------------------------------
     28 # 下边的代码行将不会执行, 因为上边已经有"exit"命令了.
     29 
     30 
     31 # Stephane Chazelas建议使用下边更简洁的方法:
     32 
     33 while read word && [[ $word != end ]]
     34 do if look "$word" > /dev/null
     35    then echo "\"$word\" is valid."
     36    else echo "\"$word\" is invalid."
     37    fi
     38 done <"$file"
     39 
     40 exit 0</pre>

     |

    * * *

*   **sed**, **awk**
*   这个两个命令都是独立的脚本语言, 尤其适合分析文本文件和命令输出. 既可以单独使用, 也可以结合管道和在shell脚本中使用.

*   **[sed](sedawk.md#SEDREF)**
*   非交互式的<span class="QUOTE">"流编辑器"</span>, 在批处理模式下, 允许使用多个**ex**命令. 你会发现它在shell脚本中非常有用.

*   **[awk](awk.md#AWKREF)**
*   可编程的文件提取器和文件格式化工具, 在结构化的文本文件中, 处理或提取特定域(特定列)具有非常好的表现. 它的语法与C语言很类似.

*   **wc**
*   _wc_可以统计文件或I/O流中的<span class="QUOTE">"单词数量"</span>:

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash $</samp> <kbd class="USERINPUT">wc /usr/share/doc/sed-4.1.2/README</kbd>
    <samp class="COMPUTEROUTPUT">13  70  447 README</samp>
    [13 lines  70 words  447 characters]</pre>

     |

    <kbd class="USERINPUT">wc -w</kbd> 统计单词数量.

    <kbd class="USERINPUT">wc -l</kbd> 统计行数量.

    <kbd class="USERINPUT">wc -c</kbd> 统计字节数量.

    <kbd class="USERINPUT">wc -m</kbd> 统计字符数量.

    <kbd class="USERINPUT">wc -L</kbd> 给出文件中最长行的长度.

    使用**wc**命令来统计当前工作目录下有多少个_.txt_文件:

    | 

    <pre class="PROGRAMLISTING">  1 $ ls *.txt | wc -l
      2 # 因为列出的文件名都是以换行符区分的, 所以使用-l来统计.
      3 
      4 
      5 # 另一种方法:
      6 #      find . -maxdepth 1 -name \*.txt -print0 | grep -cz .
      7 #      (shopt -s nullglob; set -- *.txt; echo $#)
      8 
      9 # 感谢, S.C.</pre>

     |

    **wc**命令来统计所有以 d - h 开头的文件的大小.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">wc [d-h]* | grep total | awk '{print $3}'</kbd>
    <samp class="COMPUTEROUTPUT">71832</samp>
    	      </pre>

     |

    使用**wc**命令来查看指定文件中包含<span class="QUOTE">"Linux"</span>的行一共有多少.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep Linux abs-book.sgml | wc -l</kbd>
    <samp class="COMPUTEROUTPUT">50</samp>
    	      </pre>

     |

    请参考[例子 12-35](filearchiv.md#EX52)和[例子 16-8](redircb.md#REDIR4).

    某些命令的某些选项其实已经包含了**wc**命令的部分功能.

    | 

    <pre class="PROGRAMLISTING">  1 ... | grep foo | wc -l
      2 # 这个命令使用的非常频繁, 但事实上它有更简便的写法.
      3 
      4 ... | grep -c foo
      5 # 只要使用grep命令的"-c"(或"--count")选项就能达到同样的目的.
      6 
      7 # 感谢, S.C.</pre>

     |

*   **tr**
*   字符转换过滤器.

    | ![Caution](./images/caution.gif) | 

    [必须使用引用或中括号](special-chars.md#UCREF), 这样做才是合理的. 引用可以阻止shell重新解释出现在**tr**命令序列中的特殊字符. 中括号应该被引用起来防止被shell扩展.

     |

    无论<kbd class="USERINPUT">tr "A-Z" "*" <filename</kbd>还是<kbd class="USERINPUT">tr A-Z \* <filename</kbd>都可以将<tt class="FILENAME">filename</tt>中的大写字符修改为星号(写到<tt class="FILENAME">stdout</tt>). 但是在某些系统上可能就不能正常工作了, 而<kbd class="USERINPUT">tr A-Z '[**]'</kbd>在任何系统上都可以正常工作.

    `-d`选项删除指定范围的字符.

    | 

    <pre class="PROGRAMLISTING">  1 echo "abcdef"                 # abcdef
      2 echo "abcdef" | tr -d b-d     # aef
      3 
      4 
      5 tr -d 0-9 <filename
      6 # 删除"filename"中所有的数字. </pre>

     |

    `--squeeze-repeats` (或`-s`)选项用来在重复字符序列中除去除第一个字符以外的所有字符. 这个选项在删除多余[空白](special-chars.md#WHITESPACEREF)的时候非常有用.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo "XXXXX" | tr --squeeze-repeats 'X'</kbd>
    <samp class="COMPUTEROUTPUT">X</samp></pre>

     |

    `-c`<span class="QUOTE">"complement"</span>选项将会_反转_匹配的字符集. 通过这个选项, **tr**将只会对那些_不_匹配的字符起作用.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo "acfdeb123" | tr -c b-d +</kbd>
    <samp class="COMPUTEROUTPUT">+c+d+b++++</samp></pre>

     |

    注意**tr**命令支持[POSIX字符类](x13673.md#POSIXREF). [[1]](#FTN.AEN8402)

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo "abcd2ef1" | tr '[:alpha:]' -</kbd>
    <samp class="COMPUTEROUTPUT">----2--1</samp>
    	      </pre>

     |

    * * *

    **例子 12-18\. **转换大写**: 把一个文件的内容全部转换为大写.**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 把一个文件的内容全部转换为大写. 
      3 
      4 E_BADARGS=65
      5 
      6 if [ -z "$1" ]  # 检查命令行参数.
      7 then
      8   echo "Usage: `basename $0` filename"
      9   exit $E_BADARGS
     10 fi  
     11 
     12 tr a-z A-Z <"$1"
     13 
     14 # 与上边的作用相同, 但是使用了POSIX字符集标记方法:
     15 #        tr '[:lower:]' '[:upper:]' <"$1"
     16 # 感谢, S.C.
     17 
     18 exit 0
     19 
     20 #  练习:
     21 #  重写这个脚本, 通过选项可以控制脚本或者
     22 #+ 转换为大写或者转换为小写.</pre>

     |

    * * *

    * * *

    **例子 12-19\. **转换小写**: 将当前目录下的所有文全部转换为小写.**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 #
      3 #  将当前目录下的所有文全部转换为小写. 
      4 #                                      
      5 #  灵感来自于John Dubois的脚本, 
      6 #+ Chet Ramey将其转换为Bash脚本, 
      7 #+ 然后被本书作者精简了一下. 
      8 
      9 
     10 for filename in *                # 遍历当前目录下的所有文件. 
     11 do                                                                         
     12    fname=`basename $filename`                                              
     13    n=`echo $fname | tr A-Z a-z`  # 将名字修改为小写. 
     14    if [ "$fname" != "$n" ]       # 只对那些文件名不是小写的文件进行重命名. 
     15    then
     16      mv $fname $n
     17    fi  
     18 done   
     19 
     20 exit $?
     21 
     22 
     23 # 下边的代码将不会被执行, 因为上边的"exit". 
     24 #-------------------------------------------#
     25 # 删除上边的内容, 来运行下边的内容. 
     26                                                                 
     27 # 对于那些文件名中包含空白和新行的文件, 上边的脚本就不能工作了. 
     28 # Stephane Chazelas因此建议使用下边的方法: 
     29 
     30 
     31 for filename in *    # 不必非得使用basename命令, 
     32                      # 因为"*"不会返回任何包含"/"的文件. 
     33 do n=`echo "$filename/" | tr '[:upper:]' '[:lower:]'`
     34 #                             POSIX 字符集标记法.
     35 #                    添加的斜线是为了在文件名结尾换行不会被
     36 #                    命令替换删掉. 
     37    # 变量替换:
     38    n=${n%/}          # 从文件名中将上边添加在结尾的斜线删除掉. 
     39    [[ $filename == $n ]] || mv "$filename" "$n"
     40                      # 检查文件名是否已经是小写. 
     41 done
     42 
     43 exit $?</pre>

     |

    * * *

    * * *

    **例子 12-20\. **Du**: DOS到UNIX文本文件的转换.**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # Du.sh: DOS到UNIX文本文件的转换.
      3 
      4 E_WRONGARGS=65
      5 
      6 if [ -z "$1" ]
      7 then
      8   echo "Usage: `basename $0` filename-to-convert"
      9   exit $E_WRONGARGS
     10 fi
     11 
     12 NEWFILENAME=$1.unx
     13 
     14 CR='\015'  # 回车.
     15            # 015是8进制的ASCII码的回车.
     16            # DOS中文本文件的行结束符是CR-LF.
     17            # UNIX中文本文件的行结束符只是LF.
     18 
     19 tr -d $CR < $1 > $NEWFILENAME
     20 # 删除回车并且写到新文件中. 
     21 
     22 echo "Original DOS text file is \"$1\"."
     23 echo "Converted UNIX text file is \"$NEWFILENAME\"."
     24 
     25 exit 0
     26 
     27 # 练习:
     28 # -----
     29 # 修改上边的脚本完成从UNIX到DOS的转换. </pre>

     |

    * * *

    * * *

    **例子 12-21\. **rot13**: rot13, 弱智加密.**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # rot13.sh: 典型的rot13算法, 
      3 #           使用这种方法加密至少可以愚弄一下3岁小孩. 
      4 
      5 # 用法: ./rot13.sh filename
      6 # 或     ./rot13.sh <filename
      7 # 或     ./rot13.sh and supply keyboard input (stdin)
      8 
      9 cat "$@" | tr 'a-zA-Z' 'n-za-mN-ZA-M'   # "a"变为"n", "b"变为"o", 等等. 
     10 #  'cat "$@"'结构
     11 #+ 允许从stdin或者从文件中获得输入. 
     12 
     13 exit 0</pre>

     |

    * * *

    * * *

    **例子 12-22\. 产生<span class="QUOTE">"Crypto-Quote"</span>游戏(译者: 一种文字游戏)**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # crypto-quote.sh: 加密
      3 
      4 #  使用单码替换(单一字母替换法)来进行加密. 
      5 #  这个脚本的结果与"Crypto Quote"游戏
      6 #+ 的行为很相似. 
      7 
      8 
      9 key=ETAOINSHRDLUBCFGJMQPVWZYXK
     10 # "key"不过是一个乱序的字母表.
     11 # 修改"key"就会修改加密的结果.
     12 
     13 # 'cat "$@"' 结构既可以从stdin获得输入, 也可以从文件中获得输入. 
     14 # 如果使用stdin, 那么要想结束输入就使用 Control-D. 
     15 # 否则就要在命令行上指定文件名. 
     16 
     17 cat "$@" | tr "a-z" "A-Z" | tr "A-Z" "$key"
     18 #        |   转化为大写   |     加密
     19 # 小写, 大写, 或混合大小写, 都可以正常工作.
     20 # 但是传递进来的非字母字符将不会起任何变化.
     21 
     22 
     23 # 用下边的语句试试这个脚本:
     24 # "Nothing so needs reforming as other people's habits."
     25 # --Mark Twain
     26 #                                                        
     27 # 输出为:
     28 # "CFPHRCS QF CIIOQ MINFMBRCS EQ FPHIM GIFGUI'Q HETRPQ."
     29 # --BEML PZERC
     30                                                          
     31 # 解密:
     32 # cat "$@" | tr "$key" "A-Z"
     33                                                          
     34                                                          
     35 #  这个简单的密码可以轻易的被一个12岁的小孩
     36 #+ 用铅笔和纸破解.
     37 
     38 exit 0
     39 
     40 #  练习:
     41 #  -----
     42 #  修改这个脚本, 让它可以用命令行参数
     43 #+ 来决定加密或解密.</pre>

     |

    * * *

    | 

    ****tr**的不同版本**

    **tr**工具在历史上有2个重要版本. BSD版本不需要使用中括号(<kbd class="USERINPUT">tr a-z A-Z</kbd>), 但是SysV版本则需要中括号(<kbd class="USERINPUT">tr '[a-z]' '[A-Z]'</kbd>). GNU版本的**tr**命令与BSD版本比较象, 所以最好使用中括号来引用字符范围.

     |

*   **fold**
*   将输入按照指定宽度进行折行. 这里有一个非常有用的选项`-s`, 这个选项可以使用空格进行断行(译者: 事实上只有外文才需要使用空格断行, 中文是不需要的)(请参考[例子 12-23](textproc.md#EX50)和[例子 A-1](contributed-scripts.md#MAILFORMAT)).

*   **fmt**
*   一个简单的文件格式器, 通常用在管道中, 将一个比较长的文本行输出进行<span class="QUOTE">"折行"</span>.

    * * *

    **例子 12-23\. 格式化文件列表.**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 WIDTH=40                    # 设为40列宽. 
      4 
      5 b=`ls /usr/local/bin`       # 取得文件列表...
      6 
      7 echo $b | fmt -w $WIDTH
      8 
      9 # 也可以使用如下方法, 作用是相同的.
     10 #    echo $b | fold - -s -w $WIDTH
     11  
     12 exit 0</pre>

     |

    * * *

    请参考[例子 12-5](moreadv.md#EX41).

    | ![Tip](./images/tip.gif) | 

    如果想找到一个更强力的**fmt**工具可以选择Kamil Toman的工具**par**, 这个工具可以从后边的这个网址取得[http://www.cs.berkeley.edu/~amc/Par/](http://www.cs.berkeley.edu/~amc/Par/).

     |

*   **col**
*   这个命令用来滤除标准输入的反向换行符号. 这个工具还可以将空白用等价的tab来替换. **col**工具最主要的应用还是从特定的文本处理工具中过滤输出, 比如**groff**和**tbl**. (译者: 主要用来将man页转化为文本.)

*   **column**
*   列格式化工具. 通过在合适的位置插入tab, 这个过滤工具会将列类型的文本转化为<span class="QUOTE">"易于打印"</span>的表格式进行输出.

    * * *

    **例子 12-24\. 使用**column**来格式化目录列表**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 这是"column" man页中的一个例子, 作者对这个例子做了很小的修改. 
      3 
      4 
      5 (printf "PERMISSIONS LINKS OWNER GROUP SIZE MONTH DAY HH:MM PROG-NAME\n" \
      6 ; ls -l | sed 1d) | column -t
      7 
      8 #  管道中的"sed 1d"删除输出的第一行, 
      9 #+ 第一行将是"total        N", 
     10 #+ 其中"N"是"ls -l"找到的文件总数. 
     11                                                    
     12 # "column"中的-t选项用来转化为易于打印的表形式. 
     13 
     14 exit 0</pre>

     |

    * * *

*   **colrm**
*   列删除过滤器. 这个工具将会从文件中删除指定的列(列中的字符串)并且写到文件中, 如果指定的列不存在, 那么就回到<tt class="FILENAME">stdout</tt>. <kbd class="USERINPUT">colrm 2 4 <filename</kbd>将会删除<tt class="FILENAME">filename</tt>文件中每行的第2到第4列之间的所有字符.

    | ![Caution](./images/caution.gif) | 

    如果这个文件包含tab和不可打印字符, 那将会引起不可预期的行为. 在这种情况下, 应该通过管道的手段使用[expand](textproc.md#EXPANDREF)和**unexpand**来预处理**colrm**.

     |

*   **nl**
*   计算行号过滤器. <kbd class="USERINPUT">nl filename</kbd>将会把<tt class="FILENAME">filename</tt>文件的所有内容都输出到<tt class="FILENAME">stdout</tt>上, 但是会在每个非空行的前面加上连续的行号. 如果没有<tt class="FILENAME">filename</tt>参数, 那么就操作<tt class="FILENAME">stdin.</tt>

    **nl**命令的输出与<kbd class="USERINPUT">cat -n</kbd>非常相似, 然而, 默认情况下**nl**不会列出空行.

    * * *

    **例子 12-25\. **nl**: 一个自己计算行号的脚本.**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # line-number.sh
      3 
      4 # 这个脚本将会echo自身两次, 并显示行号. 
      5                                                               
      6 # 'nl'命令显示的时候你将会看到, 本行是第4行, 因为它不计空行. 
      7 # 'cat -n'命令显示的时候你将会看到, 本行是第6行. 
      8 
      9 nl `basename $0`
     10 
     11 echo; echo  # 下边, 让我们试试 'cat -n'
     12 
     13 cat -n `basename $0`
     14 # 区别就是'cat -n'对空行也进行计数. 
     15 # 注意'nl -ba'也会这么做. 
     16 
     17 exit 0
     18 # -----------------------------------------------------------------</pre>

     |

    * * *

*   **pr**
*   格式化打印过滤器. 这个命令会将文件(或<tt class="FILENAME">stdout</tt>)分页, 将它们分成合适的小块以便于硬拷贝打印或者在屏幕上浏览. 使用这个命令的不同的参数可以完成好多任务, 比如对行和列的操作, 加入行, 设置页边, 计算行号, 添加页眉, 合并文件等等. **pr**命令集合了许多命令的功能, 比如**nl**, **paste**, **fold**, **column**, 和**expand**.

    <kbd class="USERINPUT">pr -o 5 --width=65 fileZZZ | more</kbd> 这个命令对<tt class="FILENAME">fileZZZ</tt>进行了比较好的分页, 并且打印到屏幕上. 文件的缩进被设置为5, 总宽度设置为65\.

    一个非常有用的选项`-d`, 强制隔行打印(与**sed -G**效果相同).

*   **gettext**
*   GNU **gettext**包是专门用来将程序的输出翻译或者[本地化](localization.md)为不同国家语言的工具集. 在最开始的时候仅仅支持C语言, 现在已经支持了相当数量的其它程序语言和脚本语言.

    想要查看**gettext**_程序_如何在shell脚本中使用. 请参考<tt class="REPLACEABLE">_info页_</tt>.

*   **msgfmt**
*   一个产生二进制消息目录的程序. 这个命令主要用来[本地化](localization.md).

*   **iconv**
*   一个可以将文件转化为不同编码格式(字符集)的工具. 这个命令主要用来[本地化](localization.md).

    | 

    <pre class="PROGRAMLISTING">  1 # 将字符符串由UTF-8格式转换为UTF-16并且打印到BookList中
      2 function write_utf8_string {
      3     STRING=$1
      4     BOOKLIST=$2
      5     echo -n "$STRING" | iconv -f UTF8 -t UTF16 | cut -b 3- | tr -d \\n >> "$BOOKLIST"
      6 }
      7 
      8 #  来自于Peter Knowles的"booklistgen.sh"脚本
      9 #+ 目的是把文件转换为Sony Librie格式.
     10 #  (http://booklistgensh.peterknowles.com)</pre>

     |

*   **recode**
*   可以认为这个命令是上边**iconv**命令的专业版本. 这个非常灵活的并可以把整个文件都转换为不同编码格式的工具并不是Linux标准安装的一部分.

*   **TeX**, **gs**
*   **TeX**和**Postscript**都是文本标记语言, 用来对打印和格式化的视频显示进行预拷贝.

    **TeX**是Donald Knuth精心制作的排版系统. 通常情况下, 通过编写脚本的手段来把所有的选项和参数封装起来一起传到标记语言中是一件很方便的事情.

    _Ghostscript_ (**gs**) 是一个 遵循GPL的Postscript解释器.

*   **enscript**
*   将纯文本文件转换为PostScript的工具

    比如, **enscript filename.txt -p filename.ps** 产生一个 PostScript 输出文件<tt class="FILENAME">filename.ps</tt>.

*   **groff**, **tbl**, **eqn**
*   另一种文本标记和显示格式化语言是**groff**. 这是一个对传统UNIX **roff/troff**显示和排版包的GNU增强版本. _Man页_使用的就是**groff**.

    **tbl**表处理工具可以认为是**groff**的一部分, 它的功能就是将表标记转化到**groff**命令中.

    **eqn**等式处理工具也是**groff**的一部分, 它的功能是将等式标记转化到**groff**命令中.

    * * *

    **例子 12-26\. **manview**: 查看格式化的man页**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # manview.sh: 将man页源文件格式化以方便查看. 
      3 
      4 #  当你想阅读man页的时候, 这个脚本就有用了. 
      5 #  它允许你在运行的时候查看
      6 #+ 中间结果. 
      7 
      8 E_WRONGARGS=65
      9 
     10 if [ -z "$1" ]
     11 then
     12   echo "Usage: `basename $0` filename"
     13   exit $E_WRONGARGS
     14 fi
     15 
     16 # ---------------------------
     17 groff -Tascii -man $1 | less
     18 # 来自于groff的man页.
     19 # ---------------------------
     20 
     21 #  如果man页中包括表或者等式,
     22 #+ 那么上边的代码就够呛了.
     23 #  下边的这行代码可以解决上边的这个问题.
     24 #
     25 #   gtbl < "$1" | geqn -Tlatin1 | groff -Tlatin1 -mtty-char -man
     26 #
     27 #   感谢, S.C.
     28 
     29 exit 0</pre>

     |

    * * *

*   **lex**, **yacc**
*   **lex**是用于模式匹配的词汇分析产生程序. 在Linux系统上这个命令已经被**flex**取代了.

    **yacc**工具基于一系列的语法规范, 产生一个语法分析器. 在Linux系统上这个命令已经被**bison**取代了.

### 注意事项

| [[1]](textproc.md#AEN8402) | 

对于GNU版本的**tr**命令来说, 这是唯一一处比那些商业UNIX系统上的一般版本更好的地方.

 |
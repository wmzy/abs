# 12.9\. 混杂命令

**一些不好归类的命令**

*   **jot**, **seq**
*   这些工具用来生成一系列整数, 用户可以指定生成范围.

    每个产生出来的整数一般都占一行, 但是可以使用`-s`选项来改变这种设置.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">seq 5</kbd>
    <samp class="COMPUTEROUTPUT">1
     2
     3
     4
     5</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">seq -s : 5</kbd>
    <samp class="COMPUTEROUTPUT">1:2:3:4:5</samp>
    	      </pre>

     |

    **jot**和**seq**命令经常用在[for循环](loops1.md#FORLOOPREF1)中.

    * * *

    **例子 12-49\. 使用**seq**命令来产生循环参数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 使用"seq"
      3 
      4 echo
      5 
      6 for a in `seq 80`  # or   for a in $( seq 80 )
      7 # 与	for a in 1 2 3 4 5 ... 80   相同(少敲了好多字!).
      8 # 也可以使用'jot'(如果系统上有的话). 
      9 do
     10   echo -n "$a "
     11 done      # 1 2 3 4 5 ... 80
     12 # 这也是一个通过使用命令输出
     13 # 来产生"for"循环中[list]列表的例子. 
     14 
     15 echo; echo
     16 
     17 
     18 COUNT=80  # 当然, 'seq'也可以使用一个可替换的参数.
     19 
     20 for a in `seq $COUNT`  # 或者   for a in $( seq $COUNT )
     21 do
     22   echo -n "$a "
     23 done      # 1 2 3 4 5 ... 80
     24 
     25 echo; echo
     26 
     27 BEGIN=75
     28 END=80
     29 
     30 for a in `seq $BEGIN $END`
     31 #  传给"seq"两个参数, 从第一个参数开始增长,
     32 #+ 一直增长到第二个参数为止. 
     33 do
     34   echo -n "$a "
     35 done      # 75 76 77 78 79 80
     36 
     37 echo; echo
     38 
     39 BEGIN=45
     40 INTERVAL=5
     41 END=80
     42 
     43 for a in `seq $BEGIN $INTERVAL $END`
     44 #  传给"seq"三个参数, 从第一个参数开始增长, 
     45 #+ 并以第二个参数作为增量, 
     46 #+ 一直增长到第三个参数为止. 
     47 do
     48   echo -n "$a "
     49 done      # 45 50 55 60 65 70 75 80
     50 
     51 echo; echo
     52 
     53 exit 0</pre>

     |

    * * *

    一个简单一些的例子:

    | 

    <pre class="PROGRAMLISTING">  1 #  产生10个连续扩展名的文件, 
      2 #+ 名字分别是 file.1, file.2 . . . file.10.
      3 COUNT=10
      4 PREFIX=file
      5 
      6 for filename in `seq $COUNT`
      7 do
      8   touch $PREFIX.$filename
      9   #  或者, 你可以做一些其他的操作, 
     10   #+ 比如rm, grep, 等等. 
     11 done</pre>

     |

    * * *

    **例子 12-50\. 字母统计**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # letter-count.sh: 统计一个文本文件中某些字母出现的次数.
      3 # 由Stefano Palmeri所编写. 
      4 # 经过授权可以使用在本书中. 
      5 # 本书作者做了少许修改. 
      6 
      7 MINARGS=2          # 本脚本至少需要2个参数. 
      8 E_BADARGS=65
      9 FILE=$1
     10 
     11 let LETTERS=$#-1   # 指定了多少个字母(作为命令行参数).
     12                    # (从命令行参数的个数中减1.)
     13 
     14 
     15 show_help(){
     16 	   echo
     17            echo Usage: `basename $0` file letters  
     18            echo Note: `basename $0` arguments are case sensitive.
     19            echo Example: `basename $0` foobar.txt G n U L i N U x.
     20 	   echo
     21 }
     22 
     23 # 检查参数个数. 
     24 if [ $# -lt $MINARGS ]; then
     25    echo
     26    echo "Not enough arguments."
     27    echo
     28    show_help
     29    exit $E_BADARGS
     30 fi  
     31 
     32 
     33 # 检查文件是否存在. 
     34 if [ ! -f $FILE ]; then
     35     echo "File \"$FILE\" does not exist."
     36     exit $E_BADARGS
     37 fi
     38 
     39 
     40 
     41 # 统计字母出现的次数. 
     42 for n in `seq $LETTERS`; do
     43       shift
     44       if [[ `echo -n "$1" | wc -c` -eq 1 ]]; then             #  检查参数.
     45              echo "$1" -\> `cat $FILE | tr -cd  "$1" | wc -c` #  统计. 
     46       else
     47              echo "$1 is not a  single char."
     48       fi  
     49 done
     50 
     51 exit $?
     52 
     53 #  这个脚本在功能上与letter-count2.sh完全相同, 
     54 #+ 但是运行得更快. 
     55 #  为什么? </pre>

     |

    * * *

*   **getopt**
*   **getopt**命令将会分析以[破折号](special-chars.md#DASHREF)开头的命令行选项. 这个外部命令与Bash的内建命令[getopts](internal.md#GETOPTSX)作用相同. 通过使用`-l`标志, **getopt**可以处理超长(多个字符的)选项, 并且也允许参数重置.

    * * *

    **例子 12-51\. 使用**getopt**来分析命令行选项**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 使用getopt. 
      3 
      4 # 尝试使用下边的不同的方法来调用这脚本: 
      5 #   sh ex33a.sh -a
      6 #   sh ex33a.sh -abc
      7 #   sh ex33a.sh -a -b -c
      8 #   sh ex33a.sh -d
      9 #   sh ex33a.sh -dXYZ
     10 #   sh ex33a.sh -d XYZ
     11 #   sh ex33a.sh -abcd
     12 #   sh ex33a.sh -abcdZ
     13 #   sh ex33a.sh -z
     14 #   sh ex33a.sh a
     15 # 解释上面每一次调用的结果. 
     16 
     17 E_OPTERR=65
     18 
     19 if [ "$#" -eq 0 ]
     20 then   # 脚本需要至少一个命令行参数. 
     21   echo "Usage $0 -[options a,b,c]"
     22   exit $E_OPTERR
     23 fi  
     24 
     25 set -- `getopt "abcd:" "$@"`
     26 # 为命令行参数设置位置参数. 
     27 # 如果使用"$*"来代替"$@"的话, 会发生什么? 
     28 
     29 while [ ! -z "$1" ]
     30 do
     31   case "$1" in
     32     -a) echo "Option \"a\"";;
     33     -b) echo "Option \"b\"";;
     34     -c) echo "Option \"c\"";;
     35     -d) echo "Option \"d\" $2";;
     36      *) break;;
     37   esac
     38 
     39   shift
     40 done
     41 
     42 #  通常来说在脚本中使用内建的'getopts'命令, 
     43 #+ 会比使用'getopt'好一些. 
     44 #  参考"ex33.sh".
     45 
     46 exit 0</pre>

     |

    * * *

    请参考[例子 9-13](string-manipulation.md#GETOPTSIMPLE), 这是对**getopt**命令的一个简单模拟.

*   **run-parts**
*   **run-parts**命令 [[1]](#FTN.AEN10535) 将会执行目标目录中所有的脚本, 这些脚本会以ASCII码的循序进行排列. 当然, 这些脚本都需要具有可执行权限.

    [cron](system.md#CRONREF) [幽灵进程](communications.md#DAEMONREF)会调用**run-parts**来运行<tt class="FILENAME">/etc/cron.*</tt>下的所有脚本.

*   **yes**
*   **yes**命令的默认行为是向<tt class="FILENAME">stdout</tt>连续不断的输出字符<samp class="COMPUTEROUTPUT">y</samp>, 每个<samp class="COMPUTEROUTPUT">y</samp>单独占一行. 可以使用**control**-**c**来结束输出. 如果想换一个输出字符的话, 可以使用<kbd class="USERINPUT">yes different string</kbd>, 这样就会连续不断的输出<samp class="COMPUTEROUTPUT">different string</samp>到<tt class="FILENAME">stdout</tt>. 那么这样的命令究竟能用来做什么呢? 在命令行或者脚本中, **yes**的输出可以通过重定向或管道来传递给一些命令, 这些命令的特点是需要用户输入来进行交互. 事实上, 这个命令可以说是**expect**命令(译者注: 这个命令本书未介绍, 一个自动实现交互的命令)的一个简化版本.

    <kbd class="USERINPUT">yes | fsck /dev/hda1</kbd>将会以非交互的形式运行**fsck**(译者注: 因为需要用户输入的y全由yes命令搞定了)(小心使用!).

    <kbd class="USERINPUT">yes | rm -r dirname</kbd> 与 <kbd class="USERINPUT">rm -rf dirname</kbd> 效果相同(小心使用!).

    | ![Warning](./images/warning.gif) | 

    当用**yes**命令的管道形式来使用一些可能具有潜在危险的系统命令的时候一定要深思熟虑, 比如[fsck](system.md#FSCKREF)或[fdisk](system.md#FDISKREF). 可能会产生一些令人意外的副作用.

     |

    | ![Note](./images/note.gif) | 

    **yes**命令也可用来分析变量. 比如:

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">yes $BASH_VERSION</kbd>
    <samp class="COMPUTEROUTPUT">3.00.16(1)-release
     3.00.16(1)-release
     3.00.16(1)-release
     3.00.16(1)-release
     3.00.16(1)-release
     . . .</samp>
    	      </pre>

     |

    这个<span class="QUOTE">"特性"</span>估计也不会特别有用.

     |

*   **banner**
*   将会把传递进来的参数字符串用一个ASCII字符(默认是'#')给画出来(就是将多个'#'拼出一副字符的图形), 然后输出到<tt class="FILENAME">stdout</tt>. 可以作为硬拷贝重定向到打印机上. (译者注: 可以使用-w 选项设置宽度.)

*   **printenv**
*   显示某个特定用户所有的[环境变量](othertypesv.md#ENVREF).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">printenv | grep HOME</kbd>
    <samp class="COMPUTEROUTPUT">HOME=/home/bozo</samp>
    	      </pre>

     |

*   **lp**
*   **lp**和**lpr**命令将会把文件发送到打印队列中, 并且作为硬拷贝来打印. [[2]](#FTN.AEN10624) 这些命令会记录它们名字的起点, 直到行打印机的另一个阶段.

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lp file1.txt</kbd> 或者 <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lp <file1.txt</kbd>

    通常情况下都是将**pr**的格式化输出传递到**lp**中.

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">pr -options file1.txt | lp</kbd>

    格式化的包, 比如**groff**和_Ghostscript_就可以将它们的输出直接发送给**lp**.

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">groff -Tascii file.tr | lp</kbd>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">gs -options | lp file.ps</kbd>

    还有一些相关的命令, 比如**lpq**, 可以用来查看打印队列, 而**lprm**, 可以从打印队列中删除作业.

*   **tee**
*   [这是UNIX从管道行业借来的主意.]

    这是一个重定向操作, 但是与之前所看到的有点不同. 就像管道中的<span class="QUOTE">"三通"</span>一样, 这个命令可以将命令或者管道命令的输出<span class="QUOTE">"抽出"</span>到_一个文件_中, 而且不影响结果. 当你想将一个运行中进程的输出保存到文件时, 或者为了debug而保存输出记录的时候, 这个命令就显得非常有用了.

    | 

    <pre class="SCREEN">                             (重定向)
                                |----> 到文件
                                |
      ==========================|====================
      命令   --->   命令   ---> |tee ---> 命令 ---> ---> 管道的输出
      ===============================================
    	      </pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 cat listfile* | sort | tee check.file | uniq > result.file</pre>

     |

    (在对排序的结果进行[uniq](textproc.md#UNIQREF)(去掉重复行)之前, 文件<tt class="FILENAME">check.file</tt>保存了排过序的<span class="QUOTE">"listfiles"</span>. )
*   **mkfifo**
*   这个不大引人注意的命令可以创建一个_命名管道_, 并产生一个临时的_先进先出的buffer_, 用来在两个进程之间传递数据. [[3]](#FTN.AEN10686) 典型的应用是一个进程向FIFO中写数据, 另一个进程读出来. 请参考[例子 A-15](contributed-scripts.md#FIFO).

*   **pathchk**
*   这个命令用来检查文件名的有效性. 如果文件名超过了最大允许长度(255个字符), 或者它所在的一个或多个路径搜索不到, 那么就会产生一个错误结果.

    不幸的是, **pathchk**并不能够返回一个可识别的错误码, 因此它在脚本中几乎没有什么用. 可以考虑使用[文件测试操作](fto.md#RTIF)来替代这个命令.

*   **dd**
*   这也是一个不太出名的工具, 但却是一个令人恐惧的<span class="QUOTE">"数据复制"</span>命令. 最开始, 这个命令被用来在UNIX微机和IBM大型机之间通过磁带来交换数据, 这个命令现在仍然有它的用途. **dd**命令只不过是简单的拷贝一个文件(或者<tt class="FILENAME">stdin/stdout</tt>), 但是它会做一些转换. 下边是一些可能的转换, 比如 ASCII/EBCDIC, [[4]](#FTN.AEN10719) 大写/小写, 在输入和输出之间的字节对的交换, 还有对输入文件做一些截头去尾的工作. <kbd class="USERINPUT">dd --help</kbd>列出了所有转换, 还列出了这个强大工具的其他一些选项.

    | 

    <pre class="PROGRAMLISTING">  1 # 将一个文件转换为大写: 
      2 
      3 dd if=$filename conv=ucase > $filename.uppercase
      4 #                    lcase   # 转换为小写</pre>

     |

    * * *

    **例子 12-52\. 一个拷贝自身的脚本**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # self-copy.sh
      3 
      4 # 这个脚本会拷贝自身. 
      5 
      6 file_subscript=copy
      7 
      8 dd if=$0 of=$0.$file_subscript 2>/dev/null
      9 # 阻止dd产生的消息:            ^^^^^^^^^^^
     10 
     11 exit $?</pre>

     |

    * * *

    * * *

    **例子 12-53\. 练习**dd****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # exercising-dd.sh
      3 
      4 # 由Stephane Chazelas编写. 
      5 # 本文作者做了少量修改. 
      6 
      7 input_file=$0   # 脚本自身. 
      8 output_file=log.txt
      9 n=3
     10 p=5
     11 
     12 dd if=$input_file of=$output_file bs=1 skip=$((n-1)) count=$((p-n+1)) 2> /dev/null
     13 # 从脚本中把位置n到p的字符提取出来. 
     14 
     15 # -------------------------------------------------------
     16 
     17 echo -n "hello world" | dd cbs=1 conv=unblock 2> /dev/null
     18 # 垂直地echo "hello world". 
     19 
     20 exit 0</pre>

     |

    * * *

    为了展示**dd**的多种用途, 让我们使用它来记录按键.

    * * *

    **例子 12-54\. 记录按键**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # dd-keypress.sh: 记录按键, 不需要按回车. 
      3 
      4 
      5 keypresses=4                      # 记录按键的个数. 
      6 
      7 
      8 old_tty_setting=$(stty -g)        # 保存旧的终端设置. 
      9 
     10 echo "Press $keypresses keys."
     11 stty -icanon -echo                # 禁用标准模式. 
     12                                   # 禁用本地echo. 
     13 keys=$(dd bs=1 count=$keypresses 2> /dev/null)
     14 # 如果不指定输入文件的话, 'dd'使用标准输入. 
     15 
     16 stty "$old_tty_setting"           # 恢复旧的终端设置. 
     17 
     18 echo "You pressed the \"$keys\" keys."
     19 
     20 # 感谢Stephane Chazelas, 演示了这种方法. 
     21 exit 0</pre>

     |

    * * *

    **dd**命令可以在数据流上做随机访问.

    | 

    <pre class="PROGRAMLISTING">  1 echo -n . | dd bs=1 seek=4 of=file conv=notrunc
      2 # "conv=notrunc"选项意味着输出文件不能被截短. 
      3 
      4 # 感谢, S.C.</pre>

     |

    **dd**命令可以将数据或磁盘镜像拷贝到设备中, 也可以从设备中拷贝数据或磁盘镜像, 比如说磁盘或磁带设备都可以([例子 A-5](contributed-scripts.md#COPYCD)). 通常用来创建启动磁盘.

    <kbd class="USERINPUT">dd if=kernel-image of=/dev/fd0H1440</kbd>

    同样的, **dd**可以拷贝软盘的整个内容(甚至是<span class="QUOTE">"其他"</span>操作系统的磁盘格式), 到硬盘驱动器上(以镜像文件的形式).

    <kbd class="USERINPUT">dd if=/dev/fd0 of=/home/bozo/projects/floppy.img</kbd>

    **dd**命令还有一些其他用途, 包括可以初始化临时交换文件([例子 28-2](zeros.md#EX73))和ramdisks(内存虚拟硬盘)([例子 28-3](zeros.md#RAMDISK)). 它甚至可以做一些对整个硬盘分区的底层拷贝, 虽然不建议这么做.

    某些(可能是比较无聊的)人总会想一些关于**dd**命令的有趣应用.

    * * *

    **例子 12-55\. 安全的删除一个文件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # blot-out.sh: 删除一个文件"所有"的记录. 
      3 
      4 #  这个脚本会使用随机字节交替的覆盖目标文件, 
      5 #+ 并且在最终删除这个文件之前清零.
      6 #  这么做之后, 即使你通过传统手段来检查磁盘扇区
      7 #+ 也不能把文件原始数据重新恢复.
      8 
      9 PASSES=7         #  破坏文件的次数. 
     10                  #  提高这个数字会减慢脚本运行的速度, 
     11                  #+ 尤其是对尺寸比较大的目标文件进行操作的时候. 
     12 BLOCKSIZE=1      #  带有/dev/urandom的I/O需要单位块尺寸, 
     13                  #+ 否则你可能会获得奇怪的结果. 
     14 E_BADARGS=70     #  不同的错误退出码. 
     15 E_NOT_FOUND=71
     16 E_CHANGED_MIND=72
     17 
     18 if [ -z "$1" ]   # 没指定文件名. 
     19 then
     20   echo "Usage: `basename $0` filename"
     21   exit $E_BADARGS
     22 fi
     23 
     24 file=$1
     25 
     26 if [ ! -e "$file" ]
     27 then
     28   echo "File \"$file\" not found."
     29   exit $E_NOT_FOUND
     30 fi  
     31 
     32 echo; echo -n "Are you absolutely sure you want to blot out \"$file\" (y/n)? "
     33 read answer
     34 case "$answer" in
     35 [nN]) echo "Changed your mind, huh?"
     36       exit $E_CHANGED_MIND
     37       ;;
     38 *)    echo "Blotting out file \"$file\".";;
     39 esac
     40 
     41 
     42 flength=$(ls -l "$file" | awk '{print $5}')  # 5是文件长度. 
     43 pass_count=1
     44 
     45 chmod u+w "$file"   # 允许覆盖/删除这个文件. 
     46 
     47 echo
     48 
     49 while [ "$pass_count" -le "$PASSES" ]
     50 do
     51   echo "Pass #$pass_count"
     52   sync         # 刷新buffers.
     53   dd if=/dev/urandom of=$file bs=$BLOCKSIZE count=$flength
     54                # 使用随机字节进行填充. 
     55   sync         # 再次刷新buffer. 
     56   dd if=/dev/zero of=$file bs=$BLOCKSIZE count=$flength
     57                # 用0填充. 
     58   sync         # 再次刷新buffer. 
     59   let "pass_count += 1"
     60   echo
     61 done  
     62 
     63 
     64 rm -f $file    # 最后, 删除这个已经被破坏得不成样子的文件.
     65 sync           # 最后一次刷新buffer.
     66 
     67 echo "File \"$file\" blotted out and deleted."; echo
     68 
     69 
     70 exit 0
     71 
     72 #  这是一种真正安全的删除文件的办法,
     73 #+ 但是效率比较低, 运行比较慢.
     74 #  GNU文件工具包中的"shred"命令,
     75 #+ 也可以完成相同的工作, 不过更有效率.
     76                                                             
     77 #  使用普通的方法是不可能重新恢复这个文件了.
     78 #  然而 . . .
     79 #+ 这个简单的例子是不能够抵抗
     80 #+ 那些经验丰富并且正规的分析.
     81                                                             
     82 #  这个脚本可能不会很好的运行在日志文件系统上(JFS).
     83 #  练习 (很难): 像它做的那样修正这个问题.
     84 
     85 
     86 
     87 #  Tom Vier的文件删除包可以更加彻底的删除文件, 
     88 #+ 比这个例子厉害的多. 
     89 #     http://www.ibiblio.org/pub/Linux/utils/file/wipe-2.0.0.tar.bz2
     90 
     91 #  如果想对安全删除文件这一论题进行深入的分析,
     92 #+ 可以参见Peter Gutmann的网页,
     93 #+     "Secure Deletion of Data From Magnetic and Solid-State Memory".
     94 #       http://www.cs.auckland.ac.nz/~pgut001/pubs/secure_del.html</pre>

     |

    * * *

*   **od**
*   **od**, 或者_octal dump_过滤器, 将会把输入(或文件)转换为8进制或者其他进制. 在你需要查看或处理一些二进制数据文件或者一个不可读的系统设备文件的时候, 这个命令非常有用, 比如<tt class="FILENAME">/dev/urandom</tt>, 或者是一个二进制数据过滤器. 请参考[例子 9-29](randomvar.md#SEEDINGRANDOM)和[例子 12-13](textproc.md#RND).

*   **hexdump**
*   对二进制文件进行 16进制, 8进制, 10进制, 或者ASCII码的查阅动作. 这个命令大体上与上边的**od**命令的作用相同, 但是远没有**od**命令有用.

*   **objdump**
*   显示编译后的二进制文件或二进制可执行文件的信息, 以16进制的形式显示, 或者显示反汇编列表(使用`-d`选项).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">objdump -d /bin/ls</kbd>
    <samp class="COMPUTEROUTPUT">/bin/ls:     file format elf32-i386

     Disassembly of section .init:

     080490bc <.init>:
      80490bc:       55                      push   %ebp
      80490bd:       89 e5                   mov    %esp,%ebp
      . . .</samp>
    	      </pre>

     |

*   **mcookie**
*   这个命令会产生一个<span class="QUOTE">"magic cookie"</span>, 这是一个128-bit(32-字符)的伪随机16进制数字, 这个数字一般都用来作为X server的鉴权<span class="QUOTE">"签名"</span>. 这个命令还可以用来在脚本中作为一种生成随机数的手段, 当然这是一种<span class="QUOTE">"小吃店"</span>(译者注: 虽然不太正统, 但是方便快捷)的风格.

    | 

    <pre class="PROGRAMLISTING">  1 random000=$(mcookie)</pre>

     |

    当然, 要想达到同样的目的还可以使用[md5](filearchiv.md#MD5SUMREF)命令.

    | 

    <pre class="PROGRAMLISTING">  1 # 产生关于脚本自身的md5 checksum. 
      2 random001=`md5sum $0 | awk '{print $1}'`
      3 # 使用 'awk' 来去掉文件名. </pre>

     |

    **mcookie**命令还给出了另一种产生<span class="QUOTE">"唯一"</span>文件名的方法.

    * * *

    **例子 12-56\. 文件名产生器**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # tempfile-name.sh:  临时文件名产生器
      3 
      4 BASE_STR=`mcookie`   # 32-字符的magic cookie. 
      5 POS=11               # 字符串中随便的一个位置. 
      6 LEN=5                # 取得$LEN长度连续的字符串. 
      7 
      8 prefix=temp          #  最终的一个"临时"文件. 
      9                      #  如果想让这个文件更加"唯一", 
     10                      #+ 可以对这个前缀也采用下边的方法进行生成. 
     11 
     12 suffix=${BASE_STR:POS:LEN}
     13                      # 提取从第11个字符之后的长度为5的字符串. 
     14 
     15 temp_filename=$prefix.$suffix
     16                      # 构造文件名. 
     17 
     18 echo "Temp filename = "$temp_filename""
     19 
     20 # sh tempfile-name.sh
     21 # Temp filename = temp.e19ea
     22 
     23 #  与使用'date'命令(参考 ex51.sh)来创建"唯一"文件名
     24 #+ 的方法相比较.
     25 
     26 exit 0</pre>

     |

    * * *

*   **units**
*   这个工具用来在不同的计量单位之间互相转换. 当你在交互模式下正常调用时, 会发现在脚本中**units**命令也是非常有用的.

    * * *

    **例子 12-57\. 将长度单位-米, 转化为英里**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # unit-conversion.sh
      3 
      4 
      5 convert_units ()  # 通过参数取得需要转换的单位. 
      6 {
      7   cf=$(units "$1" "$2" | sed --silent -e '1p' | awk '{print $2}')
      8   # 除了真正需要转换的部分保留下来外,其他的部分都去掉. 
      9   echo "$cf"
     10 }  
     11 
     12 Unit1=miles
     13 Unit2=meters
     14 cfactor=`convert_units $Unit1 $Unit2`
     15 quantity=3.73
     16 
     17 result=$(echo $quantity*$cfactor | bc)
     18 
     19 echo "There are $result $Unit2 in $quantity $Unit1."
     20 
     21 #  如果你传递了两个不匹配的单位会发生什么? 
     22 #+ 比如分别传入"英亩"和"英里"? 
     23 
     24 exit 0</pre>

     |

    * * *

*   **m4**
*   一个隐藏的财宝, **m4**是一个强大的宏处理过滤器, [[5]](#FTN.AEN10855) 差不多可以说是一种语言了. 虽然最开始这个工具是用来作为_RatFor_的预处理器而编写的, 但是后来证明**m4**即使作为独立的工具来使用也是非常有用的. 事实上, **m4**结合了许多工具的功能, 比如[eval](internal.md#EVALREF), [tr](textproc.md#TRREF), 和[awk](awk.md#AWKREF), 除此之外, 它还使得宏扩展变得更加容易.

    在2004年4月的[Linux Journal](http://www.linuxjournal.com)问题列表中有一篇关于**m4**命令用法的好文章.

    * * *

    **例子 12-58\. 使用m4**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # m4.sh: 使用m4宏处理器
      3 
      4 # 字符串操作
      5 string=abcdA01
      6 echo "len($string)" | m4                           # 7
      7 echo "substr($string,4)" | m4                      # A01
      8 echo "regexp($string,[0-1][0-1],\&Z)" | m4         # 01Z
      9 
     10 # 算术操作
     11 echo "incr(22)" | m4                               # 23
     12 echo "eval(99 / 3)" | m4                           # 33
     13 
     14 exit 0</pre>

     |

    * * *

*   **doexec**
*   **doexec**命令允许将一个随便的参数列表传递到一个 _二进制可执行文件_中. 比较特殊的, 甚至可以传递`argv[0]`(相当于脚本中的[$0](othertypesv.md#POSPARAMREF1)), 这样就可以使用不同的名字来调用这个可执行文件, 并且通过不同的调用名字, 还可以让这个可执行文件执行不同的动作. 这也可以说是一种将参数传递到可执行文件中的比较绕圈子的做法.

    比如, <tt class="FILENAME">/usr/local/bin</tt>目录可能包含一个<span class="QUOTE">"aaa"</span>的二进制文件. 使用**doexec /usr/local/bin/aaa list**可以_列出_当前工作目录下所有以<span class="QUOTE">"a"</span>开头的文件, 而使用**doexec /usr/local/bin/aaa delete** 将会_删除_这些文件.

    | ![Note](./images/note.gif) | 

    可执行文件的不同行为必须定义在可执行文件自身的代码中, 可以使用如下的shell脚本来做类比:

    | 

    <pre class="PROGRAMLISTING">  1 case `basename $0` in
      2 "name1" ) do_something;;
      3 "name2" ) do_something_else;;
      4 "name3" ) do_yet_another_thing;;
      5 *       ) bail_out;;
      6 esac</pre>

     |

     |

*   **dialog**
*   [dialog](assortedtips.md#DIALOGREF)工具集提供了一种从脚本中调用交互对话框的方法. **dialog**更好的变种版本是 -- **gdialog**, **Xdialog**, 和**kdialog** -- 事实上是调用X-Windows的界面工具集. 请参考[例子 33-19](assortedtips.md#DIALOG).

*   **sox**
*   **sox**命令, 也就是<span class="QUOTE">"_so_und e_x_change"</span>命令, 可以进行声音文件的转换. 事实上, 可执行文件<tt class="FILENAME">/usr/bin/play</tt>(现在不建议使用)只不过是_sox_的一个shell包装器而已.

    举个例子, **sox soundfile.wav soundfile.au**将会把一个WAV文件转换成(Sun音频格式)AU声音文件.

    Shell脚本非常适合于使用**sox**的声音操作来批处理声音文件. 比如, [Linux Radio Timeshift HOWTO](http://osl.iu.edu/~tveldhui/radio/)和[MP3do Project](http://savannah.nongnu.org/projects/audiodo).

### 注意事项

| [[1]](extmisc.md#AEN10535) | 

这个工具事实上是从Debian Linux发行版中的一个脚本借鉴过来的.

 |
| [[2]](extmisc.md#AEN10624) | 

_打印队列_就是<span class="QUOTE">"在线等待"</span>打印的作业组.

 |
| [[3]](extmisc.md#AEN10686) | 

对于本话题的一个完美的介绍, 请参考Andy Vaught的文章, [命名管道的介绍](http://www2.linuxjournal.com/lj-issues/issue41/2156.md), 这是[Linux Journal1997年9月的一个主题](http://www.linuxjournal.com).

 |
| [[4]](extmisc.md#AEN10719) | 

<acronym class="ACRONYM">EBCDIC</acronym> (发音是<span class="QUOTE">"ebb-sid-ick"</span>)是单词(Extended Binary Coded Decimal Interchange Code)的首字母缩写. 这是IBM的数据格式, 现在已经不常见了. **dd**命令的`conv=ebcdic`选项有一种比较古怪的用法, 那就是对一个文件进行快速容易但不太安全的编码.

| 

<pre class="PROGRAMLISTING">  1 cat $file | dd conv=swab,ebcdic > $file_encrypted
  2 # 编码(看起来好像没什么用).		    
  3 # 应该交换字节(swab), 有点晦涩. 
  4 
  5 cat $file_encrypted | dd conv=swab,ascii > $file_plaintext
  6 # 解码. </pre>

 |

 |
| [[5]](extmisc.md#AEN10855) | 

_宏_是一个符号常量, 将会被扩展成一个命令字符串或者一系列的参数进行操作.

 |
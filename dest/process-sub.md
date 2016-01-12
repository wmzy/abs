# 22\. 进程替换

<tt class="REPLACEABLE">_进程替换_</tt>与[命令替换](commandsub.md#COMMANDSUBREF)很相似. 命令替换把一个命令的结果赋值给一个变量, 比如**dir_contents=`ls -al`**或**xref=$( grep word datafile)**. 进程替换把一个进程的输出提供给另一个进程(换句话说, 它把一个命令的结果发给了另一个命令).

**命令替换的模版**

*   用圆括号扩起来的命令
*   **>(command)**

    **<(command)**

    启动进程替换. 它使用<tt class="FILENAME">/dev/fd/<n></tt>文件将圆括号中的进程处理结果发送给另一个进程. [[1]](#FTN.AEN14284) (译者注: 实际上现代的UNIX类操作系统提供的<tt class="FILENAME">/dev/fd/n</tt>文件是与文件描述符相关的, 整数n指的就是进程运行时对应数字的文件描述符)

    | ![Note](./images/note.gif) | 

    在<span class="QUOTE">"<"</span>或<span class="QUOTE">">"</span>与圆括号之间是_没有_空格的. 如果加了空格, 会产生错误.

     |

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo >(true)</kbd>
<samp class="COMPUTEROUTPUT">/dev/fd/63</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo <(true)</kbd>
<samp class="COMPUTEROUTPUT">/dev/fd/63</samp>
	      </pre>

 |

Bash在两个[文件描述符](io-redirection.md#FDREF)之间创建了一个管道, <tt class="FILENAME">--fIn</tt>和<tt class="FILENAME">fOut--</tt>. [true](internal.md#TRUEREF)命令的<tt class="FILENAME">stdin</tt>被连接到<tt class="FILENAME">fOut</tt> (dup2(fOut, 0)), 然后Bash把<tt class="FILENAME">/dev/fd/fIn</tt>作为参数传给**echo**. 如果系统缺乏<tt class="FILENAME">/dev/fd/<n></tt>文件, Bash会使用临时文件. (感谢, S.C.)

进程替换可以比较两个不同命令的输出, 甚至能够比较同一个命令不同选项情况下的输出.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">comm <(ls -l) <(ls -al)</kbd>
<samp class="COMPUTEROUTPUT">total 12
-rw-rw-r--    1 bozo bozo       78 Mar 10 12:58 File0
-rw-rw-r--    1 bozo bozo       42 Mar 10 12:58 File2
-rw-rw-r--    1 bozo bozo      103 Mar 10 12:58 t2.sh
        total 20
        drwxrwxrwx    2 bozo bozo     4096 Mar 10 18:10 .
        drwx------   72 bozo bozo     4096 Mar 10 17:58 ..
        -rw-rw-r--    1 bozo bozo       78 Mar 10 12:58 File0
        -rw-rw-r--    1 bozo bozo       42 Mar 10 12:58 File2
        -rw-rw-r--    1 bozo bozo      103 Mar 10 12:58 t2.sh</samp></pre>

 |

使用进程替换来比较两个不同目录的内容(可以查看哪些文件名相同, 哪些文件名不同):

| 

<pre class="PROGRAMLISTING">  1 diff <(ls $first_directory) <(ls $second_directory)</pre>

 |

一些进程替换的其他用法与技巧:

| 

<pre class="PROGRAMLISTING">  1 cat <(ls -l)
  2 # 等价于     ls -l | cat
  3 
  4 sort -k 9 <(ls -l /bin) <(ls -l /usr/bin) <(ls -l /usr/X11R6/bin)
  5 # 列出系统3个主要'bin'目录中的所有文件, 并且按文件名进行排序. 
  6 # 注意是3个(查一下, 上面就3个圆括号)明显不同的命令输出传递给'sort'. 
  7 
  8  
  9 diff <(command1) <(command2)    # 给出两个命令输出的不同之处. 
 10 
 11 tar cf >(bzip2 -c > file.tar.bz2) $directory_name
 12 # 调用"tar cf /dev/fd/?? $directory_name", 和"bzip2 -c > file.tar.bz2".
 13 #
 14 # 因为/dev/fd/<n>的系统属性, 
 15 # 所以两个命令之间的管道不必被命名. 
 16 #
 17 # 这种效果可以被模拟出来. 
 18 #
 19 bzip2 -c < pipe > file.tar.bz2&
 20 tar cf pipe $directory_name
 21 rm pipe
 22 #        或
 23 exec 3>&1
 24 tar cf /dev/fd/4 $directory_name 4>&1 >&3 3>&- | bzip2 -c > file.tar.bz2 3>&-
 25 exec 3>&-
 26 
 27 
 28 # 感谢, Stephane Chazelas</pre>

 |

一个读者给我发了一个有趣的例子, 是关于进程替换的, 如下.

| 

<pre class="PROGRAMLISTING">  1 # 摘自SuSE发行版中的代码片断: 
  2 
  3 while read  des what mask iface; do
  4 # 这里省略了一些命令...
  5 done < <(route -n)  
  6 
  7 
  8 # 为了测试它, 我们让它做点事. 
  9 while read  des what mask iface; do
 10   echo $des $what $mask $iface
 11 done < <(route -n)  
 12 
 13 # 输出: 
 14 # Kernel IP routing table
 15 # Destination Gateway Genmask Flags Metric Ref Use Iface
 16 # 127.0.0.0 0.0.0.0 255.0.0.0 U 0 0 0 lo
 17 
 18 
 19 
 20 # 就像Stephane Chazelas所给出的那样, 一个更容易理解的等价代码是: 
 21 route -n |
 22   while read des what mask iface; do   # 管道的输出被赋值给了变量. 
 23     echo $des $what $mask $iface
 24   done  #  这将产生出与上边相同的输出. 
 25         #  然而, Ulrich Gayer指出 . . .
 26         #+ 这个简单的等价版本在while循环中使用了一个子shell, 
 27         #+ 因此当管道结束后, 变量就消失了. 
 28 	
 29 
 30 	
 31 #  更进一步, Filip Moritz解释了上面两个例子之间存在一个细微的不同之处, 
 32 #+ 如下所示. 
 33 
 34 (
 35 route -n | while read x; do ((y++)); done
 36 echo $y # $y 仍然没有被声明或设置
 37 
 38 while read x; do ((y++)); done < <(route -n)
 39 echo $y # $y 的值为route -n的输出行数. 
 40 )
 41 
 42 # 一般来说, (译者注: 原书作者在这里并未加注释符号"#", 应该是笔误)
 43 (
 44 : | x=x
 45 # 看上去是启动了一个子shell
 46 : | ( x=x )
 47 # 但
 48 x=x < <(:)
 49 # 其实不是
 50 )
 51 
 52 # 当你要解析csv或类似东西的时侯, 这非常有用. 
 53 # 事实上, 这就是SuSE的这个代码片断所要实现的功能. </pre>

 |

### 注意事项

| [[1]](process-sub.md#AEN14284) | 

这与[命名管道](extmisc.md#NAMEDPIPEREF)(临时文件)具有相同的作用, 并且, 事实上, 命名管道也被同时使用在进程替换中.

 |
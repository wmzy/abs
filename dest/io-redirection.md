# 16\. I/O重定向

*   **目录**
*   16.1\. [使用exec](x13380.md)
*   16.2\. [代码块重定向](redircb.md)
*   16.3\. [重定向的应用](redirapps.md)

默认情况下始终有3个<span class="QUOTE">"文件"</span>处于打开状态, <tt class="FILENAME">stdin</tt>(键盘), <tt class="FILENAME">stdout</tt>(屏幕), 和<tt class="FILENAME">stderr</tt>(错误消息输出到屏幕上). 这3个文件和其他打开的文件都可以被重定向. 对于重定向简单的解释就是捕捉一个文件, 命令, 程序, 脚本, 或者是脚本中的代码块(请参考[例子 3-1](special-chars.md#EX8)和[例子 3-2](special-chars.md#RPMCHECK))的输出, 然后将这些输出作为输入发送到另一个文件, 命令, 程序, 或脚本中.

每个打开的文件都会被分配一个文件描述符. [[1]](#FTN.AEN13310) <tt class="FILENAME">stdin</tt>, <tt class="FILENAME">stdout</tt>, 和<tt class="FILENAME">stderr</tt>的文件描述符分别是0, 1, 和 2\. 除了这3个文件, 对于其他那些需要打开的文件, 保留了文件描述符3到9\. 在某些情况下, 将这些额外的文件描述符分配给<tt class="FILENAME">stdin</tt>, <tt class="FILENAME">stdout</tt>, 或<tt class="FILENAME">stderr</tt>作为临时的副本链接是非常有用的. [[2]](#FTN.AEN13320) 在经过复杂的重定向和刷新之后需要把它们恢复成正常状态(请参考[例子 16-1](x13380.md#REDIR1)).

| 

<pre class="PROGRAMLISTING">  1    COMMAND_OUTPUT >
  2       # 将stdout重定向到一个文件. 
  3       # 如果这个文件不存在, 那就创建, 否则就覆盖. 
  4 
  5       ls -lR > dir-tree.list
  6       # 创建一个包含目录树列表的文件. 
  7 
  8    : > filename
  9       # >操作, 将会把文件"filename"变为一个空文件(就是size为0). 
 10       # 如果文件不存在, 那么就创建一个0长度的文件(与'touch'的效果相同). 
 11       # :是一个占位符, 不产生任何输出. 
 12 
 13    > filename    
 14       # >操作, 将会把文件"filename"变为一个空文件(就是size为0). 
 15       # 如果文件不存在, 那么就创建一个0长度的文件(与'touch'的效果相同). 
 16       # (与上边的": >"效果相同, 但是某些shell可能不支持这种形式.)
 17 
 18    COMMAND_OUTPUT >>
 19       # 将stdout重定向到一个文件. 
 20       # 如果文件不存在, 那么就创建它, 如果存在, 那么就追加到文件后边. 
 21 
 22 
 23       # 单行重定向命令(只会影响它们所在的行): 
 24       # --------------------------------------------------------------------
 25 
 26    1>filename
 27       # 重定向stdout到文件"filename". 
 28    1>>filename
 29       # 重定向并追加stdout到文件"filename". 
 30    2>filename
 31       # 重定向stderr到文件"filename". 
 32    2>>filename
 33       # 重定向并追加stderr到文件"filename". 
 34    &>filename
 35       # 将stdout和stderr都重定向到文件"filename". 
 36 
 37    M>N
 38      # "M"是一个文件描述符, 如果没有明确指定的话默认为1\. 
 39      # "N"是一个文件名. 
 40      # 文件描述符"M"被重定向到文件"N". 
 41    M>&N
 42      # "M"是一个文件描述符, 如果没有明确指定的话默认为1\. 
 43      # "N"是另一个文件描述符. 
 44 
 45       #==============================================================================
 46 
 47       # 重定向stdout, 一次一行. 
 48       LOGFILE=script.log
 49 
 50       echo "This statement is sent to the log file, \"$LOGFILE\"." 1>$LOGFILE
 51       echo "This statement is appended to \"$LOGFILE\"." 1>>$LOGFILE
 52       echo "This statement is also appended to \"$LOGFILE\"." 1>>$LOGFILE
 53       echo "This statement is echoed to stdout, and will not appear in \"$LOGFILE\"."
 54       # 每行过后, 这些重定向命令会自动"reset". 
 55 
 56 
 57 
 58       # 重定向stderr, 一次一行. 
 59       ERRORFILE=script.errors
 60 
 61       bad_command1 2>$ERRORFILE       #  Error message sent to $ERRORFILE.
 62       bad_command2 2>>$ERRORFILE      #  Error message appended to $ERRORFILE.
 63       bad_command3                    #  Error message echoed to stderr,
 64                                       #+ and does not appear in $ERRORFILE.
 65       # 每行过后, 这些重定向命令也会自动"reset". 
 66       #==============================================================================
 67 
 68 
 69 
 70    2>&1
 71       # 重定向stderr到stdout. 
 72       # 将错误消息的输出, 发送到与标准输出所指向的地方. 
 73 
 74    i>&j
 75       # 重定向文件描述符_i_到_j_. 
 76       # 指向_i_文件的所有输出都发送到_j_. 
 77 
 78    >&j
 79       # 默认的, 重定向文件描述符_1_(stdout)到_j_. 
 80       # 所有传递到stdout的输出都送到_j_中去. 
 81 
 82    0< FILENAME
 83     < FILENAME
 84       # 从文件中接受输入. 
 85       # 与<span class="QUOTE">">"</span>是成对命令, 并且通常都是结合使用. 
 86       #
 87       # grep search-word <filename
 88 
 89 
 90    [j]<>filename
 91       # 为了读写"filename", 把文件"filename"打开, 并且将文件描述符"j"分配给它. 
 92       # 如果文件"filename"不存在, 那么就创建它. 
 93       # 如果文件描述符"j"没指定, 那默认是fd 0, stdin. 
 94       #
 95       # 这种应用通常是为了写到一个文件中指定的地方. 
 96       echo 1234567890 > File    # 写字符串到"File". 
 97       exec 3<> File             # 打开"File"并且将fd 3分配给它. 
 98       read -n 4 <&3             # 只读取4个字符. 
 99       echo -n . >&3             # 写一个小数点. 
100       exec 3>&-                 # 关闭fd 3.
101       cat File                  # ==> 1234.67890
102       # 随机访问. 
103 
104 
105 
106    |
107       # 管道. 
108       # 通用目的处理和命令链工具. 
109       # 与<span class="QUOTE">">"</span>, 很相似, 但是实际上更通用. 
110       # 对于想将命令, 脚本, 文件和程序串连起来的时候很有用. 
111       cat *.txt | sort | uniq > result-file
112       # 对所有.txt文件的输出进行排序, 并且删除重复行. 
113       # 最后将结果保存到<span class="QUOTE">"result-file"</span>中. </pre>

 |

可以将输入输出重定向和(或)管道的多个实例结合到一起写在同一行上.

| 

<pre class="PROGRAMLISTING">  1 command < input-file > output-file
  2 
  3 command1 | command2 | command3 > output-file</pre>

 |

请参考[例子 12-28](filearchiv.md#DERPM)和[例子 A-15](contributed-scripts.md#FIFO).

可以将多个输出流重定向到一个文件上.

| 

<pre class="PROGRAMLISTING">  1 ls -yz >> command.log 2>&1
  2 #  将错误选项"yz"的结果放到文件"command.log"中. 
  3 #  因为stderr被重定向到这个文件中, 
  4 #+ 所有的错误消息也就都指向那里了. 
  5 
  6 #   注意, 下边这个例子就不会给出相同的结果. 
  7 ls -yz 2>&1 >> command.log
  8 #  输出一个错误消息, 但是并不写到文件中. 
  9 
 10 #  如果将stdout和stderr都重定向, 
 11 #+ 命令的顺序会有些不同. </pre>

 |

**关闭文件描述符**

*   <span class="TOKEN">n<&-</span>
*   关闭输入文件描述符<tt class="REPLACEABLE">_n_</tt>.

*   <span class="TOKEN">0<&-</span>, <span class="TOKEN"><&-</span>
*   关闭<tt class="FILENAME">stdin</tt>.

*   <span class="TOKEN">n>&-</span>
*   关闭输出文件描述符<tt class="REPLACEABLE">_n_</tt>.

*   <span class="TOKEN">1>&-</span>, <span class="TOKEN">>&-</span>
*   关闭<tt class="FILENAME">stdout</tt>.

子进程继承了打开的文件描述符. 这就是为什么管道可以工作. 如果想阻止fd被继承, 那么可以关掉它.

| 

<pre class="PROGRAMLISTING">  1 # 只将stderr重定到一个管道. 
  2 
  3 exec 3>&1                              # 保存当前stdout的"值". 
  4 ls -l 2>&1 >&3 3>&- | grep bad 3>&-    # 对'grep'关闭fd 3(但不关闭'ls'). 
  5 #              ^^^^   ^^^^
  6 exec 3>&-                              # 对于剩余的脚本来说, 关闭它. 
  7 
  8 # 感谢, S.C. </pre>

 |

如果想了解关于I/O重定向更多的细节, 请参考[Appendix E](ioredirintro.md).

### 注意事项

| [[1]](io-redirection.md#AEN13310) | 

一个_文件描述符_说白了就是文件系统为了跟踪这个打开的文件而分配给它的一个数字. 也可以的将其理解为文件指针的一个简单版本. 与C语言中_文件句柄_的概念很相似.

 |
| [[2]](io-redirection.md#AEN13320) | 

使用<tt class="REPLACEABLE">_文件描述符5_</tt>可能会引起问题. 当Bash使用[exec](internal.md#EXECREF)创建一个子进程的时候, 子进程会继承fd5(参考Chet Ramey的归档e-mail, [SUBJECT: RE: File descriptor 5 is held open](http://www.geocrawler.com/archives/3/342/1996/1/0/1939805/)). 最好还是不要去招惹这个特定的fd.

 |
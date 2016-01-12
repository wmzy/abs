# 12.3\. 时间/日期 命令

**时间/日期和计时**

*   **date**
*   直接调用**date**命令就会把日期和时间输出到 <tt class="FILENAME">stdout</tt>上. 这个命令有趣的地方在于它的格式化和分析选项上.

    * * *

    **例子 12-10\. 使用**date**命令**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 练习'date'命令
      3 
      4 echo "The number of days since the year's beginning is `date +%j`."
      5 # 需要在调用格式的前边加上一个'+'号.
      6 # %j用来给出今天是本年度的第几天. 
      7 
      8 echo "The number of seconds elapsed since 01/01/1970 is `date +%s`."
      9 #  %s将产生从"UNIX 元年"到现在为止的秒数,
     10 #+ 但是这东西现在还有用么?
     11 
     12 prefix=temp
     13 suffix=$(date +%s)  # 'date'命令的"+%s"选项是GNU特性.
     14 filename=$prefix.$suffix
     15 echo $filename
     16 #  这是一种非常好的产生"唯一"临时文件的办法,
     17 #+ 甚至比使用$都强.
     18 
     19 # 如果想了解'date'命令的更多选项, 请查阅这个命令的man页.
     20 
     21 exit 0</pre>

     |

    * * *

    `-u`选项将给出UTC时间(Universal Coordinated Time).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">date</kbd>
    <samp class="COMPUTEROUTPUT">Fri Mar 29 21:07:39 MST 2002</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">date -u</kbd>
    <samp class="COMPUTEROUTPUT">Sat Mar 30 04:07:42 UTC 2002</samp>
    	      </pre>

     |

    **date**命令有许多的输出选项. 比如`%N`将以十亿分之一为单位表示当前时间. 这个选项的一个有趣的用法就是用来产生一个6位的随机数.

    | 

    <pre class="PROGRAMLISTING">  1 date +%N | sed -e 's/000$//' -e 's/^0//'
      2            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      3 # 去掉开头和结尾的0\. </pre>

     |

    当然, 还有许多其他的选项(请察看**man date**).

    | 

    <pre class="PROGRAMLISTING">  1 date +%j
      2 # 显示今天是本年度的第几天(从1月1日开始计算).
      3 
      4 date +%k%M
      5 # 使用24小时的格式来显示当前小时数和分钟数.
      6 
      7 
      8 
      9 # 'TZ'参数允许改变当前的默认时区.
     10 date                 # Mon Mar 28 21:42:16 MST 2005
     11 TZ=EST date          # Mon Mar 28 23:42:16 EST 2005
     12 # 感谢, Frank Kannemann 和 Pete Sjoberg 提供了这个技巧. 
     13 
     14 
     15 SixDaysAgo=$(date --date='6 days ago')
     16 OneMonthAgo=$(date --date='1 month ago')  # 四周前(不是一个月).
     17 OneYearAgo=$(date --date='1 year ago')</pre>

     |

    请参考[例子 3-4](special-chars.md#EX58).

*   **zdump**
*   时区dump: 查看特定时区的当前时间.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">zdump EST</kbd>
    <samp class="COMPUTEROUTPUT">EST  Tue Sep 18 22:09:22 2001 EST</samp>
    	      </pre>

     |

*   **time**
*   输出统计出来的命令执行的时间.

    <kbd class="USERINPUT">time ls -l /</kbd> 给出的输出大概是如下格式:

    | 

    <pre class="SCREEN"><samp class="COMPUTEROUTPUT">0.00user 0.01system 0:00.05elapsed 16%CPU (0avgtext+0avgdata 0maxresident)k
     0inputs+0outputs (149major+27minor)pagefaults 0swaps</samp></pre>

     |

    请参考前边章节所讲的一个类似的命令[times](x6756.md#TIMESREF).

    | ![Note](./images/note.gif) | 

    在Bash的[2.0版本](bashver2.md#BASH2REF)中, **time**成为了shell的一个保留字, 并且在一个带有管道的命令行中, 这个命令的行为有些小的变化.

     |

*   **touch**
*   这是一个用来更新文件被访问或修改的时间的工具, 这个时间可以是当前系统的时间,也可以是指定的时间, 这个命令也用来产生一个新文件. 命令<kbd class="USERINPUT">touch zzz</kbd>将产生一个<tt class="FILENAME">zzz</tt>为名字的0字节长度文件, 当然前提是<tt class="FILENAME">zzz</tt>文件不存在. 为了存储时间信息, 就需要一个时间戳为空的文件, 比如当你想跟踪一个工程的修改时间的时候, 这就非常有用了.

    | ![Note](./images/note.gif) | 

    **touch**命令等价于<kbd class="USERINPUT">: >> newfile</kbd>或<kbd class="USERINPUT">>> newfile</kbd>(对于一个普通文件).

     |

*   **at**
*   **at**命令是一个作业控制命令, 用来在指定时间点上执行指定的命令集合. 它有点像[cron](system.md#CRONREF)命令, 然而, **at**命令主要还是用来执行那种一次性执行的命令集合.

    <kbd class="USERINPUT">at 2pm January 15</kbd>将会产生提示, 提示你输入需要在这个时间上需要执行的命令序列. 这些命令应该是可以和shll脚本兼容的, 因为实际上在一个可执行的脚本中, 用户每次只能输入一行. 输入将以[Ctl-D](special-chars.md#CTLDREF)结束.

    你可以使用`-f`选项或者使用(<span class="TOKEN"><</span>)重定向操作符, 来让**at**命令从一个文件中读取命令集合. 这个文件其实就一个可执行的的脚本, 虽然它是一个不可交互的脚本. 在文件中包含一个[run-parts](extmisc.md#RUNPARTSREF)命令, 对于执行一套不同的脚本来说是非常聪明的做法.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">at 2:30 am Friday < at-jobs.list</kbd>
    <samp class="COMPUTEROUTPUT">job 2 at 2000-10-27 02:30</samp>
    	      </pre>

     |

*   **batch**
*   **batch**作业控制命令与**at**令的行为很相像, 但是**batch**命令被用来在系统平均负载量降到<tt class="LITERAL">.8</tt>以下时执行一次性的任务. 与**at**命令相似的是, 它也可以使用`-f`选项来从文件中读取命令.

*   **cal**
*   从<tt class="FILENAME">stdout</tt>中输出一个格式比较整齐的日历. 既可以指定当前年度, 也可以指定过去或将来的某个年度.

*   **sleep**
*   这个命令与一个等待循环的效果一样. 你可以指定需要暂停的秒数, 这段时间将什么都不干. 当一个后台运行的进程需要偶尔检测一个事件时, 这个功能很有用. 也可用于计时. 请参考[例子 29-6](debugging.md#ONLINE).

    | 

    <pre class="PROGRAMLISTING">  1 sleep 3     # 暂停3秒. </pre>

     |

    | ![Note](./images/note.gif) | 

    **sleep**默认是以秒为单位, 但是你也可以指定分钟, 小时, 或者天数为单位.

    | 

    <pre class="PROGRAMLISTING">  1 sleep 3 h   # 暂停3小时!</pre>

     |

     |

    | ![Note](./images/note.gif) | 

    如果你想每隔一段时间来运行一个命令的话, 那么[watch](system.md#WATCHREF)命令将比**sleep**命令好得多.

     |

*   **usleep**
*   _指定需要sleep的微秒数_ (<span class="QUOTE">"u"</span>会被希腊人读成<span class="QUOTE">"mu"</span>, 或者是 micro- 前缀). 与上边的**sleep**命令相同, 但这个命令以微秒为单位. 当需要精确计时, 或者需要非常频繁的监控一个正在运行进程的时候, 这个命令非常有用.

    | 

    <pre class="PROGRAMLISTING">  1 usleep 30     # 暂停30微秒. </pre>

     |

    这个命令是Red Hat的_initscripts / rc-scripts_包的一部分.

    | ![Caution](./images/caution.gif) | 

    事实上**usleep**命令并不能提供非常精确的计时, 所以如果你需要运行一个实时的任务的话, 这个命令并不适合.

     |

*   **hwclock**, **clock**
*   **hwclock**命令可以访问或调整硬件时钟. 这个命令的一些选项需要具有root权限. 在系统启动的时候, <tt class="FILENAME">/etc/rc.d/rc.sysinit</tt>, 会使用**hwclock**来从硬件时钟中读取并设置系统时间.

    **clock**命令与**hwclock**命令完全相同.
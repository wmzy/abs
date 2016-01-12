# 9.1\. 内部变量

*   <tt class="REPLACEABLE">_内建变量_</tt>
*   这些变量将会影响bash脚本的行为.

*   `$BASH`
*   _Bash_的二进制程序文件的路径

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $BASH</kbd>
    <samp class="COMPUTEROUTPUT">/bin/bash</samp></pre>

     |

*   `$BASH_ENV`
*   这个[环境变量](othertypesv.md#ENVREF)会指向一个Bash的启动文件, 当一个脚本被调用的时候, 这个启动文件将会被读取.

*   `$BASH_SUBSHELL`
*   这个变量用来提示[子shell](subshells.md#SUBSHELLSREF)的层次. 这是一个Bash的新特性, 直到[版本3](bashver3.md#BASH3REF)的Bash才被引入近来.

    参考[例子 20-1](subshells.md#SUBSHELL)中的用法.

*   `$BASH_VERSINFO[n]`
*   这是一个含有6个元素的[数组](arrays.md#ARRAYREF), 它包含了所安装的Bash的版本信息. 这与下边的`$BASH_VERSION`很相像, 但是这个更加详细一些.

    | 

    <pre class="PROGRAMLISTING">  1 # Bash version info:
      2 
      3 for n in 0 1 2 3 4 5
      4 do
      5   echo "BASH_VERSINFO[$n] = ${BASH_VERSINFO[$n]}"
      6 done  
      7 
      8 # BASH_VERSINFO[0] = 3                      # 主版本号.
      9 # BASH_VERSINFO[1] = 00                     # 次版本号.
     10 # BASH_VERSINFO[2] = 14                     # 补丁次数.
     11 # BASH_VERSINFO[3] = 1                      # 编译版本.
     12 # BASH_VERSINFO[4] = release                # 发行状态.
     13 # BASH_VERSINFO[5] = i386-redhat-linux-gnu  # 结构体系
     14                                             # (与变量$MACHTYPE相同).</pre>

     |

*   `$BASH_VERSION`
*   安装在系统上的Bash版本号

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $BASH_VERSION</kbd>
    <samp class="COMPUTEROUTPUT">3.00.14(1)-release</samp>
    	      </pre>

     |

    | 

    <pre class="SCREEN"><samp class="PROMPT">tcsh%</samp> <kbd class="USERINPUT">echo $BASH_VERSION</kbd>
    <samp class="COMPUTEROUTPUT">BASH_VERSION: Undefined variable.</samp>
    	      </pre>

     |

    检查$BASH_VERSION对于判断系统上到底运行的是哪个shell来说是一种非常好的方法. 变量[$SHELL](internalvariables.md#SHELLVARREF)有时候不能够给出正确的答案.

*   `$DIRSTACK`
*   在目录栈中最顶端的值. (将会受到[pushd](internal.md#PUSHDREF)和[popd](internal.md#POPDREF)的影响)

    这个内建变量与[dirs](internal.md#DIRSD)命令相符, 但是**dirs**命令会显示目录栈的整个内容.

*   `$EDITOR`
*   脚本所调用的默认编辑器, 通常情况下是**vi**或者是**emacs**.

*   `$EUID`
*   <span class="QUOTE">"有效"</span>用户ID

    不管当前用户被假定成什么用户, 这个数都用来表示当前用户的标识号, 也可能使用[su](system.md#SUREF)命令来达到假定的目的.

    | ![Caution](./images/caution.gif) | 

    `$EUID`并不一定与[$UID](internalvariables.md#UIDREF)相同.

     |

*   `$FUNCNAME`
*   当前函数的名字

    | 

    <pre class="PROGRAMLISTING">  1 xyz23 ()
      2 {
      3   echo "$FUNCNAME now executing."  # 打印: xyz23 now executing.
      4 }
      5 
      6 xyz23
      7 
      8 echo "FUNCNAME = $FUNCNAME"        # FUNCNAME =
      9                                    # 超出函数的作用域就变为null值了. </pre>

     |

*   `$GLOBIGNORE`
*   一个文件名的模式匹配列表, 如果在[通配(globbing)](globbingref.md)中匹配到的文件包含有这个列表中的某个文件, 那么这个文件将被从匹配到的结果中去掉.

*   `$GROUPS`
*   目前用户所属的组

    这是一个当前用户的组id列表(数组), 与记录在<tt class="FILENAME">/etc/passwd</tt>文件中的内容一样.

    | 

    <pre class="SCREEN"><samp class="PROMPT">root#</samp> <kbd class="USERINPUT">echo $GROUPS</kbd>
    <samp class="COMPUTEROUTPUT">0</samp>

    <samp class="PROMPT">root#</samp> <kbd class="USERINPUT">echo ${GROUPS[1]}</kbd>
    <samp class="COMPUTEROUTPUT">1</samp>

    <samp class="PROMPT">root#</samp> <kbd class="USERINPUT">echo ${GROUPS[5]}</kbd>
    <samp class="COMPUTEROUTPUT">6</samp>
    	      </pre>

     |

*   `$HOME`
*   用户的home目录, 一般是<tt class="FILENAME">/home/username</tt>(参见[例子 9-15](parameter-substitution.md#EX6))

*   `$HOSTNAME`
*   [hostname](system.md#HNAMEREF)放在一个初始化脚本中, 在系统启动的时候分配一个系统名字. 然而, `gethostname()`函数可以用来设置这个Bash内部变量`$HOSTNAME`. 参见[例子 9-15](parameter-substitution.md#EX6).

*   `$HOSTTYPE`
*   主机类型

    就像[$MACHTYPE](internalvariables.md#MACHTYPEREF), 用来识别系统硬件.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $HOSTTYPE</kbd>
    <samp class="COMPUTEROUTPUT">i686</samp></pre>

     |

*   `$IFS`
*   内部域分隔符

    这个变量用来决定Bash在解释字符串时如何识别域, 或者单词边界.

    $IFS默认为[空白](special-chars.md#WHITESPACEREF)(空格, 制表符,和换行符), 但这是可以修改的, 比如, 在分析逗号分隔的数据文件时, 就可以设置为逗号. 注意[$*](internalvariables.md#APPREF)使用的是保存在`$IFS`中的第一个字符. 参见[例子 5-1](quotingvar.md#WEIRDVARS).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $IFS | cat -vte</kbd>
    <samp class="COMPUTEROUTPUT">$</samp>
    <samp class="COMPUTEROUTPUT">(Show tabs and display "$" at end-of-line.)</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">bash -c 'set w x y z; IFS=":-;"; echo "$*"'</kbd>
    <samp class="COMPUTEROUTPUT">w:x:y:z</samp>
    <samp class="COMPUTEROUTPUT">(从字符串中读取命令, 并分配参数给位置参数.)</samp>
    	      </pre>

     |

    | ![Caution](./images/caution.gif) | 

    `$IFS`处理其他字符与处理空白字符不同.

    * * *

    **例子 9-1\. $IFS与空白字符**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # $IFS 处理空白与处理其他字符不同. 
      3 
      4 output_args_one_per_line()
      5 {
      6   for arg
      7   do echo "[$arg]"
      8   done
      9 }
     10 
     11 echo; echo "IFS=\" \""
     12 echo "-------"
     13 
     14 IFS=" "
     15 var=" a  b c   "
     16 output_args_one_per_line $var  # output_args_one_per_line `echo " a  b c   "`
     17 #
     18 # [a]
     19 # [b]
     20 # [c]
     21 
     22 
     23 echo; echo "IFS=:"
     24 echo "-----"
     25 
     26 IFS=:
     27 var=":a::b:c:::"               # 与上边一样, 但是用" "替换了":".
     28 output_args_one_per_line $var
     29 #
     30 # []
     31 # [a]
     32 # []
     33 # [b]
     34 # [c]
     35 # []
     36 # []
     37 # []
     38 
     39 # 同样的事情也会发生在awk的"FS"域中.
     40 
     41 # 感谢, Stephane Chazelas.
     42 
     43 echo
     44 
     45 exit 0</pre>

     |

    * * *

     |

    (感谢, S. C., 进行了澄清与举例.)

    参见[例子 12-37](communications.md#ISSPAMMER), [例子 10-7](loops1.md#BINGREP), 和[例子 17-14](x13628.md#MAILBOXGREP) 都是展示如何使用`$IFS`的例子.

*   `$IGNOREEOF`
*   忽略EOF: 告诉shell在log out之前要忽略多少文件结束符(control-D).

*   `$LC_COLLATE`
*   常在<tt class="FILENAME">.bashrc</tt>或<tt class="FILENAME">/etc/profile</tt>中设置, 这个变量用来控制文件名扩展和模式匹配的展开顺序. 如果$LC_COLLATE设置得不正确的话, `LC_COLLATE`会在[文件名匹配(filename globbing)](globbingref.md)中产生不可预料的结果.

    | ![Note](./images/note.gif) | 

    在2.05以后的Bash版本中, 文件名匹配(filename globbing)将不在区分中括号结构中的字符范围里字符的大小写. 比如, **ls [A-M]*** 既能够匹配为<tt class="FILENAME">File1.txt</tt>也能够匹配为<tt class="FILENAME">file1.txt</tt>. 为了能够恢复中括号里字符的匹配行为(即区分大小写), 可以设置变量`LC_COLLATE`为`C`, 在文件<tt class="FILENAME">/etc/profile</tt>或<tt class="FILENAME">~/.bashrc</tt>中使用<kbd class="USERINPUT">export LC_COLLATE=C</kbd>, 可以达到这个目的.

     |

*   `$LC_CTYPE`
*   这个内部变量用来控制[通配(globbing)](globbingref.md)和模式匹配中的字符串解释.

*   `$LINENO`
*   这个变量用来记录自身在脚本中所在的行号. 这个变量只有在脚本使用这个变量的时候才有意义, 并且这个变量一般用于调试目的.

    | 

    <pre class="PROGRAMLISTING">  1 # *** 调试代码块开始 ***
      2 last_cmd_arg=$_  # Save it.
      3 
      4 echo "At line number $LINENO, variable \"v1\" = $v1"
      5 echo "Last command argument processed = $last_cmd_arg"
      6 # *** 调试代码块结束 ***</pre>

     |

*   `$MACHTYPE`
*   机器类型

    标识系统的硬件.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $MACHTYPE</kbd>
    <samp class="COMPUTEROUTPUT">i686</samp></pre>

     |

*   `$OLDPWD`
*   之前的工作目录(<span class="QUOTE">"OLD-print-working-directory"</span>, 就是之前你所在的目录)

*   `$OSTYPE`
*   操作系统类型

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $OSTYPE</kbd>
    <samp class="COMPUTEROUTPUT">linux</samp></pre>

     |

*   `$PATH`
*   可执行文件的搜索路径, 一般为<tt class="FILENAME">/usr/bin/</tt>, <tt class="FILENAME">/usr/X11R6/bin/</tt>, <tt class="FILENAME">/usr/local/bin</tt>, 等等.

    当给出一个命令时, shell会自动生成一张哈希(hash)表, 并且在这张哈希表中按照_path_变量中所列出的路径来搜索这个可执行命令. 路径会存储在[环境变量](othertypesv.md#ENVREF)中, `$PATH`变量本身就一个以冒号分隔的目录列表. 通常情况下, 系统都是在<tt class="FILENAME">/etc/profile</tt>和<tt class="FILENAME">~/.bashrc</tt>中存储`$PATH`的定义. (参考[Appendix G](files.md)).

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> **echo $PATH**
    <samp class="COMPUTEROUTPUT">/bin:/usr/bin:/usr/local/bin:/usr/X11R6/bin:/sbin:/usr/sbin</samp></pre>

     |

    <kbd class="USERINPUT">PATH=${PATH}:/opt/bin</kbd>将会把目录<tt class="FILENAME">/opt/bin</tt>附加到当前目录列表中. 在脚本中, 这是一种把目录临时添加到$PATH中的权宜之计. 当这个脚本退出时, `$PATH`将会恢复以前的值(一个子进程, 比如说一个脚本, 是不能够修改父进程的环境变量的, 在这里也就是不能够修改shell本身的环境变量, -- 译者注: 也就是脚本所运行的这个shell).

    | ![Note](./images/note.gif) | 

    当前的<span class="QUOTE">"工作目录"</span>, <tt class="FILENAME">./</tt>, 通常是不会出现在`$PATH`中的, 这样做的目的是出于安全的考虑.

     |

*   `$PIPESTATUS`
*   这个[数组](arrays.md#ARRAYREF)变量将保存最后一个运行的_前台_[管道](special-chars.md#PIPEREF)的退出状态码. 相当有趣的是, 这个退出状态码和最后一个命令运行的[退出状态码](exit-status.md#EXITSTATUSREF)并不一定相同.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $PIPESTATUS</kbd>
    <samp class="COMPUTEROUTPUT">0</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -al | bogus_command</kbd>
    <samp class="COMPUTEROUTPUT">bash: bogus_command: command not found</samp>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $PIPESTATUS</kbd>
    <samp class="COMPUTEROUTPUT">141</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -al | bogus_command</kbd>
    <samp class="COMPUTEROUTPUT">bash: bogus_command: command not found</samp>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $?</kbd>
    <samp class="COMPUTEROUTPUT">127</samp>
    	      </pre>

     |

    `$PIPESTATUS`数组的每个成员都保存了运行在管道中的相应命令的退出状态码. `$PIPESTATUS[0]`保存管道中第一个命令的退出状态码. `$PIPESTATUS[1]`保存第二个命令的退出状态码, 依此类推.

    | ![Caution](./images/caution.gif) | 

    `$PIPESTATUS`变量在一个登陆的shell中可能会包含一个不正确<span class="ERRORCODE">0</span>值(在3.0以下版本).

    | 

    <pre class="SCREEN"><samp class="PROMPT">tcsh%</samp> <kbd class="USERINPUT">bash</kbd>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">who | grep nobody | sort</kbd>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo ${PIPESTATUS[*]}</kbd>
    <samp class="COMPUTEROUTPUT">0</samp>
    	      </pre>

     |

    如果一个脚本包含了上边的这行, 那么将会产生我们所期望的<samp class="COMPUTEROUTPUT">0 1 0</samp>的输出.

    感谢, Wayne Pollock指出这一点并提供了上边的例子.

     |

    | ![Note](./images/note.gif) | 

    在某些上下文中, 变量`$PIPESTATUS`可能不会给出期望的结果.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $BASH_VERSION</kbd>
    <samp class="COMPUTEROUTPUT">3.00.14(1)-release</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">$ ls | bogus_command | wc</kbd>
    <samp class="COMPUTEROUTPUT">bash: bogus_command: command not found
     0       0       0</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo ${PIPESTATUS[@]}</kbd>
    <samp class="COMPUTEROUTPUT">141 127 0</samp>
    	      </pre>

     |

    Chet Ramey把上边输出不正确的原因归咎于[ls](basic.md#LSREF)的行为. 因为如果把_ls_的结果放到管道上, 并且这个输出并没有被读取, 那么SIGPIPE将会杀掉它, 同时[退出状态码](exit-status.md#EXITSTATUSREF)变为<span class="RETURNVALUE">141</span>. 而不是我们所期望的<span class="RETURNVALUE">0</span>. 这种情况也会发生在[tr](textproc.md#TRREF)命令中.

     |

    | ![Note](./images/note.gif) | 

    `$PIPESTATUS`是一个<span class="QUOTE">"不稳定"</span>变量. 这个变量需要在任何命令干涉之前, 并在管道询问之后立刻被查询.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">$ ls | bogus_command | wc</kbd>
    <samp class="COMPUTEROUTPUT">bash: bogus_command: command not found
     0       0       0</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo ${PIPESTATUS[@]}</kbd>
    <samp class="COMPUTEROUTPUT">0 127 0</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo ${PIPESTATUS[@]}</kbd>
    <samp class="COMPUTEROUTPUT">0</samp>
    	      </pre>

     |

     |

*   `$PPID`
*   进程的`$PPID`就是这个进程的父进程的进程ID(`pid`). [[1]](#FTN.AEN4091)

    和[pidof](system.md#PIDOFREF)命令比较一下.

*   `$PROMPT_COMMAND`
*   这个变量保存了在主提示符`$PS1`显示之前需要执行的命令.

*   `$PS1`
*   这是主提示符, 可以在命令行中见到它.

*   `$PS2`
*   第二提示符, 当你需要额外输入的时候, 你就会看到它. 默认显示<span class="QUOTE">">"</span>.

*   `$PS3`
*   第三提示符, 它在一个[select](testbranch.md#SELECTREF)循环中显示(参见[例子 10-29](testbranch.md#EX31)).

*   `$PS4`
*   第四提示符, 当你使用<span class="TOKEN">-x</span>[选项](options.md#OPTIONSREF)来调用脚本时, 这个提示符会出现在每行输出的开头. 默认显示<span class="QUOTE">"+"</span>.

*   `$PWD`
*   工作目录(你当前所在的目录)

    这与内建命令[pwd](internal.md#PWD2REF)作用相同.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 E_WRONG_DIRECTORY=73
      4 
      5 clear # 清屏.
      6 
      7 TargetDirectory=/home/bozo/projects/GreatAmericanNovel
      8 
      9 cd $TargetDirectory
     10 echo "Deleting stale files in $TargetDirectory."
     11 
     12 if [ "$PWD" != "$TargetDirectory" ]
     13 then    # 防止偶然删错目录.
     14   echo "Wrong directory!"
     15   echo "In $PWD, rather than $TargetDirectory!"
     16   echo "Bailing out!"
     17   exit $E_WRONG_DIRECTORY
     18 fi  
     19 
     20 rm -rf *
     21 rm .[A-Za-z0-9]*    # 删除点文件(译者注: 隐藏文件). 
     22 # rm -f .[^.]* ..?*   为了删除以多个点开头的文件. 
     23 # (shopt -s dotglob; rm -f *)   也可以.
     24 # 感谢, S.C. 指出这点.
     25 
     26 # 文件名可以包含ascii中0 - 255范围内的所有字符, 除了"/".
     27 # 删除以各种诡异字符开头的文件将会作为一个练习留给大家.
     28 
     29 # 如果必要的话, 这里预留给其他操作.
     30 
     31 echo
     32 echo "Done."
     33 echo "Old files deleted in $TargetDirectory."
     34 echo
     35 
     36 
     37 exit 0</pre>

     |

*   `$REPLY`
*   当没有参数变量提供给[read](internal.md#READREF)命令的时候, 这个变量会作为默认变量提供给read命令. 也可以用于[select](testbranch.md#SELECTREF)菜单, 但是只提供所选择变量的编号, 而不是变量本身的值.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # reply.sh
      3 
      4 # REPLY是提供给'read'命令的默认变量.
      5 
      6 echo
      7 echo -n "What is your favorite vegetable? "
      8 read
      9 
     10 echo "Your favorite vegetable is $REPLY."
     11 #  当且仅当没有变量提供给"read"命令时, 
     12 #+ REPLY才保存最后一个"read"命令读入的值.
     13 
     14 echo
     15 echo -n "What is your favorite fruit? "
     16 read fruit
     17 echo "Your favorite fruit is $fruit."
     18 echo "but..."
     19 echo "Value of \$REPLY is still $REPLY."
     20 #  $REPLY还是保存着上一个read命令的值,
     21 #+ 因为变量$fruit被传入到了这个新的"read"命令中.
     22 
     23 echo
     24 
     25 exit 0</pre>

     |

*   `$SECONDS`
*   这个脚本已经运行的时间(以秒为单位).

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 TIME_LIMIT=10
      4 INTERVAL=1
      5 
      6 echo
      7 echo "Hit Control-C to exit before $TIME_LIMIT seconds."
      8 echo
      9 
     10 while [ "$SECONDS" -le "$TIME_LIMIT" ]
     11 do
     12   if [ "$SECONDS" -eq 1 ]
     13   then
     14     units=second
     15   else  
     16     units=seconds
     17   fi
     18 
     19   echo "This script has been running $SECONDS $units."
     20   #  在一台比较慢或者是附载过大的机器上, 
     21   #+ 在单次循环中, 脚本可能会忽略计数. 
     22   sleep $INTERVAL
     23 done
     24 
     25 echo -e "\a"  # Beep!(哔哔声!)
     26 
     27 exit 0</pre>

     |

*   `$SHELLOPTS`
*   shell中已经激活的[选项](options.md#OPTIONSREF)的列表, 这是一个只读变量.

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $SHELLOPTS</kbd>
    <samp class="COMPUTEROUTPUT">braceexpand:hashall:histexpand:monitor:history:interactive-comments:emacs</samp>
    	      </pre>

     |

*   `$SHLVL`
*   Shell级别, 就是Bash被嵌套的深度. 如果是在命令行中, 那么$SHLVL为1, 如果在脚本中那么$SHLVL为2\.

*   `$TMOUT`
*   如果<tt class="REPLACEABLE">_$TMOUT_</tt>环境变量被设置为非零值_time_的话, 那么经过_time_秒后, shell提示符将会超时. 这将会导致登出(logout).

    在2.05b版本的Bash中, <tt class="REPLACEABLE">_$TMOUT_</tt>变量与命令[read](internal.md#READREF)可以在脚本中结合使用.

    | 

    <pre class="PROGRAMLISTING">  1 # 只能够在Bash脚本中使用, 必须使用2.05b或之后版本的Bash.
      2 
      3 TMOUT=3    # 提示输入时间为3秒.
      4 
      5 echo "What is your favorite song?"
      6 echo "Quickly now, you only have $TMOUT seconds to answer!"
      7 read song
      8 
      9 if [ -z "$song" ]
     10 then
     11   song="(no answer)"
     12   # 默认响应.
     13 fi
     14 
     15 echo "Your favorite song is $song."</pre>

     |

    还有更加复杂的办法可以在脚本中实现定时输入. 一种办法就是建立一个定式循环, 当超时的时候给脚本发个信号. 不过这也需要有一个信号处理例程能够捕捉(参见[例子 29-5](debugging.md#EX76))由定时循环所产生的中断. (哇欧!).

    * * *

    **例子 9-2\. 定时输入**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # timed-input.sh
      3 
      4 # TMOUT=3    在新一些的Bash版本上也能运行的很好.
      5 
      6 
      7 TIMELIMIT=3  # 这个例子中设置的是3秒. 也可以设置为其他的时间值.
      8 
      9 PrintAnswer()
     10 {
     11   if [ "$answer" = TIMEOUT ]
     12   then
     13     echo $answer
     14   else       # 别和上边的例子弄混了.
     15     echo "Your favorite veggie is $answer"
     16     kill $!  # 不再需要后台运行的TimerOn函数了, kill了吧.
     17              # $! 变量是上一个在后台运行的作业的PID.
     18   fi
     19 
     20 }  
     21 
     22 
     23 
     24 TimerOn()
     25 {
     26   sleep $TIMELIMIT && kill -s 14 $ &
     27   # 等待3秒, 然后给脚本发送一个信号.
     28 }  
     29 
     30 Int14Vector()
     31 {
     32   answer="TIMEOUT"
     33   PrintAnswer
     34   exit 14
     35 }  
     36 
     37 trap Int14Vector 14   # 定时中断(14)会暗中给定时间限制. 
     38 
     39 echo "What is your favorite vegetable "
     40 TimerOn
     41 read answer
     42 PrintAnswer
     43 
     44 
     45 #  无可否认, 这是一个定时输入的复杂实现,
     46 #+ 然而"read"命令的"-t"选项可以简化这个任务. 
     47 #  参考后边的"t-out.sh".
     48 
     49 #  如果你需要一个真正优雅的写法...
     50 #+ 建议你使用C或C++来重写这个应用,
     51 #+ 你可以使用合适的函数库, 比如'alarm'和'setitimer'来完成这个任务.
     52 
     53 exit 0</pre>

     |

    * * *

    另一种选择是使用[stty](system.md#STTYREF).

    * * *

    **例子 9-3\. 再来一个, 定时输入**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # timeout.sh
      3 
      4 #  由Stephane Chazelas所编写,
      5 #+ 本书作者做了一些修改.
      6 
      7 INTERVAL=5                # 超时间隔
      8 
      9 timedout_read() {
     10   timeout=$1
     11   varname=$2
     12   old_tty_settings=`stty -g`
     13   stty -icanon min 0 time ${timeout}0
     14   eval read $varname      # 或者仅仅读取$varname变量
     15   stty "$old_tty_settings"
     16   # 参考"stty"的man页.
     17 }
     18 
     19 echo; echo -n "What's your name? Quick! "
     20 timedout_read $INTERVAL your_name
     21 
     22 #  这种方法可能并不是在每种终端类型上都可以正常使用的.
     23 #  最大的超时时间依赖于具体的中断类型.
     24 #+ (通常是25.5秒).
     25 
     26 echo
     27 
     28 if [ ! -z "$your_name" ]  # 如果在超时之前名字被键入...
     29 then
     30   echo "Your name is $your_name."
     31 else
     32   echo "Timed out."
     33 fi
     34 
     35 echo
     36 
     37 # 这个脚本的行为可能与脚本"timed-input.sh"的行为有些不同.
     38 # 每次按键, 计时器都会重置(译者注: 就是从0开始).
     39 
     40 exit 0</pre>

     |

    * * *

    可能最简单的办法就是使用`-t`选项来[read](internal.md#READREF)了.

    * * *

    **例子 9-4\. 定时**read****

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # t-out.sh
      3 # 从"syngin seven"的建议中得到的灵感 (感谢).
      4 
      5 
      6 TIMELIMIT=4         # 4秒
      7 
      8 read -t $TIMELIMIT variable <&1
      9 #                           ^^^
     10 #  在这个例子中, 对于Bash 1.x和2.x就需要"<&1"了,
     11 #  但是Bash 3.x就不需要.
     12 
     13 echo
     14 
     15 if [ -z "$variable" ]  # 值为null?
     16 then
     17   echo "Timed out, variable still unset."
     18 else  
     19   echo "variable = $variable"
     20 fi  
     21 
     22 exit 0</pre>

     |

    * * *

*   `$UID`
*   用户ID号

    当前用户的用户标识号, 记录在<tt class="FILENAME">/etc/passwd</tt>文件中

    这是当前用户的真实id, 即使只是通过使用[su](system.md#SUREF)命令来临时改变为另一个用户标识, 这个id也不会被改变. `$UID`是一个只读变量, 不能在命令行或者脚本中修改它, 并且和[id](system.md#IDREF)内建命令很相像.

    * * *

    **例子 9-5\. 我是root么?**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # am-i-root.sh:   我是不是root用户?
      3 
      4 ROOT_UID=0   # Root的$UID为0.
      5 
      6 if [ "$UID" -eq "$ROOT_UID" ]  # 只有真正的"root"才能经受得住考验?
      7 then
      8   echo "You are root."
      9 else
     10   echo "You are just an ordinary user (but mom loves you just the same)."
     11 fi
     12 
     13 exit 0
     14 
     15 
     16 # ============================================= #
     17 # 下边的代码不会执行, 因为脚本在上边已经退出了.
     18 
     19 # 下边是另外一种判断root用户的方法:
     20 
     21 ROOTUSER_NAME=root
     22 
     23 username=`id -nu`              # 或者...   username=`whoami`
     24 if [ "$username" = "$ROOTUSER_NAME" ]
     25 then
     26   echo "Rooty, toot, toot. You are root."
     27 else
     28   echo "You are just a regular fella."
     29 fi</pre>

     |

    * * *

    也请参考一下[例子 2-3](sha-bang.md#EX2).

    | ![Note](./images/note.gif) | 

    变量`$ENV`, `$LOGNAME`, `$MAIL`, `$TERM`, `$USER`, 和`$USERNAME`都_不是_Bash的[内建](internal.md#BUILTINREF)变量. 然而这些变量经常在Bash的[启动文件](files.md#FILESREF1)中被当作[环境变量](othertypesv.md#ENVREF)来设置. `$SHELL`是用户登陆shell的名字, 它可以在<tt class="FILENAME">/etc/passwd</tt>中设置, 或者也可以在<span class="QUOTE">"init"</span>脚本中设置, 并且它也不是Bash内建的.

    | 

    <pre class="SCREEN"><samp class="PROMPT">tcsh%</samp> <kbd class="USERINPUT">echo $LOGNAME</kbd>
    <samp class="COMPUTEROUTPUT">bozo</samp>
    <samp class="PROMPT">tcsh%</samp> <kbd class="USERINPUT">echo $SHELL</kbd>
    <samp class="COMPUTEROUTPUT">/bin/tcsh</samp>
    <samp class="PROMPT">tcsh%</samp> <kbd class="USERINPUT">echo $TERM</kbd>
    <samp class="COMPUTEROUTPUT">rxvt</samp>

    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $LOGNAME</kbd>
    <samp class="COMPUTEROUTPUT">bozo</samp>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $SHELL</kbd>
    <samp class="COMPUTEROUTPUT">/bin/tcsh</samp>
    <samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $TERM</kbd>
    <samp class="COMPUTEROUTPUT">rxvt</samp>
    	      </pre>

     |

     |

**位置参数**

*   `$0`, `$1`, `$2`, 等等.
*   位置参数, 从命令行传递到脚本, 或者传递给函数, 或者[set](internal.md#SETREF)给变量(参见[例子 4-5](othertypesv.md#EX17)和[例子 11-15](internal.md#EX34))

*   `$#`
*   命令行参数 [[2]](#FTN.AEN4390) 或者位置参数的个数(参见[例子 33-2](wrapper.md#EX4))

*   `$*`
*   所有的位置参数都被看作为一个单词.

    | ![Note](./images/note.gif) | 

    <span class="QUOTE">"`$*`"</span>必须被引用起来.

     |

*   `$@`
*   与<span class="TOKEN">$*</span>相同, 但是每个参数都是一个独立的引用字符串, 这就意味着, 参数是被完整传递的, 并没有被解释或扩展. 这也意味着, 参数列表中每个参数都被看作为单独的单词.

    | ![Note](./images/note.gif) | 

    当然, <span class="QUOTE">"`$@`"</span>应该被引用起来.

     |

    * * *

    **例子 9-6\. **arglist**: 通过$*和$@列出所有的参数**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # arglist.sh
      3 # 多使用几个参数来调用这个脚本, 比如"one two three".
      4 
      5 E_BADARGS=65
      6 
      7 if [ ! -n "$1" ]
      8 then
      9   echo "Usage: `basename $0` argument1 argument2 etc."
     10   exit $E_BADARGS
     11 fi  
     12 
     13 echo
     14 
     15 index=1          # 起始计数.
     16 
     17 echo "Listing args with \"\$*\":"
     18 for arg in "$*"  # 如果"$*"不被""引用,那么将不能正常地工作.
     19 do
     20   echo "Arg #$index = $arg"
     21   let "index+=1"
     22 done             # $* 将所有的参数看成一个单词.
     23 echo "Entire arg list seen as single word."
     24 
     25 echo
     26 
     27 index=1          # 重置计数(译者注: 从1开始).
     28                  # 如果你写这句会发生什么?
     29 
     30 echo "Listing args with \"\$@\":"
     31 for arg in "$@"
     32 do
     33   echo "Arg #$index = $arg"
     34   let "index+=1"
     35 done             # $@ 把每个参数都看成是单独的单词.
     36 echo "Arg list seen as separate words."
     37 
     38 echo
     39 
     40 index=1          # 重置计数(译者注: 从1开始).
     41 
     42 echo "Listing args with \$* (unquoted):"
     43 for arg in $*
     44 do
     45   echo "Arg #$index = $arg"
     46   let "index+=1"
     47 done             # 未引用的$*将会把参数看成单独的单词. 
     48 echo "Arg list seen as separate words."
     49 
     50 exit 0</pre>

     |

    * * *

    **shift**命令执行以后, `$@`将会保存命令行中剩余的参数, 但是没有之前的`$1`, 因为被丢弃了.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 使用 ./scriptname 1 2 3 4 5 来调用这个脚本
      3 
      4 echo "$@"    # 1 2 3 4 5
      5 shift
      6 echo "$@"    # 2 3 4 5
      7 shift
      8 echo "$@"    # 3 4 5
      9 
     10 # 每次"shift"都会丢弃$1.
     11 # "$@" 将包含剩下的参数. </pre>

     |

    `$@`也可以作为工具使用, 用来过滤传递给脚本的输入. **cat "$@"**结构既可以接受从<tt class="FILENAME">stdin</tt>传递给脚本的输入, 也可以接受从参数中指定的文件中传递给脚本的输入. 参见[例子 12-21](textproc.md#ROT13)和[例子 12-22](textproc.md#CRYPTOQUOTE) .

    | ![Caution](./images/caution.gif) | 

    `$*`和`$@`中的参数有时候会表现出不一致而且令人迷惑的行为, 这都依赖于[$IFS](internalvariables.md#IFSREF)的设置.

     |

    * * *

    **例子 9-7\. `$*`和`$@`的不一致的行为**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 #  内部Bash变量"$*"和"$@"的古怪行为,
      4 #+ 都依赖于它们是否被双引号引用起来.
      5 #  单词拆分与换行的不一致的处理.
      6 
      7 
      8 set -- "First one" "second" "third:one" "" "Fifth: :one"
      9 # 设置这个脚本的参数, $1, $2, 等等.
     10 
     11 echo
     12 
     13 echo 'IFS unchanged, using "$*"'
     14 c=0
     15 for i in "$*"               # 引用起来
     16 do echo "$((c+=1)): [$i]"   # 这行在下边每个例子中都一样.
     17                             # 打印参数.
     18 done
     19 echo ---
     20 
     21 echo 'IFS unchanged, using $*'
     22 c=0
     23 for i in $*                 # 未引用
     24 do echo "$((c+=1)): [$i]"
     25 done
     26 echo ---
     27 
     28 echo 'IFS unchanged, using "$@"'
     29 c=0
     30 for i in "$@"
     31 do echo "$((c+=1)): [$i]"
     32 done
     33 echo ---
     34 
     35 echo 'IFS unchanged, using $@'
     36 c=0
     37 for i in $@
     38 do echo "$((c+=1)): [$i]"
     39 done
     40 echo ---
     41 
     42 IFS=:
     43 echo 'IFS=":", using "$*"'
     44 c=0
     45 for i in "$*"
     46 do echo "$((c+=1)): [$i]"
     47 done
     48 echo ---
     49 
     50 echo 'IFS=":", using $*'
     51 c=0
     52 for i in $*
     53 do echo "$((c+=1)): [$i]"
     54 done
     55 echo ---
     56 
     57 var=$*
     58 echo 'IFS=":", using "$var" (var=$*)'
     59 c=0
     60 for i in "$var"
     61 do echo "$((c+=1)): [$i]"
     62 done
     63 echo ---
     64 
     65 echo 'IFS=":", using $var (var=$*)'
     66 c=0
     67 for i in $var
     68 do echo "$((c+=1)): [$i]"
     69 done
     70 echo ---
     71 
     72 var="$*"
     73 echo 'IFS=":", using $var (var="$*")'
     74 c=0
     75 for i in $var
     76 do echo "$((c+=1)): [$i]"
     77 done
     78 echo ---
     79 
     80 echo 'IFS=":", using "$var" (var="$*")'
     81 c=0
     82 for i in "$var"
     83 do echo "$((c+=1)): [$i]"
     84 done
     85 echo ---
     86 
     87 echo 'IFS=":", using "$@"'
     88 c=0
     89 for i in "$@"
     90 do echo "$((c+=1)): [$i]"
     91 done
     92 echo ---
     93 
     94 echo 'IFS=":", using $@'
     95 c=0
     96 for i in $@
     97 do echo "$((c+=1)): [$i]"
     98 done
     99 echo ---
    100 
    101 var=$@
    102 echo 'IFS=":", using $var (var=$@)'
    103 c=0
    104 for i in $var
    105 do echo "$((c+=1)): [$i]"
    106 done
    107 echo ---
    108 
    109 echo 'IFS=":", using "$var" (var=$@)'
    110 c=0
    111 for i in "$var"
    112 do echo "$((c+=1)): [$i]"
    113 done
    114 echo ---
    115 
    116 var="$@"
    117 echo 'IFS=":", using "$var" (var="$@")'
    118 c=0
    119 for i in "$var"
    120 do echo "$((c+=1)): [$i]"
    121 done
    122 echo ---
    123 
    124 echo 'IFS=":", using $var (var="$@")'
    125 c=0
    126 for i in $var
    127 do echo "$((c+=1)): [$i]"
    128 done
    129 
    130 echo
    131 
    132 # 使用ksh或者zsh -y来试试这个脚本.
    133 
    134 exit 0
    135 
    136 # 这个例子脚本是由Stephane Chazelas所编写,
    137 # 并且本书作者做了轻微改动.</pre>

     |

    * * *

    | ![Note](./images/note.gif) | 

    **$@**与**$***中的参数只有在被双引号引用起来的时候才会不同.

     |

    * * *

    **例子 9-8\. 当`$IFS`为空时的`$*`和`$@`**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 #  如果$IFS被设置, 但其值为空,
      4 #+ 那么"$*"和"$@"将不会像期望的那样显示位置参数. 
      5 
      6 mecho ()       # 打印位置参数.
      7 {
      8 echo "$1,$2,$3";
      9 }
     10 
     11 
     12 IFS=""         # 设置了, 但值为空.
     13 set a b c      # 位置参数.
     14 
     15 mecho "$*"     # abc,,
     16 mecho $*       # a,b,c
     17 
     18 mecho $@       # a,b,c
     19 mecho "$@"     # a,b,c
     20 
     21 #  当$IFS值为空时, $*和$@的行为依赖于
     22 #+ 正在运行的Bash或者sh的版本.
     23 #  因此在脚本中使用这种"特性"是不明智的.
     24 
     25 
     26 # 感谢, Stephane Chazelas.
     27 
     28 exit 0</pre>

     |

    * * *

**其他的特殊参数**

*   `$-`
*   传递给脚本的标记(使用[set](internal.md#SETREF)命令). 参见[例子 11-15](internal.md#EX34).

    | ![Caution](./images/caution.gif) | 

    这本来是_ksh_的结构, 后来被引进到Bash中, 但是不幸的是, 看起来它不能够可靠的用在Bash脚本中. 一种可能的用法是让一个脚本[测试自身是不是可交互的](intandnonint.md#IITEST).

     |

*   `$!`
*   运行在后台的最后一个作业的PID(进程ID)

    | 

    <pre class="PROGRAMLISTING">  1 LOG=$0.log
      2 
      3 COMMAND1="sleep 100"
      4 
      5 echo "Logging PIDs background commands for script: $0" >> "$LOG"
      6 # 所以它们是可以被监控的, 并且可以在必要的时候kill掉它们.
      7 echo >> "$LOG"
      8 
      9 # 记录命令.
     10 
     11 echo -n "PID of \"$COMMAND1\":  " >> "$LOG"
     12 ${COMMAND1} &
     13 echo $! >> "$LOG"
     14 # "sleep 100"的PID:  1506
     15 
     16 # 感谢, Jacques Lederer, 对此的建议.</pre>

     |

    | 

    <pre class="PROGRAMLISTING">  1 possibly_hanging_job & { sleep ${TIMEOUT}; eval 'kill -9 $!' &> /dev/null; }
      2 # 强制结束一个出错程序.
      3 # 很有用, 比如用在init脚本中.
      4 
      5 # 感谢, Sylvain Fourmanoit, 发现了"!"变量的创造性用法.</pre>

     |

*   `$_`
*   这个变量保存之前执行的命令的最后一个参数的值.

    * * *

    **例子 9-9\. 下划线变量**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 echo $_              # /bin/bash
      4                      # 只是调用/bin/bash来运行这个脚本.
      5 
      6 du >/dev/null        # 这么做命令行上将没有输出.
      7 echo $_              # du
      8 
      9 ls -al >/dev/null    # 这么做命令行上将没有输出.
     10 echo $_              # -al  (这是最后的参数)
     11 
     12 :
     13 echo $_              # :</pre>

     |

    * * *

*   `$?`
*   命令, [函数](functions.md#FUNCTIONREF), 或者是脚本本身的(参见[例子 23-7](complexfunct.md#MAX))[退出状态码](exit-status.md#EXITSTATUSREF)

*   `$$`
*   脚本自身的进程ID. `$$`变量在脚本中经常用来构造<span class="QUOTE">"唯一的"</span>临时文件名(参见[例子 A-13](contributed-scripts.md#FTPGET), [例子 29-6](debugging.md#ONLINE), [例子 12-28](filearchiv.md#DERPM), 和[例子 11-26](x6756.md#SELFDESTRUCT)). 这么做通常比调用[mktemp](filearchiv.md#MKTEMPREF)命令来的简单.

### 注意事项

| [[1]](internalvariables.md#AEN4091) | 

当然, 当前运行脚本的PID就是`$$`

 |
| [[2]](internalvariables.md#AEN4390) | 

术语<span class="QUOTE">"argument"</span>和<span class="QUOTE">"parameter"</span>通常情况下都可以互换使用. 在本书的上下文中, 它们的意思完全相同, 意思都是传递给脚本或者函数的变量, 或者是位置参数. (译者注: 翻译时, 基本上就未加区分.)

 |
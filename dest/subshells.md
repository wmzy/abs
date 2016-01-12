# 20\. 子shell

运行一个shell脚本的时候, 会启动命令解释器的另一个实例. 就好像你的命令是在命令行提示下被解释的一样, 类似于批处理文件中的一系列命令. 每个shell脚本都有效地运行在[父](internal.md#FORKREF)shell的一个子进程中. 这个[父](internal.md#FORKREF)shell指的是在一个控制终端或在一个_xterm_窗口中给出命令提示符的那个进程.

shell脚本也能启动它自已的子进程. 这些_子shell_能够使脚本并行的, 有效的, 同时运行多个子任务.

| 

一般来说, 脚本中的[外部命令](external.md#EXTERNALREF)能够[生成(fork)](internal.md#FORKREF)一个子进程, 然而Bash的[内建命令](internal.md#BUILTINREF)却不会这么做. 也正是由于这个原因, 内建命令比等价的外部命令要执行的快.

 |

**圆括号中的命令列表**

*   ( command1; command2; command3; ... )
*   <tt class="REPLACEABLE">_圆括号_</tt>中命令列表的命令将会运行在一个子shell中.

| ![Note](./images/note.gif) | 

子shell中的变量对于子shell之外的代码块来说, 是_不_可见的. 当然, [父进程](internal.md#FORKREF)也不能访问这些变量, 父进程指的是产生这个子shell的shell. 事实上, 这些变量都是[局部变量](localvar.md#LOCALREF).

 |

* * *

**例子 20-1\. 子shell中的变量作用域**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # subshell.sh
  3 
  4 echo
  5 
  6 echo "Subshell level OUTSIDE subshell = $BASH_SUBSHELL"
  7 # Bash, 版本3, 添加了这个新的           $BASH_SUBSHELL 变量. 
  8 echo
  9 
 10 outer_variable=Outer
 11 
 12 (
 13 echo "Subshell level INSIDE subshell = $BASH_SUBSHELL"
 14 inner_variable=Inner
 15 
 16 echo "From subshell, \"inner_variable\" = $inner_variable"
 17 echo "From subshell, \"outer\" = $outer_variable"
 18 )
 19 
 20 echo
 21 echo "Subshell level OUTSIDE subshell = $BASH_SUBSHELL"
 22 echo
 23 
 24 if [ -z "$inner_variable" ]
 25 then
 26   echo "inner_variable undefined in main body of shell"
 27 else
 28   echo "inner_variable defined in main body of shell"
 29 fi
 30 
 31 echo "From main body of shell, \"inner_variable\" = $inner_variable"
 32 #  $inner_variable将被作为未初始化的变量, 被显示出来, 
 33 #+ 这是因为变量是在子shell里定义的"局部变量". 
 34 #  还有补救的办法么? 
 35 
 36 echo
 37 
 38 exit 0</pre>

 |

* * *

请参考[例子 31-2](gotchas.md#SUBPIT).

+

子shell中的目录更改不会影响到父shell.

* * *

**例子 20-2\. 列出用户的配置文件**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # allprofs.sh: 打印所有用户的配置文件
  3 
  4 # 由Heiner Steven编写, 并由本书作者进行了修改. 
  5 
  6 FILE=.bashrc  #  在原始脚本中, File containing user profile,
  7               #+ 包含用户profile的是文件".profile". 
  8 
  9 for home in `awk -F: '{print $6}' /etc/passwd`
 10 do
 11   [ -d "$home" ] || continue    # 如果没有home目录, 跳出本次循环. 
 12   [ -r "$home" ] || continue    # 如果home目录没有读权限, 跳出本次循环. 
 13   (cd $home; [ -e $FILE ] && less $FILE)
 14 done
 15 
 16 #  当脚本结束时，不必使用'cd'命令返回原来的目录. 
 17 #+ 因为'cd $home'是在子shell中发生的, 不影响父shell. 
 18 
 19 exit 0</pre>

 |

* * *

子shell可用于为一组命令设置一个<span class="QUOTE">"独立的临时环境"</span>.

| 

<pre class="PROGRAMLISTING">  1 COMMAND1
  2 COMMAND2
  3 COMMAND3
  4 (
  5   IFS=:
  6   PATH=/bin
  7   unset TERMINFO
  8   set -C
  9   shift 5
 10   COMMAND4
 11   COMMAND5
 12   exit 3 # 只是从子shell退出. 
 13 )
 14 # 父shell不受任何影响, 并且父shell的环境也没有被更改. 
 15 COMMAND6
 16 COMMAND7</pre>

 |

子shell的另一个应用, 是可以用来检测一个变量是否被定义.

| 

<pre class="PROGRAMLISTING">  1 if (set -u; : $variable) 2> /dev/null
  2 then
  3   echo "Variable is set."
  4 fi     #  变量已经在当前脚本中被设置, 
  5        #+ 或者是一个Bash的内建变量, 
  6        #+ 或者是在当前环境下的一个可见变量(指已经被export的环境变量). 
  7 
  8 # 也可以写成            [[ ${variable-x} != x || ${variable-y} != y ]]
  9 # 或                    [[ ${variable-x} != x$variable ]]
 10 # 或                    [[ ${variable+x} = x ]]
 11 # 或                    [[ ${variable-x} != x ]]</pre>

 |

子shell还可以用来检测一个加锁的文件:

| 

<pre class="PROGRAMLISTING">  1 if (set -C; : > lock_file) 2> /dev/null
  2 then
  3   :   # lock_file不存在, 还没有用户运行这个脚本
  4 else
  5   echo "Another user is already running that script."
  6 exit 65
  7 fi
  8 
  9 #  这段程序由Stephane Chazelas所编写,
 10 #+ Paulo Marcel Coelho Aragao做了一些修改. </pre>

 |

进程在不同的子shell中可以并行地执行. 这样就可以把一个复杂的任务分成几个小的子问题来同时处理.

* * *

**例子 20-3\. 在子shell中进行并行处理**

| 

<pre class="PROGRAMLISTING">  1 	(cat list1 list2 list3 | sort | uniq > list123) &
  2 	(cat list4 list5 list6 | sort | uniq > list456) &
  3 	# 列表的合并与排序同时进行. 
  4 	# 放到后台运行可以确保能够并行执行. 
  5 	#
  6 	# 等效于
  7 	#   cat list1 list2 list3 | sort | uniq > list123 &
  8 	#   cat list4 list5 list6 | sort | uniq > list456 &
  9 	
 10 	wait   # 不再执行下面的命令, 直到子shell执行完毕. 
 11 	
 12 	diff list123 list456</pre>

 |

* * *

使用<span class="QUOTE">"|"</span>管道操作符, 将I/O流重定向到一个子shell中, 比如<kbd class="USERINPUT">ls -al | (command)</kbd>.

| ![Note](./images/note.gif) | 

在<tt class="REPLACEABLE">_大括号_</tt>中的命令_不会_启动子shell.

{ command1; command2; command3; . . . commandN; }

 |
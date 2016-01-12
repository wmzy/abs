# 29\. 调试

 _首先, 调试要比编写代码困难得多, 因此, 如果你尽可能聪明的编写代码, 你就不会在调试的时候花费很多精力._ |
 _Brian Kernighan_ |

Bash并不包含调试器, 甚至都没有包含任何用于调试目的的命令和结构. [[1]](#FTN.AEN15038) 脚本中的语法错误, 或者拼写错误只会产生模糊的错误信息, 当你调试一些非功能性脚本的时候, 这些错误信息通常都不会提供有意义的帮助.

* * *

**例子 29-1\. 一个错误脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # ex74.sh
  3 
  4 # 这是一个错误脚本. 
  5 # 哪里出了错? 
  6 
  7 a=37
  8 
  9 if [$a -gt 27 ]
 10 then
 11   echo $a
 12 fi  
 13 
 14 exit 0</pre>

 |

* * *

脚本的输出:

| 

<pre class="SCREEN"><samp class="COMPUTEROUTPUT">./ex74.sh: [37: command not found</samp></pre>

 |

上边的脚本究竟哪错了(提示: 注意**if**的后边)?

* * *

**例子 29-2\. 缺少[关键字](internal.md#KEYWORDREF)**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # missing-keyword.sh: 这个脚本会产生什么错误? 
  3 
  4 for a in 1 2 3
  5 do
  6   echo "$a"
  7 # done     # 第7行上的关键字done'被注释掉了. 
  8 
  9 exit 0  </pre>

 |

* * *

脚本的输出:

| 

<pre class="SCREEN"><samp class="COMPUTEROUTPUT">missing-keyword.sh: line 10: syntax error: unexpected end of file</samp>
	</pre>

 |

注意, 其实_不_必参考错误信息中指出的错误行号. 这行只不过是Bash解释器最终认定错误的地方.

出错信息在报告产生语法错误的行号时, 可能会忽略脚本的注释行.

如果脚本可以执行, 但并不如你所期望的那样工作, 怎么办? 通常情况下, 这都是由常见的逻辑错误所产生的.

* * *

**例子 29-3\. test24, 另一个错误脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 #  这个脚本的目的是删除当前目录下的某些文件, 
  4 #+ 这些文件特指那些文件名包含空格的文件. 
  5 #  但是不能如我们所愿的那样工作. 
  6 #  为什么? 
  7 
  8 
  9 badname=`ls | grep ' '`
 10 
 11 # 试试这个: 
 12 # echo "$badname"
 13 
 14 rm "$badname"
 15 
 16 exit 0</pre>

 |

* * *

为了找出[例子 29-3](debugging.md#EX75)中的错误, 我们可以把<kbd class="USERINPUT">echo "$badname"</kbd>行的注释符去掉. echo出来的信息能够帮助你判断脚本是否按你期望的方式运行.

在这个特定的例子里, <kbd class="USERINPUT">rm "$badname"</kbd>之所以没有给出期望的结果, 是因为`$badname`不应该被引用起来. 加上引号会保证**rm**只有一个参数(这就只能匹配一个文件名). 一种不完善的解决办法是去掉`$badname`外面的引号, 并且重新设置`$IFS`, 让`$IFS`只包含一个换行符, <kbd class="USERINPUT">IFS=/kbd>\n'</kbd>. 但是, 下面这个方法更简单.

| 

<pre class="PROGRAMLISTING">  1 # 删除文件名中包含空格的文件, 下面这才是正确的方法. 
  2 rm *\ *
  3 rm *" "*
  4 rm *' '*
  5 # 感谢. S.C.</pre>

 |

总结一下这个脚本的症状,

1.  由于<span class="QUOTE">"<span class="ERRORNAME">syntax error</span>"</span>(语法错误)使得脚本停止运行,

2.  或者脚本能够运行, 但是并不是按照我们所期望的那样运行(<span class="ERRORNAME">逻辑错误</span>).

3.  脚本能够按照我们所期望的那样运行, 但是有烦人的副作用(<span class="ERRORNAME">逻辑炸弹</span>).

如果想调试不工作的脚本, 有如下工具可用:

1.  [echo](internal.md#ECHOREF)语句可以放在脚本中存在疑问的位置上, 来观察变量的值, 也可以了解脚本后续的动作.

    | ![Tip](./images/tip.gif) | 

    最好只在_调试_的时候才使用**echo**语句.

    | 

    <pre class="PROGRAMLISTING">  1 ### debecho (debug-echo), 由Stefano Falsetto编写 ###
      2 ### 只有在DEBUG变量被赋值的情况下, 才会打印传递进来的参数. ###
      3 debecho () {
      4   if [ ! -z "$DEBUG" ]; then
      5      echo "$1" >&2
      6      #         ^^^ 打印到stderr
      7   fi
      8 }
      9 
     10 DEBUG=on
     11 Whatever=whatnot
     12 debecho $Whatever   # whatnot
     13 
     14 DEBUG=
     15 Whatever=notwhat
     16 debecho $Whatever   # (这里就不会打印.)</pre>

     |

     |

2.  使用过滤器[tee](extmisc.md#TEEREF)来检查临界点上的进程或数据流.

3.  设置选项`-n -v -x`

    <kbd class="USERINPUT">sh -n scriptname</kbd>不会运行脚本, 只会检查脚本的语法错误. 这等价于把<kbd class="USERINPUT">set -n</kbd>或<kbd class="USERINPUT">set -o noexec</kbd>插入脚本中. 注意, 某些类型的语法错误不会被这种方式检查出来.

    <kbd class="USERINPUT">sh -v scriptname</kbd>将会在运行脚本之前, 打印出每一个命令. 这等价于把<kbd class="USERINPUT">set -v</kbd>或<kbd class="USERINPUT">set -o verbose</kbd>插入到脚本中.

    选项`-n`和`-v`可以同时使用. <kbd class="USERINPUT">sh -nv scriptname</kbd>将会给出详细的语法检查.

    <kbd class="USERINPUT">sh -x scriptname</kbd>会打印出每个命令执行的结果, 但只使用缩写形式. 这等价于在脚本中插入<kbd class="USERINPUT">set -x</kbd>或<kbd class="USERINPUT">set -o xtrace</kbd>.

    把<kbd class="USERINPUT">set -u</kbd>或<kbd class="USERINPUT">set -o nounset</kbd>插入到脚本中, 并运行它, 就会在每个试图使用未声明变量的地方给出一个<span class="ERRORNAME">unbound variable</span>错误信息.

4.  使用<span class="QUOTE">"assert"</span>(断言)函数在脚本的临界点上测试变量或条件. (这是从C语言中引入的.)

    * * *

    **例子 29-4\. 使用<span class="QUOTE">"assert"</span>来测试条件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # assert.sh
      3 
      4 assert ()                 #  如果条件为false, 
      5 {                         #+ 那么就打印错误信息并退出脚本. 
      6   E_PARAM_ERR=98
      7   E_ASSERT_FAILED=99
      8 
      9 
     10   if [ -z "$2" ]          # 传递进来的参数个数不够. 
     11   then
     12     return $E_PARAM_ERR   # 什么都不做就return. 
     13   fi
     14 
     15   lineno=$2
     16 
     17   if [ ! $1 ] 
     18   then
     19     echo "Assertion failed:  \"$1\""
     20     echo "File \"$0\", line $lineno"
     21     exit $E_ASSERT_FAILED
     22   # else
     23   #   返回
     24   #   然后继续执行脚本余下的代码. 
     25   fi  
     26 }    
     27 
     28 
     29 a=5
     30 b=4
     31 condition="$a -lt $b"     # 产生错误信息并退出脚本. 
     32                           #  尝试把这个"条件"放到其他的地方, 
     33                           #+ 然后看看发生了什么. 
     34 
     35 assert "$condition" $LINENO
     36 # 只有在"assert"成功时, 脚本余下的代码才会继续执行. 
     37 
     38 
     39 # 这里放置的是其他的一些命令. 
     40 # ...
     41 echo "This statement echoes only if the \"assert\" does not fail."
     42 # ...
     43 # 这里也放置其他一些命令. 
     44 
     45 exit 0</pre>

     |

    * * *

5.  使用变量[$LINENO](internalvariables.md#LINENOREF)和内建命令[caller](internal.md#CALLERREF).

6.  捕获exit.

    脚本中的**exit**命令会触发一个信号<span class="RETURNVALUE">0</span>, 这个信号终止进程, 也就是终止脚本本身. [[2]](#FTN.AEN15137) 捕获**exit**在某些情况下很有用, 比如说强制<span class="QUOTE">"打印"</span>变量值. **trap**命令必须放在脚本中第一个命令的位置上.

**捕获信号**

*   **trap**
*   可以在收到一个信号的时候指定一个处理动作; 在调试的时候, 这一点也非常有用.

    | ![Note](./images/note.gif) | 

    A _signal_就是发往进程的一个简单消息, 这个消息即可以由内核发出, 也可以由另一个进程发出, 发送这个消息的目的是为了通知目的进程采取一些指定动作(通常都是终止动作). 比如说, 按下**Control**-**C**, 就会发送一个用户中断(即INT信号)到运行中的进程.

     |

    | 

    <pre class="PROGRAMLISTING">  1 trap '' 2
      2 # 忽略中断2(Control-C), 没有指定处理动作. 
      3 
      4 trap 'echo "Control-C disabled."' 2
      5 # 当Control-C按下时, 显示一行信息. </pre>

     |

* * *

**例子 29-5\. 捕获exit**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # 使用trap来捕捉变量值. 
  3 
  4 trap 'echo Variable Listing --- a = $a  b = $b' EXIT
  5 #  EXIT是脚本中exit命令所产生信号的名字. 
  6 #
  7 #  "trap"所指定的命令并不会马上执行, 
  8 #+ 只有接收到合适的信号, 这些命令才会执行. 
  9 
 10 echo "This prints before the \"trap\" --"
 11 echo "even though the script sees the \"trap\" first."
 12 echo
 13 
 14 a=39
 15 
 16 b=36
 17 
 18 exit 0
 19 #  注意, 即使注释掉上面的这行'exit'命令, 也不会产生什么不同的结果, 
 20 #+ 这是因为所有命令都执行完毕后, 不管怎么样, 脚本都会退出的. </pre>

 |

* * *

* * *

**例子 29-6\. Control-C之后, 清除垃圾**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # logon.sh: 一个检查你是否在线的脚本, 这个脚本实现的很简陋. 
  3 
  4 umask 177  # 确保temp文件并不是所有用户都有权限访问. 
  5 
  6 
  7 TRUE=1
  8 LOGFILE=/var/log/messages
  9 #  注意: $LOGFILE必须是可读的
 10 #+ (使用root身份来执行, chmod 644 /var/log/messages).
 11 TEMPFILE=temp.$
 12 #  使用脚本的进程ID, 来创建一个"唯一"的临时文件名. 
 13 #     也可以使用'mktemp'. 
 14 #     比如: 
 15 #     TEMPFILE=`mktemp temp.XXXXXX`
 16 KEYWORD=address
 17 #  登陆时, 把"remote IP address xxx.xxx.xxx.xxx"
 18 #                      添加到/var/log/messages中. 
 19 ONLINE=22
 20 USER_INTERRUPT=13
 21 CHECK_LINES=100
 22 #  日志文件有多少行需要检查. 
 23 
 24 trap 'rm -f $TEMPFILE; exit $USER_INTERRUPT' TERM INT
 25 #  如果脚本被control-c中途中断的话, 那么就清除掉临时文件. 
 26 
 27 echo
 28 
 29 while [ $TRUE ]  #死循环. 
 30 do
 31   tail -$CHECK_LINES $LOGFILE> $TEMPFILE
 32   #  将系统日志文件的最后100行保存到临时文件中. 
 33   #  这么做很有必要, 因为新版本的内核在登陆的时候, 会产生许多登陆信息. 
 34   search=`grep $KEYWORD $TEMPFILE`
 35   #  检查是否存在"IP address"片断, 
 36   #+ 它用来提示, 这是一次成功的网络登陆. 
 37 
 38   if [ ! -z "$search" ] #  必须使用引号, 因为变量可能会包含一些空白符. 
 39   then
 40      echo "On-line"
 41      rm -f $TEMPFILE    #  清除临时文件. 
 42      exit $ONLINE
 43   else
 44      echo -n "."        #  echo的-n选项不会产生换行符. 
 45                         #+ 这样你就可以在一行上连续打印. 
 46   fi
 47 
 48   sleep 1  
 49 done  
 50 
 51 
 52 #  注意: 如果你将变量KEYWORD的值改为"Exit", 
 53 #+ 当在线时, 这个脚本就可以被用来检查
 54 #+ 意外的掉线情况. 
 55 
 56 # 练习: 按照上面"注意"中所说的那样来修改这个脚本, 
 57 #       让它表现的更好. 
 58 
 59 exit 0
 60 
 61 
 62 # Nick Drage建议使用另一种方法: 
 63 
 64 while true
 65   do ifconfig ppp0 | grep UP 1> /dev/null && echo "connected" && exit 0
 66   echo -n "."   # 不停的打印(.....), 用来提示用户等待, 直到连接上位置. 
 67   sleep 2
 68 done
 69 
 70 # 问题: 使用Control-C来终止这个进程可能是不够的. 
 71 #+         (可能还会继续打印"...")
 72 # 练习: 修复这个问题. 
 73 
 74 
 75 
 76 # Stephane Chazelas提出了另一种方法: 
 77 
 78 CHECK_INTERVAL=1
 79 
 80 while ! tail -1 "$LOGFILE" | grep -q "$KEYWORD"
 81 do echo -n .
 82    sleep $CHECK_INTERVAL
 83 done
 84 echo "On-line"
 85 
 86 # 练习: 讨论一下这几种不同方法
 87 #       各自的优缺点. </pre>

 |

* * *

| ![Note](./images/note.gif) | 

如果使用**trap**命令的`DEBUG`参数, 那么当脚本中每个命令执行完毕后, 都会执行指定的动作. 比方说, 你可以跟踪某个变量的值.

* * *

**例子 29-7\. 跟踪一个变量**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 trap 'echo "VARIABLE-TRACE> \$variable = \"$variable\""' DEBUG
  4 # 当每个命令执行之后, 就会打印出$variable的值. 
  5 
  6 variable=29
  7 
  8 echo "Just initialized \"\$variable\" to $variable."
  9 
 10 let "variable *= 3"
 11 echo "Just multiplied \"\$variable\" by 3."
 12 
 13 exit $?
 14 
 15 #  "trap 'command1 . . . command2 . . .' DEBUG"结构更适合于
 16 #+ 使用在复杂脚本的上下文中, 
 17 #+ 如果在这种情况下大量使用"echo $variable"语句的话, 
 18 #+ 将会非常笨拙, 而且很耗时. 
 19 
 20 # 感谢, Stephane Chazelas指出这点. 
 21 
 22 
 23 脚本的输出: 
 24 
 25 VARIABLE-TRACE> $variable = ""
 26 VARIABLE-TRACE> $variable = "29"
 27 Just initialized "$variable" to 29.
 28 VARIABLE-TRACE> $variable = "29"
 29 VARIABLE-TRACE> $variable = "87"
 30 Just multiplied "$variable" by 3.
 31 VARIABLE-TRACE> $variable = "87"</pre>

 |

* * *

 |

当然, 除了调试之外, **trap**命令还有其他的用途.

* * *

**例子 29-8\. 运行多进程(在对称多处理器(SMP box)的机器上)**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # parent.sh
  3 # 在多处理器(SMP box)的机器里运行多进程. 
  4 # 作者: Tedman Eng
  5 
  6 #  我们下面要介绍两个脚本, 这是第一个, 
  7 #+ 这两个脚本都要放到当前工作目录下. 
  8 
  9 
 10 
 11 
 12 LIMIT=$1         # 想要启动的进程总数
 13 NUMPROC=4        # 并发的线程数量(forks?)
 14 PROCID=1         # 启动的进程ID
 15 echo "My PID is $"
 16 
 17 function start_thread() {
 18         if [ $PROCID -le $LIMIT ] ; then
 19                 ./child.sh $PROCID&
 20                 let "PROCID++"
 21         else
 22            echo "Limit reached."
 23            wait
 24            exit
 25         fi
 26 }
 27 
 28 while [ "$NUMPROC" -gt 0 ]; do
 29         start_thread;
 30         let "NUMPROC--"
 31 done
 32 
 33 
 34 while true
 35 do
 36 
 37 trap "start_thread" SIGRTMIN
 38 
 39 done
 40 
 41 exit 0
 42 
 43 
 44 
 45 # ======== 下面是第二个脚本 ========
 46 
 47 
 48 #!/bin/bash
 49 # child.sh
 50 # 在SMP box上运行多进程. 
 51 # 这个脚本会被parent.sh调用. 
 52 # 作者: Tedman Eng
 53 
 54 temp=$RANDOM
 55 index=$1
 56 shift
 57 let "temp %= 5"
 58 let "temp += 4"
 59 echo "Starting $index  Time:$temp" "$@"
 60 sleep ${temp}
 61 echo "Ending $index"
 62 kill -s SIGRTMIN $PPID
 63 
 64 exit 0
 65 
 66 
 67 # ======================= 脚本作者注 ======================= #
 68 #  这个脚本并不是一点bug都没有. 
 69 #  我使用limit = 500来运行这个脚本, 但是在过了开头的一两百个循环后, 
 70 #+ 有些并发线程消失了! 
 71 #  还不能确定这是否是由捕捉信号的冲突引起的, 或者是其他什么原因. 
 72 #  一旦接收到捕捉的信号, 那么在下一次捕捉到来之前, 
 73 #+ 会有一段短暂的时间来执行信号处理程序, 
 74 #+ 在信号处理程序处理的过程中, 很有可能会丢失一个想要捕捉的信号, 因此失去一个产生子进程的机会. 
 75 
 76 #  毫无疑问的, 肯定有人能够找出产生这个bug的原因, 
 77 #+ 并且在将来的某个时候. . . 修正它.
 78 
 79 
 80 
 81 # ===================================================================== #
 82 
 83 
 84 
 85 # ----------------------------------------------------------------------#
 86 
 87 
 88 
 89 #################################################################
 90 # 下面的脚本是由Vernia Damiano原创. 
 91 # 不幸的是, 它并不能正常工作. 
 92 #################################################################
 93 
 94 #!/bin/bash
 95 
 96 #  要想调用这个脚本, 至少需要一个整形参数
 97 #+ (并发的进程数). 
 98 #  所有的其他参数都传递给要启动的进程. 
 99 
100 
101 INDICE=8        # 想要启动的进程数目
102 TEMPO=5         # 每个进程最大的睡眠时间
103 E_BADARGS=65    # 如果没有参数传到脚本中, 那么就返回这个错误码. 
104 
105 if [ $# -eq 0 ] # 检查一下, 至少要传递一个参数给脚本. 
106 then
107   echo "Usage: `basename $0` number_of_processes [passed params]"
108   exit $E_BADARGS
109 fi
110 
111 NUMPROC=$1              # 并发进程数
112 shift
113 PARAMETRI=( "$@" )      # 每个进程的参数
114 
115 function avvia() {
116          local temp
117          local index
118          temp=$RANDOM
119          index=$1
120          shift
121          let "temp %= $TEMPO"
122          let "temp += 1"
123          echo "Starting $index Time:$temp" "$@"
124          sleep ${temp}
125          echo "Ending $index"
126          kill -s SIGRTMIN $
127 }
128 
129 function parti() {
130          if [ $INDICE -gt 0 ] ; then
131               avvia $INDICE "${PARAMETRI[@]}" &
132                 let "INDICE--"
133          else
134                 trap : SIGRTMIN
135          fi
136 }
137 
138 trap parti SIGRTMIN
139 
140 while [ "$NUMPROC" -gt 0 ]; do
141          parti;
142          let "NUMPROC--"
143 done
144 
145 wait
146 trap - SIGRTMIN
147 
148 exit $?
149 
150 : <<SCRIPT_AUTHOR_COMMENTS
151 我需要使用指定的选项来运行一个程序, 
152 并且能够接受不同的文件, 而且要运行在一个多处理器(SMP)的机器上. 
153 所以我想(我也会)运行指定数目个进程, 
154 并且每个进程终止之后, 都要启动一个新进程. 
155 
156 "wait"命令并没有提供什么帮助, 因为它需要等待一个指定的后台进程, 
157 或者等待*全部*的后台进程. 所以我编写了[这个]bash脚本程序来完成这个工作, 
158 并且使用了"trap"指令. 
159   --Vernia Damiano
160 SCRIPT_AUTHOR_COMMENTS</pre>

 |

* * *

| ![Note](./images/note.gif) | 

<kbd class="USERINPUT">trap '' SIGNAL</kbd>(两个引号之间为空)在剩余的脚本中禁用了SIGNAL信号的动作. <kbd class="USERINPUT">trap SIGNAL</kbd>则会恢复处理SIGNAL的动作. 当你想保护脚本的临界部分不受意外的中断骚扰, 那么上面讲的这种办法就非常有用了.

 |

| 

<pre class="PROGRAMLISTING">  1 	trap '' 2  # 信号2就是Control-C, 现在被禁用了. 
  2 	command
  3 	command
  4 	command
  5 	trap 2     # 重新恢复Control-C
  6 	</pre>

 |

| 

Bash[3.0](bashver3.md#BASH3REF)之后增加了如下这些特殊变量用于调试.

1.  $BASH_ARGC

2.  $BASH_ARGV

3.  $BASH_COMMAND

4.  $BASH_EXECUTION_STRING

5.  $BASH_LINENO

6.  $BASH_SOURCE

7.  [$BASH_SUBSHELL](internalvariables.md#BASHSUBSHELLREF)

 |

### 注意事项

| [[1]](debugging.md#AEN15038) | 

事实上, Rocky Bernstein的[Bash debugger](http://bashdb.sourceforge.net)填补了这项空白.

 |
| [[2]](debugging.md#AEN15137) | 

根据惯例, <tt class="REPLACEABLE">_信号0_</tt>被指定为[exit](exit-status.md#EXITCOMMANDREF).

 |
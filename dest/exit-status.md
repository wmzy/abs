# 6\. 退出和退出状态码

 _...在Bourne shell中有许多黑暗的角落, 但是人们也会利用它们._ |
 _Chet Ramey_ |

**exit** 被用来结束一个脚本, 就像在_C_语言中一样. 它也返回一个值, 并且这个值会传递给脚本的父进程, 父进程会使用这个值做下一步的处理.

每个命令都会返回一个 _退出状态码_ (有时候也被称为 _返回状态_ ). 成功的命令返回<span class="RETURNVALUE">0</span>, 而不成功的命令返回<span class="RETURNVALUE">非零</span>值, 非零值通常都被解释成一个错误码. 行为良好的UNIX命令, 程序, 和工具都会返回<span class="RETURNVALUE">0</span>作为退出码来表示成功, 虽然偶尔也会有例外.

同样的, 脚本中的函数和脚本本身也会返回退出状态码. 在脚本或者是脚本函数中执行的最后的命令会决定退出状态码. 在脚本中, <kbd class="USERINPUT">exit <tt class="REPLACEABLE">_nnn_</tt></kbd>命令将会把 <span class="RETURNVALUE"><tt class="REPLACEABLE">_nnn_</tt></span>退出码传递给shell( <span class="RETURNVALUE"><tt class="REPLACEABLE">_nnn_</tt></span>必须是十进制数, 范围必须是<span class="RETURNVALUE">0</span> - <span class="RETURNVALUE">255</span>).

| ![Note](./images/note.gif) | 

当脚本以不带参数的**exit**命令来结束时, 脚本的退出状态码就由脚本中最后执行的命令来决定(就是**exit**之前的命令).

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 COMMAND_1
  4 
  5 . . .
  6 
  7 # 将以最后的命令来决定退出状态码.
  8 COMMAND_LAST
  9 
 10 exit</pre>

 |

不带参数的**exit**命令与 **exit $?**的效果是一样的, 甚至脚本的结尾不写**exit**, 也与前两者的效果相同.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 COMMAND_1
  4 
  5 . . .
  6 
  7 # 将以最后的命令来决定退出状态码.
  8 COMMAND_LAST
  9 
 10 exit $?</pre>

 |

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 COMMAND1
  4 
  5 . . . 
  6 
  7 # 将以最后的命令来决定退出状态码.
  8 COMMAND_LAST</pre>

 |

 |

`$?`保存了最后所执行的命令的退出状态码. 当函数返回之后, `$?`保存函数中最后所执行的命令的退出状态码. 这就是bash对函数<span class="QUOTE">"返回值"</span>的处理方法. 当一个脚本退出, `$?`保存了脚本的退出状态码, 这个退出状态码也就是脚本中最后一个执行命令的退出状态码. 一般情况下, <kbd class="USERINPUT">0</kbd>表示成功, 在范围<span class="RETURNVALUE">1 - 255</span>的整数表示错误.

* * *

**例子 6-1\. 退出/退出状态码**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 echo hello
  4 echo $?    # 退出状态为0, 因为命令执行成功.
  5 
  6 lskdf      # 无效命令.
  7 echo $?    # 非零的退出状态, 因为命令执行失败.
  8 
  9 echo
 10 
 11 exit 113   # 返回113退出状态给shell.
 12            # 为了验证这个结果, 可以在脚本结束的地方使用"echo $?". 
 13 
 14 #  一般的, 'exit 0' 表示成功,
 15 #+ 而一个非零的退出码表示一个错误, 或者是反常的条件.</pre>

 |

* * *

[$?](internalvariables.md#XSTATVARREF)用于测试脚本中的命令结果的时候, 往往显得特别有用(见[例子 12-32](filearchiv.md#FILECOMP)和[例子 12-17](textproc.md#LOOKUP)).

| ![Note](./images/note.gif) | 

[!](special-chars.md#NOTREF), 逻辑 <span class="QUOTE">"非"</span>操作符, 将会反转命令或条件测试的结果, 并且这会影响[退出状态码](exit-status.md#EXITSTATUSREF).

* * *

**例子 6-2\. 反转一个条件的用法<span class="TOKEN">!</span>**

| 

<pre class="PROGRAMLISTING">  1 true  # "true" 是内建命令.
  2 echo "exit status of \"true\" = $?"     # 0
  3 
  4 ! true
  5 echo "exit status of \"! true\" = $?"   # 1
  6 # 注意: "!" 需要一个空格.
  7 #    !true   将导致"command not found"错误
  8 #
  9 # 如果一个命令以'!'开头, 那么会启用Bash的历史机制. 
 10 
 11 true
 12 !true
 13 # 这次就没有错误了, 也没有反转结果.
 14 # 它只是重复了之前的命令(true).
 15 
 16 # 感谢, Stephane Chazelas和Kristopher Newsome.</pre>

 |

* * *

 |

| ![Caution](./images/caution.gif) | 

特定的退出状态码具有[保留含义](exitcodes.md#EXITCODESREF), 所以用户不应该在脚本中指定它.

 |
# 30\. 选项

选项用来更改shell和脚本的行为.

[set](internal.md#SETREF)命令用来打开脚本中的选项. 你可以在脚本中任何你想让选项生效的地方插入**set -o option-name**, 或者使用更简单的形式, **set -option-abbrev**. 这两种形式是等价的.

| 

<pre class="PROGRAMLISTING">  1       #!/bin/bash
  2 
  3       set -o verbose
  4       # 打印出所有执行前的命令. 
  5       </pre>

 |

| 

<pre class="PROGRAMLISTING">  1       #!/bin/bash
  2 
  3       set -v
  4       # 与上边的例子具有相同的效果. 
  5       </pre>

 |

| ![Note](./images/note.gif) | 

如果你想在脚本中_禁用_某个选项, 可以使用**set +o option-name**或**set +option-abbrev**.

 |

| 

<pre class="PROGRAMLISTING">  1       #!/bin/bash
  2 
  3       set -o verbose
  4       # 激活命令回显. 
  5       command
  6       ...
  7       command
  8 
  9       set +o verbose
 10       # 禁用命令回显. 
 11       command
 12       # 没有命令回显了. 
 13 
 14 
 15       set -v
 16       # 激活命令回显. 
 17       command
 18       ...
 19       command
 20 
 21       set +v
 22       # 禁用命令回显. 
 23       command
 24 
 25       exit 0
 26       </pre>

 |

还有另一种可以在脚本中启用选项的方法, 那就是在脚本头部, <tt class="REPLACEABLE">_#!_</tt>的后边直接指定选项.

| 

<pre class="PROGRAMLISTING">  1       #!/bin/bash -x
  2       #
  3       # 下边是脚本的主要内容. 
  4       </pre>

 |

也可以从命令行中打开脚本的选项. 某些不能与**set**命令一起用的选项就可以使用这种方法来打开. <tt class="REPLACEABLE">_-i_</tt>就是其中之一, 这个选项用来强制脚本以交互的方式运行.

<kbd class="USERINPUT">bash -v script-name</kbd>

<kbd class="USERINPUT">bash -o verbose script-name</kbd>

下表列出了一些有用的选项. 它们都可以使用缩写的形式来指定(开头加一个破折号), 也可以使用完整名字来指定(开头加上_双_破折号, 或者使用`-o`选项来指定).

* * *

**表格 30-1\. Bash选项**

<colgroup><col><col><col></colgroup>
| 缩写 | 名称 | 作用 |
| --- | --- | --- |
| `-C` | noclobber | 防止重定向时覆盖文件(可能会被<span class="TOKEN">>|</span>覆盖) |
| `-D` | (none) | 列出用双引号引用起来的, 以<span class="TOKEN">$</span>为前缀的字符串, 但是不执行脚本中的命令 |
| `-a` | allexport | export(导出)所有定义过的变量 |
| `-b` | notify | 当后台运行的作业终止时, 给出通知(脚本中并不常见) |
| `-c ...` | (none) | 从**...**中读取命令 |
| `-e` | errexit | 当脚本发生第一个错误时, 就退出脚本, 换种说法就是, 当一个命令返回非零值时, 就退出脚本(除了[until](loops1.md#UNTILLOOPREF)或[while loops](loops1.md#WHILELOOPREF), [if-tests](testconstructs.md#TESTCONSTRUCTS1), [list constructs](list-cons.md#LCONS1)) |
| `-f` | noglob | 禁用文件名扩展(就是禁用globbing) |
| `-i` | interactive | 让脚本以_交互_模式运行 |
| `-n` | noexec | 从脚本中读取命令, 但是不执行它们(做语法检查) |
| `-o Option-Name` | (none) | 调用_Option-Name_选项 |
| `-o posix` | POSIX | 修改Bash或被调用脚本的行为, 使其符合[POSIX](sha-bang.md#POSIX2REF)标准. |
| `-p` | privileged | 以<span class="QUOTE">"suid"</span>身份来运行脚本(小心!) |
| `-r` | restricted | 以_受限_模式来运行脚本(参考 [21](restricted-sh.md)). |
| `-s` | stdin | 从<tt class="FILENAME">stdin</tt>中读取命令 |
| `-t` | (none) | 执行完第一个命令之后, 就退出 |
| `-u` | nounset | 如果尝试使用了未定义的变量, 就会输出一个错误消息, 然后强制退出 |
| `-v` | verbose | 在执行每个命令之前, 把每个命令打印到<tt class="FILENAME">stdout</tt>上 |
| `-x` | xtrace | 与`-v`选项类似, 但是会打印完整命令 |
| `-` | (none) | 选项结束标志. 后面的参数为[位置参数](internalvariables.md#POSPARAMREF). |
| `--` | (none) | unset(释放)位置参数. 如果指定了参数列表(`-- arg1 arg2`), 那么位置参数将会依次设置到参数列表中. |

* * *
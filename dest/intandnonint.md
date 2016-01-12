# 33.1\. 交互与非交互式的交互与非交互式的shell和脚本

_交互式_的shell会在<tt class="FILENAME">tty</tt>上从用户输入中读取命令. 另一方面, 这样的shell能在启动时读取启动文件, 显示一个提示符, 并默认激活作业控制. 也就是说, 用户可以与shell_交互_.

shell所运行的脚本通常都是非交互的shell. 但是脚本仍然可以访问它的<tt class="FILENAME">tty</tt>. 甚至可以在脚本中模拟一个交互式的shell.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 MY_PROMPT='$ '
  3 while :
  4 do
  5   echo -n "$MY_PROMPT"
  6   read line
  7   eval "$line"
  8   done
  9 
 10 exit 0
 11 
 12 # 这个例子脚本, 还有上面那么多的解释
 13 # 都是由Stephane Chazelas提供的(再次感谢). </pre>

 |

让我们考虑一个需要用户输入的_交互式_脚本, 这种脚本通常都要使用[read](internal.md#READREF)语句(请参考[例子 11-3](internal.md#EX36)). 但是<span class="QUOTE">"现实的情况"</span>肯定要比这复杂的多. 就目前的情况来看, 交互式脚本通常都绑定在一个tty设备上, 换句话说, 用户都是在控制终端或_xterm_上来调用脚本的.

初始化脚本和启动脚本都是非交互式的, 因为它们都不需要人为干预, 都是自动运行的. 许多管理脚本和系统维护脚本也同样是非交互式的. 对于那些不需要经常变化的, 重复性的任务, 应该交给非交互式的脚本来自动完成.

非交互式的脚本可以在后台运行, 但是如果交互式脚本在后台运行的话, 就会被挂起, 因为它们在等待永远不会到来的输入. 如果想解决后台运行交互式脚本的问题, 可以使用带有**expect**命令的脚本, 或者在脚本中嵌入[here document](here-docs.md#HEREDOCREF)来提供交互式脚本所需要的输入. 最简单的办法其实就是将一个文件重定向给**read**命令, 来提供它所需要的输入(**read variable <file**). 通过使用上述方法, 就可以编写出通用目的脚本, 这种脚本即可以运行在交互模式下, 也可以运行在非交互模式下.

如果脚本需要测试一下自己是否运行在交互式shell中, 那么一个简单的办法就是察看是否存在_提示符(prompt)_变量, 也就是察看一下变量[$PS1](internalvariables.md#PS1REF)是否被设置. (如果脚本需要用户输入, 那么脚本就需要显示提示符.)

| 

<pre class="PROGRAMLISTING">  1 if [ -z $PS1 ] # 没有提示符? 
  2 then
  3   # 非交互式
  4   ...
  5 else
  6   # 交互式
  7   ...
  8 fi</pre>

 |

另一种办法, 脚本可以测试一下标志[$-](internalvariables.md#FLPREF)中是否存在选项<span class="QUOTE">"i"</span>.

| 

<pre class="PROGRAMLISTING">  1 case $- in
  2 *i*)    # 交互式shell
  3 ;;
  4 *)      # 非交互式shell
  5 ;;
  6 # ("UNIX F.A.Q."的惯例, 1993)</pre>

 |

| ![Note](./images/note.gif) | 

使用<kbd class="USERINPUT">#!/bin/bash -i</kbd>头, 或者使用<span class="TOKEN">-i</span>选项, 可以强制脚本运行在交互模式下. 注意, 这么做可能会让脚本产生古怪的行为, 有时候即使在没有错误的情况下, 也可能会显示错误信息.

 |
# 33.9\. 可移植性问题

这本书主要描述的是, 在GNU/Linux系统上, 如何处理特定于Bash的脚本. 但是使用**sh**和**ksh**的用户仍然会从这里找到很多有价值的东西. .

碰巧, 许多不同的shell脚本语言其实都遵循POSIX 1003.2标准. 如果使用`--posix`选项来调用Bash, 或者在脚本头插入**set -o posix**, 那么将会使Bash与这个标准非常接近地保持一致. 另一种办法就是在脚本头使用

| 

<pre class="PROGRAMLISTING">  1 #!/bin/sh</pre>

 |

而不是

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash</pre>

 |

注意在Linux或者某些特定的UNIX上, <tt class="FILENAME">/bin/sh</tt>其实只是一个指向<tt class="FILENAME">/bin/bash</tt>的[链接](basic.md#LINKREF), 并且使用这种方法调用脚本的话, 将会禁用Bash的扩展功能.

大多数的Bash脚本都好像运行在**ksh**上一样, 反过来看, 这是因为Chet Ramey一直致力于将**ksh**的特性移植到Bash的最新版本上.

对于商业UNIX机器来说, 如果在脚本中包含了使用GNU特性的标准命令, 那么这些脚本可能不会正常运行. 但是在最近几年, 这个问题得到了极大的改观, 这是因为即使在<span class="QUOTE">"大块头"</span>UNIX上, GNU工具包也非常好的替换掉了同类的私有工具. 对于原始的UNIX来说, [源代码的火山喷发](http://linux.oreillynet.com/pub/a/linux/2002/02/28/caldera.md)加剧了这种趋势.

Bash具有的某些特性是传统的Bourne shell所缺乏的. 下面就是其中的一部分:

*   某些扩展的[调用选项](options.md#INVOCATIONOPTIONSREF)

*   使用**$( )**形式的[命令替换](commandsub.md#COMMANDSUBREF)

*   某些[字符串处理](string-manipulation.md#STRINGMANIP)操作符

*   [进程替换](process-sub.md#PROCESSSUBREF)

*   Bash特有的[内建命令](internal.md#BUILTINREF)

请参考[Bash F.A.Q.](ftp://ftp.cwru.edu/pub/bash/FAQ), 你将会获得完整的列表.
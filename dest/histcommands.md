# Appendix J. 历史命令

Bash shell提供命令行工具用于编辑和操作用户的_命令历史_. 这其实主要就是为了方便, 节省用户的重复按键.

Bash历史命令:

1.  **history**

2.  **fc**

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">history</kbd>
 <samp class="COMPUTEROUTPUT">1  mount /mnt/cdrom
    2  cd /mnt/cdrom
    3  ls
     ...</samp>
	      </pre>

 |

与Bash历史命令相关的内部变量:

1.  $HISTCMD

2.  $HISTCONTROL

3.  $HISTIGNORE

4.  $HISTFILE

5.  $HISTFILESIZE

6.  $HISTSIZE

7.  $HISTTIMEFORMAT (Bash 3.0或后续版本)

8.  !!

9.  !$

10.  !#

11.  !N

12.  !-N

13.  !STRING

14.  !?STRING?

15.  ^STRING^string^

不幸的是, Bash历史工具在脚本中没用.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # history.sh
  3 # 尝试在脚本中使用'history'命令. 
  4 
  5 history
  6 
  7 # 脚本没产生输出. 
  8 # 历史命令不能工作在脚本中. </pre>

 |

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">./history.sh</kbd>
<samp class="COMPUTEROUTPUT">(no output)</samp>	      
	      </pre>

 |

站点[Advancing in the Bash Shell](http://www.deadman.org/bash.md)给出了一份关于如何在Bash中使用历史命令的详细介绍.
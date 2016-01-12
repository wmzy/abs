# 21\. 受限shell

**在受限shell中禁用的命令**

*   在_受限_模式下运行一个脚本或脚本片断, 将会禁用某些命令, 这些命令在正常模式下都可以运行. 这是一种安全策略, 目的是为了限制脚本用户的权限, 并且能够让运行脚本所导致的危害降低到最小.

*   使用<tt class="REPLACEABLE">_cd_</tt>命令更改工作目录.

*   更改[环境变量](othertypesv.md#ENVREF)<tt class="REPLACEABLE">_$PATH_</tt>, <tt class="REPLACEABLE">_$SHELL_</tt>, <tt class="REPLACEABLE">_$BASH_ENV_</tt>, 或<tt class="REPLACEABLE">_$ENV_</tt>的值.

*   读取或修改环境变量<tt class="REPLACEABLE">_$SHELLOPTS_</tt>的值.

*   输出重定向.

*   调用的命令路径中包括有一个或多个斜杠(<span class="TOKEN">/</span>).

*   调用_exec_, 把当前的受限shell替换成另外一个进程.

*   能够在无意中破坏脚本的命令.

*   在脚本中企图脱离受限模式的操作.

* * *

**例子 21-1\. 在受限模式下运行脚本**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 #  脚本开头以"#!/bin/bash -r"来调用, 
  4 #+ 会使整个脚本在受限模式下运行. 
  5 
  6 echo
  7 
  8 echo "Changing directory."
  9 cd /usr/local
 10 echo "Now in `pwd`"
 11 echo "Coming back home."
 12 cd
 13 echo "Now in `pwd`"
 14 echo
 15 
 16 # 非受限的模式下，所有操作都正常. 
 17 
 18 set -r
 19 # set --restricted    也具有相同的效果. 
 20 echo "==> Now in restricted mode. <=="
 21 
 22 echo
 23 echo
 24 
 25 echo "Attempting directory change in restricted mode."
 26 cd ..
 27 echo "Still in `pwd`"
 28 
 29 echo
 30 echo
 31 
 32 echo "\$SHELL = $SHELL"
 33 echo "Attempting to change shell in restricted mode."
 34 SHELL="/bin/ash"
 35 echo
 36 echo "\$SHELL= $SHELL"
 37 
 38 echo
 39 echo
 40 
 41 echo "Attempting to redirect output in restricted mode."
 42 ls -l /usr/bin > bin.files
 43 ls -l bin.files    # 尝试列出刚才创建的文件. 
 44 
 45 echo
 46 
 47 exit 0</pre>

 |

* * *
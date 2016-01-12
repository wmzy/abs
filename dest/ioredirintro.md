# Appendix E. I/O和I/O重定向的详细介绍

_由Stephane Chazelas编写, 本书作者修订_

一个命令期望前3个[文件描述符](io-redirection.md#FDREF)是可用的. 第一个, _fd 0_(标准输入, <tt class="FILENAME">stdin</tt>), 用作读取. 另外两个, (_fd 1_, <tt class="FILENAME">stdout</tt>和_fd 2_, <tt class="FILENAME">stderr</tt>), 用来写入.

每个命令都会关联到<tt class="FILENAME">stdin</tt>, <tt class="FILENAME">stdout</tt>, 和<tt class="FILENAME">stderr</tt>. <kbd class="USERINPUT">ls 2>&1</kbd>意味着临时的将**ls**命令的<tt class="FILENAME">stderr</tt>连接到shell的<tt class="FILENAME">stdout</tt>.

按惯例, 命令一般都是从fd 0(<tt class="FILENAME">stdin</tt>)上读取输入, 打印输出到fd 1(<tt class="FILENAME">stdout</tt>)上, 错误输出一般都输出到fd 2(<tt class="FILENAME">stderr</tt>)上. 如果这3个文件描述中的某一个没打开, 你可能就会遇到麻烦了:

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">cat /etc/passwd >&-</kbd>
<samp class="COMPUTEROUTPUT">cat: standard output: Bad file descriptor</samp>
      </pre>

 |

比如说, 当**xterm**运行的时候, 它首先会初始化自身. 在运行用户shell之前, **xterm**会打开终端设备(/dev/pts/<n> 或者类似的东西)三次.

这里, Bash继承了这三个文件描述符, 而且每个运行在Bash上的命令(子进程)也都依次继承了它们, 除非你重定向了这些命令. [重定向](io-redirection.md#IOREDIRREF)意味着将这些文件描述符中的某一个, 重新分配到其他文件中(或者分配到一个管道中, 或者是其他任何可能的东西). 文件描述符既可以被局部重分配(对于一个命令, 命令组, 一个子shell, 一个[while循环, if或case结构](redircb.md#REDIRREF)...), 也可以全局重分配, 对于余下的shell(使用[exec](internal.md#EXECREF)).

<kbd class="USERINPUT">ls > /dev/null</kbd> 表示将运行的**ls**命令的fd 1连接到<tt class="FILENAME">/dev/null</tt>上.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lsof -a -p $ -d0,1,2</kbd>
<samp class="COMPUTEROUTPUT">COMMAND PID     USER   FD   TYPE DEVICE SIZE NODE NAME
 bash    363 bozo        0u   CHR  136,1         3 /dev/pts/1
 bash    363 bozo        1u   CHR  136,1         3 /dev/pts/1
 bash    363 bozo        2u   CHR  136,1         3 /dev/pts/1</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">exec 2> /dev/null</kbd>
<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">lsof -a -p $ -d0,1,2</kbd>
<samp class="COMPUTEROUTPUT">COMMAND PID     USER   FD   TYPE DEVICE SIZE NODE NAME
 bash    371 bozo        0u   CHR  136,1         3 /dev/pts/1
 bash    371 bozo        1u   CHR  136,1         3 /dev/pts/1
 bash    371 bozo        2w   CHR    1,3       120 /dev/null</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">bash -c 'lsof -a -p $ -d0,1,2' | cat</kbd>
<samp class="COMPUTEROUTPUT">COMMAND PID USER   FD   TYPE DEVICE SIZE NODE NAME
 lsof    379 root    0u   CHR  136,1         3 /dev/pts/1
 lsof    379 root    1w  FIFO    0,0      7118 pipe
 lsof    379 root    2u   CHR  136,1         3 /dev/pts/1</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo "$(bash -c 'lsof -a -p $ -d0,1,2' 2>&1)"</kbd>
<samp class="COMPUTEROUTPUT">COMMAND PID USER   FD   TYPE DEVICE SIZE NODE NAME
 lsof    426 root    0u   CHR  136,1         3 /dev/pts/1
 lsof    426 root    1w  FIFO    0,0      7520 pipe
 lsof    426 root    2w  FIFO    0,0      7520 pipe</samp></pre>

 |

这是用来展示不同类型的重定向.

<kbd class="USERINPUT">练习:</kbd> 分析下面的脚本.

| 

<pre class="PROGRAMLISTING">  1 #! /usr/bin/env bash                                                                                    
  2 												
  3 mkfifo /tmp/fifo1 /tmp/fifo2                                                                            
  4 while read a; do echo "FIFO1: $a"; done < /tmp/fifo1 &                                                  
  5 exec 7> /tmp/fifo1                                                                                      
  6 exec 8> >(while read a; do echo "FD8: $a, to fd7"; done >&7)                                            
  7                                                                                                         
  8 exec 3>&1                                                                                               
  9 (                                                                                                       
 10  (                                                                                                      
 11   (                                                                                                     
 12    while read a; do echo "FIFO2: $a"; done < /tmp/fifo2 | tee /dev/stderr | tee /dev/fd/4 | tee /dev/fd/5 | tee /dev/fd/6 >&7 &                                                                        
 13    exec 3> /tmp/fifo2                                                                                   
 14                                                                                                         
 15    echo 1st, to stdout                                                                                  
 16    sleep 1                                                                                              
 17    echo 2nd, to stderr >&2                                                                              
 18    sleep 1                                                                                              
 19    echo 3rd, to fd 3 >&3                                                                                
 20    sleep 1                                                                                              
 21    echo 4th, to fd 4 >&4                                                                                
 22    sleep 1                                                                                              
 23    echo 5th, to fd 5 >&5                                                                                
 24    sleep 1                                                                                              
 25    echo 6th, through a pipe | sed 's/.*/PIPE: &, to fd 5/' >&5                                          
 26    sleep 1                                                                                              
 27    echo 7th, to fd 6 >&6                                                                                
 28    sleep 1                                                                                              
 29    echo 8th, to fd 7 >&7                                                                                
 30    sleep 1                                                                                              
 31    echo 9th, to fd 8 >&8                                                                                
 32                                                                                                         
 33   ) 4>&1 >&3 3>&- | while read a; do echo "FD4: $a"; done 1>&3 5>&- 6>&-                                
 34  ) 5>&1 >&3 | while read a; do echo "FD5: $a"; done 1>&3 6>&-                                           
 35 ) 6>&1 >&3 | while read a; do echo "FD6: $a"; done 3>&-                                                 
 36                                                                                                         
 37 rm -f /tmp/fifo1 /tmp/fifo2
 38 
 39 
 40 # 对于每个命令和子shell, 分别指出每个fd的指向. 
 41 
 42 exit 0</pre>

 |
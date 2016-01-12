# M.1\. 分析脚本

检查下面的脚本. 运行它, 然后解释一下这个脚本是做什么用的. 注释这个脚本, 并以更紧凑和更优雅的形式重写它.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 MAX=10000
  4 
  5 
  6   for((nr=1; nr<$MAX; nr++))
  7   do
  8 
  9     let "t1 = nr % 5"
 10     if [ "$t1" -ne 3 ]
 11     then
 12       continue
 13     fi
 14 
 15     let "t2 = nr % 7"
 16     if [ "$t2" -ne 4 ]
 17     then
 18       continue
 19     fi
 20 
 21     let "t3 = nr % 9"
 22     if [ "$t3" -ne 5 ]
 23     then
 24       continue
 25     fi
 26 
 27   break   # 当你注释掉这行, 会发生什么? 为什么? 
 28 
 29   done
 30 
 31   echo "Number = $nr"
 32 
 33 
 34 exit 0</pre>

 |

---

解释一下下面脚本的作用. 事实上它只是一个参数化的命令行管道.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 DIRNAME=/usr/bin
  4 FILETYPE="shell script"
  5 LOGFILE=logfile
  6 
  7 file "$DIRNAME"/* | fgrep "$FILETYPE" | tee $LOGFILE | wc -l
  8 
  9 exit 0</pre>

 |

---

一个读者发来了如下的代码片断.

| 

<pre class="PROGRAMLISTING">  1 while read LINE
  2 do
  3   echo $LINE
  4 done < `tail -f /var/log/messages`</pre>

 |

他希望编写一个脚本, 用来跟踪系统日志文件(<tt class="FILENAME">/var/log/messages</tt>)的更新情况. 不幸的是, 上面的这段代码会被挂起, 并且不会做任何有意义的事情. 为什么? 修复它, 让这个脚本如期望般的运行. (小提示: 不要[重定向循环的stdin](redircb.md#REDIRREF), 试试[管道](special-chars.md#PIPEREF). )

---

分析[例子 A-10](contributed-scripts.md#LIFESLOW), 然后简化它, 使其逻辑性更好. 看看可以省掉多少个变量, 尝试优化这个脚本, 并提高这个脚本的运行速度.

修改这个脚本, 让它可以接受任意的ASCII文本文件作为输入, 用于它初始的"产生". 这个脚本将读取最初的`$ROW*$COL`字符, 并且设置元音的出现次数作为<span class="QUOTE">"活的"</span>细胞. 提示: 必须保证将输入文件中的空格转换为下划线.
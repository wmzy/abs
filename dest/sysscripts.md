# 13.1\. 分析一个系统脚本

利用我们所学到的关于管理命令的知识, 让我们一起来练习分析一个系统脚本. 最简单并且最短的系统脚本之一是<span class="QUOTE">"killall"</span>, [[1]](#FTN.AEN13054) 这个脚本被用来在系统关机时挂起运行的脚本.

* * *

**例子 13-11\. **killall**, 来自于<tt class="FILENAME">/etc/rc.d/init.d</tt>**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/sh
  2 
  3 # -->  本书作者所做的注释全部以"# -->"开头. 
  4 
  5 # --> 这是由Miquel van Smoorenburg所编写的
  6 # --> 'rc'脚本包的一部分, <miquels@drinkel.nl.mugnet.org>.
  7 
  8 # --> 这个特殊的脚本看起来是Red Hat/FC专用的, 
  9 # --> (在其它的发行版中可能不会出现). 
 10 
 11 #  停止所有正在运行的不必要的服务
 12 #+ (不会有多少, 所以这是个合理性检查)
 13 
 14 for i in /var/lock/subsys/*; do
 15         # --> 标准的for/in循环, 但是由于"do"在同一行上, 
 16         # --> 所以必须添加";". 
 17         # 检查脚本是否在那里. 
 18         [ ! -f $i ] && continue
 19         # --> 这是一种使用"与列表"的聪明方法, 等价于: 
 20         # --> if [ ! -f "$i" ]; then continue
 21 
 22         # 取得子系统的名字. 
 23         subsys=${i#/var/lock/subsys/}
 24         # --> 匹配变量名, 在这里就是文件名. 
 25         # --> 与subsys=`basename $i`完全等价. 
 26 	
 27         # -->  从锁定文件名中获得
 28         # -->+ (如果那里有锁定文件的话, 
 29         # -->+ 那就证明进程正在运行). 
 30         # -->  参考一下上边所讲的"锁定文件"的内容. 
 31 
 32 
 33         # 终止子系统. 
 34         if [ -f /etc/rc.d/init.d/$subsys.init ]; then
 35            /etc/rc.d/init.d/$subsys.init stop
 36         else
 37            /etc/rc.d/init.d/$subsys stop
 38         # -->  挂起运行的作业和幽灵进程. 
 39         # -->  注意"stop"只是一个位置参数, 
 40         # -->+ 并不是shell内建命令. 
 41         fi
 42 done</pre>

 |

* * *

这个没有那么糟. 除了在变量匹配的地方玩了一点花样, 其它也没有别的材料了.

**练习1\.** 在<tt class="FILENAME">/etc/rc.d/init.d</tt>中, 分析**halt**脚本. 比脚本**killall**长一些, 但是概念上很相近. 对这个脚本做一个拷贝, 放到你的home目录下并且用它练习一下, (_不_要以root身份运行它). 使用`-vn`标志来模拟运行一下(<kbd class="USERINPUT">sh -vn scriptname</kbd>). 添加详细的注释. 将<span class="QUOTE">"action"</span>命令修改为<span class="QUOTE">"echo"</span>.

**练习2\.** 察看<tt class="FILENAME">/etc/rc.d/init.d</tt>下的更多更复杂的脚本. 看看你是不是能够理解其中的一些脚本. 使用上边的过程来分析这些脚本. 为了更详细的理解, 你可能也需要分析在<tt class="FILENAME">/usr/share/doc/initscripts-?.??</tt>目录下的文件<tt class="FILENAME">sysvinitfiles</tt>, 这些都是<span class="QUOTE">"initscripts"</span>文档的一部分.

### 注意事项

| [[1]](sysscripts.md#AEN13054) | 

系统的_killall_脚本不应该与<tt class="FILENAME">/usr/bin</tt>中的[killall](x6756.md#KILLALLREF)命令相混淆.

 |
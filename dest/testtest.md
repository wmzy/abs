# 7.5\. 检测你对测试知识的掌握情况

系统范围的<tt class="FILENAME">xinitrc</tt>文件可以用来启动X server. 这个文件包含了相当多的_if/then_条件测试, 下面是这个文件的部分节选.

| 

<pre class="PROGRAMLISTING">  1 if [ -f $HOME/.Xclients ]; then
  2   exec $HOME/.Xclients
  3 elif [ -f /etc/X11/xinit/Xclients ]; then
  4   exec /etc/X11/xinit/Xclients
  5 else
  6      # 失败后的安全设置. 虽然我们永远都不会走到这来.
  7      # (我们在Xclients中也提供了相同的机制) 保证它不会被破坏.
  8      xclock -geometry 100x100-5+5 &
  9      xterm -geometry 80x50-50+150 &
 10      if [ -f /usr/bin/netscape -a -f /usr/share/doc/HTML/index.html ]; then
 11              netscape /usr/share/doc/HTML/index.html &
 12      fi
 13 fi</pre>

 |

解释上边节选中<span class="QUOTE">"条件测试"</span>结构中的内容, 然后检查整个文件, <tt class="FILENAME">/etc/X11/xinit/xinitrc</tt>, 并且分析其中的_if/then_测试结构. 你可能需要查阅一下后边讲解的知识, 比如说[grep](textproc.md#GREPREF), [sed](sedawk.md#SEDREF), 和[正则表达式](regexp.md#REGEXREF).
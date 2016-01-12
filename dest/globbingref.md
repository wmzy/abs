# 19.2\. 通配(globbing)

Bash本身并不会识别正则表达式. 在脚本中, 使用RE的是命令和工具 -- 比如[sed](sedawk.md#SEDREF)和[awk](awk.md#AWKREF) -- 这些工具能够解释RE.

Bash_仅仅_做的一件事是_文件名扩展_(译者注: 作者在前面使用的名词是filename globbing, 这里又使用filename expansion, 造成术语不统一, 希望读者不要产生误解.) [[1]](#FTN.AEN14088) -- 这就是所谓的_通配(globbing)_ -- 但是这里所使用的并_不是_标准的RE, 而是使用通配符. 通配(globbing)解释标准通配符, <span class="TOKEN">*</span>, <span class="TOKEN">?</span>, 中括号扩起来的字符, 还有其他一些特殊字符(比如<span class="TOKEN">^</span>用来表示取反匹配). 然而通配(globbing)所使用的通配符有很大的局限性. 包含<tt class="REPLACEABLE">_*_</tt>的字符串不能匹配以<span class="QUOTE">"点"</span>开头的文件, 比如, <tt class="FILENAME">.bashrc</tt>. [[2]](#FTN.AEN14102) 另外, RE中所使用的<tt class="REPLACEABLE">_?_</tt>, 与通配(globbing)中所使用的<tt class="REPLACEABLE">_?_</tt>, 含义并不相同.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l</kbd>
<samp class="COMPUTEROUTPUT">total 2
 -rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 a.1
 -rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 b.1
 -rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 c.1
 -rw-rw-r--    1 bozo  bozo       466 Aug  6 17:48 t2.sh
 -rw-rw-r--    1 bozo  bozo       758 Jul 30 09:02 test1.txt</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l t?.sh</kbd>
<samp class="COMPUTEROUTPUT">-rw-rw-r--    1 bozo  bozo       466 Aug  6 17:48 t2.sh</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l [ab]*</kbd>
<samp class="COMPUTEROUTPUT">-rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 a.1
 -rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 b.1</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l [a-c]*</kbd>
<samp class="COMPUTEROUTPUT">-rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 a.1
 -rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 b.1
 -rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 c.1</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l [^ab]*</kbd>
<samp class="COMPUTEROUTPUT">-rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 c.1
 -rw-rw-r--    1 bozo  bozo       466 Aug  6 17:48 t2.sh
 -rw-rw-r--    1 bozo  bozo       758 Jul 30 09:02 test1.txt</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l {b*,c*,*est*}</kbd>
<samp class="COMPUTEROUTPUT">-rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 b.1
 -rw-rw-r--    1 bozo  bozo         0 Aug  6 18:42 c.1
 -rw-rw-r--    1 bozo  bozo       758 Jul 30 09:02 test1.txt</samp>
	      </pre>

 |

Bash只能对未用引号引用起来的命令行参数进行文件名扩展. [echo](internal.md#ECHOREF)命令可以印证这一点.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo *</kbd>
<samp class="COMPUTEROUTPUT">a.1 b.1 c.1 t2.sh test1.txt</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo t*</kbd>
<samp class="COMPUTEROUTPUT">t2.sh test1.txt</samp>
	      </pre>

 |

| ![Note](./images/note.gif) | 

Bash在通配(globbing)中解释特殊字符的行为是可以修改的. **set -f**命令可以禁用通配(globbing), 而且[shopt](internal.md#SHOPTREF)命令的选项`nocaseglob`和`nullglob`可以修改通配(globbing)的行为.

 |

请参考[例子 10-4](loops1.md#LISTGLOB).

### 注意事项

| [[1]](globbingref.md#AEN14088) | 

_文件名扩展_意味着扩展包含有特殊字符的文件名模式或模版. 比如, <tt class="FILENAME">example.???</tt>可能会被扩展成<tt class="FILENAME">example.001</tt>或(和)<tt class="FILENAME">example.txt</tt>.

 |
| [[2]](globbingref.md#AEN14102) | 

文件名扩展_能够_匹配以<span class="QUOTE">"点"</span>开头的文件, 但是, 你必须在模式字符串中明确的写上<span class="QUOTE">"点"</span>(.), 才能够扩展.

| 

<pre class="PROGRAMLISTING">  1 ~/[.]bashrc    #  不能扩展成~/.bashrc
  2 ~/?bashrc      #  也不能扩展. 
  3                #  通配(globbing)中所使用的通配符
  4                #+ 和匹配字符串"不能"扩展"点". 
  5 
  6 ~/.[b]ashrc    #  可以扩展成~/.bashrc
  7 ~/.ba?hrc      #  也可以扩展.
  8 ~/.bashr*      #  也可以扩展.
  9 
 10 # 可以设置"dotglob"选项, 把这个特性关闭. 
 11 
 12 # 感谢, S.C.</pre>

 |

 |
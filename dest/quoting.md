# 5\. 引用

*   **目录**
*   5.1\. [引用变量](quotingvar.md)
*   5.2\. [转义](escapingsection.md)

引用的字面意思就是将字符串用双引号括起来. 它的作用就是保护字符串中的[特殊字符](special-chars.md#SCHARLIST1)不被shell或者shell脚本重新解释, 或者扩展. (我们这里所说的<span class="QUOTE">"特殊"</span>指的是一些字符在shell中具有的特殊意义, 而不是字符的字面意思, 比如<span class="TOKEN">通配符</span> -- <span class="TOKEN">*</span>.)

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l [Vv]*</kbd>
<samp class="COMPUTEROUTPUT">-rw-rw-r--    1 bozo  bozo       324 Apr  2 15:05 VIEWDATA.BAT
 -rw-rw-r--    1 bozo  bozo       507 May  4 14:25 vartrace.sh
 -rw-rw-r--    1 bozo  bozo       539 Apr 14 17:11 viewdata.sh</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">ls -l '[Vv]*'</kbd>
<samp class="COMPUTEROUTPUT">ls: [Vv]*: No such file or directory</samp></pre>

 |

| 

在日常的演讲和写作中, 当我们<span class="QUOTE">"引用"</span>一个短语的时候, 这意味着这个短语被区分以示它有特别的含义. 但是在Bash脚本中, 当我们_引用_一个字符串的时候, 我们区分这个字符串是为了保护它的_字面_含义.

 |

某些程序和工具能够重新解释或者扩展被引用的特殊字符. 引用的一个重要作用就是保护命令行参数不被shell解释, 但是还是能够让正在调用的程序来扩展它.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">grep '[Ff]irst' *.txt</kbd>
<samp class="COMPUTEROUTPUT">file1.txt:This is the first line of file1.txt.
 file2.txt:This is the First line of file2.txt.</samp></pre>

 |

注意一下未引用的 <kbd class="USERINPUT">grep [Ff]irst *.txt</kbd> 在Bash shell下的行为. [[1]](#FTN.AEN2072)

引用还可以改掉[echo's](internal.md#ECHOREF)不换行的<span class="QUOTE">"毛病"</span>.

| 

<pre class="SCREEN"><samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo $(ls -l)</kbd>
<samp class="COMPUTEROUTPUT">total 8 -rw-rw-r-- 1 bozo bozo 130 Aug 21 12:57 t222.sh -rw-rw-r-- 1 bozo bozo 78 Aug 21 12:57 t71.sh</samp>

<samp class="PROMPT">bash$</samp> <kbd class="USERINPUT">echo "$(ls -l)"</kbd>
<samp class="COMPUTEROUTPUT">total 8
 -rw-rw-r--  1 bozo bozo 130 Aug 21 12:57 t222.sh
 -rw-rw-r--  1 bozo bozo  78 Aug 21 12:57 t71.sh</samp></pre>

 |

### 注意事项

| [[1]](quoting.md#AEN2072) | 

除非正好当前工作目录下有一个名字为 <tt class="FILENAME">first</tt>的文件. 然而这是_引用的_另一个原因. (感谢, Harald Koenig, 指出这一点.

 |
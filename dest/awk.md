# C.2\. Awk

**Awk**是功能完整的文本处理语言, 使用类似于**C**的语法. 它具有一整套操作符和能力集, 我们只在这里讲解一小部分 - 也就是在shell脚本中最有用的部分.

Awk将传递进来的每行输入都分割成_域_. 默认情况下, 一个域指的就是使用[空白](special-chars.md#WHITESPACEREF)分隔的一个连续字符串, 不过我们可以修改属性来改变分隔符. Awk将会分析并操作每个分割域. 因为这种特性, 所以awk非常善于处理结构化的文本文件 -- 尤其是表 -- 将数据组织成统一的块, 比如说分成行和列.

强引用(单引号)和大括号用来包含shell脚本中的awk代码段.

| 

<pre class="PROGRAMLISTING">  1 echo one two | awk '{print $1}'
  2 # one
  3 
  4 echo one two | awk '{print $2}'
  5 # two
  6 
  7 
  8 awk '{print $3}' $filename
  9 # 打印文件$filename的域#3, 到stdout. 
 10 
 11 awk '{print $1 $5 $6}' $filename
 12 # 打印文件$filename的域#1, #5, 和#6\. </pre>

 |

事实上, 上边我们只讲解了awk的**print**命令. 我们需要在这里讲解awk的另一个特点, 变量. Awk处理变量的手段与shell脚本很相似, 虽然更复杂一些.

| 

<pre class="PROGRAMLISTING">  1 { total += ${column_number} }</pre>

 |

上边这句将_column_number_的值加上<span class="QUOTE">"total"</span>的值然后再赋给_total_. 最后, 为了打印出<span class="QUOTE">"total"</span>, 我们需要一个**END**命令块, 当脚本处理完所有输入之后, 就会执行这个命令块中的内容.

| 

<pre class="PROGRAMLISTING">  1 END { print total }</pre>

 |

与**END**对应, 还有**BEGIN**命令块, 在脚本处理所有输入之前, 将会执行这个命令块中的内容.

下面这个例子展示了**awk**如何在shell脚本中添加文本分析工具.

* * *

**例子 C-1\. 计算字符出现次数**

| 

<pre class="PROGRAMLISTING">  1 #! /bin/sh
  2 # letter-count2.sh: 在文本文件中计算字符的出现次数. 
  3 #
  4 # 由nyal [nyal@voila.fr]编写.
  5 # 授权使用. 
  6 # 本文作者重新注释. 
  7 # 版本 1.1: 经过修改可用于gawk 3.1.3.
  8 #              (也可用于awk的早期版本.)
  9 
 10 
 11 INIT_TAB_AWK=""
 12 # 初始化awk脚本的参数. 
 13 count_case=0
 14 FILE_PARSE=$1
 15 
 16 E_PARAMERR=65
 17 
 18 usage()
 19 {
 20     echo "Usage: letter-count.sh file letters" 2>&1
 21     # 比如:   ./letter-count2.sh filename.txt a b c
 22     exit $E_PARAMERR  # 传递到脚本的参数个数不够. 
 23 }
 24 
 25 if [ ! -f "$1" ] ; then
 26     echo "$1: No such file." 2>&1
 27     usage                 # 打印使用信息并退出. 
 28 fi 
 29 
 30 if [ -z "$2" ] ; then
 31     echo "$2: No letters specified." 2>&1
 32     usage
 33 fi 
 34 
 35 shift                      # 指定的字符. 
 36 for letter in `echo $@`    # for循环遍历 . . .
 37   do
 38   INIT_TAB_AWK="$INIT_TAB_AWK tab_search[${count_case}] = \"$letter\"; final_tab[${count_case}] = 0; " 
 39   # 作为参数传递到下边的awk脚本中. 
 40   count_case=`expr $count_case + 1`
 41 done
 42 
 43 # 调试:
 44 # echo $INIT_TAB_AWK;
 45 
 46 cat $FILE_PARSE |
 47 # 将目标文件通过管道传递下边的awk脚本中. 
 48 
 49 # ----------------------------------------------------------------------------------
 50 # 下边是本脚本的早期版本使用的方法: 
 51 # awk -v tab_search=0 -v final_tab=0 -v tab=0 -v nb_letter=0 -v chara=0 -v chara2=0 \
 52 
 53 awk \
 54 "BEGIN { $INIT_TAB_AWK } \
 55 { split(\$0, tab, \"\"); \
 56 for (chara in tab) \
 57 { for (chara2 in tab_search) \
 58 { if (tab_search[chara2] == tab[chara]) { final_tab[chara2]++ } } } } \
 59 END { for (chara in final_tab) \
 60 { print tab_search[chara] \" => \" final_tab[chara] } }"
 61 # ----------------------------------------------------------------------------------
 62 #  不是所有的都那么复杂, 只是 . . . 
 63 #+ for循环, if条件判断, 和几个指定函数而已. 
 64 
 65 exit $?
 66 
 67 # 与脚本letter-count.sh相比较.</pre>

 |

* * *

如果想再看一些在shell脚本中使用awk的简单例子, 如下:

1.  [例子 11-12](internal.md#EX44)

2.  [例子 16-8](redircb.md#REDIR4)

3.  [例子 12-29](filearchiv.md#STRIPC)

4.  [例子 33-5](wrapper.md#COLTOTALER)

5.  [例子 9-24](ivr.md#COLTOTALER2)

6.  [例子 11-19](internal.md#COLTOTALER3)

7.  [例子 27-2](procref1.md#PIDID)

8.  [例子 27-3](procref1.md#CONSTAT)

9.  [例子 10-3](loops1.md#FILEINFO)

10.  [例子 12-55](extmisc.md#BLOTOUT)

11.  [例子 9-29](randomvar.md#SEEDINGRANDOM)

12.  [例子 12-4](moreadv.md#IDELETE)

13.  [例子 9-14](string-manipulation.md#SUBSTRINGEX)

14.  [例子 33-16](assortedtips.md#SUMPRODUCT)

15.  [例子 10-8](loops1.md#USERLIST)

16.  [例子 33-4](wrapper.md#PRASC)

我们在这里所要讲解的awk内容就这么多, 但是事实上还有好多东西需要学. 可以参考[参考文献](biblio.md)中的内容深入学习.
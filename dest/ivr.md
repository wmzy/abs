# 9.5\. 变量的间接引用

假设一个变量的值是第二个变量的名字. 那么我们如何从第一个变量中取得第二个变量的值呢? 比如, 如果<tt class="REPLACEABLE">_a=letter_of_alphabet_</tt>并且<tt class="REPLACEABLE">_letter_of_alphabet=z_</tt>, 那么我们能够通过引用变量<tt class="REPLACEABLE">_a_</tt>来获得<tt class="REPLACEABLE">_z_</tt>么? 这确实是可以做到的, 它被称为_间接引用_. 它使用<tt class="REPLACEABLE">_eval var1=\$var2_</tt>这种不平常的形式.

* * *

**例子 9-23\. 间接引用**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # ind-ref.sh: 间接变量引用.
  3 # 访问一个以另一个变量内容作为名字的变量的值.(译者注: 怎么译都不顺)
  4 
  5 a=letter_of_alphabet   # 变量"a"的值是另一个变量的名字. 
  6 letter_of_alphabet=z
  7 
  8 echo
  9 
 10 # 直接引用.
 11 echo "a = $a"          # a = letter_of_alphabet
 12 
 13 # 间接引用.
 14 eval a=\$a
 15 echo "Now a = $a"      # 现在 a = z
 16 
 17 echo
 18 
 19 
 20 # 现在, 让我们试试修改第二个引用的值.
 21 
 22 t=table_cell_3
 23 table_cell_3=24
 24 echo "\"table_cell_3\" = $table_cell_3"            # "table_cell_3" = 24
 25 echo -n "dereferenced \"t\" = "; eval echo \$t    # 解引用 "t" = 24
 26 # 在这个简单的例子中, 下面的表达式也能正常工作么(为什么?).
 27 #         eval t=\$t; echo "\"t\" = $t"
 28 
 29 echo
 30 
 31 t=table_cell_3
 32 NEW_VAL=387
 33 table_cell_3=$NEW_VAL
 34 echo "Changing value of \"table_cell_3\" to $NEW_VAL."
 35 echo "\"table_cell_3\" now $table_cell_3"
 36 echo -n "dereferenced \"t\" now "; eval echo \$t
 37 # "eval" 带有两个参数 "echo" 和 "\$t" (与$table_cell_3等价)
 38 
 39 echo
 40 
 41 # (感谢, Stephane Chazelas, 澄清了上边语句的行为.)
 42 
 43 
 44 # 另一个方法是使用${!t}符号, 见"Bash, 版本2"小节的讨论.
 45 # 也请参考 ex78.sh.
 46 
 47 exit 0</pre>

 |

* * *

变量的间接引用到底有什么应用价值? 它给Bash添加了一种类似于_C_语言_指针_的功能, 比如, 在[表格查找](bashver2.md#RESISTOR)中的用法. 另外, 还有一些其他非常有趣的应用. . . .

Nils Radtke展示了如何建立<span class="QUOTE">"动态"</span>变量名并取出它们的值. 当使用[source](internal.md#SOURCEREF)命令加载配置文件的时候, 很有用.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 
  4 # --------------------------------------------------------
  5 # 这部分内容可以用单独文件通过使用"source"命令来单独加载. 
  6 isdnMyProviderRemoteNet=172.16.0.100
  7 isdnYourProviderRemoteNet=10.0.0.10
  8 isdnOnlineService="MyProvider"
  9 # --------------------------------------------------------
 10       
 11 
 12 remoteNet=$(eval "echo \$(echo isdn${isdnOnlineService}RemoteNet)")
 13 remoteNet=$(eval "echo \$(echo isdnMyProviderRemoteNet)")
 14 remoteNet=$(eval "echo \$isdnMyProviderRemoteNet")
 15 remoteNet=$(eval "echo $isdnMyProviderRemoteNet")
 16 
 17 echo "$remoteNet"    # 172.16.0.100
 18 
 19 # ================================================================
 20 
 21 #  能够做得更好.
 22 
 23 #  注意下面的脚本, 给出了变量getSparc,
 24 #+ 但是没有变量getIa64:
 25 
 26 chkMirrorArchs () { 
 27   arch="$1";
 28   if [ "$(eval "echo \${$(echo get$(echo -ne $arch |
 29        sed 's/^\(.\).*/\1/g' | tr 'a-z' 'A-Z'; echo $arch |
 30        sed 's/^.\(.*\)/\1/g')):-false}")" = true ]
 31   then
 32      return 0;
 33   else
 34      return 1;
 35   fi;
 36 }
 37 
 38 getSparc="true"
 39 unset getIa64
 40 chkMirrorArchs sparc
 41 echo $?        # 0
 42                # True
 43 
 44 chkMirrorArchs Ia64
 45 echo $?        # 1
 46                # False
 47 
 48 # 注意:
 49 # -----
 50 # 变量名中由替换命令产生的部分被准确地生成了. 
 51 # chkMirrorArchs函数的参数全都是小写字母. 
 52 # 新产生的变量名由两部分组成: "get"和"Sparc" . . .
 53 # (译者注: 此处是将chkMirrorArchs函数参数的第一个字母转为大写, 然后与"get"组合形成新的变量名. )</pre>

 |

* * *

**例子 9-24\. 传递一个间接引用给<tt class="REPLACEABLE">_awk_</tt>**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 #  这是"求文件中指定列的总和"脚本的另一个版本,
  4 #+ 这个脚本可以计算目标文件中指定列(此列的内容必须都是数字)的所有数字的和.
  5 #  这个脚本使用了间接引用.
  6 
  7 ARGS=2
  8 E_WRONGARGS=65
  9 
 10 if [ $# -ne "$ARGS" ] # 检查命令行参数的个数是否合适.
 11 then
 12    echo "Usage: `basename $0` filename column-number"
 13    exit $E_WRONGARGS
 14 fi
 15 
 16 filename=$1
 17 column_number=$2
 18 
 19 #===== 在这一行上边的部分, 与原始脚本是相同的 =====#
 20 
 21 
 22 # 多行的awk脚本的调用方法为: awk ' ..... '
 23 
 24 
 25 # awk脚本开始.
 26 # ------------------------------------------------
 27 awk "
 28 
 29 { total += \${column_number} # 间接引用
 30 }
 31 END {
 32      print total
 33      }
 34 
 35      " "$filename"
 36 # ------------------------------------------------
 37 # awk脚本结束.
 38 
 39 #  间接变量引用避免了在一个内嵌awk脚本中引用shell变量的混乱行为.
 40 #  感谢, Stephane Chazelas.
 41 
 42 
 43 exit 0</pre>

 |

* * *

| ![Caution](./images/caution.gif) | 

这种使用间接引用的方法是一个小技巧. 如果第二个变量更改了它的值, 那么第一个变量必须被适当的解除引用(就像上边的例子一样). 幸运的是, 在Bash[版本2](bashver2.md#BASH2REF)中引入的<tt class="REPLACEABLE">_${!variable}_</tt>形式使得使用间接引用更加直观了. (参考[例子 34-2](bashver2.md#EX78)和[例子 A-23](contributed-scripts.md#HASHEX2)).

 |

| 

Bash并不支持指针运算操作, 因此这极大的限制了间接引用的使用. 事实上, 在脚本语言中, 间接引用是一个蹩脚的东西.

 |
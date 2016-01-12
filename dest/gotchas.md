# 31\. 陷阱

 _Turandot: Gli enigmi sono tre, la morte una!Caleph: No, no! Gli enigmi sono tre, una la vita!_ |
 _Puccini_ |

*   将保留字或特殊字符声明为变量名.

    | 

    <pre class="PROGRAMLISTING">  1 case=value0       # 引发错误. 
      2 23skidoo=value1   # 也会引发错误. 
      3 # 以数字开头的变量名是被shell保留使用的. 
      4 # 试试_23skidoo=value1\. 以下划线开头的变量就没问题. 
      5 
      6 # 然而 . . .   如果只用一个下划线作为变量名就不行. 
      7 _=25
      8 echo $_           # $_是一个特殊变量, 代表最后一个命令的最后一个参数. 
      9 
     10 xyz((!*=value2    # 引起严重的错误. 
     11 # Bash3.0之后, 标点不能出现在变量名中. </pre>

     |

*   使用连字符或其他保留字符来做变量名(或函数名).

    | 

    <pre class="PROGRAMLISTING">  1 var-1=23
      2 # Use 'var_1' instead.
      3 
      4 function-whatever ()   # 错误
      5 # 使用'function_whatever ()'来代替. 
      6 
      7  
      8 # Bash3.0之后, 标点不能出现在函数名中. 
      9 function.whatever ()   # 错误
     10 # 使用'functionWhatever ()'来代替. </pre>

     |

*   让变量名与函数名相同. 这会使得脚本的可读性变得很差.

    | 

    <pre class="PROGRAMLISTING">  1 do_something ()
      2 {
      3   echo "This function does something with \"$1\"."
      4 }
      5 
      6 do_something=do_something
      7 
      8 do_something do_something
      9 
     10 # 这么做是合法的, 但是会让人混淆. </pre>

     |

*   不合时宜的使用[空白](special-chars.md#WHITESPACEREF)字符. 与其它编程语言相比, Bash非常讲究空白字符的使用.

    | 

    <pre class="PROGRAMLISTING">  1 var1 = 23   # 'var1=23'才是正确的. 
      2 # 对于上边这一行来说, Bash会把"var1"当作命令来执行, 
      3 # "="和"23"会被看作"命令""var1"的参数. 
      4 	
      5 let c = $a - $b   # 'let c=$a-$b'或'let "c = $a - $b"'才是正确的. 
      6 
      7 if [ $a -le 5]    # if [ $a -le 5 ]   是正确的. 
      8 # if [ "$a" -le 5 ]   这么写更好. 
      9 # [[ $a -le 5 ]] 也行. </pre>

     |

*   在[大括号包含的代码块](special-chars.md#CODEBLOCKREF)中, 最后一条命令没有以_分号_结尾.

    | 

    <pre class="PROGRAMLISTING">  1 { ls -l; df; echo "Done." }
      2 # bash: syntax error: unexpected end of file
      3 
      4 { ls -l; df; echo "Done."; }
      5 #                        ^     ### 最后的这条命令必须以分号结尾. </pre>

     |

*   假定未初始化的变量(赋值前的变量)被<span class="QUOTE">"清0"</span>. 事实上, 未初始化的变量值为<span class="QUOTE">"null"</span>, 而_不是_0\.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 echo "uninitialized_var = $uninitialized_var"
      4 # uninitialized_var =</pre>

     |

*   混淆测试符号_=_和_-eq_. 请记住, _=_用于比较字符变量, 而_-eq_用来比较整数.

    | 

    <pre class="PROGRAMLISTING">  1 if [ "$a" = 273 ]      # $a是整数还是字符串? 
      2 if [ "$a" -eq 273 ]    # $a为整数. 
      3 
      4 # 有些情况下, 即使你混用-eq和=, 也不会产生错误的结果. 
      5 # 然而 . . .
      6 
      7 
      8 a=273.0   # 不是一个整数. 
      9 	   
     10 if [ "$a" = 273 ]
     11 then
     12   echo "Comparison works."
     13 else  
     14   echo "Comparison does not work."
     15 fi    # Comparison does not work.
     16 
     17 # 与a=" 273"和a="0273"相同.
     18 
     19 
     20 # 类似的, 如果对非整数值使用"-eq"的话, 就会产生问题. 
     21 	   
     22 if [ "$a" -eq 273.0 ]
     23 then
     24   echo "a = $a"
     25 fi  # 因为产生了错误消息, 所以退出. 
     26 # test.sh: [: 273.0: integer expression expected</pre>

     |

*   误用了[字符串比较](comparison-ops.md#SCOMPARISON1)操作符.

    * * *

    **例子 31-1\. 数字比较与字符串比较并不相同**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # bad-op.sh: 尝试一下对整数使用字符串比较. 
      3 
      4 echo
      5 number=1
      6 
      7 # 下面的"while循环"有两个错误: 
      8 #+ 一个比较明显, 而另一个比较隐蔽. 
      9 
     10 while [ "$number" < 5 ]    # 错! 应该是:  while [ "$number" -lt 5 ]
     11 do
     12   echo -n "$number "
     13   let "number += 1"
     14 done  
     15 #  如果你企图运行这个错误的脚本, 那么就会得到一个错误消息: 
     16 #+ bad-op.sh: line 10: 5: No such file or directory
     17 #  在单中括号结构([ ])中, "<"必须被转义. 
     18 #+ 即便如此, 比较两个整数还是错误的. 
     19 
     20 
     21 echo "---------------------"
     22 
     23 
     24 while [ "$number" \< 5 ]    #  1 2 3 4
     25 do                          #
     26   echo -n "$number "        #  看起来*好像可以工作, 但是 . . .
     27   let "number += 1"         #+ 事实上是比较ASCII码, 
     28 done                        #+ 而不是整数比较. 
     29 
     30 echo; echo "---------------------"
     31 
     32 # 这么做会产生问题. 比如: 
     33 
     34 lesser=5
     35 greater=105
     36 
     37 if [ "$greater" \< "$lesser" ]
     38 then
     39   echo "$greater is less than $lesser"
     40 fi                          # 105 is less than 5
     41 #  事实上, 在字符串比较中(按照ASCII码的顺序)
     42 #+ "105"小于"5". 
     43 
     44 echo
     45 
     46 exit 0</pre>

     |

    * * *

*   有时候在<span class="QUOTE">"test"</span>中括号([ ])结构里的变量需要被引用起来(双引号). 如果不这么做的话, 可能会引起不可预料的结果. 请参考[例子 7-6](comparison-ops.md#STRTEST), [例子 16-5](redircb.md#REDIR2), 和[例子 9-6](internalvariables.md#ARGLIST).

*   脚本中的命令可能会因为脚本宿主不具备相应的运行权限而导致运行失败, 如果用户在命令行中就不能调用这个命令的话, 那么即使把它放到脚本中来运行, 也还是会失败. 这时可以通过修改命令的属性来解决这个问题, 有时候甚至要给它设置suid位(当然, 要以root身份来设置).

*   试图使用**-**作为重定向操作符(事实上它不是), 通常都会导致令人不快的结果.

    | 

    <pre class="PROGRAMLISTING">  1 command1 2> - | command2  # 试图将command1的错误输出重定向到一个管道中...
      2 #    ...不会工作. 	
      3 
      4 command1 2>& - | command2  # 也没效果. 
      5 
      6 感谢, S.C.</pre>

     |

*   使用Bash [2.0](bashver2.md#BASH2REF)或更高版本的功能, 可以在产生错误信息的时候, 引发修复动作. 但是比较老的Linux机器默认安装的可能是Bash 1.XX.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 minimum_version=2
      4 # 因为Chet Ramey经常给Bash添加一些新的特征, 
      5 # 所以你最好将$minimum_version设置为2.XX, 3.XX, 或是其他你认为比较合适的值. 
      6 E_BAD_VERSION=80
      7 
      8 if [ "$BASH_VERSION" \< "$minimum_version" ]
      9 then
     10   echo "This script works only with Bash, version $minimum or greater."
     11   echo "Upgrade strongly recommended."
     12   exit $E_BAD_VERSION
     13 fi
     14 
     15 ...</pre>

     |

*   在非Linux机器上的Bourne shell脚本(<kbd class="USERINPUT">#!/bin/sh</kbd>)中使用Bash特有的功能, 可能会引起不可预料的行为. Linux系统通常都会把**bash**别名化为**sh**, 但是在一般的UNIX机器上却不一定会这么做.

*   使用Bash未文档化的特征, 将是一种危险的举动. 本书之前的几个版本就依赖一个这种<span class="QUOTE">"特征"</span>, 下面说明一下这个<span class="QUOTE">"特征"</span>, 虽然[exit](exit-status.md#EXITSTATUSREF)或[return](complexfunct.md#RETURNREF)所能返回的最大正值为255, 但是并没有限制我们使用_负_整数. 不幸的是, Bash 2.05b之后的版本, 这个漏洞消失了. 请参考[例子 23-9](complexfunct.md#RETURNTEST).

*   一个带有DOS风格换行符(<tt class="REPLACEABLE">_\r\n_</tt>)的脚本将会运行失败, 因为<kbd class="USERINPUT">#!/bin/bash\r\n</kbd>是_不_合法的, 与我们所期望的<kbd class="USERINPUT">#!/bin/bash\n</kbd>_不同_. 解决办法就是将这个脚本转换为UNIX风格的换行符.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 echo "Here"
      4 
      5 unix2dos $0    # 脚本先将自己改为DOS格式. 
      6 chmod 755 $0   # 更改可执行权限. 
      7                # 'unix2dos'会删除可执行权限. 
      8 
      9 ./$0           # 脚本尝试再次运行自己. 
     10                # 但它作为一个DOS文件, 已经不能运行了. 
     11 
     12 echo "There"
     13 
     14 exit 0</pre>

     |

*   以<kbd class="USERINPUT">#!/bin/sh</kbd>开头的Bash脚本, 不能在完整的Bash兼容模式下运行. 某些Bash特定的功能可能会被禁用. 如果脚本需要完整的访问所有Bash专有扩展, 那么它需要使用<kbd class="USERINPUT">#!/bin/bash</kbd>作为开头.

*   如果在[here document](here-docs.md#HEREDOCREF)中, [结尾的limit string之前加上空白字符](here-docs.md#INDENTEDLS)的话, 将会导致脚本的异常行为.

*   脚本不能将变量**export**到它的[父进程](internal.md#FORKREF)(即调用这个脚本的shell), 或父进程的环境中. 就好比我们在生物学中所学到的那样, 子进程只会继承父进程, 反过来则不行.

    | 

    <pre class="PROGRAMLISTING">  1 WHATEVER=/home/bozo
      2 export WHATEVER
      3 exit 0</pre>

     |

    | 

    <pre class="SCREEN"><samp class="PROMPT">bash$</samp> **echo $WHATEVER**
    <samp class="COMPUTEROUTPUT"></samp>
    <samp class="PROMPT">bash$</samp> </pre>

     |

    可以确定的是, 即使回到命令行提示符, 变量$WHATEVER仍然没有被设置.

*   在[子shell](subshells.md#SUBSHELLSREF)中设置和操作变量之后, 如果尝试在子shell作用域之外使用同名变量的话, 将会产生令人不快的结果.

    * * *

    **例子 31-2\. 子shell缺陷**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 子shell中的变量缺陷. 
      3 
      4 outer_variable=outer
      5 echo
      6 echo "outer_variable = $outer_variable"
      7 echo
      8 
      9 (
     10 # 开始子shell
     11 
     12 echo "outer_variable inside subshell = $outer_variable"
     13 inner_variable=inner  # Set
     14 echo "inner_variable inside subshell = $inner_variable"
     15 outer_variable=inner  # 会修改全局变量么? 
     16 echo "outer_variable inside subshell = $outer_variable"
     17 
     18 # 如果将变量'导出'会产生不同的结果么? 
     19 #    export inner_variable
     20 #    export outer_variable
     21 # 试试看. 
     22 
     23 # 结束子shell
     24 )
     25 
     26 echo
     27 echo "inner_variable outside subshell = $inner_variable"  # 未设置. 
     28 echo "outer_variable outside subshell = $outer_variable"  # 未修改. 
     29 echo
     30 
     31 exit 0
     32 
     33 # 如果你打开第19和第20行的注释会怎样? 
     34 # 会产生不同的结果么? (译者注: 小提示, 第18行的'导出'都加上引号了.)</pre>

     |

    * * *

*   将**echo**的输出通过[管道](special-chars.md#PIPEREF)传递给[read](internal.md#READREF)命令可能会产生不可预料的结果. 在这种情况下, **read**命令的行为就好像它在子shell中运行一样. 可以使用[set](internal.md#SETREF)命令来代替(就好像[例子 11-17](internal.md#SETPOS)一样).

    * * *

    **例子 31-3\. 将**echo**的输出通过管道传递给**read**命令**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 #  badread.sh:
      3 #  尝试使用'echo'和'read'命令
      4 #+ 非交互的给变量赋值. 
      5 
      6 a=aaa
      7 b=bbb
      8 c=ccc
      9 
     10 echo "one two three" | read a b c
     11 # 尝试重新给变量a, b, 和c赋值.
     12 
     13 echo
     14 echo "a = $a"  # a = aaa
     15 echo "b = $b"  # b = bbb
     16 echo "c = $c"  # c = ccc
     17 # 重新赋值失败. 
     18 
     19 # ------------------------------
     20 
     21 # 试试下边这种方法. 
     22 
     23 var=`echo "one two three"`
     24 set -- $var
     25 a=$1; b=$2; c=$3
     26 
     27 echo "-------"
     28 echo "a = $a"  # a = one
     29 echo "b = $b"  # b = two
     30 echo "c = $c"  # c = three 
     31 # 重新赋值成功. 
     32 
     33 # ------------------------------
     34 
     35 #  也请注意, echo到'read'的值只会在子shell中起作用. 
     36 #  所以, 变量的值*只*会在子shell中被修改. 
     37 
     38 a=aaa          # 重新开始. 
     39 b=bbb
     40 c=ccc
     41 
     42 echo; echo
     43 echo "one two three" | ( read a b c;
     44 echo "Inside subshell: "; echo "a = $a"; echo "b = $b"; echo "c = $c" )
     45 # a = one
     46 # b = two
     47 # c = three
     48 echo "-----------------"
     49 echo "Outside subshell: "
     50 echo "a = $a"  # a = aaa
     51 echo "b = $b"  # b = bbb
     52 echo "c = $c"  # c = ccc
     53 echo
     54 
     55 exit 0</pre>

     |

    * * *

    事实上, 也正如Anthony Richardson指出的那样, 通过管道将输出传递到_任何_循环中, 都会引起类似的问题.

    | 

    <pre class="PROGRAMLISTING">  1 # 循环的管道问题. 
      2 #  这个例子由Anthony Richardson编写, 
      3 #+ 由Wilbert Berendsen补遗. 
      4 
      5 
      6 foundone=false
      7 find $HOME -type f -atime +30 -size 100k |
      8 while true
      9 do
     10    read f
     11    echo "$f is over 100KB and has not been accessed in over 30 days"
     12    echo "Consider moving the file to archives."
     13    foundone=true
     14    # ------------------------------------
     15    echo "Subshell level = $BASH_SUBSHELL"
     16    # Subshell level = 1
     17    # 没错, 现在是在子shell中运行. 
     18    # ------------------------------------
     19 done
     20    
     21 #  变量foundone在这里肯定是false, 
     22 #+ 因为它是在子shell中被设置为true的. 
     23 if [ $foundone = false ]
     24 then
     25    echo "No files need archiving."
     26 fi
     27 
     28 # =====================现在, 下边是正确的方法:=================
     29 
     30 foundone=false
     31 for f in $(find $HOME -type f -atime +30 -size 100k)  # 这里没使用管道. 
     32 do
     33    echo "$f is over 100KB and has not been accessed in over 30 days"
     34    echo "Consider moving the file to archives."
     35    foundone=true
     36 done
     37    
     38 if [ $foundone = false ]
     39 then
     40    echo "No files need archiving."
     41 fi
     42 
     43 # ==================这里是另一种方法==================
     44 
     45 #  将脚本中读取变量的部分放到一个代码块中, 
     46 #+ 这样一来, 它们就能在相同的子shell中共享了. 
     47 #  感谢, W.B.
     48 
     49 find $HOME -type f -atime +30 -size 100k | {
     50      foundone=false
     51      while read f
     52      do
     53        echo "$f is over 100KB and has not been accessed in over 30 days"
     54        echo "Consider moving the file to archives."
     55        foundone=true
     56      done
     57 
     58      if ! $foundone
     59      then
     60        echo "No files need archiving."
     61      fi
     62 }</pre>

     |

    一个相关的问题: 当你尝试将**tail -f**的<tt class="FILENAME">stdout</tt>通过管道传递给[grep](textproc.md#GREPREF)时, 会产生问题.

    | 

    <pre class="PROGRAMLISTING">  1 tail -f /var/log/messages | grep "$ERROR_MSG" >> error.log
      2 # "error.log"文件将不会写入任何东西. </pre>

     |

*   在脚本中使用<span class="QUOTE">"suid"</span>命令是非常危险的, 因为这会危及系统安全. [[1]](#FTN.AEN15516)

*   使用shell脚本来编写CGI程序是值得商榷的. 因为Shell脚本的变量不是<span class="QUOTE">"类型安全"</span>的, 当CGI被关联的时候, 可能会产生令人不快的行为. 此外, 它还很难抵挡住<span class="QUOTE">"破解的考验"</span>.

*   Bash不能正确的处理[双斜线(//)字符串](internal.md#DOUBLESLASHREF).

*   在Linux或BSD上编写的Bash脚本, 可能需要修改一下, 才能使它们运行在商业的UNIX(或Apple OSX)机器上. 这些脚本通常都使用GNU命令和过滤工具, GNU工具通常都比一般的UNIX上的同类工具更加强大. 这方面的一个非常明显的例子就是, 文本处理工具[tr](textproc.md#TRREF).

 _危险正在接近你 --小心, 小心, 小心, 小心.许多勇敢的心都在沉睡.所以一定要小心 --小心._ |
 _A.J. Lamb and H.W. Petrie_ |

### 注意事项

| [[1]](gotchas.md#AEN15516) | 

给脚本设置_suid_权限是没用的.

 |
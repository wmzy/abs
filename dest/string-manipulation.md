# 9.2\. 操作字符串

Bash所支持的字符串操作的数量多的令人惊讶. 但是不幸的是, 这些工具缺乏统一的标准. 一些是[参数替换](parameter-substitution.md#PARAMSUBREF)的子集, 而另外一些则受到UNIX [expr](moreadv.md#EXPRREF)命令的影响. 这就导致了命令语法的不一致, 还会引起冗余的功能, 但是这些并没有引起混乱.

**字符串长度**

*   ${#string}

*   expr length $string

*   expr "$string" : '.*'
*   | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 
      3 echo ${#stringZ}                 # 15
      4 echo `expr length $stringZ`      # 15
      5 echo `expr "$stringZ" : '.*'`    # 15</pre>

     |

* * *

**例子 9-10\. 在一个文本文件的段落之间插入空行**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # paragraph-space.sh
  3 
  4 # 在一个单倍行距的文本文件中插入空行.
  5 # Usage: $0 <FILENAME
  6 
  7 MINLEN=45        # 可能需要修改这个值.
  8 #  假定行的长度小于$MINLEN所指定的长度的时候 
  9 #+ 才认为此段结束.
 10 
 11 while read line  # 提供和输入文件一样多的行...
 12 do
 13   echo "$line"   # 输入所读入的行本身.
 14 
 15   len=${#line}
 16   if [ "$len" -lt "$MINLEN" ]
 17     then echo    # 在短行(译者注: 也就是小于$MINLEN个字符的行)后面添加一个空行.
 18   fi  
 19 done
 20 
 21 exit 0</pre>

 |

* * *

**匹配字符串开头的子串长度**

*   expr match "$string" '$substring'
*   <tt class="REPLACEABLE">_$substring_</tt>是一个[正则表达式](regexp.md#REGEXREF).

*   expr "$string" : '$substring'
*   <tt class="REPLACEABLE">_$substring_</tt>是一个正则表达式.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 #       |------|
      3 
      4 echo `expr match "$stringZ" 'abc[A-Z]*.2'`   # 8
      5 echo `expr "$stringZ" : 'abc[A-Z]*.2'`       # 8</pre>

     |

**索引**

*   expr index $string $substring
*   在字符串$string中所匹配到的$substring第一次所出现的位置.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 echo `expr index "$stringZ" C12`             # 6
      3                                              # C 字符的位置.
      4 
      5 echo `expr index "$stringZ" 1c`              # 3
      6 # 'c' (in #3 position) matches before '1'.</pre>

     |

    这与C语言中的_strchr()_函数非常相似.

**提取子串**

*   ${string:position}
*   在<tt class="REPLACEABLE">_$string_</tt>中从位置<tt class="REPLACEABLE">_$position_</tt>开始提取子串.

    如果`$string`是<span class="QUOTE">"<span class="TOKEN">*</span>"</span>或者<span class="QUOTE">"<span class="TOKEN">@</span>"</span>, 那么将会提取从位置`$position`开始的[位置参数](internalvariables.md#POSPARAMREF). [[1]](#FTN.AEN4649)

*   ${string:position:length}
*   在<tt class="REPLACEABLE">_$string_</tt>中从位置<tt class="REPLACEABLE">_$position_</tt>开始提取<tt class="REPLACEABLE">_$length_</tt>长度的子串.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 #       0123456789.....
      3 #       0-based indexing.
      4 
      5 echo ${stringZ:0}                            # abcABC123ABCabc
      6 echo ${stringZ:1}                            # bcABC123ABCabc
      7 echo ${stringZ:7}                            # 23ABCabc
      8 
      9 echo ${stringZ:7:3}                          # 23A
     10                                              # 提取子串长度为3.
     11 
     12 
     13 
     14 # 能不能从字符串的右边(也就是结尾)部分开始提取子串? 
     15     
     16 echo ${stringZ:-4}                           # abcABC123ABCabc
     17 # 默认是提取整个字符串, 就象${parameter:-default}一样.
     18 # 然而 . . .
     19 
     20 echo ${stringZ:(-4)}                         # Cabc 
     21 echo ${stringZ: -4}                          # Cabc
     22 # 这样, 它就可以工作了.
     23 # 使用圆括号或者添加一个空格可以"转义"这个位置参数.
     24 
     25 # 感谢, Dan Jacobson, 指出这点.</pre>

     |

    如果`$string`参数是<span class="QUOTE">"<span class="TOKEN">*</span>"</span>或<span class="QUOTE">"<span class="TOKEN">@</span>"</span>, 那么将会从`$position`位置开始提取`$length`个位置参数, 但是由于可能没有`$length`个位置参数了, 那么就有几个位置参数就提取几个位置参数.

    | 

    <pre class="PROGRAMLISTING">  1 echo ${*:2}          # 打印出第2个和后边所有的位置参数.
      2 echo ${@:2}          # 同上.
      3 
      4 echo ${*:2:3}        # 从第2个开始, 连续打印3个位置参数. </pre>

     |

*   expr substr $string $position $length
*   在<tt class="REPLACEABLE">_$string_</tt>中从<tt class="REPLACEABLE">_$position_</tt>开始提取<tt class="REPLACEABLE">_$length_</tt>长度的子串.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 #       123456789......
      3 #       以1开始计算.
      4 
      5 echo `expr substr $stringZ 1 2`              # ab
      6 echo `expr substr $stringZ 4 3`              # ABC</pre>

     |

*   expr match "$string" '\($substring\)'
*   从<tt class="REPLACEABLE">_$string_</tt>的开始位置提取<tt class="REPLACEABLE">_$substring_</tt>, <tt class="REPLACEABLE">_$substring_</tt>是[正则表达式](regexp.md#REGEXREF).

*   expr "$string" : '\($substring\)'
*   从<tt class="REPLACEABLE">_$string_</tt>的开始位置提取<tt class="REPLACEABLE">_$substring_</tt>, <tt class="REPLACEABLE">_$substring_</tt>是正则表达式.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 #       =======	    
      3 
      4 echo `expr match "$stringZ" '\(.[b-c]*[A-Z]..[0-9]\)'`   # abcABC1
      5 echo `expr "$stringZ" : '\(.[b-c]*[A-Z]..[0-9]\)'`       # abcABC1
      6 echo `expr "$stringZ" : '\(.......\)'`                   # abcABC1
      7 # 上边的每个echo都打印出相同的结果. </pre>

     |

*   expr match "$string" '.*\($substring\)'
*   从<tt class="REPLACEABLE">_$string_</tt>的_结尾_提取<tt class="REPLACEABLE">_$substring_</tt>, <tt class="REPLACEABLE">_$substring_</tt>是正则表达式.

*   expr "$string" : '.*\($substring\)'
*   从<tt class="REPLACEABLE">_$string_</tt>的_结尾_提取<tt class="REPLACEABLE">_$substring_</tt>, <tt class="REPLACEABLE">_$substring_</tt>是正则表达式.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 #                ======
      3 
      4 echo `expr match "$stringZ" '.*\([A-C][A-C][A-C][a-c]*\)'`    # ABCabc
      5 echo `expr "$stringZ" : '.*\(......\)'`                       # ABCabc</pre>

     |

**子串削除**

*   ${string#substring}
*   从<tt class="REPLACEABLE">_$string_</tt>的_开头_位置截掉最短匹配的<tt class="REPLACEABLE">_$substring_</tt>.

*   ${string##substring}
*   从<tt class="REPLACEABLE">_$string_</tt>的_开头_位置截掉最长匹配的<tt class="REPLACEABLE">_$substring_</tt>.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 #       |----|
      3 #       |----------|
      4 
      5 echo ${stringZ#a*C}      # 123ABCabc
      6 # 截掉'a'到'C'之间最短的匹配字符串.
      7 
      8 echo ${stringZ##a*C}     # abc
      9 # 截掉'a'到'C'之间最长的匹配字符串.</pre>

     |

*   ${string%substring}
*   从<tt class="REPLACEABLE">_$string_</tt>的_结尾_位置截掉最短匹配的<tt class="REPLACEABLE">_$substring_</tt>.

*   ${string%%substring}
*   从<tt class="REPLACEABLE">_$string_</tt>的_结尾_位置截掉最长匹配的<tt class="REPLACEABLE">_$substring_</tt>.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 #                    ||
      3 #        |------------|
      4 
      5 echo ${stringZ%b*c}      # abcABC123ABCa
      6 # 从$stringZ的结尾位置截掉'b'到'c'之间最短的匹配.
      7 
      8 echo ${stringZ%%b*c}     # a
      9 # 从$stringZ的结尾位置截掉'b'到'c'之间最长的匹配. </pre>

     |

    当你需要构造文件名的时候, 这个操作就显得特别有用.

    * * *

    **例子 9-11\. 转换图片文件格式, 同时更改文件名**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 #  cvt.sh:
      3 #  将一个目录下的所有MacPaint格式的图片文件都转换为"pbm"各式的图片文件. 
      4 
      5 #  使用"netpbm"包中的"macptopbm"程序进行转换, 
      6 #+ 这个程序主要是由Brian Henderson(bryanh@giraffe-data.com)来维护的.
      7 #  Netpbm绝大多数Linux发行版的标准套件. 
      8 
      9 OPERATION=macptopbm
     10 SUFFIX=pbm          # 新的文件名后缀.
     11 
     12 if [ -n "$1" ]
     13 then
     14   directory=$1      # 如果目录名作为参数传递给脚本...
     15 else
     16   directory=$PWD    # 否则使用当前的工作目录.
     17 fi  
     18   
     19 #  假定目标目录中的所有文件都是MacPaint格式的图像文件, 
     20 #+ 并且都是以".mac"作为文件名后缀. 
     21 
     22 for file in $directory/*    # 文件名匹配(filename globbing).
     23 do
     24   filename=${file%.*c}      #  去掉文件名的".mac"后缀
     25                             #+ ('.*c' 将会匹配
     26 			    #+ '.'和'c'之间任意字符串).
     27   $OPERATION $file > "$filename.$SUFFIX"
     28                             # 把结果重定向到新的文件中.
     29   rm -f $file               # 转换后删除原始文件.
     30   echo "$filename.$SUFFIX"  # 从stdout输出转换后文件的文件名.
     31 done
     32 
     33 exit 0
     34 
     35 # 练习:
     36 # -----
     37 #  就像它现在的样子, 这个脚本把当前
     38 #+ 目录下的所有文件都转换了.
     39 #  修改这个脚本, 让它只转换以".mac"为后缀名的文件.</pre>

     |

    * * *

    * * *

    **例子 9-12\. 将音频流文件转换为_ogg_各式的文件**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # ra2ogg.sh: 将音频流文件(*.ra)转换为ogg格式的文件.
      3 
      4 # 使用"mplayer"媒体播放器程序:
      5 #      http://www.mplayerhq.hu/homepage
      6 #      可能需要安装合适的编解码程序(codec)才能够正常的运行这个脚本. 
      7 # 需要使用"ogg"库和"oggenc":
      8 #      http://www.xiph.org/
      9 
     10 
     11 OFILEPREF=${1%%ra}      # 去掉"ra"后缀.
     12 OFILESUFF=wav           # wav文件的后缀.
     13 OUTFILE="$OFILEPREF""$OFILESUFF"
     14 E_NOARGS=65
     15 
     16 if [ -z "$1" ]          # 必须要指定一个需要转换的文件名.
     17 then
     18   echo "Usage: `basename $0` [filename]"
     19   exit $E_NOARGS
     20 fi
     21 
     22 
     23 ##########################################################################
     24 mplayer "$1" -ao pcm:file=$OUTFILE
     25 oggenc "$OUTFILE"  # oggenc编码后会自动加上正确的文件扩展名.
     26 ##########################################################################
     27 
     28 rm "$OUTFILE"      # 删除中介的*.wav文件. 
     29                    # 如果你想保留这个文件的话, 可以把上边这行注释掉.
     30 
     31 exit $?
     32 
     33 #  注意:
     34 #  ----
     35 #  在网站上, 简单的在*.ram流音频文件上单击的话, 
     36 #+ 一般都只会下载真正音频流文件(就是*.ra文件)的URL.
     37 #  你可以使用"wget"或者一些类似的工具
     38 #+ 来下载*.ra文件本身.
     39 
     40 
     41 #  练习:
     42 #  -----
     43 #  像上面所看到的, 这个脚本只能够转换*.ra文件.
     44 #  给这个脚本添加一些灵活性, 让它能够转换*.ram and other filenames.
     45 #
     46 #  如果你觉得这还不过瘾, 那么你可以扩展这个脚本, 
     47 #+ 让它自动下载并转换音频流文件.
     48 #  给出一个URL, (使用"wget")批处理下载音频流文件,
     49 #+ 然后转换它们.</pre>

     |

    * * *

    一个简单的[getopt](extmisc.md#GETOPTY)命令的模拟, 使用子串提取结构.

    * * *

    **例子 9-13\. 模拟_getopt_**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # getopt-simple.sh
      3 # 作者: Chris Morgan
      4 # 已经经过授权, 可以使用在本书中.
      5 
      6 
      7 getopt_simple()
      8 {
      9     echo "getopt_simple()"
     10     echo "Parameters are '$*'"
     11     until [ -z "$1" ]
     12     do
     13       echo "Processing parameter of: '$1'"
     14       if [ ${1:0:1} = '/' ]
     15       then
     16           tmp=${1:1}               # 去掉开头的'/' . . .
     17           parameter=${tmp%%=*}     # 提取参数名.
     18           value=${tmp##*=}         # 提取参数值.
     19           echo "Parameter: '$parameter', value: '$value'"
     20           eval $parameter=$value
     21       fi
     22       shift
     23     done
     24 }
     25 
     26 # 把所有选项传给函数getopt_simple().
     27 getopt_simple $*
     28 
     29 echo "test is '$test'"
     30 echo "test2 is '$test2'"
     31 
     32 exit 0
     33 
     34 ---
     35 
     36 sh getopt_example.sh /test=value1 /test2=value2
     37 
     38 Parameters are '/test=value1 /test2=value2'
     39 Processing parameter of: '/test=value1'
     40 Parameter: 'test', value: 'value1'
     41 Processing parameter of: '/test2=value2'
     42 Parameter: 'test2', value: 'value2'
     43 test is 'value1'
     44 test2 is 'value2'</pre>

     |

    * * *

**子串替换**

*   ${string/substring/replacement}
*   使用<tt class="REPLACEABLE">_$replacement_</tt>来替换第一个匹配的<tt class="REPLACEABLE">_$substring_</tt>.

*   ${string//substring/replacement}
*   使用<tt class="REPLACEABLE">_$replacement_</tt>来替换所有匹配的<tt class="REPLACEABLE">_$substring_</tt>.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 
      3 echo ${stringZ/abc/xyz}           # xyzABC123ABCabc
      4                                   # 使用'xyz'来替换第一个匹配的'abc'.
      5 
      6 echo ${stringZ//abc/xyz}          # xyzABC123ABCxyz
      7                                   # 用'xyz'来替换所有匹配的'abc'.</pre>

     |

*   ${string/#substring/replacement}
*   如果<tt class="REPLACEABLE">_$substring_</tt>匹配<tt class="REPLACEABLE">_$string_</tt>的_开头部分_, 那么就用<tt class="REPLACEABLE">_$replacement_</tt>来替换<tt class="REPLACEABLE">_$substring_</tt>.

*   ${string/%substring/replacement}
*   如果<tt class="REPLACEABLE">_$substring_</tt>匹配<tt class="REPLACEABLE">_$string_</tt>的_结尾部分_, 那么就用<tt class="REPLACEABLE">_$replacement_</tt>来替换<tt class="REPLACEABLE">_$substring_</tt>.

    | 

    <pre class="PROGRAMLISTING">  1 stringZ=abcABC123ABCabc
      2 
      3 echo ${stringZ/#abc/XYZ}          # XYZABC123ABCabc
      4                                   # 用'XYZ'替换开头的'abc'.
      5 
      6 echo ${stringZ/%abc/XYZ}          # abcABC123ABCXYZ
      7                                   # 用'XYZ'替换结尾的'abc'.</pre>

     |

## <a name="AWKSTRINGMANIP">9.2.1\. 使用awk来处理字符串</a>

Bash脚本也可以调用[awk](awk.md#AWKREF)的字符串操作功能来代替它自己内建的字符串操作.

* * *

**例子 9-14\. 提取字符串的另一种方法**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # substring-extraction.sh
  3 
  4 String=23skidoo1
  5 #      012345678    Bash
  6 #      123456789    awk
  7 # 注意不同的字符串索引系统:
  8 # Bash的第一个字符是从'0'开始记录的. 
  9 # Awk的第一个字符是从'1'开始记录的. 
 10 
 11 echo ${String:2:4} # 位置 3 (0-1-2), 4 个字符长
 12                                          # skid
 13 
 14 # awk中等价于${string:pos:length}的命令是substr(string,pos,length).
 15 echo | awk '
 16 { print substr("'"${String}"'",3,4)      # skid
 17 }
 18 '
 19 #  使用一个空的"echo"通过管道传递给awk一个假的输入, 
 20 #+ 这样就不必提供一个文件名给awk.
 21 
 22 exit 0</pre>

 |

* * *

## <a name="STRFDISC">9.2.2\. 更深入的讨论</a>

如果想了解关于在脚本中使用字符串的更多细节, 请参考[Section 9.3](parameter-substitution.md)和[expr](moreadv.md#EXPRREF)命令列表的[相关章节](moreadv.md#EXPEXTRSUB). 相关脚本的例子, 参见:

1.  [例子 12-9](moreadv.md#EX45)

2.  [例子 9-17](parameter-substitution.md#LENGTH)

3.  [例子 9-18](parameter-substitution.md#PATTMATCHING)

4.  [例子 9-19](parameter-substitution.md#RFE)

5.  [例子 9-21](parameter-substitution.md#VARMATCH)

### 注意事项

| [[1]](string-manipulation.md#AEN4649) | 

这适用于命令行参数或[函数](functions.md#FUNCTIONREF)参数.

 |
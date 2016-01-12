# 23.2\. 局部变量

**怎样使一个变量变成<span class="QUOTE">"局部"</span>变量?**

*   局部变量
*   如果变量用_local_来声明, 那么它就只能够在该变量被声明的[代码块](special-chars.md#CODEBLOCKREF)中可见. 这个代码块就是局部<span class="QUOTE">"范围"</span>. 在一个函数中, 一个_局部变量_只有在函数代码块中才有意义.

    * * *

    **例子 23-12\. 局部变量的可见范围**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 函数内部的局部变量与全局变量. 
      3 
      4 func ()
      5 {
      6   local loc_var=23       # 声明为局部变量. 
      7   echo                   # 使用'local'内建命令. 
      8   echo "\"loc_var\" in function = $loc_var"
      9   global_var=999         # 没有声明为局部变量. 
     10                          # 默认为全局变量.  
     11   echo "\"global_var\" in function = $global_var"
     12 }  
     13 
     14 func
     15 
     16 # 现在, 来看看局部变量"loc_var"在函数外部是否可见. 
     17 
     18 echo
     19 echo "\"loc_var\" outside function = $loc_var"
     20                                       # $loc_var outside function = 
     21                                       # 不行, $loc_var不是全局可见的. 
     22 echo "\"global_var\" outside function = $global_var"
     23                                       # 在函数外部$global_var = 999
     24                                       # $global_var是全局可见的. 
     25 echo				      
     26 
     27 exit 0
     28 #  与C语言相比, 在函数内声明的Bash变量
     29 #+ 除非它被明确声明为local时, 它才是局部的. </pre>

     |

    * * *

    | ![Caution](./images/caution.gif) | 

    在函数被调用之前, _所有_在函数中声明的变量, 在函数体外都是不可见的, 当然也包括那些被明确声明为_local_的变量.

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 
      3 func ()
      4 {
      5 global_var=37    #  在函数被调用之前, 
      6                  #+ 变量只在函数体内可见.  
      7 }                #  函数结束
      8 
      9 echo "global_var = $global_var"  # global_var =
     10                                  #  函数"func"还没被调用, 
     11                                  #+ 所以$global_var还不能被访问. 
     12 
     13 func
     14 echo "global_var = $global_var"  # global_var = 37
     15                                  # 已经在函数调用的时候设置了变量的值. </pre>

     |

     |

## <a name="LOCVARRECUR">23.2.1\. 局部变量使递归变为可能.</a>

局部变量允许递归, [[1]](#FTN.AEN14542) 但是这种方法会产生大量的计算, 因此在shell脚本中, 非常明确的_不_推荐这种做法. [[2]](#FTN.AEN14549)

* * *

**例子 23-13\. 使用局部变量的递归**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 #               阶乘
  4 #               ----
  5 
  6 
  7 # bash允许递归吗? 
  8 # 嗯, 允许, 但是...
  9 # 他太慢了, 所以恐怕你难以忍受. 
 10 
 11 
 12 MAX_ARG=5
 13 E_WRONG_ARGS=65
 14 E_RANGE_ERR=66
 15 
 16 
 17 if [ -z "$1" ]
 18 then
 19   echo "Usage: `basename $0` number"
 20   exit $E_WRONG_ARGS
 21 fi
 22 
 23 if [ "$1" -gt $MAX_ARG ]
 24 then
 25   echo "Out of range (5 is maximum)."
 26   #  现在让我们来了解一些实际情况. 
 27   #  如果你想计算比这个更大的范围的阶乘, 
 28   #+ 应该用真正的编程语言来重写它. 
 29   exit $E_RANGE_ERR
 30 fi  
 31 
 32 fact ()
 33 {
 34   local number=$1
 35   #  变量"number"必须声明为局部变量, 
 36   #+ 否则不能正常工作. 
 37   if [ "$number" -eq 0 ]
 38   then
 39     factorial=1    # 0的阶乘为1\. 
 40   else
 41     let "decrnum = number - 1"
 42     fact $decrnum  # 递归的函数调用(就是函数调用自己). 
 43     let "factorial = $number * $?"
 44   fi
 45 
 46   return $factorial
 47 }
 48 
 49 fact $1
 50 echo "Factorial of $1 is $?."
 51 
 52 exit 0</pre>

 |

* * *

也可以参考[例子 A-16](contributed-scripts.md#PRIMES), 这是一个脚本中递归的例子. 必须认识到递归同时也意味着巨大的资源消耗和缓慢的运行速度, 因此它并不适合在脚本中使用.

### 注意事项

| [[1]](localvar.md#AEN14542) | 

[Herbert Mayer](biblio.md#MAYERREF) 给_递归_下的定义为: <span class="QUOTE">". . . expressing an algorithm by using a simpler version of that same algorithm(使用相同算法的一个简单版本来表达这个算法) . . ."</span> 一个递归函数就是调用自身的函数.

 |
| [[2]](localvar.md#AEN14549) | 

过多层次的递归可能会产生段错误, 继而导致脚本崩溃.

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 #  警告: 运行这个脚本可能使你的系统失去响应! 
  4 #  如果你运气不错, 在它用光所有可用内存之前会因为段错误而退出. 
  5 
  6 recursive_function ()		   
  7 {
  8 echo "$1"     # 让这个函数做点事, 以便于加速段错误. 
  9 (( $1 < $2 )) && recursive_function $(( $1 + 1 )) $2;
 10 #  当第一个参数比第二个参数少时, 
 11 #+ 将第一个参数加1, 然后再递归. 
 12 }
 13 
 14 recursive_function 1 50000  # Recurse 50,000 levels!
 15 #  极有可能产生段错误(这依赖于栈尺寸, 可以用ulimit -m来设置). 
 16 
 17 #  这种深度递归可能会产生C程序的段错误, 
 18 #+ 这是由于耗光所有的栈内存所引起的. 
 19 
 20 
 21 echo "This will probably not print."
 22 exit 0  # 这个脚本是不会在这里正常退出的. 
 23 
 24 #  感谢, Stephane Chazelas.</pre>

 |

 |
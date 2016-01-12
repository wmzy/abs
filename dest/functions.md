# 23\. 函数

*   **目录**
*   23.1\. [复杂函数和函数复杂性](complexfunct.md)
*   23.2\. [局部变量](localvar.md)
*   23.3\. [不使用局部变量的递归](recurnolocvar.md)

与<span class="QUOTE">"真正的"</span>编程语言一样, Bash也有函数, 虽然在某些实现方面稍有限制. 一个函数就是一个子程序, 用于实现一系列操作的[代码块](special-chars.md#CODEBLOCKREF), 它是完成特定任务的<span class="QUOTE">"黑盒子"</span>. 当存在重复代码的时候, 或者当一个任务只需要轻微修改就被重复使用的时候, 你就需要考虑使用函数了.

**function** <tt class="REPLACEABLE">_function_name_</tt> {
<tt class="REPLACEABLE">_command_</tt>...
}

或

<tt class="REPLACEABLE">_function_name_</tt> () {
<tt class="REPLACEABLE">_command_</tt>...
}

C程序员肯定会更加喜欢第二中格式的写法(并且这种写法可移植性更好).

在C中, 函数的左大括号也可以写在下一行中.

<tt class="REPLACEABLE">_function_name_</tt> ()
{
<tt class="REPLACEABLE">_command_</tt>...
}

只需要简单的调用函数名, 函数就会被调用或_触发_.

* * *

**例子 23-1\. 简单函数**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 
  3 JUST_A_SECOND=1
  4 
  5 funky ()
  6 { # 这是一个最简单的函数. 
  7   echo "This is a funky function."
  8   echo "Now exiting funky function."
  9 } # 函数必须在调用前声明. 
 10 
 11 
 12 fun ()
 13 { # 一个稍微复杂一些的函数. 
 14   i=0
 15   REPEATS=30
 16 
 17   echo
 18   echo "And now the fun really begins."
 19   echo
 20 
 21   sleep $JUST_A_SECOND    # 嘿, 暂停一秒! 
 22   while [ $i -lt $REPEATS ]
 23   do
 24     echo "----------FUNCTIONS---------->"
 25     echo "<------------ARE-------------"
 26     echo "<------------FUN------------>"
 27     echo
 28     let "i+=1"
 29   done
 30 }
 31 
 32   # 现在, 调用这两个函数. 
 33 
 34 funky
 35 fun
 36 
 37 exit 0</pre>

 |

* * *

函数定义必须在第一次调用函数之前完成. 没有像C中函数<span class="QUOTE">"声明"</span>的方法.

| 

<pre class="PROGRAMLISTING">  1 f1
  2 # 因为函数"f1"还没有被定义, 这会产生一个错误. 
  3 
  4 declare -f f1      # 这样也没用. 
  5 f1                 # 仍然会引起错误. 
  6 
  7 # 然而...
  8 
  9 	  
 10 f1 ()
 11 {
 12   echo "Calling function \"f2\" from within function \"f1\"."
 13   f2
 14 }
 15 
 16 f2 ()
 17 {
 18   echo "Function \"f2\"."
 19 }
 20 
 21 f1  #  虽然在f2在定义前被引用过, 
 22     #+ 实际上f2到这儿才被调用. 
 23     #  所以这么做是正常的. 
 24     
 25     # 感谢, S.C.</pre>

 |

甚至可以在一个函数内嵌套另一个函数, 虽然这么做并没有多大用处.

| 

<pre class="PROGRAMLISTING">  1 f1 ()
  2 {
  3 
  4   f2 () # nested
  5   {
  6     echo "Function \"f2\", inside \"f1\"."
  7   }
  8 
  9 }  
 10 
 11 f2  #  产生一个错误. 
 12     #  即使你先写出"declare -f f2"也没用. 
 13 
 14 echo    
 15 
 16 f1  #  什么事都没干, 因为调用"f1"并不会自动调用"f2". 
 17 f2  #  现在, 可以正确的调用"f2"了, 
 18     #+ 因为之前调用"f1"使"f2"在脚本中变得可见了. 
 19 
 20     # 感谢, S.C.</pre>

 |

函数声明可以出现在看上去不可能出现的地方, 比如说本应出现命令的地方, 也可以出现函数声明.

| 

<pre class="PROGRAMLISTING">  1 ls -l | foo() { echo "foo"; }  # 可以这么做, 但没什么用. 
  2 
  3 
  4 
  5 if [ "$USER" = bozo ]
  6 then
  7   bozo_greet ()   # 在if/then结构中定义了函数. 
  8   {
  9     echo "Hello, Bozo."
 10   }
 11 fi  
 12 
 13 bozo_greet        # 只能由Bozo运行, 其他用户使用的话, 会引起错误. 
 14 
 15 
 16 
 17 # 在某些上下文中, 这样做可能会有用. 
 18 NO_EXIT=1   # 将会打开下面的函数定义. 
 19 
 20 [[ $NO_EXIT -eq 1 ]] && exit() { true; }     # 在"与列表"中定义函数. 
 21 # 如果$NO_EXIT为1, 那就声明"exit ()". 
 22 # 把"exit"化名为"true", 将会禁用内建的"exit"命令. 
 23 
 24 exit  # 这里调用的是"exit ()"函数, 而不是"exit"内建命令. 
 25 
 26 # 感谢, S.C.</pre>

 |
# 8.2\. 数字常量

shell脚本在默认情况下都是把数字作为10进制数来处理, 除非这个数字采用了特殊的标记或者前缀. 如果数字以<tt class="REPLACEABLE">_0_</tt>开头的话那么就是<tt class="REPLACEABLE">_8进制_</tt>数. 如果数字以<tt class="REPLACEABLE">_0x_</tt>开头的话那么就是<tt class="REPLACEABLE">_16进制_</tt>数. 如果数字中间嵌入了<tt class="REPLACEABLE">_#_</tt>的话, 那么就被认为是<tt class="REPLACEABLE">_BASE#NUMBER_</tt>形式的标记法(有范围和符号限制).

* * *

**例子 8-4\. 数字常量表示法**

| 

<pre class="PROGRAMLISTING">  1 #!/bin/bash
  2 # numbers.sh: 几种不同数制的数字表示法.
  3 
  4 # 10进制: 默认情况
  5 let "dec = 32"
  6 echo "decimal number = $dec"             # 32
  7 # 这没什么特别的.
  8 
  9 
 10 # 8进制: 以'0'(零)开头 
 11 let "oct = 032"
 12 echo "octal number = $oct"               # 26
 13 # 表达式结果是用10进制表示的.
 14 # ---------------------------
 15 
 16 # 16进制: 以'0x'或者'0X'开头的数字
 17 let "hex = 0x32"
 18 echo "hexadecimal number = $hex"         # 50
 19 # 表达式结果是用10进制表示的.
 20 
 21 # 其他进制: BASE#NUMBER
 22 # BASE的范围在2到64之间.
 23 # NUMBER的值必须使用BASE范围内的符号来表示, 具体看下边的示例. 
 24 
 25 
 26 let "bin = 2#111100111001101"
 27 echo "binary number = $bin"              # 31181
 28 
 29 let "b32 = 32#77"
 30 echo "base-32 number = $b32"             # 231
 31 
 32 let "b64 = 64#@_"
 33 echo "base-64 number = $b64"             # 4031
 34 # 这个表示法只能工作于受限的ASCII字符范围(2 - 64).
 35 # 10个数字 + 26个小写字母 + 26个大写字符 + @ + _
 36 
 37 
 38 echo
 39 
 40 echo $((36#zz)) $((2#10101010)) $((16#AF16)) $((53#1aA))
 41                                          # 1295 170 44822 3375
 42 
 43 
 44 #  重要的注意事项:
 45 #  ---------------
 46 #  使用一个超出给定进制的数字的话, 
 47 #+ 将会引起一个错误. 
 48 
 49 let "bad_oct = 081"
 50 # (部分的) 错误消息输出:
 51 #  bad_oct = 081: value too great for base (error token is "081")
 52 #              Octal numbers use only digits in the range 0 - 7.
 53 
 54 exit 0       # 感谢, Rich Bartell 和 Stephane Chazelas的指正. </pre>

 |

* * *
# 33.3\. 测试和比较: 一种可选的方法

对于测试来说, [[[ ]]](testconstructs.md#DBLBRACKETS)结构可能比<kbd class="USERINPUT">[ ]</kbd>结构更合适. 同样地, 在算术比较中, 使用[(( ))](dblparens.md)结构可能会更有用.

| 

<pre class="PROGRAMLISTING">  1 a=8
  2 
  3 # 下面所有的比较都是等价的. 
  4 test "$a" -lt 16 && echo "yes, $a < 16"         # "与列表"
  5 /bin/test "$a" -lt 16 && echo "yes, $a < 16" 
  6 [ "$a" -lt 16 ] && echo "yes, $a < 16" 
  7 [[ $a -lt 16 ]] && echo "yes, $a < 16"          # 在[[ ]]和(( ))结构中, 
  8 (( a < 16 )) && echo "yes, $a < 16"             # 不用将变量引用起来. 
  9 
 10 city="New York"
 11 # 同样地, 下面所有的比较都是等价的. 
 12 test "$city" \< Paris && echo "Yes, Paris is greater than $city"  # 按照ASCII顺序比较. 
 13 /bin/test "$city" \< Paris && echo "Yes, Paris is greater than $city" 
 14 [ "$city" \< Paris ] && echo "Yes, Paris is greater than $city" 
 15 [[ $city < Paris ]] && echo "Yes, Paris is greater than $city"    # 不需要引用$city. 
 16 
 17 # 感谢, S.C. </pre>

 |
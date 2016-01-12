# 7.4\. 嵌套的if/then条件测试

可以通过**if/then**结构来使用嵌套的条件测试. 最终的结果和上面使用**&&**混合比较操作符的结果是相同的.

| 

<pre class="PROGRAMLISTING">  1 if [ condition1 ]
  2 then
  3   if [ condition2 ]
  4   then
  5     do-something  # But only if both "condition1" and "condition2" valid.
  6   fi  
  7 fi</pre>

 |

参考[例子 34-4](bashver2.md#EX79), 里边有一个使用<tt class="REPLACEABLE">_if/then_</tt>结构进行条件测试的例子.
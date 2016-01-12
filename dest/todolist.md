# Appendix Q. To Do列表

*   全面调查Bash与经典的Bourne shell之间的兼容性.

*   同上, 但需要调查的是Korn shell (ksh).

*   一个使用Bash来进行CGI编程的初级读本.

    下面是一个简单的CGI脚本, 你可以从这里开始.

    * * *

    **例子 Q-1\. 打印服务器环境**

    | 

    <pre class="PROGRAMLISTING">  1 #!/bin/bash
      2 # 可能需要修改你的站点位置. 
      3 # (在ISP的服务器上, Bash可能不在标准位置/bin.)
      4 # 其他可能出现的地方: /usr/bin或/usr/local/bin
      5 # 甚至可以不带任何路径信息来尝试使用#!. 
      6 
      7 # test-cgi.sh
      8 # 由Michael Zick编写
      9 # 经过授权在此使用
     10 
     11 
     12 # 禁用文件名匹配. 
     13 set -f
     14 
     15 # 头信息将会给浏览器需要的东西. 
     16 echo Content-type: text/plain
     17 echo
     18 
     19 echo CGI/1.0 test script report:
     20 echo
     21 
     22 echo environment settings:
     23 set
     24 echo
     25 
     26 echo whereis bash?
     27 whereis bash
     28 echo
     29 
     30 
     31 echo who are we?
     32 echo ${BASH_VERSINFO[*]}
     33 echo
     34 
     35 echo argc is $#. argv is "$*".
     36 echo
     37 
     38 # CGI/1.0需要的环境变量. 
     39 
     40 echo SERVER_SOFTWARE = $SERVER_SOFTWARE
     41 echo SERVER_NAME = $SERVER_NAME
     42 echo GATEWAY_INTERFACE = $GATEWAY_INTERFACE
     43 echo SERVER_PROTOCOL = $SERVER_PROTOCOL
     44 echo SERVER_PORT = $SERVER_PORT
     45 echo REQUEST_METHOD = $REQUEST_METHOD
     46 echo HTTP_ACCEPT = "$HTTP_ACCEPT"
     47 echo PATH_INFO = "$PATH_INFO"
     48 echo PATH_TRANSLATED = "$PATH_TRANSLATED"
     49 echo SCRIPT_NAME = "$SCRIPT_NAME"
     50 echo QUERY_STRING = "$QUERY_STRING"
     51 echo REMOTE_HOST = $REMOTE_HOST
     52 echo REMOTE_ADDR = $REMOTE_ADDR
     53 echo REMOTE_USER = $REMOTE_USER
     54 echo AUTH_TYPE = $AUTH_TYPE
     55 echo CONTENT_TYPE = $CONTENT_TYPE
     56 echo CONTENT_LENGTH = $CONTENT_LENGTH
     57 
     58 exit 0
     59 
     60 # Here document可以给出简要的使用说明. 
     61 :<<-'_test_CGI_'
     62 
     63 1) Drop this in your http://domain.name/cgi-bin directory.
     64 2) Then, open http://domain.name/cgi-bin/test-cgi.sh.
     65 
     66 _test_CGI_</pre>

     |

    * * *

有志愿者么?
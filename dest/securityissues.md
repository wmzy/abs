# 33.8\. 安全问题

## <a name="INFECTEDSCRIPTS">33.8.1\. 被感染的脚本</a>

在这里对脚本安全进行一个简短的介绍非常合适. shell脚本可能会包含_蠕虫_, _特洛伊木马_, 甚至可能会中_病毒_. 由于这些原因, 永远不要用root身份来运行脚本(或者将自己不太清楚的脚本插入到<tt class="FILENAME">/etc/rc.d</tt>里面的系统启动脚本中), 除非你确定这是值得信赖的源代码, 或者你已经小心的分析了这个脚本, 并确定它不会产生什么危害.

Bell实验室以及其他地方的病毒研究人员, 包括M. Douglas McIlroy, Tom Duff, 和Fred Cohen已经研究过了shell脚本病毒的实现. 他们认为即使是初学者也可以很容易的编写脚本病毒, 比如<span class="QUOTE">"脚本小子(script kiddie)"</span>, 就写了一个. [[1]](#FTN.AEN16084)

这也是学习脚本编程的另一个原因. 能够很好地了解脚本, 就可以让的系统免受骇客的攻击和破坏.

## <a name="HIDINGSOURCE">33.8.2\. 隐藏Shell脚本源代码</a>

出于安全目的, 让脚本不可读, 也是有必要的. 如果有软件可以将脚本转化为相应的二进制可执行文件就好了. Francisco Rosales的[shc - generic shell script compiler](http://www.datsi.fi.upm.es/~frosal/sources/)可以出色的完成这个任务.

不幸的是, 根据[发表在2005年10月的Linux Journal上的一篇文章](http://www.linuxjournal.com/article/8256), 二进制文件, 至少在某些情况下, 可以被恢复成原始的脚本代码. 但是不管怎么说, 对于那些技术不高的骇客来说, 这仍然是一种保证脚本安全的有效办法.

### 注意事项

| [[1]](securityissues.md#AEN16084) | 

请参考Marius van Oers的文章, [Unix Shell Scripting Malware](http://www.virusbtn.com/magazine/archives/200204/malshell.xml), 还有列在[参考书目](biblio.md#BIBLIOREF)中的_Denning_的书目.

 |
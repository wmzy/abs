# 35.6\. 致谢

_团体的力量才使得这本书顺利地完成._ 作者非常感激那些给作者提供帮助和反馈的人们, 如果没有他们, 这本书根本就是一个不可能完成的任务.

译者: 如下是作者感谢的对象. 为了保持原文作者的完整性, 这里就不译了.

[Philippe Martin](mailto:feloy@free.fr) translated the first version (0.1) of this document into DocBook/SGML. While not on the job at a small French company as a software developer, he enjoys working on GNU/Linux documentation and software, reading literature, playing music, and, for his peace of mind, making merry with friends. You may run across him somewhere in France or in the Basque Country, or you can email him at [feloy@free.fr](mailto:feloy@free.fr).

Philippe Martin also pointed out that positional parameters past $9 are possible using {bracket} notation. (See [例子 4-5](othertypesv.md#EX17)).

[Stephane Chazelas](mailto:stephane_chazelas@yahoo.fr) sent a long list of corrections, additions, and example scripts. More than a contributor, he had, in effect, for a while taken on the role of **editor** for this document. Merci beaucoup!

Paulo Marcel Coelho Aragao offered many corrections, both major and minor, and contributed quite a number of helpful suggestions.

I would like to especially thank _Patrick Callahan_, _Mike Novak_, and _Pal Domokos_ for catching bugs, pointing out ambiguities, and for suggesting clarifications and changes. Their lively discussion of shell scripting and general documentation issues inspired me to try to make this document more readable.

I'm grateful to Jim Van Zandt for pointing out errors and omissions in version 0.2 of this document. He also contributed an instructive [example script](contributed-scripts.md#ZFIFO).

Many thanks to [Jordi Sanfeliu](mailto:mikaku@fiwix.org) for giving permission to use his fine tree script ([例子 A-17](contributed-scripts.md#TREE)), and to Rick Boivie for revising it.

Likewise, thanks to [Michel Charpentier](mailto:charpov@cs.unh.edu) for permission to use his [dc](mathc.md#DCREF) factoring script ([例子 12-47](mathc.md#FACTR)).

Kudos to [Noah Friedman](mailto:friedman@prep.ai.mit.edu) for permission to use his string function script ([例子 A-18](contributed-scripts.md#STRING)).

[Emmanuel Rouat](mailto:emmanuel.rouat@wanadoo.fr) suggested corrections and additions on [command substitution](commandsub.md#COMMANDSUBREF) and [aliases](aliases.md#ALIASREF). He also contributed a very nice sample <tt class="FILENAME">.bashrc</tt> file ([Appendix K](sample-bashrc.md)).

[Heiner Steven](mailto:heiner.steven@odn.de) kindly gave permission to use his base conversion script, [例子 12-43](mathc.md#BASE). He also made a number of corrections and many helpful suggestions. Special thanks.

Rick Boivie contributed the delightfully recursive _pb.sh_ script ([例子 33-9](recursionsct.md#PBOOK)), revised the _tree.sh_ script ([例子 A-17](contributed-scripts.md#TREE)), and suggested performance improvements for the _monthlypmt.sh_ script ([例子 12-42](mathc.md#MONTHLYPMT)).

Florian Wisser enlightened me on some of the fine points of testing strings (see [例子 7-6](comparison-ops.md#STRTEST)), and on other matters.

Oleg Philon sent suggestions concerning [cut](textproc.md#CUTREF) and [pidof](system.md#PIDOFREF).

Michael Zick extended the [empty array](arrays.md#EMPTYARRAY) example to demonstrate some surprising array properties. He also contributed the _isspammer_ scripts ([例子 12-37](communications.md#ISSPAMMER) and [例子 A-28](contributed-scripts.md#ISSPAMMER2)).

Marc-Jano Knopp sent corrections and clarifications on DOS batch files.

Hyun Jin Cha found several typos in the document in the process of doing a Korean translation. Thanks for pointing these out.

Andreas Abraham sent in a long list of typographical errors and other corrections. Special thanks!

Others contributing scripts, making helpful suggestions, and pointing out errors were Gabor Kiss, Leopold Toetsch, Peter Tillier, Marcus Berglof, Tony Richardson, Nick Drage (script ideas!), Rich Bartell, Jess Thrysoee, Adam Lazur, Bram Moolenaar, Baris Cicek, Greg Keraunen, Keith Matthews, Sandro Magi, Albert Reiner, Dim Segebart, Rory Winston, Lee Bigelow, Wayne Pollock, <span class="QUOTE">"jipe,"</span> <span class="QUOTE">"bojster,"</span> <span class="QUOTE">"nyal,"</span> <span class="QUOTE">"Hobbit,"</span> <span class="QUOTE">"Ender,"</span> <span class="QUOTE">"Little Monster"</span> (Alexis), <span class="QUOTE">"Mark,"</span> Emilio Conti, Ian. D. Allen, Arun Giridhar, Dennis Leeuw, Dan Jacobson, Aurelio Marinho Jargas, Edward Scholtz, Jean Helou, Chris Martin, Lee Maschmeyer, Bruno Haible, Wilbert Berendsen, Sebastien Godard, Bj鰊 Eriksson, John MacDonald, Joshua Tschida, Troy Engel, Manfred Schwarb, Amit Singh, Bill Gradwohl, David Lombard, Jason Parker, Steve Parker, Bruce W. Clare, William Park, Vernia Damiano, Mihai Maties, Jeremy Impson, Ken Fuchs, Frank Wang, Sylvain Fourmanoit, Matthew Walker, Kenny Stauffer, Filip Moritz, Andrzej Stefanski, Daniel Albers, Stefano Palmeri, Nils Radtke, Jeroen Domburg, Alfredo Pironti, Phil Braham, Bruno de Oliveira Schneider, Stefano Falsetto, Chris Morgan, Walter Dnes, Linc Fessenden, Michael Iatrou, Pharis Monalo, Jesse Gough, Fabian Kreutz, Mark Norman, Harald Koenig, Peter Knowles, Francisco Lobo, Mariusz Gniazdowski, Tedman Eng, Jochen DeSmet, Oliver Beckstein, Achmed Darwish, Andreas K黨ne, and David Lawyer (himself an author of four HOWTOs).

My gratitude to [Chet Ramey](mailto:chet@po.cwru.edu) and Brian Fox for writing _Bash_, and building into it elegant and powerful scripting capabilities.

Very special thanks to the hard-working volunteers at the [Linux Documentation Project](http://www.tldp.org). The LDP hosts a repository of Linux knowledge and lore, and has, to a large extent, enabled the publication of this book.

Thanks and appreciation to IBM, Novell, Red Hat, the [Free Software Foundation](http://www.fsf.org), and all the good people fighting the good fight to keep Open Source software free and open.

Thanks most of all to my wife, Anita, for her encouragement and emotional support.